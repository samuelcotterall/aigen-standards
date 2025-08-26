---
id: architecture-next-app
title: Architecture — Next.js App Router
topics: [architecture]
scope: [next, app-router]
version: '>=13'
sections: [structure, boundaries, server-client-split]
---

# Architecture — Next.js (App Router)

## Structure

- Use `app/` for routes; colocate server components by default.
- Keep client components minimal and at interaction boundaries.

## Boundaries

- Server components fetch data and compose UI; avoid client data fetching when possible.
- Shared schemas/types in `/lib` safe for client.
