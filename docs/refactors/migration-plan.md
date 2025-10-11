# Monorepo Refactor Migration Plan

## Guiding Principles

- Ship in small, reviewable PRs (~300 LOC) to reduce merge risk.
- Maintain backwards compatibility via re-exports until all consumers migrate.
- Keep CI green: run `pnpm test`, `pnpm lint`, and Playwright smoke suite on each phase.

## Prerequisites

- [x] Document route groups, feature modules, server layer, UI consolidation.
- [ ] Create GitHub project or issue list to track sub-tasks.
- [ ] Align engineering stakeholders on rollout order (dashboard team, marketing team).

## Phase 1 – Layout & Routing (Week 1)

1. Scaffold `(public)`, `(auth)`, `(dashboard)` folders with placeholder `layout.tsx`.
2. Move landing + marketing routes into `(public)`; update nav/header imports.
3. Move auth routes into `(auth)` and add redirect guard.
4. Move dashboard routes into `(dashboard)` and wire tenant guard.
5. Update tests and Playwright expectations for new URLs if necessary.

**Exit Criteria:** Legacy `apps/app/src/app/{contact,features,pricing,...}` folders removed; layouts verified manually.

## Phase 2 – Server Layer Extraction (Week 2)

1. Introduce `src/server` with Supabase, auth, tenant modules.
2. Update all imports (`getServerClient`, `getProfile`, etc.) to use new alias.
3. Add ESLint rule preventing client components from importing `@/server`.
4. Remove deprecated files from `src/lib` (leave temporary re-exports with warnings).

**Exit Criteria:** No direct imports from `@/lib/supabase` remain; lint passes.

## Phase 3 – Feature Modules (Weeks 3–4)

1. Create `src/features/customers` with components, server modules, tests; migrate customer pages.
2. Repeat for `policies`, `payments`, `loyalty`, `renewals`, `communications`.
3. Move shared utilities to `features/shared`.
4. Update route files to become lean shells that defer to feature modules.

**Exit Criteria:** `src/lib` only contains transitional re-exports (to be deleted in final cleanup).

## Phase 4 – UI Consolidation (Week 5)

1. Migrate primitives to `packages/ui` and publish updated package.
2. Create `src/ui/{marketing,dashboard}` for composed components.
3. Update imports throughout the app; remove `apps/app/components`.
4. Run visual smoke tests/playwright to confirm layout unaffected.

**Exit Criteria:** All UI imports come from `@mahardika/ui` or `@/ui/*`; Tailwind config unchanged.

## Phase 5 – Testing & Tooling (Week 6)

1. Restructure tests per [testing-structure.md](./testing-structure.md).
2. Update Vitest and Playwright configs; unskip critical suites.
3. Add CI jobs for `pnpm --filter app test:unit` and `pnpm test:e2e`.
4. Remove deprecated test files after migration.

**Exit Criteria:** New folder layout adopted; coverage reports captured in CI.

## Phase 6 – Cleanup & Docs (Week 7)

1. Delete remaining re-export shims from `src/lib`.
2. Update README and onboarding docs to reference new structure.
3. Hold knowledge sharing session / record Loom for team.
4. Close tracking issues, archive old documentation.

**Exit Criteria:** Repo contains only new structure; docs updated; team onboarded.

## Risks & Mitigations

- **Large PR churn:** Encourage feature flag or re-export approach; schedule daily sync while moving core modules.
- **Out-of-sync branches:** Merge main frequently; consider short-lived migration branch for each phase.
- **Developer confusion:** Provide quick-reference sheet (see next step for adoption guidelines).

## Dependencies

- Requires agreement on Supabase schema & feature scope (see `AGENTS.md` and `docs/refactors/app-router-structure.md`).
- Some migrations (UI, features) depend on route groups and server layer being in place first.
