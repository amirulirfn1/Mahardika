-- 0010_blueprint_schema.sql
-- Align database schema with Mahardika multi-tenant blueprint

-- Required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Helper schema
create schema if not exists auth;

create or replace function auth.user_id() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid;
$$;

create or replace function auth.tenant_id() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id', '')::uuid;
$$;

create or replace function auth.role() returns text language sql stable as $$
  select coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
$$;

-- Drop legacy artefacts

-- views
 drop view if exists public.loyalty_balances_by_customer cascade;

-- tables
 drop table if exists public.outbound_messages cascade;
 drop table if exists public.vehicles cascade;
 drop table if exists public.loyalty_memberships cascade;
 drop table if exists public.points_transaction cascade;
 drop table if exists public.audit_events cascade;
 drop table if exists public.payments cascade;
 drop table if exists public.policy_payments cascade;
 drop table if exists public.policies cascade;
 drop table if exists public.customers cascade;
 drop table if exists public.agency_staff cascade;
 drop table if exists public.agency_members cascade;
 drop table if exists public.agencies cascade;
 drop table if exists public.profiles cascade;
 drop table if exists public.user_profiles cascade;
 drop table if exists public.notes cascade;
 drop table if exists public.tasks cascade;
 drop table if exists public.notifications cascade;
 drop table if exists public.conversations cascade;
 drop table if exists public.loyalty_ledger cascade;
 drop table if exists public.loyalty_tiers cascade;
 drop table if exists public.subscriptions cascade;
 drop table if exists public.seats cascade;
 drop table if exists public.files cascade;
 drop table if exists public.audit_log cascade;
 drop table if exists public.jobs cascade;
 drop table if exists public.ai_artifacts cascade;

-- types
 drop type if exists public.member_role cascade;
 drop type if exists public.member_status cascade;
 drop type if exists public.policy_status cascade;
 drop type if exists public.payment_method cascade;
 drop type if exists public.renewal_stage cascade;
 drop type if exists public.conversation_channel cascade;
 drop type if exists public.conversation_direction cascade;
 drop type if exists public.note_entity cascade;
 drop type if exists public.task_status cascade;
 drop type if exists public.task_related_type cascade;
 drop type if exists public.loyalty_ref_type cascade;
 drop type if exists public.file_kind cascade;
 drop type if exists public.subscription_plan cascade;
 drop type if exists public.job_status cascade;

-- Enumerations
create type public.member_role as enum ('OWNER', 'ADMIN', 'AGENT', 'STAFF');
create type public.member_status as enum ('ACTIVE', 'INVITED', 'SUSPENDED');
create type public.policy_status as enum ('QUOTE', 'IN_FORCE', 'LAPSED', 'CANCELLED');
create type public.payment_method as enum ('CASH', 'TRANSFER', 'CARD');
create type public.renewal_stage as enum ('UPCOMING', 'CONTACTED', 'QUOTED', 'PENDING_DOCS', 'COMPLETED', 'MISSED');
create type public.conversation_channel as enum ('WHATSAPP', 'EMAIL', 'PHONE', 'IN_PERSON');
create type public.conversation_direction as enum ('IN', 'OUT');
create type public.note_entity as enum ('CUSTOMER', 'POLICY', 'AGENT');
create type public.task_status as enum ('OPEN', 'DONE', 'CANCELLED');
create type public.task_related_type as enum ('RENEWAL', 'LEAD', 'CUSTOMER', 'POLICY');
create type public.loyalty_ref_type as enum ('PURCHASE', 'RENEWAL', 'ADJUST');
create type public.file_kind as enum ('QUOTE', 'POLICY', 'RECEIPT', 'KYC', 'MISC');
create type public.subscription_plan as enum ('FREE', 'STARTER', 'GROWTH', 'PRO');
create type public.job_status as enum ('QUEUED', 'RUNNING', 'DONE', 'FAILED');

-- Core tables
create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text,
  phone text,
  locale text not null default 'en',
  avatar_url text,
  platform_role text not null default 'USER' check (platform_role in ('USER', 'SUPER_ADMIN')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country text,
  timezone text,
  logo_url text,
  plan public.subscription_plan not null default 'FREE',
  seats_limit integer not null default 1,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agency_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role public.member_role not null,
  status public.member_status not null default 'INVITED',
  license_no text,
  license_issuer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  national_id text,
  address_json jsonb default '{}'::jsonb,
  notes text,
  loyalty_tier text,
  points_balance integer not null default 0,
  consent_marketing_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, email),
  unique (tenant_id, phone)
);

