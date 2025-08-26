---
id: architecture-vite
title: Architecture — Vite + React Router
topics: [architecture]
scope: [vite, react]
version: 'any'
sections: [structure, boundaries]
---

# Architecture — Vite + React Router

## Structure

- Use `src/app` for router wiring and layout routes.
- Features under `src/features/*` with public API via `index.ts`.

## Boundaries

- Keep server-only code out of client bundles; place in `/server` or separate package.

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Architecture guidelines](https://nextjs.org/docs/architecture)
- [Vite docs](https://vitejs.dev/guide/)
- [React docs](https://react.dev)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

