---
id: security-md
title: Security — Web App Conventions
topics: []
scope: []
version: any
sections:
  - core-areas
  - conventions
  - patterns
  - checklist
toolingLinks: {}
---
# Security — Web App Conventions

[← Back to TOC](./README.md)

## Core areas

- Input validation: zod at boundaries; encode outputs.
- AuthN/Z: short-lived tokens, refresh rotation; enforce on server routes.
- Secrets: never in client bundles; use environment management.

## Conventions

- Use CSP with nonces/hashes; disallow `unsafe-inline`.
- SameSite cookies (Lax/Strict) and HttpOnly; secure in production.
- Rate limiting and bot protection on sensitive endpoints.
- Dependency hygiene: audit regularly; pin and update.

## Patterns

- Central error handler that avoids leaking internals.
- Strict CORS; exact origins.
- SSRF-safe HTTP clients; allowlist targets if proxying.

## Checklist

- [ ] CSP configured
- [ ] Cookies secure and scoped
- [ ] Input validated and output encoded
- [ ] Secrets managed outside repo
- [ ] Dependencies audited

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [General web docs](https://developer.mozilla.org/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

