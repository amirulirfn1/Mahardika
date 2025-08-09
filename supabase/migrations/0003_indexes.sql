-- 0003_indexes.sql

-- Tenant-wide agency_id indexes
create index if not exists idx_profiles_agency_id on public.profiles(agency_id);
create index if not exists idx_agency_staff_agency_id on public.agency_staff(agency_id);
create index if not exists idx_customers_agency_id on public.customers(agency_id);
create index if not exists idx_vehicles_agency_id on public.vehicles(agency_id);
create index if not exists idx_policies_agency_id on public.policies(agency_id);
create index if not exists idx_payments_agency_id on public.payments(agency_id);
create index if not exists idx_loyalty_agency_id on public.loyalty_ledger(agency_id);
create index if not exists idx_reminders_agency_id on public.reminder_jobs(agency_id);
create index if not exists idx_messages_agency_id on public.message_logs(agency_id);
create index if not exists idx_files_agency_id on public.upload_files(agency_id);
create index if not exists idx_audit_agency_id on public.audit_log(agency_id);

-- Foreign key and filter indexes
create index if not exists idx_agency_staff_user_id on public.agency_staff(user_id);
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_customers_phone on public.customers(phone);
create index if not exists idx_vehicles_customer_id on public.vehicles(customer_id);
create index if not exists idx_policies_customer_id on public.policies(customer_id);
create index if not exists idx_policies_vehicle_id on public.policies(vehicle_id);
create index if not exists idx_payments_customer_id on public.payments(customer_id);
create index if not exists idx_payments_policy_id on public.payments(policy_id);
create index if not exists idx_loyalty_customer_id on public.loyalty_ledger(customer_id);

-- Time-based / status indexes
create index if not exists idx_policies_end_date on public.policies(end_date);
create index if not exists idx_reminders_run_on_status on public.reminder_jobs(run_on, status);
create index if not exists idx_messages_created_at on public.message_logs(created_at);


