# Mahardika Agents

A complete blueprint for how human agents and optional AI agents work inside the Mahardika platform. This file is implementation ready and aligned with decisions already locked in for Mahardika.

---

## 0) TLDR

* Human agents are staff members under an agency tenant. They sell and renew general insurance via external carriers, handle customer comms, upload quotes and policy files, and manage renewals.
* AI agents (Mahardika Copilot) are opt in assistants that draft replies, triage leads, extract data from uploads, and schedule reminders. They never act without human confirmation by default.
* Multi tenant is enforced with tenant_id scoping everywhere. RLS is strict allowlist. Storage buckets follow the same tenant scoping pattern.
* Customers cannot upload their own policy or payment proof. Quote requests remain external to carriers. Only Admin can add staff, limited by subscription tier. English and Malay supported. No real time online status for staff for now.

---

## 1) Scope

This document covers roles, data model, RLS, auth and tenancy, UI flows, API and RPC surface, storage, comms, analytics, billing and seats, audits and PDPA, testing, and an appendix with types and SQL starters. It is written for engineers working on Next.js App Router and Supabase.

---

## 2) Terminology

* Tenant: A single subscribing organization in Mahardika, called an Agency.
* Member: A user inside a tenant. Members have roles.
* Agent: A Member who sells policies and manages customers. In database terms it is a specialized Member profile.
* Customer: End user who holds a policy.
* Owner: The primary administrator of an Agency tenant. Can manage billing and seats.
* Admin: Agency administrator who can manage members and settings.
* Staff: Non selling staff such as CS or finance.
* Super Admin: Mahardika platform operator.
* Copilot: AI assistant features inside Mahardika.

---

## 3) Architecture overview

* Front end: Next.js App Router. Relevant routes today include `/dashboard`, `/dashboard/agency/*`, `/dashboard/staff`, `/dashboard/customer`, `/dashboard/users`, `/dashboard/settings`, `/dashboard/agency/loyalty`, `/dashboard/agency/communications`, `/dashboard/agency/customers`, `/dashboard/agency/policies` and related CRUD pages.
* Back end: Supabase Postgres with RLS, RPC functions, triggers, Storage buckets. Optional serverless Next.js Route Handlers under `/api/*` for value added orchestration and webhooks.
* Auth: Auth.js (NextAuth) with JWT that carries `tenant_id` and `role`. Session middleware redirects users per tenant. Database role checks are done by RLS regardless of session.
* Jobs: Database driven queues in `jobs` table for reminders and async processing. No external workers required initially. Cron can be implemented with Supabase scheduled functions.

---

## 4) Data model

The following tables are core. Prefix all rows with `tenant_id uuid not null`.

### 4.1 Core identity and tenancy

* `user_profiles` id uuid pk, email, name, phone, avatar_url, locale.
* `agencies` id uuid pk, name, slug, country, timezone, logo_url, plan, seats_limit, created_by.
* `agency_members` id uuid pk, tenant_id references agencies.id, user_id references user_profiles.id, role enum('OWNER','ADMIN','AGENT','STAFF'), status enum('ACTIVE','INVITED','SUSPENDED'), license_no text nullable, license_issuer text nullable.

### 4.2 Customer and policy

* `customers` id uuid pk, tenant_id, full_name, phone, email, national_id, address_json, notes, loyalty_tier, points_balance int default 0.
* `policies` id uuid pk, tenant_id, customer_id, agent_id, carrier text, product text, policy_no text, status enum('QUOTE','IN_FORCE','LAPSED','CANCELLED'), start_date, end_date, premium_net numeric, premium_gross numeric, files_json, external_quote_ref text.
* `policy_payments` id uuid pk, tenant_id, policy_id, amount numeric, paid_at timestamp, method enum('CASH','TRANSFER','CARD'), receipt_file_url, verified_by uuid nullable.
* `renewals` id uuid pk, tenant_id, policy_id, due_date, stage enum('UPCOMING','CONTACTED','QUOTED','PENDING_DOCS','COMPLETED','MISSED'), last_contact_at.

### 4.3 Comms, tasks, notes

