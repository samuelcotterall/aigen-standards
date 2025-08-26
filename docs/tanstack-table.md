---
id: tanstack-table-md
title: TanStack Table — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# TanStack Table — Conventions & Examples

## Conventions
1. Separate `columns.ts` with accessors and cell renderers.
2. Server-driven pagination/sort; control state via props.
3. Memoize `data`, `columns`, renderers.

## Examples
```ts
// columns.ts
import { createColumnHelper } from "@tanstack/react-table";
const h = createColumnHelper<any>();
export const columns = [
  h.accessor("email", { header: "Email", cell: (info) => <span>{info.getValue()}</span> }),
];
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [General web docs](https://developer.mozilla.org/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

