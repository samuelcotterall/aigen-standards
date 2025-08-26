---
id: storybook-md
title: "Storybook — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
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
