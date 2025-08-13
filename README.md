# Mahardika

Monorepo for Mahardika MVP built with Next.js 14, TypeScript, Tailwind, Supabase, Turborepo, and pnpm.

Requirements

- Node 20 LTS (see `.nvmrc`)
- pnpm 9.x

Scripts

- `pnpm dev` run all apps in dev
- `pnpm lint` run linters
- `pnpm typecheck` run TypeScript across workspaces
- `pnpm build` build all packages and apps

Workspaces

- `apps/app` Next.js application
- `packages/ui` shared UI components
- `packages/config` shared configs (ESLint, Tailwind, TS, Prettier)

## Security model for policies and PDFs

- `public.policies` is protected by strict RLS: same-agency users can select/insert/update; delete is limited to `agency_owner` (and platform admins) within the same agency.
- Policy PDFs are stored in a private bucket `policy-pdfs`. RLS on `storage.objects` restricts access by `metadata.agency_id == current_agency_id()`.
- Server code ensures all PDF uploads set `metadata.agency_id` automatically; clients cannot override it.
- Signed URLs expire after 10 minutes.

## Payment tracking

- `public.policy_payments` tracks incoming payments tied to `public.policies`.
- RLS strictly scopes all operations to the agency of the owning policy. Delete is limited to agency owners (and platform admins).
- UI: create and list payments under a policy detail, with a dedicated payments page for more entries.

## Soft delete and audit trail

- Both `public.policies` and `public.policy_payments` support soft delete via `deleted_at`.
- RLS hides soft-deleted rows by default in SELECT/UPDATE/INSERT checks.
- `public.audit_events` records inserts/updates/deletes and soft-delete/restore, scoped by `actor_agency_id`.
- Policy detail includes a danger zone to soft delete/restore; audit visibility is restricted to the same agency.

## Monitoring (Sentry)

- Integrated `@sentry/nextjs` with safe defaults. If `SENTRY_DSN` is unset, Sentry is inert and the app still runs.
- Configure `SENTRY_DSN`, `SENTRY_ENV`, and `SENTRY_TRACES_SAMPLE_RATE` in environment.
- A small server logger at `apps/app/src/lib/log.ts` captures errors to Sentry when DSN is set, and always logs to stderr with redaction of sensitive keys.
