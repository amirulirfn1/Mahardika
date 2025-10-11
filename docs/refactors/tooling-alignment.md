# TypeScript & ESLint Alignment Plan

## TSConfig Paths

Current `apps/app/tsconfig.json`:
```json
"paths": {
  "@/*": ["./src/*", "./*"]
}
```

Problems:
- Allows imports from both `src` and root directories, hiding legacy folders (`apps/app/components`) that we plan to retire.
- No aliases for upcoming `features`, `server`, or `ui` directories.

### Proposed Paths

```json
"paths": {
  "@/*": ["./src/*"],
  "@/features/*": ["./src/features/*"],
  "@/server/*": ["./src/server/*"],
  "@/ui/*": ["./src/ui/*"]
}
```

Steps:
1. Introduce new directories (`src/features`, `src/server`, `src/ui`) before updating paths.
2. Update Vitest config (`vitest.config.ts`) and Next.js ESLint resolver to recognize new aliases.
3. Remove `"./*"` from `@/*` once all imports are migrated.

## ESLint Rules

Current config (`packages/config/eslint/index.cjs`) extends Next.js defaults but does not enforce module boundaries.

### Enhancements

- Add `import/no-restricted-paths` rules to prevent client components from importing `@/server`.
- Enforce `import/order` groups to keep feature imports tidy.
- Introduce `boundaries/element-types` (via `eslint-plugin-boundaries`) to ensure routes only import from allowed layers:
  ```js
  settings: {
    'boundaries/elements': [
      { type: 'server', pattern: '@/server/**' },
      { type: 'feature', pattern: '@/features/**' },
      { type: 'ui', pattern: '@/ui/**' },
    ],
    'boundaries/ignore': ['@/lib/**/*'] // temporary until migration completes
  },
  rules: {
    'boundaries/element-types': [2, {
      default: 'allow',
      overrides: [
        { from: ['client'], allow: ['ui', 'feature'] },
        { from: ['server'], allow: ['server', 'feature'] }
      ]
    }]
  }
  ```
- Enable `@next/next/no-server-import-in-page` to catch server/client mixups, especially after route groups move.

### Workspace Propagation

- Update `packages/config/eslint/index.cjs`.
- Bump `@mahardika/config` version if necessary and run `pnpm install` to refresh lockfile.
- Ensure `apps/app/.eslintrc` extends the shared config and overrides route group specifics if needed.

## Tooling Tasks

1. Add `@/features`, `@/server`, and `@/ui` aliases to TSConfig and Vitest config.
2. Update ESLint config with module boundary rules; run `pnpm lint` to confirm no regressions.
3. Configure `eslint-import-resolver-typescript` paths in `.eslintrc` for new aliases.
4. Update documentation in `docs/development.md` about allowed import paths.
5. Optionally introduce `eslint-plugin-tailwindcss` once UI consolidation is complete.

## Risks

- Changing path aliases may break existing imports until all files are updated; plan for a short-lived compatibility layer (re-exports).
- New ESLint rules could raise many violations initially—build a suppression plan (e.g. TODOs or `eslint-disable-next-line` with justification).
- Ensure Vitest and Playwright respect the same path mappings to avoid runtime module resolution errors.
