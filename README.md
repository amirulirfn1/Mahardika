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

## Staging deploy on push to main

- Workflow `.github/workflows/deploy_staging.yml` deploys `apps/app` to a Vercel preview on pushes to `main`, then runs Playwright smoke tests.
- Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- The job skips gracefully with a notice if any secret is missing.
- Smoke tests use `BASE_URL` and the `@smoke` tag to target a fast subset.

## CI for Pull Requests

- Workflow `.github/workflows/pr_e2e.yml` runs on pull requests.
- Jobs: install deps, lint, typecheck, build, install Playwright browsers, run full E2E with `--retries=1`.
- Artifacts uploaded: `apps/app/playwright-report` and `apps/app/test-results` (collected under `artifacts/`).

## Production deploy

- Workflow `.github/workflows/deploy_prod.yml` promotes to Vercel production after manual approval via the GitHub `production` environment.
- Triggers: manual `workflow_dispatch` or tags matching `release-*`.
- Uses the same Vercel secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).
- After deploy, runs Playwright smoke tests against the production URL.

## Staging

- **Branch rules**: Pushes to `develop` or `staging` trigger the `Staging Deploy` workflow.
- **Manual runs**: Use the `Staging Deploy` workflow's manual dispatch and optionally provide `ref` to deploy a specific commit/branch/tag.
- **Gated by E2E**: The deploy is gated by the reusable `pr_e2e.yml` job. Deployment runs only if E2E passes.
- **Required secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `STAGING_DATABASE_URL`.
- **Optional variables**:
  - `STAGING_ALIAS`: Friendly domain alias (e.g., `staging.mahardika.app`).
  - `RUN_MIGRATIONS`: Set to `1` to run `pnpm -w exec prisma migrate deploy` against `STAGING_DATABASE_URL`.
- **Windows note**: If a build fails due to a readlink error, clean and rebuild:

```cmd
rmdir /s /q apps\app\.next
pnpm -w build
```
