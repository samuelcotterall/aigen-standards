---
id: architecture-next-pages
title: Architecture — Next.js Pages Router
topics:
  - architecture
scope:
  - next
  - pages-router
version: <=13
sections:
  - structure
  - boundaries
toolingLinks: {}
---

# Architecture — Next.js (Pages Router)

## Structure

- Use `pages/` for routing; colocate API routes under `pages/api`.
- Keep data fetching in `getServerSideProps`/`getStaticProps` where appropriate.

## Boundaries

- Prefer server-rendered data via props; avoid client-only fetching on first paint.

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Architecture guidelines](https://nextjs.org/docs/architecture)
- [Next.js docs](https://nextjs.org/docs)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

