# Legacy → Target File Mapping

This document enumerates the key files/folders that will move during the upcoming refactor so contributors can track progress and avoid duplicated work.

## Routes

| Current Path | Target Group | Notes |
| --- | --- | --- |
| `apps/app/src/app/page.tsx` | `(public)/page.tsx` | Landing page. |
| `apps/app/src/app/contact/page.tsx` | `(public)/contact/page.tsx` | Marketing contact form. |
| `apps/app/src/app/features/page.tsx` | `(public)/features/page.tsx` | Feature highlights. |
| `apps/app/src/app/pricing/page.tsx` | `(public)/pricing/page.tsx` | Pricing tiers. |
| `apps/app/src/app/shop/page.tsx` | `(public)/shop/page.tsx` | Merchandise or add-ons. |
| `apps/app/src/app/docs/*` | `(public)/docs/*` | Documentation pages. |
| `apps/app/src/app/signin/*` | `(auth)/signin/*` | Sign-in form + server actions. |
| `apps/app/src/app/signup/*` | `(auth)/signup/*` | Sign-up flow. |
| `apps/app/src/app/dashboard/**/*` | `(dashboard)/**` | All tenant-specific pages. |
| `apps/app/src/app/profile/**/*` | `(dashboard)/profile/**/*` | Profile wizard + settings. |
| `apps/app/src/app/notes/page.tsx` | `(dashboard)/notes/page.tsx` | Tenant notes listing. |

## Components

| Current Path | Target | Notes |
| --- | --- | --- |
| `apps/app/components/ui/Card.tsx` | `packages/ui/src/card.tsx` | Promote to design system. |
| `apps/app/components/ui/Button.tsx` | `packages/ui/src/button.tsx` | Merge with `src/components/ui/Button.tsx`. |
| `apps/app/components/ui/Table.tsx` | `packages/ui/src/table.tsx` | Provide data table primitive. |
| `apps/app/components/ui/SectionHeading.tsx` | `packages/ui/src/section-heading.tsx` | Works for marketing + dashboard. |
| `apps/app/components/marketing/*` | `apps/app/src/ui/marketing/*` | App-specific marketing compositions. |
| `apps/app/components/dashboard/*` | `apps/app/src/ui/dashboard/*` | Dashboard cards/tables. |
| `apps/app/components/layout/*` | `(public)/layout.tsx` or `(dashboard)/layout.tsx` | Integrate header/footer directly. |
| `apps/app/src/components/forms/CustomerForm.tsx` | `features/customers/components/CustomerForm.tsx` | Co-locate with feature logic. |
| `apps/app/src/components/forms/PolicyForm.tsx` | `features/policies/components/PolicyForm.tsx` | Same pattern. |

## Server & Libs

| Current Path | Target | Notes |
| --- | --- | --- |
| `apps/app/src/lib/supabase/client.ts` | `apps/app/src/server/supabase/client.ts` | Server-only client factory. |
| `apps/app/src/lib/supabase/service.ts` | `apps/app/src/server/supabase/service-client.ts` | Service role access. |
| `apps/app/src/lib/supabase/server-auth.ts` | `apps/app/src/server/auth/helpers.ts` | Consolidate auth helpers. |
| `apps/app/src/lib/auth/session.ts` | `apps/app/src/server/auth/session.ts` | Session getter. |
| `apps/app/src/lib/auth/rbac.ts` | `apps/app/src/server/auth/rbac.ts` | Role checks. |
| `apps/app/src/lib/auth/types.ts` | `apps/app/src/server/auth/types.ts` | Interfaces. |
| `apps/app/src/lib/tenant.ts` | `apps/app/src/server/tenants/scope.ts` | Tenant utilities. |
| `apps/app/src/lib/policies.ts` | `apps/app/src/features/policies/server/{mutations,queries}.ts` | Domain separation. |
| `apps/app/src/lib/payments.ts` | `apps/app/src/features/payments/server/*.ts` | Domain separation. |
| `apps/app/src/lib/loyalty.ts` | `features/loyalty/server/*.ts` | Domain separation. |
| `apps/app/src/lib/storage.ts` | `apps/app/src/server/storage/*.ts` | Storage client + helpers. |
| `apps/app/src/lib/phone.ts` | `features/shared/utils/phone.ts` | Shared utility (re-export via `@/features`). |
| `apps/app/src/lib/audit.ts` | `features/shared/server/audit.ts` | Trigger helpers. |
| `apps/app/src/lib/log.ts` | `apps/app/src/server/logging.ts` | Server logging (if needed). |
| `apps/app/src/lib/whatsapp/**/*` | `apps/app/src/server/integrations/whatsapp/**/*` | External provider glue. |

## Tests

| Current Path | Target | Notes |
| --- | --- | --- |
| `apps/app/tests/phone.spec.ts` | `tests/unit/utils/phone.spec.ts` | Keep Vitest. |
| `apps/app/tests/unit.tenantScope.spec.ts` | `tests/unit/shared/tenant-scope.spec.ts` | Update imports to `@/server/tenants`. |
| `apps/app/tests/*.e2e.spec.ts` | `tests/e2e/*.spec.ts` (Playwright) | Re-implement as browser tests or remove. |
| `apps/app/tests/fixtures/*` | `tests/fixtures/*` | Rename when necessary. |

## Config & Tooling

| Current Path | Target | Notes |
| --- | --- | --- |
| `apps/app/tsconfig.json` | Update paths per [tooling alignment](./tooling-alignment.md) | Remove `./*` fallback. |
| `apps/app/vitest.config.ts` | Point to `tests/unit` & `tests/integration` | Align with new structure. |
| `.eslintrc` in app root | Extend new module boundaries | Coming after ESLint update. |

## Tracking

- Maintain a checklist (GitHub issue or Notion) referencing this mapping.
- Use git mv where possible to preserve history.
- After each move, delete any re-export shims left behind to prevent drift.
