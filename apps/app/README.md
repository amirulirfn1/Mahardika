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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Security model for policies and PDFs

- Policy records in `public.policies` are protected by row-level security: users can only read/insert/update rows for their own agency. Deletes are limited to `agency_owner` (and platform admins) within the same agency.
- Policy PDFs live in a private bucket `policy-pdfs`. Access is enforced by RLS on `storage.objects` using the object `metadata.agency_id` and the caller's current agency.
- The server sets `metadata.agency_id` automatically when uploading/replacing a policy PDF. Clients cannot override it.
- Signed URLs are generated on demand and expire after 10 minutes.
