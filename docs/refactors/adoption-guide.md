# Refactor Adoption Guide

This guide explains how engineers should work in the reorganized Mahardika codebase once the refactor lands. Share this doc with all contributors and keep it updated as the migration progresses.

## Folder Cheat Sheet

- **Routes**: `apps/app/src/app/(public|auth|dashboard)` contain only thin wrapper components that compose feature modules. Avoid embedding business logic directly inside route files.
- **Features**: `apps/app/src/features/<domain>` owns UI components, server actions, queries, and tests for that domain.
- **Server**: `apps/app/src/server` hosts server-only utilities (Supabase, auth, tenant guards, integrations).
- **UI**: `packages/ui` for reusable primitives; `apps/app/src/ui` for app-wide compositions.
- **Tests**: `apps/app/tests/{unit,integration,e2e}` mirror the feature structure.

## Contribution Workflow

1. **Determine the feature scope**  
   - New functionality belongs under an existing feature folder or a new one (`apps/app/src/features/new-feature`).
   - Update `/docs/refactors/feature-modules.md` if a new domain is introduced.

2. **Author server logic**  
   - Place Supabase interactions in `server/queries.ts` or `server/mutations.ts` inside the feature.
   - Accept a session/tenant context parameter rather than importing global singletons.
   - Reuse helpers from `@/server/*` for auth/tenant enforcement.

3. **Build UI**  
   - Prefer primitives from `@mahardika/ui`.  
   - If you need a new composition used across features, add it to `apps/app/src/ui/<area>`.  
   - Feature-specific components stay under `features/<domain>/components`.

4. **Add tests**  
   - Unit tests go under `apps/app/tests/unit/features/<domain>`.  
   - Integration tests go under `apps/app/tests/integration/features/<domain>`.  
   - If a Playwright scenario is required, add it to `apps/app/tests/e2e`.

5. **Update routes**  
   - Route files import from `@/features` and `@/ui`; they should not talk to Supabase directly.
   - Ensure route guards (`layout.tsx`) handle auth/tenant concerns, not the page itself.

6. **Lint & test**  
   - Run `pnpm lint`, `pnpm --filter app test`, and `pnpm test:e2e` (or targeted filters) before opening a PR.

## Review Checklist

- Imports respect boundaries (no `@/server` usage in client components).
- Tenant scoping is applied through helpers, not hand-rolled queries.
- UI components leverage consolidated primitives; no new code added to legacy folders.
- Tests cover the new functionality and live beside the feature.
- Documentation updated if API/behavior changes (README, feature docs).

## Communication & Tracking

- Log migration progress in the central GitHub project (refer to [migration plan](./migration-plan.md)).
- Mention in PR descriptions which checklist item from the plan the change addresses.
- Keep `docs/refactors/*` synchronized—update or remove docs as phases complete.

## FAQ

- **Where do I put shared enums or types?**  
  Place TypeScript types consumed by multiple features in `apps/app/src/features/shared/types.ts` or `apps/app/src/server/types.ts` if they are server-only.

- **How do I add a new Supabase RPC?**  
  Define the function in the database, then create a typed wrapper in `@/server/supabase/rpc` and call it from feature mutations.

- **What about background jobs?**  
  Job enqueuing lives in feature modules. Job processors shared across features should live in `apps/app/src/server/jobs`.

## Next Steps

- Schedule a brown-bag session to walk the team through the new structure.
- Update onboarding docs (`docs/onboarding.md`) once the refactor is merged.
- Audit open PRs for conflicts and provide assistance to authors in migrating their changes.
