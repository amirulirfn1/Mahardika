# Feature Module Boundaries

## Objectives

- Move business logic out of the generic `apps/app/src/lib` folder into feature-scoped modules that own their server actions, queries, and UI.
- Co-locate forms, state, and tests per domain to reduce accidental cross-feature imports.
- Prepare the codebase for incremental extraction to packages or server functions when needed.

## Proposed Directory Layout

```
apps/app/src/features/
├─ auth/
│  ├─ actions/
│  ├─ components/
│  └─ hooks/
├─ customers/
│  ├─ components/         // e.g. CustomerForm, tables, detail panels
│  ├─ server/             // supabase queries, mutations
│  ├─ hooks/              // client-side SWR/useQuery wrappers
│  ├─ utils/              // phone parsing, helpers
│  └─ tests/
├─ policies/
├─ payments/
├─ renewals/
├─ loyalty/
├─ communications/
├─ notes/
├─ analytics/
├─ staff/
├─ tenants/               // tenant resolution, seat enforcement
└─ shared/
   ├─ components/         // cross-feature UI not suitable for packages/ui
   ├─ server/             // helpers like `getServerClient`
   └─ utils/
```

Each feature folder should include an `index.ts` that exports public APIs, keeping private helpers internal.

## Mapping Current Files

| Current Location | Destination | Notes |
| --- | --- | --- |
| `apps/app/src/lib/payments.ts` | `apps/app/src/features/payments/server/mutations.ts` | Split `createPayment`, `listPaymentsByPolicy`, `softDeletePayment`, `restorePayment` into discrete functions. |
| `apps/app/src/lib/policies.ts` | `features/policies/server/*` & `features/policies/utils.ts` | Contains queries, status helpers—separate read/write logic. |
| `apps/app/src/lib/loyalty.ts` | `features/loyalty/server/*` | Align with loyalty pages under dashboard. |
| `apps/app/src/lib/tenant.ts` | `features/tenants/server/tenant-scope.ts` | Keep `tenantScope`, `requireTenantId` close to tenant guards. |
| `apps/app/src/lib/audit.ts` | `features/shared/server/audit.ts` | Shared instrumentation. |
| `apps/app/src/lib/phone.ts` | `features/shared/utils/phone.ts` | Re-export from a shared utility index for backwards compatibility. |
| `apps/app/src/app/dashboard/agency/customers/_actions.ts` | `features/customers/server/actions.ts` | Server Actions should live with feature logic. |
| `apps/app/src/components/forms/CustomerForm.tsx` | `features/customers/components/CustomerForm.tsx` | Keep route components thin—call into feature modules. |
| `apps/app/src/components/forms/PolicyForm.tsx` | `features/policies/components/PolicyForm.tsx` | Same as above. |
| Dashboard table/list components | Within respective feature `components/` directories | E.g. move customers table out of route file. |

## Naming & API Conventions

- **Server modules** export noun-verb functions (`createPayment`, `getCustomerList`). They accept validated inputs and return typed results.
- **Actions** wrap server functions in Next.js Server Actions or route handlers, exposing only the minimal surface area to the UI.
- **Hooks** provide client-side data-fetching wrappers (React Query/SWR) and should live next to their feature components.
- **Tests** sit under each feature (`tests/*.spec.ts`) and can import relative modules without reaching across feature boundaries.
- **Shared utilities** that are not UI-specific should move to `features/shared`. Promote only broadly reusable primitives to `packages/ui` if they are framework-agnostic.

## Migration Strategy

1. Create `apps/app/src/features` with placeholder `index.ts` files.
2. For a given feature (e.g. customers), move the server file and adjust imports in route components.
3. Update path aliases in `apps/app/tsconfig.json` to point `@/features/*` at the new folder.
4. Mirror directory structure in tests (`apps/app/tests/features/customers/*.spec.ts`).
5. Delete legacy modules from `apps/app/src/lib` once consumers switch.

### Candidate First Moves

- **Customers**: `_actions.ts`, `CustomerForm.tsx`, table render logic in `dashboard/agency/customers/page.tsx`.
- **Policies**: similar pattern; align with `policy` UI.
- **Tenant / session**: after server-only folder exists, relocate to `features/tenants`.

## Tooling Updates

- Extend ESLint import rules to block `@/lib/*` once the migration completes.
- Add barrel files (`index.ts`) to expose public interfaces and aid tree-shaking.
- Adopt namespaces like `@/features/customers` in place of deep relative imports from route files.

## Risks & Mitigations

- **Large import diff**: Move features incrementally and provide temporary re-exports (e.g. `apps/app/src/lib/payments.ts` re-exporting from new module until consumers are updated).
- **Test coverage gaps**: Port existing Vitest suites as modules move; add new tests for server functions when possible.
- **Developer onboarding**: Document module structure in `/docs/architecture/features.md` once the first feature lands.
