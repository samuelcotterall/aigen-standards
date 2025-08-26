---
id: accessibility-md
title: Accessibility — A11y Conventions for React/Next
topics: []
scope: []
version: any
sections:
  - core-principles
  - conventions
  - patterns
  - checklist
toolingLinks: {}
---
# Accessibility — A11y Conventions for React/Next

[← Back to TOC](./README.md)

## Core principles

- Keyboard first: all interactive elements reachable and operable.
- Semantics: prefer native elements; ARIA to augment, not replace.
- Announce changes: `aria-live` for async states; focus management on navigation/dialogs.

## Conventions

- Use accessible component primitives (Radix UI/React Aria) and respect `prefers-reduced-motion`.
- Forms: associate labels, helpful error text; describe requirements.
- Color contrast: WCAG AA minimum; test in light/dark.
- Dialogs/menus: trap focus, restore on close, escape to dismiss.

## Patterns

- Route changes: move focus to heading or main landmark.
- Loading: use `aria-busy` and live regions.
- Tables: headers, scope, and captions; for complex, provide summaries.

## Checklist

- [ ] Tab order logical; skip links present
- [ ] Landmarks (header/nav/main/footer) set
- [ ] Focus states visible and not removed
- [ ] Motion reduced when user requests
- [ ] Forms labeled with errors tied to inputs

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Next.js docs](https://nextjs.org/docs)
- [React docs](https://react.dev)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

