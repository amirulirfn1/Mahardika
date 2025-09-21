This app is part of the `mahardika` monorepo managed by Turborepo and pnpm workspaces.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Loyalty

Loyalty enables tenant-configurable tiers with a ringgit-to-point rate. When policy payments are recorded, companion jobs or triggers can post credits into the customer ledger.

Objects:

- `public.loyalty_tiers`: Scoped by `tenant_id`. Fields include `code`, `name`, `ringgit_to_point`, `threshold_visits`, `is_default`.
- `public.loyalty_ledger`: Append-only ledger of point adjustments referencing policies or payments.
- `public.customers`: Holds the current `loyalty_tier` code and cached `points_balance`.
- `public.loyalty_balances_by_customer` view: Summarises balances by tenant and customer.

Manage tiers at `/dashboard/agency/loyalty`. Customers inherit the tenant default tier when no specific tier is set.

## WhatsApp Provider

Pluggable WhatsApp sender with feature flag. Default provider is `stub` (console log only). Optional `cloud` posts to the WhatsApp Cloud API.

Env:

```env
WHATSAPP_PROVIDER=stub # or cloud
WHATSAPP_CLOUD_TOKEN= # required for cloud
WHATSAPP_PHONE_NUMBER_ID= # required for cloud
```

Application log entries and conversation history are persisted in `public.conversations`. View the audit trail at `/dashboard/agency/communications`.

## Sentry

Basic Sentry integration is enabled and safe when envs are missing.

Env:

```env
SENTRY_DSN=
SENTRY_ENV=local
SENTRY_TRACES_SAMPLE_RATE=0.1
```

- Config files: `sentry.client.config.ts`, `sentry.server.config.ts`.
- `logError(err, context)` in `src/lib/log.ts` captures to Sentry (if DSN) and prints a redacted log.
- Health check: `/api/health` returns `{ ok: true, ts }`.