* `conversations` id uuid pk, tenant_id, customer_id, channel enum('WHATSAPP','EMAIL','PHONE','IN_PERSON'), direction enum('IN','OUT'), body text, meta_json, sent_by uuid nullable.
* `notes` id uuid pk, tenant_id, subject, body, entity_type enum('CUSTOMER','POLICY','AGENT'), entity_id uuid, created_by uuid.
* `tasks` id uuid pk, tenant_id, assignee_id uuid, title, due_at, status enum('OPEN','DONE','CANCELLED'), related_type enum('RENEWAL','LEAD','CUSTOMER','POLICY'), related_id uuid.
* `notifications` id uuid pk, tenant_id, user_id, kind, payload_json, read_at timestamp nullable.

### 4.4 Loyalty and tiers

* `loyalty_tiers` id uuid pk, tenant_id, code text unique, name text, threshold_visits int, ringgit_to_point numeric, perks_json.
* `loyalty_ledger` id uuid pk, tenant_id, customer_id, points int, reason, ref_type enum('PURCHASE','RENEWAL','ADJUST'), ref_id uuid, created_by uuid.

### 4.5 Billing and seats

* `subscriptions` id uuid pk, tenant_id, plan enum('FREE','STARTER','GROWTH','PRO'), status, current_period_end, stripe_customer_id nullable.
* `seats` id uuid pk, tenant_id, member_id uuid unique, role_cached text, active boolean default true.

### 4.6 Storage and audits

* `files` id uuid pk, tenant_id, path text, bucket text, kind enum('QUOTE','POLICY','RECEIPT','KYC','MISC'), uploaded_by uuid, size_bytes int.
* `audit_log` id uuid pk, tenant_id, actor_id uuid, action, entity, entity_id uuid, before_json, after_json, at timestamp default now().
* `jobs` id uuid pk, tenant_id, kind, payload_json, run_at timestamp, status enum('QUEUED','RUNNING','DONE','FAILED'), attempts int default 0, last_error text.

### 4.7 Example DDL for key tables

```sql
create table public.agency_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null check (role in ('OWNER','ADMIN','AGENT','STAFF')),
  status text not null default 'INVITED' check (status in ('ACTIVE','INVITED','SUSPENDED')),
  license_no text,
  license_issuer text,
  unique(tenant_id, user_id)
);

create table public.policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  agent_id uuid references public.agency_members(id) on delete set null,
  carrier text not null,
  product text not null,
  policy_no text,
  status text not null check (status in ('QUOTE','IN_FORCE','LAPSED','CANCELLED')),
  start_date date,
  end_date date,
  premium_net numeric,
  premium_gross numeric,
  files_json jsonb default '[]'::jsonb,
  external_quote_ref text
);
```

---

## 5) RLS and tenancy

Enable RLS on all tables. The client connection must set `request.jwt.claims ->> 'tenant_id'` and `role`.

### 5.1 Common helper

```sql
create policy helper on public.agencies as permissive for select using (true);
-- Add a DB function to extract tenant and role from JWT
create or replace function auth.tenant_id() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id','')::uuid
$$;
create or replace function auth.role() returns text language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'role','')
$$;
```

### 5.2 Generic policies

```sql
alter table public.agency_members enable row level security;
create policy agency_members_tenant_isolation on public.agency_members
  for all using (tenant_id = auth.tenant_id()) with check (tenant_id = auth.tenant_id());

create policy agency_members_admin_write on public.agency_members
  for insert with check (auth.role() in ('OWNER','ADMIN'));
create policy agency_members_admin_update on public.agency_members
  for update using (auth.role() in ('OWNER','ADMIN'));

-- Read for same tenant members
create policy agency_members_read on public.agency_members
  for select using (tenant_id = auth.tenant_id());
```

Repeat the same per table. For `files` add a path prefix constraint inside Storage policies.

### 5.3 Storage buckets

Buckets:

* `policy-docs/{tenant_id}/{policy_id}/...`
* `customer-kits/{tenant_id}/{customer_id}/...`
* `agency-docs/{tenant_id}/...`

Supabase Storage policy example:

