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

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Architecture guidelines](https://nextjs.org/docs/architecture)
- [Next.js docs](https://nextjs.org/docs)
- [Next.js App Router docs](https://nextjs.org/docs/app)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