create table public.policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  agent_id uuid references public.agency_members(id) on delete set null,
  carrier text not null,
  product text not null,
  policy_no text,
  status public.policy_status not null default 'QUOTE',
  start_date date,
  end_date date,
  premium_net numeric,
  premium_gross numeric,
  files_json jsonb not null default '[]'::jsonb,
  external_quote_ref text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.policy_payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  policy_id uuid not null references public.policies(id) on delete cascade,
  amount numeric not null,
  paid_at timestamptz not null default now(),
  method public.payment_method not null default 'TRANSFER',
  receipt_file_url text,
  reference text,
  notes text,
  verified_by uuid references public.agency_members(id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.renewals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  policy_id uuid not null references public.policies(id) on delete cascade,
  due_date date not null,
  stage public.renewal_stage not null default 'UPCOMING',
  last_contact_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  channel public.conversation_channel not null,
  direction public.conversation_direction not null,
  body text,
  meta_json jsonb default '{}'::jsonb,
  sent_by uuid references public.agency_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  subject text,
  body text,
  entity_type public.note_entity not null,
  entity_id uuid,
  created_by uuid references public.agency_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  assignee_id uuid references public.agency_members(id) on delete set null,
  title text not null,
  due_at timestamptz,
  status public.task_status not null default 'OPEN',
  related_type public.task_related_type,
  related_id uuid,
  created_by uuid references public.agency_members(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  kind text not null,
  payload_json jsonb default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.loyalty_tiers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  code text not null,
  name text not null,
  threshold_visits integer,
  ringgit_to_point numeric not null default 1,
  perks_json jsonb default '[]'::jsonb,
  is_default boolean not null default false,
  unique (tenant_id, code)
);

create table public.loyalty_ledger (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  points integer not null,
  reason text,
  ref_type public.loyalty_ref_type not null,
  ref_id uuid,
  created_by uuid references public.agency_members(id) on delete set null,
  occurred_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  plan public.subscription_plan not null default 'FREE',
  status text not null default 'active',
  current_period_end timestamptz,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  unique (tenant_id)
);

create table public.seats (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  member_id uuid not null references public.agency_members(id) on delete cascade,
  role_cached public.member_role not null,
  active boolean not null default true,
  unique (member_id)
);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  path text not null,
  bucket text not null,
  kind public.file_kind not null,
  uploaded_by uuid references public.agency_members(id) on delete set null,
  size_bytes integer,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  actor_id uuid references public.agency_members(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  before_json jsonb,
  after_json jsonb,
  at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  kind text not null,
  payload_json jsonb default '{}'::jsonb,
  run_at timestamptz,
  status public.job_status not null default 'QUEUED',
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_artifacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  kind text not null,
  payload_json jsonb not null,
  created_by uuid references public.agency_members(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Supporting view
create view public.loyalty_balances_by_customer as
  select tenant_id, customer_id, sum(points) as points
  from public.loyalty_ledger
  group by tenant_id, customer_id;

-- Indexes
create index if not exists idx_agency_members_user on public.agency_members(user_id);
create index if not exists idx_customers_tenant on public.customers(tenant_id);
create index if not exists idx_customers_email on public.customers(tenant_id, email);
create index if not exists idx_policies_tenant on public.policies(tenant_id);
create index if not exists idx_policy_payments_policy on public.policy_payments(policy_id);
create index if not exists idx_policy_payments_tenant on public.policy_payments(tenant_id);
create index if not exists idx_renewals_due on public.renewals(tenant_id, due_date);
create index if not exists idx_conversations_customer on public.conversations(customer_id);
create index if not exists idx_tasks_assignee on public.tasks(assignee_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_loyalty_ledger_customer on public.loyalty_ledger(customer_id);
create index if not exists idx_jobs_status_run_at on public.jobs(status, run_at);

-- RLS enablement
alter table public.user_profiles enable row level security;
alter table public.agencies enable row level security;
alter table public.agency_members enable row level security;
alter table public.customers enable row level security;
alter table public.policies enable row level security;
alter table public.policy_payments enable row level security;
alter table public.renewals enable row level security;
alter table public.conversations enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.loyalty_tiers enable row level security;
alter table public.loyalty_ledger enable row level security;
alter table public.subscriptions enable row level security;
alter table public.seats enable row level security;
alter table public.files enable row level security;
alter table public.audit_log enable row level security;
alter table public.jobs enable row level security;
alter table public.ai_artifacts enable row level security;

create or replace function public.is_super_admin() returns boolean language sql stable as $$
  select auth.role() = 'SUPER_ADMIN';
$$;

-- Policies
create policy user_profiles_self_select on public.user_profiles
  for select using (id = auth.user_id());
create policy user_profiles_self_update on public.user_profiles
  for update using (id = auth.user_id()) with check (id = auth.user_id());
create policy user_profiles_admin_read on public.user_profiles
  for select using (public.is_super_admin());

create policy agencies_tenant_access on public.agencies
  using (id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or id = auth.tenant_id());

create policy agency_members_tenant on public.agency_members
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy customers_tenant on public.customers
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy policies_tenant on public.policies
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy policy_payments_tenant on public.policy_payments
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy renewals_tenant on public.renewals
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy conversations_tenant on public.conversations
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy notes_tenant on public.notes
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy tasks_tenant on public.tasks
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy notifications_tenant on public.notifications
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy loyalty_tiers_tenant on public.loyalty_tiers
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy loyalty_ledger_tenant on public.loyalty_ledger
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy subscriptions_tenant on public.subscriptions
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy seats_tenant on public.seats
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy files_tenant on public.files
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy audit_log_tenant on public.audit_log
  for select using (tenant_id = auth.tenant_id() or public.is_super_admin());

create policy jobs_tenant on public.jobs
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

create policy ai_artifacts_tenant on public.ai_artifacts
  using (tenant_id = auth.tenant_id() or public.is_super_admin())
  with check (public.is_super_admin() or tenant_id = auth.tenant_id());

-- updated_at trigger
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_user_profiles before update on public.user_profiles for each row execute procedure public.touch_updated_at();
create trigger touch_agencies before update on public.agencies for each row execute procedure public.touch_updated_at();
create trigger touch_agency_members before update on public.agency_members for each row execute procedure public.touch_updated_at();
create trigger touch_customers before update on public.customers for each row execute procedure public.touch_updated_at();
create trigger touch_policies before update on public.policies for each row execute procedure public.touch_updated_at();
create trigger touch_policy_payments before update on public.policy_payments for each row execute procedure public.touch_updated_at();
create trigger touch_renewals before update on public.renewals for each row execute procedure public.touch_updated_at();
create trigger touch_tasks before update on public.tasks for each row execute procedure public.touch_updated_at();
create trigger touch_jobs before update on public.jobs for each row execute procedure public.touch_updated_at();


-- Storage buckets and policies
insert into storage.buckets (id, name, public)
values
  ('policy-docs', 'policy-docs', false),
  ('customer-kits', 'customer-kits', false),
  ('agency-docs', 'agency-docs', false)
on conflict (id) do nothing;

create policy storage_read_tenant on storage.objects
  for select using (
    bucket_id in ('policy-docs','customer-kits','agency-docs')
    and (storage.foldername(name))[1] = coalesce(auth.tenant_id()::text, '')
  );

create policy storage_write_tenant on storage.objects
  for insert with check (
    bucket_id in ('policy-docs','customer-kits','agency-docs')
    and (storage.foldername(name))[1] = coalesce(auth.tenant_id()::text, '')
  );

create policy storage_update_tenant on storage.objects
  for update using (
    bucket_id in ('policy-docs','customer-kits','agency-docs')
    and (storage.foldername(name))[1] = coalesce(auth.tenant_id()::text, '')
  ) with check (
    bucket_id in ('policy-docs','customer-kits','agency-docs')
    and (storage.foldername(name))[1] = coalesce(auth.tenant_id()::text, '')
  );

create policy storage_delete_tenant on storage.objects
  for delete using (
    bucket_id in ('policy-docs','customer-kits','agency-docs')
    and (storage.foldername(name))[1] = coalesce(auth.tenant_id()::text, '')
  );
