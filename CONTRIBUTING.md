# Contributing to Mahardika

First off, thanks for taking the time to contribute! 🎉

This project follows a few simple rules so that everyone can move fast **without breaking things**.

---

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Branch naming](#branch-naming)
3. [Commit messages](#commit-messages)
4. [Using pnpm](#using-pnpm)
5. [Running tests](#running-tests)
6. [Pre-push hooks](#pre-push-hooks)

---

## Prerequisites

* Node.js **≥20**
* **pnpm** – install via `corepack enable && corepack prepare pnpm@latest --activate`.
* A GitHub fork of the repo and a feature branch (see below).

> npm & Yarn are *not* supported for local development – the workspace relies on pnpm features.

---

## Branch naming

```
<type>/<short-description>
```

Examples:

* `feat/signup-oauth`
* `fix/button-loading-state`
* `docs/readme-typo`

Choose one of the conventional *types*: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `perf`, `ci`.

---

## Commit messages

We use **[Conventional Commits](https://www.conventionalcommits.org)**. This keeps the history tidy and enables automated changelogs / releases.

Basic format:

```
<type>(scope?): <summary>

<body>
```

Example:

```
feat(ui): add loading state to BrandButton

The button now shows a spinner while awaiting async actions.
```

A scope is optional but encouraged (e.g. `ui`, `web`, `scripts`).

---

## Using pnpm

The monorepo is workspace-aware. Common commands:

```bash
# install deps
pnpm install

# start dev server for web app
pnpm dev

# build everything
pnpm run build

# run scripts in a specific package
pnpm -F "@mahardika/ui" test
```

Please **never** commit a `package-lock.json` or `yarn.lock` – the root `.gitignore` covers this.

---

## Running tests

* **Unit & integration** – `pnpm run test`
* **Watch mode** – `pnpm run test -- --watch`

PRs should not reduce overall coverage (see Jest thresholds).

---

## Pre-push hooks

Husky is configured to run:

1. `pnpm lint`
2. Prettier format check
3. `pnpm run test`

The hook runs automatically; if it fails, push is aborted. You can run the same checks manually:

```bash
pnpm lint && pnpm format:check && pnpm run test
```

---

Thank you for helping make **Mahardika** better! 🚀 