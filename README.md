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
