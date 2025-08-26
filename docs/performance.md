---
id: performance-md
title: "Performance — React/Next/Vite"
topics: []
scope: []
version: "any"
sections: [goals, conventions, patterns, diagnostics, checklist]
---
# Performance — React/Next/Vite

[← Back to TOC](./README.md)

## Goals

- Ship less JS; do work server-side when possible.
- Load critical UI early; defer the rest.

## Conventions

- Code-split by route and feature; prefer dynamic/lazy imports.
- Memoize expensive components; stabilize props; use selectors.
- Cache data at the right layer (HTTP cache, React Query, server cache).
- Images: responsive sizes, next-gen formats, lazy-loading.

## Patterns

- Route-based code-splitting with `lazy` (React Router) or `next/dynamic`.
- Hydration strategy: stream/partial hydration where available.
- Use `useTransition` for non-urgent updates.

## Diagnostics

- Measure: Lighthouse, WebPageTest, React Profiler.
- Budget: set performance budgets and track regressions in CI.

## Checklist

- [ ] Largest bundles < 200KB gzipped
- [ ] Images optimized and sized correctly
- [ ] Unused deps removed; tree-shaking effective
- [ ] Long lists virtualized

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Next.js docs](https://nextjs.org/docs)
- [React docs](https://react.dev)
- [Vite docs](https://vitejs.dev/guide/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

