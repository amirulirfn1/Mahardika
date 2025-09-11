# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview

Mahardika is a pnpm + Turborepo monorepo.
- apps/app: Next.js 14 (App Router) application, TypeScript, Tailwind, Supabase client, optional Sentry.
- packages/ui: Shared TypeScript UI library built with tsc.
- packages/config: Centralized config exports (ESLint, Prettier, Tailwind preset, tsconfig base) consumed by workspaces.
- Build graph and caching via turbo.json; TypeScript project references in root tsconfig.json wire packages together.

Common commands

Setup
- Install deps (workspace root):
  - pnpm i -w
- Node and pnpm versions: Node 20 LTS, pnpm 9 (enforced via package.json engines).

Develop
- Run all workspaces in dev (parallel):
  - pnpm -w dev
- Focus on the Next.js app only:
  - pnpm -C apps/app dev
  - Or with workspace filter: pnpm -F app dev

Build, lint, types, format
- Build everything: pnpm -w build
- Build a single package:
  - UI lib: pnpm -C packages/ui build
  - App: pnpm -C apps/app build
- Lint: pnpm -w lint
- Lint (auto-fix): pnpm -w lint:fix
- Typecheck: pnpm -w typecheck
- Typecheck single workspace: pnpm -C apps/app typecheck
- Format (Prettier): pnpm -w fmt

Unit tests (Vitest)
- Run unit tests in app: pnpm -C apps/app test
- Run a single test file: pnpm -C apps/app vitest path/to/file.test.ts
- Run by name/pattern: pnpm -C apps/app vitest -t "pattern"

End-to-end tests (Playwright)
- All E2E tests: pnpm -w test:e2e
  - By default, Playwright will start the app if PLAYWRIGHT_BASE_URL/BASE_URL is not set. It runs pnpm start -p 3100 in apps/app, which requires a prior production build. If you rely on the auto webServer, run pnpm -w build first.
- Run against an already running dev server:
  - PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm -w test:e2e
- Smoke subset (tagged @smoke), e.g. for a deployed URL:
  - BASE_URL=https://<preview>.vercel.app pnpm -w e2e:smoke
- Open Playwright UI:
  - PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm -w e2e:ui

Prisma/DB (if schema is present)
- Generate client: pnpm db:gen
- Apply migrations on target DB: pnpm db:migrate
- Push dev schema: pnpm db:push
- Seed data: pnpm db:seed

Vercel local dev (optional)
- pnpm vercel:dev (serves apps/app on port 3000 via Vercel CLI)

Environment
- Copy example env for the app: apps/app/.env.example -> apps/app/.env.local
- Notable variables used in builds/tests (see turbo.json, workflows, and app):
  - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SENTRY_DSN (optional), SENTRY_ENV, SENTRY_TRACES_SAMPLE_RATE
  - PLAYWRIGHT_BASE_URL or BASE_URL for E2E

High-level architecture and flows

Build and workspace graph (Turbo + pnpm)
- Monorepo packages are defined in pnpm-workspace.yaml and referenced in tsconfig.json.
- turbo.json defines tasks: build (dependsOn ^build, caches .next and dist outputs), dev (non-cached, persistent), lint, typecheck, test.
- The Next.js app’s production build reads specific env vars at build time (turbo.json env array).

Shared configuration (packages/config)
- Exposes eslint, prettier, tailwind preset, and a tsconfig base via package exports ("@mahardika/config/..."), consumed by apps/app (see apps/app/.eslintrc.json extends ../../packages/config/eslint/index.cjs).

App (apps/app)
- Next.js 14 App Router with Tailwind and minimal component primitives under components/ui.
- Sentry integration is wrapped in next.config.mjs; if @sentry/nextjs is not installed or SENTRY_DSN is unset, config falls back harmlessly.
- Supabase usage is client-side via @supabase/supabase-js and @supabase/ssr; security/row-level policies are enforced in the backend (see repository READMEs and supabase/seed/README.md).

Testing strategy
- Unit tests: Vitest in apps/app (script: vitest run). Prefer colocating *.test.ts files within the app or a dedicated tests folder as appropriate to the app’s structure.
- E2E: Playwright config lives at playwright.config.ts with:
  - testDir: apps/app/tests, testMatch: **/*.e2e.spec.ts
  - baseURL comes from PLAYWRIGHT_BASE_URL or BASE_URL; if absent, a webServer starts pnpm start in apps/app on port 3100
  - HTML reports output to apps/app/playwright-report

CI/CD (GitHub Actions + Vercel)
- Pull Requests: .github/workflows/pr_e2e.yml runs install → lint → typecheck → build → Playwright (full, with minimal retries) and uploads artifacts.
- Staging:
  - .github/workflows/staging_deploy.yml: Reuses the PR E2E job, then pulls/builds with Vercel CLI to produce a preview and optionally sets a staging alias; can run DB migrations when enabled.
  - .github/workflows/deploy_staging.yml: Alternate staging flow that deploys via Vercel CLI and runs Playwright smoke against the preview; guarded by Vercel secrets presence.
- Production:
  - .github/workflows/prod_release.yml: After E2E, resolves the preview for the commit and promotes it to production using Vercel; publishes the Production URL and runs a post-deploy smoke check.
  - .github/workflows/deploy_prod.yml: Alternative flow to promote latest preview to production and run a smoke suite.

Database and seeding
- supabase/seed/README.md contains SQL snippets to bootstrap initial records (agencies, profiles, staff). Use Supabase Studio/SQL editor as described.

OS-specific note (Windows)
- If you encounter a readlink error with Next builds, clear the build output and rebuild:
  - rmdir /s /q apps\app\.next
  - pnpm -w build

What’s not present
- No CLAUDE.md, .cursor rules, or Copilot instruction file detected at the time of writing.

