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
