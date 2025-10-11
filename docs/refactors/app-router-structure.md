# App Router Restructure Blueprint

## Goals

- Separate public marketing pages from authenticated dashboard concerns to simplify shared layouts, providers, and middleware (see `apps/app/src/app/layout.tsx`).
- Reduce cross-cutting imports by placing each route inside a dedicated group with its own `layout.tsx`, `loading.tsx`, and error boundaries.
- Create consistent entry points for feature modules that will later move into `apps/app/src/features`.

## Current Snapshot (Sept 2025)

| Area | Representative Files |
| --- | --- |
| Root & shared | `apps/app/src/app/layout.tsx`, `providers.tsx`, `error.tsx`, `not-found.tsx` |
| Marketing & public | `apps/app/src/app/page.tsx`, `contact/page.tsx`, `features/page.tsx`, `pricing/page.tsx`, `docs/*`, `shop/page.tsx` |
| Authentication | `apps/app/src/app/signin/page.tsx`, `signup/page.tsx`, `auth/*` |
| Dashboard | `apps/app/src/app/dashboard/page.tsx`, `dashboard/agency/*`, `dashboard/staff/page.tsx`, `dashboard/users/page.tsx`, etc. |
| Misc app pages | `apps/app/src/app/notes/page.tsx`, `profile/*`, `all/*` |
| API & route handlers | `apps/app/src/app/api/*` |

Observations:

- Public and protected routes share the same root layout, forcing `providers.tsx` to handle both anonymous and authenticated contexts.
- Dashboard sub-pages are nested directly under `dashboard/` with shared UI sprinkled in `apps/app/src/components/ui/*`.
- Utility pages like `notes` and `profile` should live alongside authenticated dashboard views but currently bypass tenant-aware layout logic.

## Proposed Route Grouping

```
apps/app/src/app
├─ (public)/
│  ├─ layout.tsx
│  ├─ page.tsx                // Landing
│  ├─ contact/page.tsx
│  ├─ features/page.tsx
│  ├─ pricing/page.tsx
│  ├─ docs/**
│  └─ shop/page.tsx
├─ (auth)/
│  ├─ layout.tsx              // Minimal shell for sign-in/up flows
│  ├─ signin/page.tsx
│  └─ signup/page.tsx
├─ (dashboard)/
│  ├─ layout.tsx              // Auth/tenant guard, nav, shell
│  ├─ page.tsx                // Existing dashboard overview
│  ├─ agency/**
│  ├─ staff/**
│  ├─ users/**
│  ├─ profile/**
│  ├─ notes/page.tsx
│  └─ (feature-specific folders to be introduced)
├─ api/**
├─ error.tsx
├─ not-found.tsx
├─ loading.tsx
└─ 404.tsx
```

### Layout Responsibilities

- `apps/app/src/app/layout.tsx`: Shell that loads theme, fonts, providers, and forwards rendering into the appropriate group-specific layout via `children`.
- `(public)/layout.tsx`: Keeps the current marketing nav/hero scaffolding, no auth checks.
- `(auth)/layout.tsx`: Minimal background with brand logo. Handles redirect if already authenticated.
- `(dashboard)/layout.tsx`: Wraps children in session + tenant guards, side navigation, announcements, etc. Can import tenant-aware context from the upcoming `apps/app/src/server` utilities.

## Implementation Phases

1. **Scaffold layouts** – add empty `layout.tsx` files for `(public)`, `(auth)`, `(dashboard)` that simply render `children`. Update imports to use relative paths within each folder.
2. **Relocate routes** – move marketing pages into `(public)`, auth into `(auth)`, and dashboard-related views into `(dashboard)`. Adjust component imports (e.g. `../components/...`).
3. **Introduce guards** – attach session/tenant logic to `(dashboard)/layout.tsx`, and redirect logic to `(auth)/layout.tsx`.
4. **Cleanup root** – after route moves, prune obsolete folders (e.g. `auth/` root folder if inline).
5. **Update navigation** – ensure shared nav components reference new segments (`Link href="/(public)/features"` etc.). Consider rewriting with `usePathname`.
6. **Testing** – run `pnpm --filter app test`, Playwright smoke suite, and manual sanity check of major routes.

## Dependencies & Considerations

- `middleware.ts` (if introduced later) should gate `(dashboard)` paths once folders move.
- Update `next.config.mjs` (if present) or `tsconfig` path aliases if components switch to new directories.
- Document session expectations for each layout in `docs/architecture/app-router.md` once implemented.

## Next Actions

- [ ] Scaffold `(public)`, `(auth)`, `(dashboard)` directories with placeholder layouts.
- [ ] Move `page.tsx` (landing) into `(public)/page.tsx` and re-export under root for legacy links if necessary.
- [ ] Create issue to track nav/header refactor once marketing pages move.
- [ ] Start feature module extraction after layouts stabilize (see forthcoming `features` plan).
