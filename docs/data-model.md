# Data Model Summary

- profiles: user profile, links auth.users to tenant via agency_id, has role.
- agencies: tenant entity with owner_id and plan.
- agency_staff: membership of users to agencies with role.
- customers: contacts per agency with lifetime_points.
- vehicles: optional vehicles linked to customers.
- policies: policy linked to customer and optional vehicle, has pdf_path and dates.
- payments: payments for policies with status and optional proof_path.
- loyalty_ledger: points per completed payment.
- reminder_jobs: queued reminders for policy expiry at 60/30/7 days.
- message_logs: outbound messages, status and error.
- upload_files: mapping of storage objects to rows with bucket_id and object_path.
- audit_log: before/after change snapshots.

Relationships

- agencies 1—\* customers, vehicles, policies, payments, reminder_jobs, message_logs, upload_files
- customers 1—\* vehicles, policies, payments, loyalty_ledger
- payments 1—1 loyalty_ledger (optional)
- policies _—1 customers, _—1 vehicles

RLS

- Tenant isolation by agency_id and public.current_agency_id(); platform admin override via public.is_platform_admin().
