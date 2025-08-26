# React / Next / Vite Conventions

A living playbook of conventions, patterns, and integration notes for building React apps—especially with Next.js and Vite—plus common libraries and tooling. Each topic lives in its own Markdown file.

## How to use

- Open the guide for the topic you need via the table of contents below.
- Treat this as a reference for starting projects and aligning practices across a team.
- PRs to refine or extend conventions are welcome.

## Table of contents

### Core

- [Core conventions](docs/core.md)
- [Architecture](docs/architecture.md)

### Frameworks & Routing

-- [Next.js](docs/nextjs.md)
-- [React Router](docs/react-router.md)

### State Management

-- [Jotai](docs/jotai.md)
-- [Redux Toolkit](docs/redux-toolkit.md)

### Data, APIs & Backend

-- [tRPC](docs/trpc.md)
-- [Prisma](docs/prisma.md)
-- [Drizzle ORM](docs/drizzle.md)
-- [Supabase](docs/supabase.md)
-- [HTTP Clients](docs/http-clients.md)

### UI, Accessibility & Styling

-- [Tailwind CSS](docs/tailwind.md) - [Tailwind v3](docs/tailwind/3.md) - [Tailwind v4](docs/tailwind/4.md)
-- [Radix UI](docs/radix-ui.md)
-- [React Aria](docs/react-aria.md)
-- [Accessibility](docs/accessibility.md)
-- [Charts](docs/charts.md)
-- [TanStack Table](docs/tanstack-table.md)

### Auth

-- [NextAuth](docs/nextauth.md)

### Testing & DX

-- [Vitest + Testing Library](docs/vitest-testing-library.md)
-- [Playwright](docs/playwright.md)
-- [Storybook](docs/storybook.md)

### Integrations

-- [Stripe](docs/stripe.md)
-- [Uploads](docs/uploads.md)

### Cross-cutting

-- [Performance](docs/performance.md)
-- [Security](docs/security.md)

### Architecture (scoped)

-- Next.js App Router: [architecture/next-app.md](docs/architecture/next-app.md)
-- Next.js Pages Router: [architecture/next-pages.md](docs/architecture/next-pages.md)
-- Vite + React Router: [architecture/vite.md](docs/architecture/vite.md)

### Utilities

-- [Internationalization (i18n)](docs/i18n.md)
-- [Dates](docs/dates.md)

---

If you want quick navigation inside each doc, add a "Back to TOC" link to this README at the top of files as needed.

## Contributing & Maintenance

- Style: keep sections short with Conventions, Patterns, Examples, and a Checklist.
- Validation: run markdown linters and link checks before committing.
- Examples: prefer minimal, copy-pastable snippets; annotate with comments.

Validation (optional): lint all docs and check links.

```sh
# format
npx prettier -w "**/*.md"

# lint markdown (if using markdownlint-cli)
npx markdownlint "**/*.md" --fix || true

# link check (if using markdown-link-check)
npx markdown-link-check README.md
```

### Scripts: frontmatter & index

There are helper scripts under `dist/scripts/` (compiled from TypeScript in `src/scripts`). Prefer the npm wrappers which build then run the compiled scripts:

```sh
# build TypeScript scripts
npm run build

# ensure frontmatter (adds missing frontmatter to docs)
npm run docs:ensure-frontmatter

# build the docs index
npm run docs:build-index

# extract a section (examples):
# get the conventions for react-router (any version)
npm run docs:extract -- conventions react-router

# get conventions for react-router >=6
npm run docs:extract -- conventions react-router -- --version='>=6'

# if you're on zsh, quote range values that include '>' or '<'
```

## Machine-readable metadata

Each doc can include YAML frontmatter with fields like:

```yaml
id: react-router
title: React Router
topics: [routing]
scope: [react, next, vite]
version: '>=6.4'
sections: [conventions, examples, patterns]
```

This enables tooling to extract “just the conventions for X” or filter by scope/version.
