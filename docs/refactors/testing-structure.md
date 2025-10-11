# Test Suite Restructure Plan

## Current Layout

`apps/app/tests` mixes unit and end-to-end specs in a single directory:

- `unit.tenantScope.spec.ts` (Vitest unit test)
- `phone.spec.ts` (unit)
- Several `.e2e.spec.ts` files that are currently `describe.skip`
- Fixture data under `apps/app/tests/fixtures`

End-to-end testing also exists via Playwright (`playwright.config.ts` at repo root).

Issues:

- Naming conventions are inconsistent; Vitest includes both unit and e2e specs despite Playwright handling browser tests.
- Feature ownership is unclear – e.g. payments tests live in the root folder instead of next to the feature.
- Skipped e2e suites hide regressions and should either be maintained or removed.

## Target Structure

```
apps/app/tests/
├─ unit/
│  ├─ shared/
│  │  └─ tenant-scope.spec.ts
│  ├─ features/
│  │  ├─ customers/
│  │  └─ policies/
│  └─ utils/
│     └─ phone.spec.ts
├─ integration/
│  ├─ features/
│  │  ├─ payments/
│  │  └─ loyalty/
│  └─ tenants/
├─ e2e/                    // Playwright tests (move from Vitest)
│  ├─ smoke-nav.spec.ts
│  └─ policies.spec.ts
└─ fixtures/
   └─ …
```

- **Unit tests (Vitest)** focus on pure functions and server modules.
- **Integration tests (Vitest)** exercise server actions with Supabase test doubles or local DB.
- **E2E tests (Playwright)** reside under `apps/app/tests/e2e` and run via the Playwright runner instead of Vitest.

## Migration Steps

1. Create `apps/app/tests/unit`, `integration`, and `e2e` directories.
2. Move `phone.spec.ts` → `tests/unit/utils/phone.spec.ts`.
3. Move `unit.tenantScope.spec.ts` → `tests/unit/shared/tenant-scope.spec.ts`.
4. Convert skipped `.e2e.spec.ts` Vitest files into Playwright specs under `tests/e2e`, or delete if superseded.
5. Update `vitest.config.ts` include patterns:
   ```ts
   include: ['tests/unit/**/*.spec.ts', 'tests/integration/**/*.spec.ts']
   ```
6. Update `package.json` scripts to run Vitest (`pnpm --filter app test`) and Playwright separately (`pnpm test:e2e`).
7. Document testing strategy in `docs/testing.md` (structure, commands, data requirements).

## Coverage & CI

- Introduce `vitest --coverage` for unit/integration.
- Configure Playwright projects for smoke vs. full regression; ensure GitHub Actions uses the new paths.
- Consider adding seed scripts under `supabase/seed` referenced by integration tests.

## Risks

- Playwright conversion requires actual working pages; ensure tenant and auth fixtures exist.
- Running integration tests may require a local Supabase instance. Provide environment setup instructions or use Supabase test harness.
- Keep developers informed about new file locations to avoid duplication during migration.
