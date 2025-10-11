# UI Consolidation Plan

## Current State

- Two parallel UI directories:
  - `apps/app/components/ui` (legacy, shared by marketing & dashboard routes)
  - `apps/app/src/components/ui` (newer, limited set: `Button`, `Section`)
- Feature-specific components (e.g. marketing pricing cards, dashboard stat cards) live in `apps/app/components/{marketing,dashboard}`.
- `packages/ui` exists but contains only build artifacts; app-level components are not published or reused elsewhere.

Pain points:

- Duplicate `Button` implementations under both `components/ui` paths.
- Front end imports mix absolute aliases (`@/components/ui/Card`) pointing to files outside `src`, which complicates future extraction to a feature module folder.
- No documented boundary between reusable primitives vs. feature-presentational components.

## Target Structure

```
packages/ui/src/              // Design system primitives
  button.tsx
  card.tsx
  table.tsx
  section-heading.tsx
  index.ts

apps/app/src/ui/              // App-specific wrappers & composition
  marketing/
    FeatureCard.tsx
    PricingCard.tsx
    Testimonial.tsx
  dashboard/
    StatCard.tsx
  layout/
    AppShell.tsx

apps/app/src/features/**      // Feature-specific UI colocated with logic
```

- `packages/ui` exposes stable, framework-specific primitives (`Card`, `Badge`, `Button`, `Table`, `SectionHeading`, etc.).
- `apps/app/src/ui` collects higher-level patterns that are still app-wide but not generic enough for the package.
- Feature modules own their internal UI under `features/<domain>/components`.

## Migration Steps

1. **Audit components**
   - Compare `apps/app/components/ui/*` and `apps/app/src/components/ui/*` for duplicated props and styling.
   - Decide on canonical implementations (likely the newer `src` versions).
2. **Populate `packages/ui`**
   - Move canonical primitives into `packages/ui/src`.
   - Ensure each primitive re-exports a plain React component with minimal Tailwind classes.
   - Update `packages/ui/package.json` exports and rebuild.
3. **Create `apps/app/src/ui`**
   - Move marketing and dashboard helper components from `apps/app/components/{marketing,dashboard}`.
   - Update imports in routes to reference `@/ui/marketing/...` or `@/ui/dashboard/...`.
4. **Adjust aliases**
   - In `apps/app/tsconfig.json`, add `"@/ui/*": ["src/ui/*"]`.
   - Remove `"./*"` from the `@` path once legacy folders are relocated.
5. **Update consumers**
   - Replace references to `@/components/ui/Card` with either `@mahardika/ui` exports or `@/ui/...`.
   - Add temporary re-exports with deprecation warnings if needed.
6. **Remove legacy folder**
   - Delete `apps/app/components/ui` and the duplicate files under `apps/app/src/components/ui`.
   - Update tests to import from the new modules.

## Testing & Verification

- Run `pnpm --filter app lint` to catch import path errors.
- Execute Playwright smoke tests to ensure visual regressions are minimal (cards, buttons).
- Consider adding Chromatic or percy for UI diffing once components move.

## Risks & Mitigation

- **Tree-shaking / bundle size**: verify `packages/ui` exports are component-level to avoid pulling unused code.
- **Tailwind classes**: confirm both marketing and dashboard themes still inherit required styles after moves.
- **Stories/Docs**: eventually add Storybook or MDX docs for `packages/ui` to drive consistency.
