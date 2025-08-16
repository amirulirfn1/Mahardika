-- 0009_audit_messages_storage.sql
-- Extend audit to outbound messages and storage objects, idempotent and RLS safe

-- Ensure helper function to write audit exists
do $$ begin
    if not exists (
        select 1 from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where p.proname = 'fn_write_audit' and n.nspname = 'public'
    ) then
        create function public.fn_write_audit(
            p_entity text,
            p_entity_id uuid,
            p_action text,
            p_before jsonb,
            p_after jsonb,
            p_agency uuid
        ) returns void language sql security definer set search_path = public as $$
        insert into public.audit_events(
            occurred_at,
            actor_user_id,
            actor_agency_id,
            entity,
            entity_id,
            action,
            before,
            after
        ) values (
            now(),
            auth.uid(),
            p_agency,
            p_entity,
            p_entity_id,
            p_action,
            p_before,
            p_after
        );
        $$;
        grant execute on function public.fn_write_audit(text, uuid, text, jsonb, jsonb, uuid) to authenticated;
    end if;
end $$;

-- Audit outbound messages on insert (sent/failed)
create or replace function public.fn_audit_message() returns trigger language plpgsql security definer set search_path = public as $$
begin
    perform public.fn_write_audit(
        'message', new.id, case when coalesce(new.status, '') = 'sent' then 'message_send' else 'message_fail' end,
        null, to_jsonb(new), new.agency_id
    );
    return new;
end;
$$;

do $$ begin
    if not exists (
        select 1 from pg_trigger where tgname = 'tg_outbound_messages_audit_ins'
    ) then
        create trigger tg_outbound_messages_audit_ins after insert on public.outbound_messages
        for each row execute function public.fn_audit_message();
    end if;
end $$;

-- Storage auditing (policy-pdfs/payment-proofs buckets only); guarded for permissions
do $$ begin
    perform 1 from pg_class where relname = 'objects' and relnamespace = 'storage'::regnamespace;  -- ensure storage schema exists
    -- Insert
    create or replace function public.fn_audit_storage() returns trigger language plpgsql security definer set search_path = public as $$
    declare v_action text; v_row jsonb; v_id uuid; v_agency uuid;
    begin
        if (coalesce(new.bucket_id, old.bucket_id)) not in ('policy-pdfs','payment-proofs') then
            if tg_op = 'DELETE' then return old; else return new; end if;
        end if;
        if tg_op = 'INSERT' then v_action := 'storage_upload'; v_row := to_jsonb(new); v_id := new.id; v_agency := ((new.metadata->>'agency_id')::uuid);
        elsif tg_op = 'UPDATE' then v_action := 'storage_update'; v_row := to_jsonb(new); v_id := new.id; v_agency := ((new.metadata->>'agency_id')::uuid);
        else v_action := 'storage_delete'; v_row := to_jsonb(old); v_id := old.id; v_agency := ((old.metadata->>'agency_id')::uuid);
        end if;
        perform public.fn_write_audit('storage_object', v_id, v_action, case when tg_op='DELETE' then to_jsonb(old) else null end, v_row, v_agency);
        if tg_op = 'DELETE' then return old; end if; return new;
    end;
    $$;
    -- Triggers guarded by existence check
    if not exists (select 1 from pg_trigger where tgname = 'tg_storage_objects_audit_all') then
        create trigger tg_storage_objects_audit_all after insert or update or delete on storage.objects
        for each row execute function public.fn_audit_storage();
    end if;
exception when others then
    -- Skip storage auditing if permissions or schema unavailable
    perform 1;
end $$;


