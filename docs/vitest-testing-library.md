---
id: vitest-testing-library-md
title: Vitest + Testing Library — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# Vitest + Testing Library — Conventions & Examples

## Conventions
1. `setupTests.ts` for globals (`jest-dom`, MSW).
2. Prefer accessible queries (`getByRole` etc.).
3. Co-locate `*.test.tsx` with components.

## Examples
```ts
// setupTests.ts
import "@testing-library/jest-dom";
```
```tsx
// Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
it("renders", () => {
  render(<Button>Click</Button>);
  expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
});
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Vite docs](https://vitejs.dev/guide/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

