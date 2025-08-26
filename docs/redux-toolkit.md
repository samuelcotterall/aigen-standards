---
id: redux-toolkit-md
title: "Redux Toolkit — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
---
# Redux Toolkit — Conventions & Examples

## Conventions
1. Slice per feature; export selectors next to slice.
2. Prefer RTK Query for IO with cache tags.
3. Keep state serializable; use `createListenerMiddleware` for side effects.

## Examples
```ts
import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: { inc: (s) => { s.value += 1; } },
});
export const { inc } = slice.actions;
export default slice.reducer;
```
