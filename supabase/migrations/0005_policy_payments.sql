-- 0005_policy_payments.sql
-- Minimal policy payments module with strict RLS based on policy agency

-- Create payment_channel enum if missing
do $$
begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'payment_channel' and n.nspname = 'public'
  ) then
    create type public.payment_channel as enum ('cash','bank_transfer','ewallet','card','other');
  end if;
end$$;

-- Create table if missing
create table if not exists public.policy_payments (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policies(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  channel public.payment_channel not null default 'cash',
  reference text,
  paid_at timestamptz not null default now(),
  notes text,
  uploaded_by uuid not null default auth.uid(),
  created_at timestamptz not null default now()
);

-- Ensure RLS enabled
alter table if exists public.policy_payments enable row level security;

-- SELECT policy: same-agency via owning policy
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'policy_payments' and policyname = 'policy_payments_select_same_agency'
  ) then
    create policy policy_payments_select_same_agency
      on public.policy_payments
      for select
      using (
        exists (
          select 1 from public.policies p
          where p.id = policy_payments.policy_id
            and p.agency_id = public.current_agency_id()
        )
      );
  end if;
end$$;

-- INSERT policy: same-agency via owning policy
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'policy_payments' and policyname = 'policy_payments_insert_same_agency'
  ) then
    create policy policy_payments_insert_same_agency
      on public.policy_payments
      for insert
      with check (
        exists (
          select 1 from public.policies p
          where p.id = policy_payments.policy_id
            and p.agency_id = public.current_agency_id()
        )
      );
  end if;
end$$;

-- UPDATE policy: same-agency via owning policy
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'policy_payments' and policyname = 'policy_payments_update_same_agency'
  ) then
    create policy policy_payments_update_same_agency
      on public.policy_payments
      for update
      using (
        exists (
          select 1 from public.policies p
          where p.id = policy_payments.policy_id
            and p.agency_id = public.current_agency_id()
        )
      )
      with check (
        exists (
          select 1 from public.policies p
          where p.id = policy_payments.policy_id
            and p.agency_id = public.current_agency_id()
        )
      );
  end if;
end$$;

-- DELETE policy: only agency_owner or platform_admin within same agency
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'policy_payments' and policyname = 'policy_payments_delete_owner_only'
  ) then
    create policy policy_payments_delete_owner_only
      on public.policy_payments
      for delete
      using (
        exists (
          select 1
          from public.profiles pr
          join public.policies p on p.id = policy_payments.policy_id
          where pr.user_id = auth.uid()
            and pr.agency_id = p.agency_id
            and pr.role in ('agency_owner','platform_admin')
        )
      );
  end if;
end$$;