```sql
create policy storage_read_same_tenant on storage.objects
for select using (
  bucket_id in ('policy-docs','customer-kits','agency-docs')
  and (storage.foldername(name))[1] = auth.tenant_id()::text
);
```

---

## 6) Auth and session

* Auth.js issues JWT that includes `tenant_id` and `role` in the token. Server routes also enforce role checks.
* On sign in, users without an Agency get routed to create or join flow.
* Suspended members cannot sign in to a tenant workspace.

---

## 7) Roles and permissions matrix

| Capability                        | Owner | Admin | Agent     | Staff   | Super Admin |
| --------------------------------- | ----- | ----- | --------- | ------- | ----------- |
| Manage billing and plan           | Yes   | No    | No        | No      | N/A         |
| Add or remove members             | Yes   | Yes   | No        | No      | N/A         |
| Edit agency settings              | Yes   | Yes   | No        | Limited | N/A         |
| Create and edit customers         | Yes   | Yes   | Yes       | Yes     | N/A         |
| Create policies                   | Yes   | Yes   | Yes       | Limited | N/A         |
| Upload quotes and policy files    | Yes   | Yes   | Yes       | Yes     | N/A         |
| Record payments and mark verified | Yes   | Yes   | Yes       | Limited | N/A         |
| Start conversations               | Yes   | Yes   | Yes       | Yes     | N/A         |
| View analytics                    | Yes   | Yes   | Yes (own) | Limited | N/A         |
| Configure Copilot                 | Yes   | Yes   | No        | No      | N/A         |
| Export data                       | Yes   | Yes   | No        | No      | N/A         |

Limited means read or own scope only.

---

## 8) Onboarding and lifecycle

### 8.1 Create agency

1. Owner signs up and creates Agency with name and slug.
2. Plan defaults to Free or Trial.
3. Seats limit seeded from plan.

### 8.2 Invite members

1. Admin sends invite by email from `/dashboard/agency/users`.
2. Invitee accepts, account is created, role assigned, optional license fields captured.
3. Status becomes ACTIVE after first login.

### 8.3 Agent profile

* Optional license verification fields: `license_no`, `license_issuer`. Store as plain text only. If external verification is added later, create a separate `verifications` table.
* Assign agent to default product lines: motor, car, home, fire. These are metadata only and do not lock features.

### 8.4 Deactivate and transfer

* Deactivate sets `status = 'SUSPENDED'` and revokes seat. Policies remain assigned for audit but appear in read only.

---

## 9) UX and navigation

### 9.1 Proposed routes and screens

* `/dashboard/agency/agents` list and manage members with role filter.
* `/dashboard/agency/agents/new` invite flow.
* `/dashboard/agency/agents/[id]` profile, KPIs, assigned customers.
* `/dashboard/agency/customers` CRUD with quick actions, tags, and bulk SMS or WhatsApp.
* `/dashboard/agency/policies` CRUD with filters: status, expiry window, carrier, agent.
* `/dashboard/agency/loyalty` manage tiers and adjustments. Customers cannot self upload points evidence.
* `/dashboard/agency/communications` unified inbox for WhatsApp and email logs.

These sit alongside your existing pages. If you prefer to keep `/dashboard/staff` and `/dashboard/users`, alias the new routes or add tabs.

### 9.2 Table columns

* Agents list: Name, Role, Status, Customers, Active policies, Renewals in next 30 days, Last login.
* Customers list: Name, Phone, Email, Tier, Points, Policies count, Last contact.
* Policies list: No, Customer, Carrier, Product, Agent, Status, Start, End, Premium gross, Files.

### 9.3 Detail views

* Agent profile: top cards for Active policies, Renewal pipeline, Conversion rate, Response time. Tabs for Customers, Conversations, Notes, Files.

---

## 10) Operational workflows

### 10.1 Lead to policy

1. Create Customer or import from CSV.
2. Record Conversation and Notes.
3. Upload external quote file and set `status = 'QUOTE'` on Policy record.
4. When confirmed, set policy details and `status = 'IN_FORCE'`. Create Renewal row with due date from end_date.

### 10.2 Renewals

* System creates `jobs` for 30, 14, 7, 1 day before `renewals.due_date`.
* Notifications are generated for the assigned Agent and Admin.
* One click actions: send WhatsApp template, log call, upload new quote, mark completed or missed.

