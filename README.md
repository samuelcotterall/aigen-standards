# React / Next / Vite Conventions

A living playbook of conventions, patterns, and integration notes for building React apps—especially with Next.js and Vite—plus common libraries and tooling. Each topic lives in its own Markdown file.

## How to use

- Open the guide for the topic you need via the table of contents below.
- Treat this as a reference for starting projects and aligning practices across a team.
- PRs to refine or extend conventions are welcome.

## Table of contents

### Core

- [Core conventions](core.md)
- [Architecture](architecture.md)

### Frameworks & Routing

- [Next.js](nextjs.md)
- [React Router](react-router.md)

### State Management

- [Jotai](jotai.md)
- [Redux Toolkit](redux-toolkit.md)

### Data, APIs & Backend

- [tRPC](trpc.md)
- [Prisma](prisma.md)
- [Drizzle ORM](drizzle.md)
- [Supabase](supabase.md)
- [HTTP Clients](http-clients.md)

### UI, Accessibility & Styling

- [Tailwind CSS](tailwind.md)
- [Radix UI](radix-ui.md)
- [React Aria](react-aria.md)
- [Accessibility](accessibility.md)
- [Charts](charts.md)
- [TanStack Table](tanstack-table.md)

### Auth

- [NextAuth](nextauth.md)

### Testing & DX

- [Vitest + Testing Library](vitest-testing-library.md)
- [Playwright](playwright.md)
- [Storybook](storybook.md)

### Integrations

- [Stripe](stripe.md)
- [Uploads](uploads.md)

### Cross-cutting

- [Performance](performance.md)
- [Security](security.md)

### Architecture (scoped)

- Next.js App Router: [architecture/next-app.md](architecture/next-app.md)
- Next.js Pages Router: [architecture/next-pages.md](architecture/next-pages.md)
- Vite + React Router: [architecture/vite.md](architecture/vite.md)

### Utilities

- [Internationalization (i18n)](i18n.md)
- [Dates](dates.md)

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

There are two helper scripts under `scripts/`:

- `ensure-frontmatter.js` — adds minimal frontmatter to any `.md` missing it (id, title, sections). Run once to normalize files.
- `build-docs-index.js` — builds `docs-index.json` by reading frontmatter from all `.md` files. Useful for search or programmatic consumption.

Usage:

```sh
# add frontmatter (safe to run repeatedly)
node scripts/ensure-frontmatter.js

# build JSON index
node scripts/build-docs-index.js
```

If you prefer npm scripts (they install dependencies declared in `package.json`):

```sh
# ensure frontmatter
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
