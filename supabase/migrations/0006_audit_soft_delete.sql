-- 0006_audit_soft_delete.sql
-- Auditable soft delete for policies and policy_payments
-- Add deleted_at columns if missing
do $$ begin if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
        and table_name = 'policies'
        and column_name = 'deleted_at'
) then
alter table public.policies
add column deleted_at timestamptz;
end if;
end $$;
do $$ begin if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
        and table_name = 'policy_payments'
        and column_name = 'deleted_at'
) then
alter table public.policy_payments
add column deleted_at timestamptz;
end if;
end $$;
-- Create audit_events table if missing
create table if not exists public.audit_events (
    id uuid primary key default gen_random_uuid(),
    occurred_at timestamptz not null default now(),
    actor_user_id uuid default auth.uid(),
    actor_agency_id uuid,
    entity text not null check (entity in ('policy', 'payment', 'storage_object')),
    entity_id uuid,
    action text not null check (
        action in (
            'insert',
            'update',
            'delete',
            'soft_delete',
            'restore',
            'storage_upload',
            'storage_update',
            'storage_delete'
        )
    ),
    before jsonb,
    after jsonb,
    ip inet,
    user_agent text
);
alter table public.audit_events enable row level security;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'audit_events'
        and policyname = 'audit_events_tenant_read'
) then create policy audit_events_tenant_read on public.audit_events for
select using (
        actor_agency_id = public.current_agency_id()
    );
end if;
end $$;
-- Audit trigger function
create or replace function public.fn_audit() returns trigger language plpgsql security definer
set search_path = public as $$
declare v_action text;
v_entity text;
v_entity_id uuid;
v_agency uuid;
begin if tg_table_name = 'policies' then v_entity := 'policy';
if tg_op = 'INSERT' then v_action := 'insert';
v_entity_id := new.id;
v_agency := new.agency_id;
end if;
if tg_op = 'UPDATE' then v_entity_id := new.id;
v_agency := new.agency_id;
if old.deleted_at is null
and new.deleted_at is not null then v_action := 'soft_delete';
elsif old.deleted_at is not null
and new.deleted_at is null then v_action := 'restore';
else v_action := 'update';
end if;
end if;
if tg_op = 'DELETE' then v_action := 'delete';
v_entity_id := old.id;
v_agency := old.agency_id;
end if;
elsif tg_table_name = 'policy_payments' then v_entity := 'payment';
if tg_op = 'INSERT' then v_action := 'insert';
v_entity_id := new.id;
end if;
if tg_op = 'UPDATE' then v_entity_id := new.id;
if old.deleted_at is null
and new.deleted_at is not null then v_action := 'soft_delete';
elsif old.deleted_at is not null
and new.deleted_at is null then v_action := 'restore';
else v_action := 'update';
end if;
end if;
if tg_op = 'DELETE' then v_action := 'delete';
v_entity_id := old.id;
end if;
-- derive agency via policy
select p.agency_id into v_agency
from public.policies p
where p.id = coalesce(new.policy_id, old.policy_id);
else return null;
end if;
insert into public.audit_events(
        occurred_at,
        actor_user_id,
        actor_agency_id,
        entity,
        entity_id,
        action,
        before,
        after
    )
values (
        now(),
        auth.uid(),
        v_agency,
        v_entity,
        v_entity_id,
        v_action,
        to_jsonb(old),
        to_jsonb(new)
    );
if tg_op in ('DELETE') then return old;
end if;
return new;
end;
$$;
-- Attach triggers
drop trigger if exists tg_policies_audit on public.policies;
create trigger tg_policies_audit
after
insert
    or
update
    or delete on public.policies for each row execute function public.fn_audit();
drop trigger if exists tg_policy_payments_audit on public.policy_payments;
create trigger tg_policy_payments_audit
after
insert
    or
update
    or delete on public.policy_payments for each row execute function public.fn_audit();
-- Update RLS for policies to hide soft-deleted rows
do $$ begin if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policies'
        and policyname = 'policies_select_same_agency'
) then drop policy policies_select_same_agency on public.policies;
end if;
create policy policies_select_same_agency on public.policies for
select using (
        agency_id = public.current_agency_id()
        and deleted_at is null
    );
end $$;
do $$ begin if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policies'
        and policyname = 'policies_insert_same_agency'
) then drop policy policies_insert_same_agency on public.policies;
end if;
create policy policies_insert_same_agency on public.policies for
insert with check (
        agency_id = public.current_agency_id()
        and deleted_at is null
    );
end $$;
do $$ begin if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policies'
        and policyname = 'policies_update_same_agency'
) then drop policy policies_update_same_agency on public.policies;
end if;
create policy policies_update_same_agency on public.policies for
update using (agency_id = public.current_agency_id()) with check (
        agency_id = public.current_agency_id()
        and deleted_at is null
    );
end $$;
-- Update RLS for policy_payments to hide soft-deleted rows
do $$ begin if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policy_payments'
        and policyname = 'policy_payments_select_same_agency'
) then drop policy policy_payments_select_same_agency on public.policy_payments;
end if;
create policy policy_payments_select_same_agency on public.policy_payments for
select using (
        deleted_at is null
        and exists (
            select 1
            from public.policies p
            where p.id = policy_payments.policy_id
                and p.agency_id = public.current_agency_id()
        )
    );
end $$;
do $$ begin if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policy_payments'
        and policyname = 'policy_payments_insert_same_agency'
) then drop policy policy_payments_insert_same_agency on public.policy_payments;
end if;
create policy policy_payments_insert_same_agency on public.policy_payments for
insert with check (
        (deleted_at is null)
        and exists (
            select 1
            from public.policies p
            where p.id = policy_payments.policy_id
                and p.agency_id = public.current_agency_id()
        )
    );
end $$;
do $$ begin if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policy_payments'
        and policyname = 'policy_payments_update_same_agency'
) then drop policy policy_payments_update_same_agency on public.policy_payments;
end if;
create policy policy_payments_update_same_agency on public.policy_payments for
update using (
        exists (
            select 1
            from public.policies p
            where p.id = policy_payments.policy_id
                and p.agency_id = public.current_agency_id()
        )
    ) with check (
        (deleted_at is null)
        and exists (
            select 1
            from public.policies p
            where p.id = policy_payments.policy_id
                and p.agency_id = public.current_agency_id()
        )
    );
end $$;