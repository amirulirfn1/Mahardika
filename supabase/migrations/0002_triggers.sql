-- 0002_triggers.sql

-- Audit log trigger function
create or replace function public.tg_audit_row() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_agency_id uuid;
  v_actor uuid := auth.uid();
begin
  if (tg_op = 'INSERT') then
    v_agency_id := coalesce((to_jsonb(new)->>'agency_id')::uuid, null);
    insert into public.audit_log(agency_id, table_name, action, row_id, actor, before_data, after_data)
    values (v_agency_id, tg_table_name, 'insert', (to_jsonb(new)->>'id')::uuid, v_actor, null, to_jsonb(new));
    return new;
  elsif (tg_op = 'UPDATE') then
    v_agency_id := coalesce((to_jsonb(new)->>'agency_id')::uuid, (to_jsonb(old)->>'agency_id')::uuid);
    insert into public.audit_log(agency_id, table_name, action, row_id, actor, before_data, after_data)
    values (v_agency_id, tg_table_name, 'update', (to_jsonb(new)->>'id')::uuid, v_actor, to_jsonb(old), to_jsonb(new));
    return new;
  elsif (tg_op = 'DELETE') then
    v_agency_id := coalesce((to_jsonb(old)->>'agency_id')::uuid, null);
    insert into public.audit_log(agency_id, table_name, action, row_id, actor, before_data, after_data)
    values (v_agency_id, tg_table_name, 'delete', (to_jsonb(old)->>'id')::uuid, v_actor, to_jsonb(old), null);
    return old;
  end if;
  return null;
end;
$$;

-- Attach audit triggers
drop trigger if exists tg_audit_customers on public.customers;
create trigger tg_audit_customers
after insert or update or delete on public.customers
for each row execute function public.tg_audit_row();

drop trigger if exists tg_audit_vehicles on public.vehicles;
create trigger tg_audit_vehicles
after insert or update or delete on public.vehicles
for each row execute function public.tg_audit_row();

drop trigger if exists tg_audit_policies on public.policies;
create trigger tg_audit_policies
after insert or update or delete on public.policies
for each row execute function public.tg_audit_row();

drop trigger if exists tg_audit_payments on public.payments;
create trigger tg_audit_payments
after insert or update or delete on public.payments
for each row execute function public.tg_audit_row();

-- Loyalty on payments completed
create or replace function public.tg_payments_loyalty() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_prev_status public.payment_status;
  v_points numeric;
  v_multiplier numeric := 1.0;
  v_lifetime numeric := 0;
begin
  v_prev_status := coalesce(old.status, 'pending');

  if (new.status = 'completed' and v_prev_status <> 'completed') then
    select coalesce(c.lifetime_points, 0) into v_lifetime
    from public.customers c where c.id = new.customer_id;

    if v_lifetime < 1000 then
      v_multiplier := 1.0; -- Bronze
    elsif v_lifetime < 5000 then
      v_multiplier := 1.25; -- Silver
    else
      v_multiplier := 1.5; -- Gold
    end if;

    v_points := new.amount_myr * v_multiplier;

    insert into public.loyalty_ledger(id, agency_id, customer_id, payment_id, points, reason)
    values (gen_random_uuid(), new.agency_id, new.customer_id, new.id, v_points, 'payment_completed');

    update public.customers
    set lifetime_points = coalesce(lifetime_points, 0) + v_points
    where id = new.customer_id;
  end if;

  return new;
end;
$$;

drop trigger if exists tg_payments_loyalty on public.payments;
create trigger tg_payments_loyalty
after update on public.payments
for each row execute function public.tg_payments_loyalty();

-- Reminder job enqueue
create or replace function public.tg_policies_schedule_reminders() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_dates date[] := array[new.end_date - interval '60 days', new.end_date - interval '30 days', new.end_date - interval '7 days'];
  v_date date;
begin
  foreach v_date in array v_dates loop
    if v_date > current_date then
      insert into public.reminder_jobs(id, agency_id, policy_id, run_on)
      select gen_random_uuid(), new.agency_id, new.id, v_date::date
      where not exists (
        select 1 from public.reminder_jobs r where r.policy_id = new.id and r.run_on = v_date::date
      );
    end if;
  end loop;
  return new;
end;
$$;

drop trigger if exists tg_policy_insert_reminders on public.policies;
create trigger tg_policy_insert_reminders
after insert on public.policies
for each row execute function public.tg_policies_schedule_reminders();

drop trigger if exists tg_policy_update_reminders on public.policies;
create trigger tg_policy_update_reminders
after update of end_date on public.policies
for each row execute function public.tg_policies_schedule_reminders();


