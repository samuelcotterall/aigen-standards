---
id: jotai-md
title: "Jotai — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
---
# Jotai — Conventions & Examples

## Conventions
1. Small atoms per concern; derive with computed/selectAtom.
2. Co-locate atoms near features; export API from `atoms.ts`.
3. Persist with namespaced keys; gate SSR/CSR access.

## Examples
```ts
import { atom, useAtom } from "jotai";
const countAtom = atom(0);
export function Counter() {
  const [count, set] = useAtom(countAtom);
  return <button onClick={() => set((c) => c + 1)}>{count}</button>;
}
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [General web docs](https://developer.mozilla.org/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

