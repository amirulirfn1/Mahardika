# Server-Only Layer Plan

## Motivation

- Prevent server utilities (`getServerClient`, session resolvers, tenant guards) from being imported into client components.
- Centralize Supabase, Auth.js, and job queue access patterns.
- Provide clear entry points for middleware and route handlers to share logic.

## Target Structure

```
apps/app/src/server/
├─ supabase/
│  ├─ client.ts          // wraps createServerComponentClient
│  ├─ service.ts         // service role utilities
│  └─ types.ts
├─ auth/
│  ├─ session.ts         // getSession, assertSession
│  ├─ rbac.ts            // canImpersonateTenant, role checks
│  └─ types.ts
├─ tenants/
│  ├─ require-tenant.ts
│  └─ scope.ts
├─ middleware/
│  └─ guards.ts          // shared protectRoute logic
├─ jobs/
│  ├─ enqueue.ts
│  └─ processors.ts
└─ index.ts
```

All modules live under `apps/app/src/server` and are referenced via the alias `@/server/*`.

## Mapping Current Files

| Current Location | New Home | Notes |
| --- | --- | --- |
| `apps/app/src/lib/supabase/client.ts` | `server/supabase/client.ts` | Called by server components and actions. |
| `apps/app/src/lib/supabase/service.ts` | `server/supabase/service.ts` | Service role helper; ensure it remains server-only. |
| `apps/app/src/lib/supabase/server-auth.ts` | `server/auth/helpers.ts` | Consolidate Auth.js integration. |
| `apps/app/src/lib/auth/session.ts` | `server/auth/session.ts` | Already server-only; move and re-export. |
| `apps/app/src/lib/auth/rbac.ts` | `server/auth/rbac.ts` | Role checks used by server handlers. |
| `apps/app/src/lib/auth/types.ts` | `server/auth/types.ts` | Shared interfaces for server auth modules. |
| `apps/app/src/lib/tenant.ts` | `server/tenants/scope.ts` | Works with auth + supabase; keep server-side. |

After relocation, add temporary re-exports under `apps/app/src/lib` that throw informative errors if imported from the client.

## Guard Patterns

- **Route Groups**: `(dashboard)/layout.tsx` should import `assertSession` and `requireTenantId` from `@/server`.
- **Server Actions**: Actions in `features/*/server/actions.ts` use server auth helpers to scope Supabase queries.
- **API Routes**: Shared guard helper ensures JWTs or session tokens are validated before continuing.
- **Middleware**: A future `middleware.ts` can import `@/server/middleware/guards` without leaking client-safe code.

## Tooling

- Update `apps/app/tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["src/*"],
        "@/server/*": ["src/server/*"],
        "@/features/*": ["src/features/*"]
      }
    }
  }
  ```
- Extend ESLint config to disallow `@/server` imports in client components (use `next/no-typed-css-import` style rules or custom lint).
- Consider enabling `"use client"` detection to enforce server-only usage.

## Migration Steps

1. Create `apps/app/src/server` with placeholder index file that re-exports current helpers.
2. Move Supabase + auth files, adjust imports in routes and libs.
3. Introduce lint rule and codemod to replace `@/lib/supabase/*` imports.
4. Remove legacy files from `apps/app/src/lib` after all consumers switch.

## Risks

- **Circular Dependencies**: Ensure server modules don't import from features (keep one-directional flow).
- **Bundle Impact**: Client components must not import server modules—linting and review should catch this.
- **Type Paths**: Update Vitest config and path aliases to include the new directories.