### 10.3 Payments

* Agents record payment and upload receipt. Verification is done by Admin or Owner. Customers cannot upload receipts.

### 10.4 Loyalty points

* Points are added when `policies.status` becomes `IN_FORCE` or on renewal completion. Conversion uses tier at time of awarding.

---

## 11) Communications

### 11.1 WhatsApp

* Outbound uses templated messages. Store only message body, timestamps, and delivery status. Do not store full third party identifiers beyond phone number.
* Minimal PII. Respect customer opt out flag.

### 11.2 Email

* Use transactional email provider. Track message_id and delivery state.

### 11.3 Call logs

* Agents can log calls manually with outcomes. No call recording at MVP.

---

## 12) Analytics and KPIs

* Agent KPIs: policies sold, active policies, renewal conversion, average time to first response, NPS or CSAT placeholders.
* Agency KPIs: total premium, growth, retention rate, upcoming renewals, outstanding verifications.
* Charts: bar and line for monthly premium, funnel from lead to policy, renewal pipeline by bucket.

---

## 13) Plans, seats, and limits

Plan gates to start with:

* FREE: 1 Owner, 1 Admin, 1 Agent, 500 customers, 2 GB storage, basic analytics.
* STARTER: up to 5 seats, 5,000 customers, 20 GB, renewals automation, WhatsApp templates.
* GROWTH: up to 15 seats, 50,000 customers, 100 GB, custom fields, export.
* PRO: custom seats, SSO, audit exports, priority support.

Only Admin or Owner can add staff. Seat checks enforced by database constraint and UI.

---

## 14) Copilot AI agents (optional)

Principles:

* Assistive by default. Never auto send messages without user confirmation.
* Explainable output. Always show source snippets or extracted fields before save.
* Respect tenant boundaries and PDPA.

Capabilities:

* Lead triage: classify urgency and suggest next step.
* Smart compose: draft WhatsApp or email replies with tone control in English or Malay.
* Document extraction: pull policy number, dates, carrier, premium from uploaded PDFs and propose a prefilled policy record.
* Renewal prioritization: rank upcoming renewals by likelihood to convert using simple rules first.

Tables and events:

* `jobs` rows with kind `AI_EXTRACT`, `AI_REPLY_DRAFT`, `AI_RENEWAL_RANK`.
* `ai_artifacts` table if you want to store model outputs for audit.

UI:

* Copilot panel inside Customer, Policy, and Renewals pages with Draft, Accept, Edit, Discard actions.

---

## 15) API and RPC surface

### 15.1 REST style Route Handlers

* `POST /api/agency/members/invite` body: email, role.
* `POST /api/customers` create customer.
* `POST /api/policies` create policy in QUOTE status.
* `POST /api/policies/:id/activate` set IN_FORCE and create renewal.
* `POST /api/payments` record payment and upload receipt.
* `POST /api/renewals/:id/advance` stage transitions.
* `POST /api/loyalty/adjust` points adjustment.

All requests require JWT. Server will pass claims to Supabase via service role when needed and still set `tenant_id` for row creation.

### 15.2 Supabase RPC helpers

* `rpc.create_member(email text, role text)` -> invites a user and inserts `agency_members` with status INVITED.
* `rpc.activate_policy(policy_id uuid)` -> updates status and inserts into `renewals` and `loyalty_ledger`.
* `rpc.renewal_pipeline(days int)` -> returns grouped counts by stage.

---

## 16) Validation and field rules

* Phone uses E.164. Store as text, validate in UI.
* National ID stored encrypted at rest. Add a column using `pgcrypto` to encrypt if needed.
* Currency amounts use numeric with 2 decimals.
* Date logic: `end_date` must be after `start_date`. Renewal due_date equals `end_date` unless configured.

---

## 17) Security, PDPA, and audit

* Data minimization: only store what is needed for the purpose. No copies of documents outside Storage.
* Consent: checkbox for marketing contact on customer create. Store consent timestamp and channel.
* Access logging: write to `audit_log` on all create, update, delete for key tables via triggers.
* Export and deletion: implement customer data export and deletion queues to honor PDPA requests. Soft delete first, hard delete by job after retention period.

