-- 0007_loyalty.sql
-- Loyalty tiers and points accrual on policy payments with multi-agency RLS

-- Enum: loyalty_direction
do $$ begin
    if not exists (
        select 1 from pg_type t
        join pg_namespace n on n.oid = t.typnamespace
        where t.typname = 'loyalty_direction' and n.nspname = 'public'
    ) then
        create type public.loyalty_direction as enum ('credit','debit');
    end if;
end $$;

-- Table: loyalty_tiers
create table if not exists public.loyalty_tiers (
    id uuid primary key default gen_random_uuid(),
    agency_id uuid not null references public.agencies(id) on delete cascade,
    code text not null,
    name text not null,
    points_per_myr numeric(10,4) not null default 1.0,
    is_default boolean not null default false,
    created_at timestamptz default now(),
    unique(agency_id, code)
);
-- One default tier per agency
do $$ begin
    if not exists (
        select 1 from pg_indexes where schemaname = 'public' and indexname = 'loyalty_tiers_one_default'
    ) then
        create unique index loyalty_tiers_one_default on public.loyalty_tiers(agency_id) where is_default;
    end if;
end $$;
alter table if exists public.loyalty_tiers enable row level security;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_tiers' and policyname = 'loyalty_tiers_select_same_agency'
) then create policy loyalty_tiers_select_same_agency on public.loyalty_tiers for select using (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_tiers' and policyname = 'loyalty_tiers_insert_same_agency'
) then create policy loyalty_tiers_insert_same_agency on public.loyalty_tiers for insert with check (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_tiers' and policyname = 'loyalty_tiers_update_same_agency'
) then create policy loyalty_tiers_update_same_agency on public.loyalty_tiers for update using (agency_id = public.current_agency_id()) with check (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_tiers' and policyname = 'loyalty_tiers_delete_same_agency'
) then create policy loyalty_tiers_delete_same_agency on public.loyalty_tiers for delete using (agency_id = public.current_agency_id()); end if; end $$;

-- Table: loyalty_memberships
create table if not exists public.loyalty_memberships (
    id uuid primary key default gen_random_uuid(),
    agency_id uuid not null references public.agencies(id) on delete cascade,
    customer_id uuid not null references public.customers(id) on delete cascade,
    tier_id uuid not null references public.loyalty_tiers(id) on delete restrict,
    since date default now(),
    unique(agency_id, customer_id)
);
alter table if exists public.loyalty_memberships enable row level security;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_memberships' and policyname = 'loyalty_memberships_select_same_agency'
) then create policy loyalty_memberships_select_same_agency on public.loyalty_memberships for select using (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_memberships' and policyname = 'loyalty_memberships_insert_same_agency'
) then create policy loyalty_memberships_insert_same_agency on public.loyalty_memberships for insert with check (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_memberships' and policyname = 'loyalty_memberships_update_same_agency'
) then create policy loyalty_memberships_update_same_agency on public.loyalty_memberships for update using (agency_id = public.current_agency_id()) with check (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_memberships' and policyname = 'loyalty_memberships_delete_same_agency'
) then create policy loyalty_memberships_delete_same_agency on public.loyalty_memberships for delete using (agency_id = public.current_agency_id()); end if; end $$;

-- Table: loyalty_ledger (ensure required columns exist)
create table if not exists public.loyalty_ledger (
    id uuid primary key default gen_random_uuid(),
    agency_id uuid not null references public.agencies(id) on delete cascade,
    customer_id uuid references public.customers(id) on delete set null,
    policy_id uuid references public.policies(id) on delete set null,
    payment_id uuid references public.policy_payments(id) on delete set null,
    direction public.loyalty_direction not null,
    points integer not null check (points >= 0),
    reason text,
    occurred_at timestamptz not null default now(),
    created_by uuid default auth.uid(),
    created_at timestamptz default now()
);
-- Backfill/alter legacy columns if table pre-existed
do $$ begin
    if exists (
        select 1 from information_schema.columns
        where table_schema='public' and table_name='loyalty_ledger' and column_name='points' and data_type <> 'integer'
    ) then
        alter table public.loyalty_ledger alter column points type integer using floor(points)::int;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='loyalty_ledger' and column_name='policy_id') then
        alter table public.loyalty_ledger add column policy_id uuid references public.policies(id) on delete set null;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='loyalty_ledger' and column_name='payment_id') then
        alter table public.loyalty_ledger add column payment_id uuid references public.policy_payments(id) on delete set null;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='loyalty_ledger' and column_name='direction') then
        alter table public.loyalty_ledger add column direction public.loyalty_direction;
        -- default new rows will set it; legacy rows can be null
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='loyalty_ledger' and column_name='occurred_at') then
        alter table public.loyalty_ledger add column occurred_at timestamptz not null default now();
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='loyalty_ledger' and column_name='created_by') then
        alter table public.loyalty_ledger add column created_by uuid default auth.uid();
    end if;
