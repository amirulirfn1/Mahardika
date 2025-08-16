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

Loyalty enables agency-configurable tiers with a points-per-MYR rate. When a policy payment is recorded, a trigger credits points into a per-customer ledger. If a payment amount changes or is deleted, balancing ledger rows are written.

Objects:

- `public.loyalty_tiers`: Scoped by `agency_id`. Fields: `code`, `name`, `points_per_myr`, `is_default`. Bronze is seeded as default per agency on first use.
- `public.loyalty_memberships`: Assigns a customer to a tier per agency.
- `public.loyalty_ledger`: Append-only ledger of credits/debits with references to policy and payment.
- `public.loyalty_balances_by_customer` view: Summarizes points balance per customer and agency.

Accrual:

- On `policy_payments` insert: credit `floor(amount * rate)` points.
- On update of `amount`: delta between new and old points is applied as credit/debit.
- On delete (including soft delete): debit equal to previously credited points.

RLS restricts access to rows where `agency_id = public.current_agency_id()`.

Manage tiers at `/dashboard/agency/loyalty`. Default tiers are used when a customer has no membership.

## WhatsApp Provider

Pluggable WhatsApp sender with feature flag. Default provider is `stub` (no network). Optional `cloud` uses WhatsApp Cloud API.

Env:

```env
WHATSAPP_PROVIDER=stub # or cloud
WHATSAPP_CLOUD_TOKEN= # required for cloud
WHATSAPP_PHONE_NUMBER_ID= # required for cloud
```

- Stub writes to `public.outbound_messages` with status `sent` and logs a `wa.me` link.
- Cloud posts to `https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/messages` and logs rows with `sent` or `failed`.
- View logs at `/dashboard/agency/communications`.

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
