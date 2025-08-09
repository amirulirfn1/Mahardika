-- 0001_init.sql
-- Enums
create type public.user_role as enum ('platform_admin','agency_owner','staff','customer');
create type public.policy_status as enum ('active','expired','canceled','archived');
create type public.payment_status as enum ('pending','failed','completed','refunded');

-- Tables
create table if not exists public.profiles (
  id uuid primary key default auth.uid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  agency_id uuid,
  role public.user_role not null,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  owner_id uuid not null references auth.users(id),
  plan text default 'Lite',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.agency_staff (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role default 'staff',
  created_at timestamptz default now(),
  unique(agency_id, user_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  lifetime_points numeric default 0,
  created_at timestamptz default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  plate_no text not null,
  make text,
  model text,
  year int,
  created_at timestamptz default now()
);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete restrict,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  policy_no text not null unique,
  start_date date not null,
  end_date date not null,
  premium_myr numeric not null,
  status public.policy_status default 'active',
  pdf_path text,
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid not null references public.customers(id),
  policy_id uuid references public.policies(id) on delete set null,
  amount_myr numeric not null,
  method text,
  status public.payment_status default 'pending',
  proof_path text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

create table if not exists public.loyalty_ledger (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null,
  customer_id uuid not null references public.customers(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete set null,
  points numeric not null,
  reason text,
  created_at timestamptz default now()
);

create table if not exists public.reminder_jobs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  policy_id uuid not null references public.policies(id) on delete cascade,
  run_on date not null,
  status text default 'queued',
  created_at timestamptz default now()
);

create table if not exists public.message_logs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null,
  customer_id uuid references public.customers(id),
  policy_id uuid references public.policies(id),
  channel text not null,
  to_addr text,
  subject text,
  body text,
  status text not null,
  error text,
  created_at timestamptz default now()
);

create table if not exists public.upload_files (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null,
  table_ref text,
  row_id uuid,
  bucket_id text not null,
  object_path text not null,
  created_at timestamptz default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  agency_id uuid,
  table_name text,
  action text,
  row_id uuid,
  actor uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz default now()
);

-- Helper functions
create or replace function public.is_platform_admin() returns boolean
language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'platform_admin'
  );
$$;

create or replace function public.current_agency_id() returns uuid
language sql security definer set search_path = public as $$
  select p.agency_id from public.profiles p
  where p.user_id = auth.uid()
  limit 1;
$$;

-- RLS enable
alter table public.profiles enable row level security;
alter table public.agencies enable row level security;
alter table public.agency_staff enable row level security;
alter table public.customers enable row level security;
alter table public.vehicles enable row level security;
alter table public.policies enable row level security;
alter table public.payments enable row level security;
alter table public.loyalty_ledger enable row level security;
alter table public.reminder_jobs enable row level security;
alter table public.message_logs enable row level security;
alter table public.upload_files enable row level security;
alter table public.audit_log enable row level security;

-- profiles policies
create policy profiles_self_read on public.profiles
  for select using (
    auth.uid() = user_id or public.is_platform_admin()
  );
create policy profiles_self_update on public.profiles
  for update using (
    auth.uid() = user_id or public.is_platform_admin()
  );

-- agencies policies
create policy agencies_read_owner_or_admin on public.agencies
  for select using (
    owner_id = auth.uid() or public.is_platform_admin()
  );
create policy agencies_update_owner_or_admin on public.agencies
  for update using (
    owner_id = auth.uid() or public.is_platform_admin()
  );
create policy agencies_insert_auth on public.agencies
  for insert with check (
    auth.uid() is not null
  );

-- generic tenant policies for tables with agency_id
do $$ begin
  perform 1;
end $$;

-- customers
create policy customers_tenant_all on public.customers for all
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  )
  with check (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- vehicles
create policy vehicles_tenant_all on public.vehicles for all
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  )
  with check (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- policies
create policy policies_tenant_all on public.policies for all
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  )
  with check (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- payments
create policy payments_tenant_all on public.payments for all
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  )
  with check (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- loyalty_ledger
create policy loyalty_tenant_all on public.loyalty_ledger for all
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  )
  with check (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- reminder_jobs
create policy reminders_tenant_all on public.reminder_jobs for all
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  )
  with check (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- message_logs
create policy messages_tenant_all on public.message_logs for all
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  )
  with check (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- upload_files
create policy files_tenant_all on public.upload_files for all
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  )
  with check (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- audit_log (read-only for tenant)
create policy audit_tenant_read on public.audit_log for select
  using (
    public.is_platform_admin() or agency_id = public.current_agency_id()
  );

-- Storage buckets and policies
insert into storage.buckets(id, name, public)
values ('policy-pdfs','policy-pdfs', false)
on conflict (id) do nothing;

insert into storage.buckets(id, name, public)
values ('payment-proofs','payment-proofs', false)
on conflict (id) do nothing;

-- RLS on storage.objects
alter table storage.objects enable row level security;

create policy storage_read_policy on storage.objects for select using (
  bucket_id in ('policy-pdfs','payment-proofs') and (
    public.is_platform_admin() or (metadata ->> 'agency_id')::uuid = public.current_agency_id()
  )
);

create policy storage_insert_policy on storage.objects for insert with check (
  bucket_id in ('policy-pdfs','payment-proofs') and (
    public.is_platform_admin() or (metadata ->> 'agency_id')::uuid = public.current_agency_id()
  )
);

create policy storage_update_policy on storage.objects for update using (
  bucket_id in ('policy-pdfs','payment-proofs') and (
    public.is_platform_admin() or (metadata ->> 'agency_id')::uuid = public.current_agency_id()
  )
);

create policy storage_delete_policy on storage.objects for delete using (
  bucket_id in ('policy-pdfs','payment-proofs') and (
    public.is_platform_admin() or (metadata ->> 'agency_id')::uuid = public.current_agency_id()
  )
);


