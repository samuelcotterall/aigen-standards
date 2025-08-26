---
id: architecture-next-pages
title: Architecture — Next.js Pages Router
topics: [architecture]
scope: [next, pages-router]
version: '<=13'
sections: [structure, boundaries]
---

# Architecture — Next.js (Pages Router)

## Structure

- Use `pages/` for routing; colocate API routes under `pages/api`.
- Keep data fetching in `getServerSideProps`/`getStaticProps` where appropriate.

## Boundaries

- Prefer server-rendered data via props; avoid client-only fetching on first paint.
