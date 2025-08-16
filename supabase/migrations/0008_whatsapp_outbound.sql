-- 0008_whatsapp_outbound.sql
-- Outbound WhatsApp messages table with multi-agency RLS
-- Create table if missing
create table if not exists public.outbound_messages (
    id uuid primary key default gen_random_uuid(),
    agency_id uuid not null references public.agencies(id) on delete cascade,
    channel text not null check (channel in ('whatsapp')),
    to_number text not null,
    template text,
    body text,
    status text not null default 'queued',
    error text,
    created_by uuid default auth.uid(),
    created_at timestamptz default now()
);
-- Index for common listing
do $$ begin if not exists (
    select 1
    from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'i'
        and c.relname = 'outbound_messages_agency_created_idx'
        and n.nspname = 'public'
) then create index outbound_messages_agency_created_idx on public.outbound_messages(agency_id, created_at desc);
end if;
end $$;
-- RLS policies
alter table if exists public.outbound_messages enable row level security;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'outbound_messages'
        and policyname = 'outbound_messages_select_same_agency'
) then create policy outbound_messages_select_same_agency on public.outbound_messages for
select using (agency_id = public.current_agency_id());
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'outbound_messages'
        and policyname = 'outbound_messages_insert_same_agency'
) then create policy outbound_messages_insert_same_agency on public.outbound_messages for
insert with check (agency_id = public.current_agency_id());
end if;
end $$;