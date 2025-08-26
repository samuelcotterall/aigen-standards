---
id: tanstack-table-md
title: "TanStack Table — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
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