Audit trigger starter:

```sql
create or replace function util.audit() returns trigger language plpgsql as $$
begin
  insert into public.audit_log(tenant_id, actor_id, action, entity, entity_id, before_json, after_json)
  values (new.tenant_id, nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'user_id','')::uuid,
          tg_op, tg_table_name, coalesce(new.id, old.id), to_jsonb(old), to_jsonb(new));
  return coalesce(new, old);
end; $$;
```

---

## 18) Testing checklist

* RLS: a user from Tenant A cannot see Tenant B rows for all tables.
* Seats: cannot invite beyond plan limit.
* Renewals pipeline: jobs created at 30, 14, 7, 1 days and notifications delivered.
* Storage: objects are not readable across tenants via direct URL.
* Copilot: outputs require human confirmation and are stored under the correct tenant.
* Downgrade: plan downgrade enforces seat and feature limits gracefully.

---

## 19) Migration and seed

* Migrations: one SQL file per table with `enable row level security` and policies. Use a master `init.sql` that can be run idempotently.
* Seed users: 1 Owner, 1 Admin, 1 Agent, 5 Customers, 5 Policies with mixed statuses, 3 Renewals due soon.
* Seed loyalty: Basic, Silver, Gold with sample conversion like 1.0, 1.25, 1.5 ringgit to point.

---

## 20) Known decisions and non goals

* Customers cannot upload policy or payment proof.
* Quotation requests remain external to carriers. Agencies can upload quotes if their tier allows.
* Only Admin can add staff. Limits are by subscription tier.
* English and Malay supported in the UI. Content toggles per user locale.
* No real time agent availability indicator for now.

---

## 21) Appendix A: TypeScript types

```ts
export type Role = 'OWNER' | 'ADMIN' | 'AGENT' | 'STAFF';
export interface AgencyMember {
  id: string;
  tenant_id: string;
  user_id: string;
  role: Role;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  license_no?: string;
  license_issuer?: string;
}

export interface Policy {
  id: string;
  tenant_id: string;
  customer_id: string;
  agent_id?: string;
  carrier: string;
  product: string;
  policy_no?: string;
  status: 'QUOTE' | 'IN_FORCE' | 'LAPSED' | 'CANCELLED';
  start_date?: string;
  end_date?: string;
  premium_net?: number;
  premium_gross?: number;
  files_json: Array<{ url: string; name: string; kind: 'QUOTE'|'POLICY'|'RECEIPT'|'KYC'|'MISC' }>;
  external_quote_ref?: string;
}
```

## 22) Appendix B: Sample RLS for policies

```sql
alter table public.policies enable row level security;
create policy policies_tenant_isolation on public.policies
  for all using (tenant_id = auth.tenant_id()) with check (tenant_id = auth.tenant_id());

-- Agents can update only their own assigned policies. Admins and Owners can update any policy.
create policy policies_agent_update on public.policies
  for update using (
    tenant_id = auth.tenant_id() and (
      auth.role() in ('OWNER','ADMIN') or exists (
        select 1 from public.agency_members m
        where m.id = policies.agent_id and m.user_id = nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'user_id','')::uuid
      )
    )
  );
```

## 23) Appendix C: WhatsApp templates

* Renewal reminder: Hello {{name}}, your {{product}} policy ends on {{end_date}}. Would you like me to prepare a renewal quote? Reply 1 for yes, 2 for no.
* Payment received: Hi {{name}}, we have received RM {{amount}} for policy {{policy_no}}. Thank you.
* Document request: Hi {{name}}, could you send a photo of your IC and cover note so I can proceed with your quote?

---

## 24) Ready next steps

* Scaffold `/dashboard/agency/agents` pages and link from the sidebar.
* Create SQL migrations using the schemas and policies above.
* Wire Auth.js JWT to include `tenant_id`, `role`, and `user_id` claims.
* Implement Storage buckets and Storage RLS.
* Add renewal jobs with Supabase cron and notification creation.
* Optional: ship Copilot panel with draft only actions.

This is a living spec. Update this file as soon as scope or decisions change.
