---
id: dates-md
title: Dates (date-fns / dayjs) — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# Dates (date-fns / dayjs) — Conventions & Examples

## Conventions
1. Normalize to UTC at boundaries; format in user TZ at view.
2. Centralize format tokens.
3. No `new Date()` in UI; compute in helpers.

## Examples
```ts
import { formatISO } from "date-fns";
export const toIsoUtc = (d: Date) => formatISO(new Date(d.toISOString()));
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [General web docs](https://developer.mozilla.org/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