end $$;
alter table if exists public.loyalty_ledger enable row level security;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_ledger' and policyname = 'loyalty_ledger_select_same_agency'
) then create policy loyalty_ledger_select_same_agency on public.loyalty_ledger for select using (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_ledger' and policyname = 'loyalty_ledger_insert_same_agency'
) then create policy loyalty_ledger_insert_same_agency on public.loyalty_ledger for insert with check (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_ledger' and policyname = 'loyalty_ledger_update_same_agency'
) then create policy loyalty_ledger_update_same_agency on public.loyalty_ledger for update using (agency_id = public.current_agency_id()) with check (agency_id = public.current_agency_id()); end if; end $$;
do $$ begin if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'loyalty_ledger' and policyname = 'loyalty_ledger_delete_same_agency'
) then create policy loyalty_ledger_delete_same_agency on public.loyalty_ledger for delete using (agency_id = public.current_agency_id()); end if; end $$;

-- View: loyalty_balances_by_customer
do $$ begin
    if not exists (
        select 1 from pg_views where schemaname='public' and viewname='loyalty_balances_by_customer'
    ) then
        create view public.loyalty_balances_by_customer as
        select
            customer_id,
            agency_id,
            coalesce(sum(case when direction = 'credit' then points when direction = 'debit' then -points else 0 end), 0)::int as points
        from public.loyalty_ledger
        group by customer_id, agency_id;
    end if;
end $$;

