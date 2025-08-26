---
id: architecture-md
title: Architecture — Project Structure & Boundaries
topics: []
scope: []
version: any
sections:
  - goals
  - recommended-structure
  - conventions
  - boundaries
  - checklist
toolingLinks: {}
---
# Architecture — Project Structure & Boundaries

[← Back to TOC](./README.md)

## Goals

- Clear domain boundaries; minimize cross-imports.
- UI primitives vs. feature components vs. app routes.
- Server-only code isolated from client bundles.

## Recommended structure

```
src/
  app/               # routes (Next.js) or router modules (Vite)
  features/
    users/
      components/
      hooks/
      services/
      schemas/
  components/        # design system / primitives (ui/*)
  lib/               # cross-cutting libraries (http, auth, query)
  server/            # server-only modules (db, env, auth)
```

## Conventions

- Each feature exports a public API via `index.ts`.
- Domain schemas in `schemas/` shared by server and client (safe ones only).
- Avoid deep relative imports; use path aliases `@/`.
- Keep side effects out of module scope; prefer functions.

## Boundaries

- UI never imports server modules.
- Services perform network/DB; hooks wire services to UI.
- Routes coordinate features and data loading.

---

## Checklist

- [ ] Features not importing each other directly; use lib or app coordinators
- [ ] Clear public API for each feature
- [ ] Path aliases configured and mirrored in tsconfig

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Architecture guidelines](https://nextjs.org/docs/architecture)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

