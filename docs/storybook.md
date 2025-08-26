---
id: storybook-md
title: Storybook — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# Storybook — Conventions & Examples

## Conventions
1. CSF stories with `args`/`argTypes`.
2. Theme decorator for real tokens + dark/light.
3. Stories act as specs (loading/error/empty).

## Examples
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = { component: Button };
export default meta;
export const Primary: StoryObj<typeof Button> = { args: { children: "Click" } };
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [General web docs](https://developer.mozilla.org/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