-- Seed: ensure_default_tiers(agency)
create or replace function public.ensure_default_tiers(agency uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
    if not exists (select 1 from public.loyalty_tiers where agency_id = agency) then
        insert into public.loyalty_tiers(agency_id, code, name, points_per_myr, is_default)
        values
            (agency, 'bronze', 'Bronze', 1.00, true),
            (agency, 'silver', 'Silver', 1.25, false),
            (agency, 'gold', 'Gold', 1.50, false);
    end if;
    -- Ensure exactly one default (favor Bronze if multiple)
    update public.loyalty_tiers set is_default = false where agency_id = agency;
    update public.loyalty_tiers set is_default = true where agency_id = agency and code = 'bronze';
end;
$$;
grant execute on function public.ensure_default_tiers(uuid) to authenticated;

-- Resolve loyalty rate for a customer within an agency
create or replace function public.resolve_loyalty_rate(agency uuid, cust uuid)
returns numeric language plpgsql security definer set search_path = public as $$
declare v_rate numeric(10,4);
begin
    select t.points_per_myr into v_rate
    from public.loyalty_memberships m
    join public.loyalty_tiers t on t.id = m.tier_id
    where m.agency_id = agency and m.customer_id = cust
    limit 1;

    if v_rate is null then
        perform public.ensure_default_tiers(agency);
        select t.points_per_myr into v_rate
        from public.loyalty_tiers t
        where t.agency_id = agency and t.is_default
        limit 1;
    end if;

    return coalesce(v_rate, 1.00);
end;
$$;
grant execute on function public.resolve_loyalty_rate(uuid, uuid) to authenticated;

-- Trigger functions on policy_payments
create or replace function public.fn_loyalty_on_payment_ins() returns trigger language plpgsql security definer set search_path = public as $$
declare v_agency uuid; v_customer uuid; v_rate numeric(10,4); v_pts int;
begin
    select p.agency_id, p.customer_id into v_agency, v_customer from public.policies p where p.id = new.policy_id;
    if v_agency is null then return new; end if;
    v_rate := public.resolve_loyalty_rate(v_agency, v_customer);
    v_pts := floor(coalesce(new.amount, 0) * v_rate);
    if v_pts <> 0 then
        insert into public.loyalty_ledger(agency_id, customer_id, policy_id, payment_id, direction, points, reason, occurred_at, created_by)
        values(v_agency, v_customer, new.policy_id, new.id, 'credit', v_pts, 'payment', coalesce(new.paid_at, now()), auth.uid());
    end if;
    return new;
end;
$$;

create or replace function public.fn_loyalty_on_payment_upd() returns trigger language plpgsql security definer set search_path = public as $$
declare v_agency uuid; v_customer uuid; v_rate numeric(10,4); v_old_pts int; v_new_pts int; v_delta int;
begin
    select p.agency_id, p.customer_id into v_agency, v_customer from public.policies p where p.id = new.policy_id;
    if v_agency is null then return new; end if;
    v_rate := public.resolve_loyalty_rate(v_agency, v_customer);
    v_old_pts := floor(coalesce(old.amount, 0) * v_rate);
    v_new_pts := floor(coalesce(new.amount, 0) * v_rate);
    v_delta := v_new_pts - v_old_pts;
    if v_delta > 0 then
        insert into public.loyalty_ledger(agency_id, customer_id, policy_id, payment_id, direction, points, reason, occurred_at, created_by)
        values(v_agency, v_customer, new.policy_id, new.id, 'credit', v_delta, 'payment_update', coalesce(new.paid_at, now()), auth.uid());
    elsif v_delta < 0 then
        insert into public.loyalty_ledger(agency_id, customer_id, policy_id, payment_id, direction, points, reason, occurred_at, created_by)
        values(v_agency, v_customer, new.policy_id, new.id, 'debit', abs(v_delta), 'payment_update', coalesce(new.paid_at, now()), auth.uid());
    end if;
    return new;
end;
$$;

create or replace function public.fn_loyalty_on_payment_del() returns trigger language plpgsql security definer set search_path = public as $$
declare v_agency uuid; v_customer uuid; v_rate numeric(10,4); v_pts int;
begin
    select p.agency_id, p.customer_id into v_agency, v_customer from public.policies p where p.id = old.policy_id;
    if v_agency is null then return old; end if;
    v_rate := public.resolve_loyalty_rate(v_agency, v_customer);
    v_pts := floor(coalesce(old.amount, 0) * v_rate);
    if v_pts <> 0 then
        insert into public.loyalty_ledger(agency_id, customer_id, policy_id, payment_id, direction, points, reason, occurred_at, created_by)
        values(v_agency, v_customer, old.policy_id, old.id, 'debit', v_pts, 'payment_delete', coalesce(old.paid_at, now()), auth.uid());
    end if;
    return old;
end;
$$;

-- Attach triggers to policy_payments
drop trigger if exists tg_loyalty_payment_ins on public.policy_payments;
create trigger tg_loyalty_payment_ins after insert on public.policy_payments
for each row execute function public.fn_loyalty_on_payment_ins();

drop trigger if exists tg_loyalty_payment_upd_amount on public.policy_payments;
create trigger tg_loyalty_payment_upd_amount after update of amount on public.policy_payments
for each row execute function public.fn_loyalty_on_payment_upd();

drop trigger if exists tg_loyalty_payment_del on public.policy_payments;
create trigger tg_loyalty_payment_del after delete on public.policy_payments
for each row execute function public.fn_loyalty_on_payment_del();

-- Optional: handle soft delete via deleted_at updates
create or replace function public.fn_loyalty_on_payment_soft_delete() returns trigger language plpgsql security definer set search_path = public as $$
declare v_agency uuid; v_customer uuid; v_rate numeric(10,4); v_pts int;
begin
    if old.deleted_at is null and new.deleted_at is not null then
        select p.agency_id, p.customer_id into v_agency, v_customer from public.policies p where p.id = new.policy_id;
        if v_agency is null then return new; end if;
        v_rate := public.resolve_loyalty_rate(v_agency, v_customer);
        v_pts := floor(coalesce(old.amount, 0) * v_rate);
        if v_pts <> 0 then
            insert into public.loyalty_ledger(agency_id, customer_id, policy_id, payment_id, direction, points, reason, occurred_at, created_by)
            values(v_agency, v_customer, new.policy_id, new.id, 'debit', v_pts, 'payment_soft_delete', coalesce(new.paid_at, now()), auth.uid());
        end if;
    end if;
    return new;
end;
$$;

drop trigger if exists tg_loyalty_payment_soft_delete on public.policy_payments;
create trigger tg_loyalty_payment_soft_delete after update of deleted_at on public.policy_payments
for each row execute function public.fn_loyalty_on_payment_soft_delete();


