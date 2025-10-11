# API Clients & RPC Normalization

## Overview

Mahardika currently talks to:

- Supabase Postgres via the Supabase JS client (server-side in `apps/app/src/lib/supabase/*`).
- Supabase storage via helper functions in `apps/app/src/lib/storage.ts`.
- WhatsApp providers in `apps/app/src/lib/whatsapp`.
- Future external APIs (Stripe, carriers) are stubbed but not yet implemented.

Most feature modules call Supabase directly, mixing validation, tenant scoping, and transport details in the same functions (e.g. `apps/app/src/lib/policies.ts`, `apps/app/src/lib/payments.ts`).

## Goals

1. Provide a single Supabase client factory per execution context (server component, service role, job worker).
2. Isolate tenant scoping logic so features cannot forget to apply it.
3. Standardize error handling and result typing for server actions and API routes.
4. Organize RPC helper functions (e.g. `rpc.activate_policy`) and REST route handlers under a shared convention.

## Proposed Layout

```
apps/app/src/server/
├─ supabase/
│  ├─ client.ts           // createServerClient(ctx)
│  ├─ service-client.ts   // createServiceClient()
│  ├─ rpc.ts              // typed wrappers for Supabase RPC calls
│  └─ types.ts
├─ storage/
│  ├─ client.ts           // Supabase storage interactions
│  └─ buckets.ts
└─ api/
   ├─ handler.ts          // wrap Next.js Route Handlers with auth + error helpers
   ├─ responses.ts        // JSON helpers
   └─ errors.ts

apps/app/src/features/<domain>/server/
├─ queries.ts             // read operations, accept tenant/session context
├─ mutations.ts           // write operations
├─ actions.ts             // Next.js Server Actions (optional)
└─ types.ts
```

## Supabase Client Patterns

- `createServerClient(headers, cookies)` returns a scoped client with current user JWT.
- `withTenant<T>(session, callback)` resolves tenant via `requireTenantId` and injects `.eq('tenant_id', tenantId)` automatically.
- `serviceClient()` returns a service-role Supabase client for jobs or admin tasks (lives under `server/supabase/service-client.ts`).
- Expose typed RPC wrappers in `server/supabase/rpc.ts`, e.g.:
  ```ts
  export async function activatePolicy(client: SupabaseClient, policyId: string) {
    return client.rpc('activate_policy', { policy_id: policyId });
  }
  ```

## Route Handler Wrapper

- Create `apps/app/src/server/api/handler.ts` that:
  - Parses request method & body (`zod`).
  - Attaches session/tenant context.
  - Catches errors and returns consistent JSON responses.
- Example usage:
  ```ts
  import { createHandler } from '@/server/api/handler';
  import { createCustomer } from '@/features/customers/server/mutations';

  export const POST = createHandler({
    body: CustomerInputSchema,
    auth: 'required',
    handler: async ({ body, session }) => {
      return await createCustomer(session, body);
    },
  });
  ```

## RPC & REST Inventory

| Current File | Type | Notes |
| --- | --- | --- |
| `apps/app/src/lib/policies.ts` | Supabase table insert/select | Needs split into query/mutation and moved under `features/policies`. |
| `apps/app/src/lib/payments.ts` | Supabase insert/update | Should accept session context instead of calling `getServerClient` directly. |
| `apps/app/src/lib/loyalty.ts` | Mix of queries | Same pattern. |
| `apps/app/src/lib/whatsapp/index.ts` | Provider dispatch | Move to `server/integrations/whatsapp`. |
| `apps/app/src/app/api/health/route.ts` | Basic ping | Can use new handler wrapper but low priority. |

## Migration Steps

1. Implement `@/server/supabase/client` returning { client, session }.
2. Introduce `withTenant(client, tenantId)` helper used by feature modules.
3. Move existing Supabase calls into feature `queries.ts`/`mutations.ts` accepting `(session, input)`.
4. Update server actions and API routes to call feature modules instead of raw Supabase clients.
5. Document available RPC functions in `/docs/architecture/supabase-rpc.md`.

## Testing

- Add unit tests for `withTenant` and RPC wrappers using Supabase test doubles or Vitest mocks.
- Expand integration tests in `apps/app/tests` to hit at least one handler per pattern.

## Open Questions

- How will jobs (Supabase scheduled functions) reuse these helpers? Consider a shared lightweight client factory outside Next.js runtime.
- Should we adopt a type-safe ORM layer (Kanel, drizzle) later? For now, stick with Supabase JS to avoid scope creep.
