# Mahardika

Monorepo for Mahardika MVP built with Next.js 14, TypeScript, Tailwind, Supabase, Turborepo, and pnpm.

Requirements

- Node 22.x (see `.nvmrc`)
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

## Security model for policies and documents

- `public.policies` is protected by tenant-scoped RLS. Owners and admins can manage any policy in their tenant; agents can be restricted to their assigned policies via policy checks.
- Policy documents live in the private bucket `policy-docs`. Storage policies ensure the first path segment matches the authenticated `tenant_id`.
- Server utilities automatically write files to `policy-docs/{tenant_id}/{policy_id}/...` and store metadata in `policies.files_json`.
- Signed URLs expire after 10 minutes.

## Payment tracking

- `public.policy_payments` tracks incoming payments tied to `public.policies` with fields for `method`, `reference`, `notes`, and soft-delete support.
- RLS strictly scopes all operations to the tenant of the owning policy. Deletion/restoration is limited to owners/admins.
- UI: create and list payments under a policy detail, with a dedicated payments page for expanded history.

## Soft delete and audit trail

- `public.policies`, `public.policy_payments`, and other core tables include `deleted_at` for reversible deletes.
- RLS excludes soft-deleted rows by default.
- `public.audit_log` captures inserts, updates, deletes, soft-delete, and restore events along with JSON snapshots.
- Policy detail includes a danger zone section to soft delete/restore and surfaces the audit history.

## Monitoring (Sentry)

- Integrated `@sentry/nextjs` with safe defaults. If `SENTRY_DSN` is unset, Sentry is inert and the app still runs.
- Configure `SENTRY_DSN`, `SENTRY_ENV`, and `SENTRY_TRACES_SAMPLE_RATE` in environment.
- A small server logger at `apps/app/src/lib/log.ts` captures errors to Sentry when DSN is set, and always logs to stderr with redaction of sensitive keys.

## Staging deploy on push to main

- Workflow `.github/workflows/staging_deploy.yml` deploys `apps/app` to a Vercel preview on pushes to `main`, then runs Playwright smoke tests.
- Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- The job skips gracefully with a notice if any secret is missing.
- Smoke tests use `BASE_URL` and the `@smoke` tag to target a fast subset.

## CI for Pull Requests

- Workflow `.github/workflows/pr_e2e.yml` runs on pull requests.
- Jobs: install deps, lint, typecheck, build, install Playwright browsers, run full E2E with `--retries=1`.
- Artifacts uploaded: `apps/app/playwright-report` and `apps/app/test-results` (collected under `artifacts/`).

## Production release

- Workflow `.github/workflows/prod_release.yml` promotes the already-built Vercel preview to Production after E2E passes.
- Triggers: push to `main`, release published, and manual `workflow_dispatch` (inputs: optional `ref`, optional `deployment_url`).
- Promotion behavior: resolves the preview deployment for the current commit via Vercel REST API, then runs `vercel promote` to flip Production.
- Environment gate: uses the GitHub Environment `production` with required reviewers; the job publishes the Production URL to the environment.
- Required secrets: `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`. Optional: `VERCEL_ORG_ID` if your CLI setup requires it.
- Post-deploy: optional smoke check pings `/` until HTTP 200.
- Gated by CI: reuses the reusable `pr_e2e.yml` job; promotion only runs if E2E succeeds.

## Staging

- **Branch rules**: Pushes to `develop` or `staging` trigger the `Staging Deploy` workflow.
- **Manual runs**: Use the `Staging Deploy` workflow's manual dispatch and optionally provide `ref` to deploy a specific commit/branch/tag.
- **Gated by E2E**: The deploy is gated by the reusable `pr_e2e.yml` job. Deployment runs only if E2E passes.
- **Required secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- **Optional variables**:
  - `STAGING_ALIAS`: Friendly domain alias (e.g., `staging.mahardika.app`).
- **Windows note**: If a build fails due to a readlink error, clean and rebuild:

```cmd
rmdir /s /q apps\app\.next
pnpm -w build
```

## Local preview

- Install deps: `pnpm i -w`
- Pull Vercel env (Preview): `vercel pull --yes --environment=preview` and save as `apps/app/.env.local` (or copy from `apps/app/.env.example`).
- Run dev: `pnpm -w dev` (Next.js on `http://localhost:3000`).
- Run E2E UI against local: `PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm -w test:e2e:ui`.
- Vercel CLI dev (optional): `pnpm vercel:dev`.
- Windows tip: if you hit `readlink` errors, remove `.next` and rebuild:

```cmd
rmdir /s /q apps\app\.next
pnpm -w build
```

## Supabase + Vercel integration

- Link the Supabase project locally (required for CLI migrations):

  ```bash
  SUPABASE_ACCESS_TOKEN=... npx supabase link --project-ref uskwbfrmbqvpymxgpvqw
  ```

- Apply the latest migrations before deploying:

  ```bash
  npx supabase db push
  ```

- Required Vercel environment variables (Preview + Production):
  - `NEXT_PUBLIC_SUPABASE_URL=https://uskwbfrmbqvpymxgpvqw.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `supabase projects api-keys list`)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - `SUPABASE_JWT_SECRET`
  - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
  - `NEXTAUTH_URL`/`APP_URL` for production (e.g. `https://mahardika.vercel.app`)

- Propagate env vars to Vercel:

  ```bash
  vercel env pull --yes --environment=preview
  vercel env add NEXTAUTH_SECRET production
  # repeat for other keys / environments
  ```


## Design notes

- Tokens: CSS custom properties for spacing and radii defined in `apps/app/src/app/globals.css` (e.g., `--space-*`, `--radius-*`). Accent color is injected via `--accent` and defaults to indigo; override with `NEXT_PUBLIC_ACCENT`.
- Typography: system font stack, headings tight tracking and 1.15 line-height, body 1.6.
- Components: minimal UI primitives under `apps/app/components/ui` (`Button`, `Badge`, `Card`, `Container`, `Section`, `SectionHeading`). Layout (`Header`, `Footer`, `ThemeToggle`). Marketing (`FeatureCard`, `PricingCard`, `Testimonial`, `FAQ`). Dashboard (`PageHeader`, `StatCard`, `TableSimple`).
- Dark mode: `next-themes` with class attribute; toggle in header.
- Metadata: Next.js Metadata API in `apps/app/src/app/layout.tsx` via values from `apps/app/lib/site.ts`.

## Routes (App Router)

- Marketing: `/`, `/features`, `/pricing`, `/docs`, `/contact`
- Auth: `/signin`, `/signup`
- App: `/dashboard/overview`, `/dashboard/users`, `/dashboard/users/[id]`, `/dashboard/settings`
- System: `/404`, `not-found.tsx`, `loading.tsx`, `error.tsx`

## Staging deploy

Push to `develop`:

```bash
git add -A
git commit -m "feat(ui): scaffold minimalist design system and core pages"
git push origin develop
```

Expected workflow: CI runs Lint/Typecheck/Build, Playwright smoke (`apps/app/tests/smoke-nav.e2e.spec.ts`), then Vercel stages a Preview URL. Check Actions → Staging Deploy for the preview link.
