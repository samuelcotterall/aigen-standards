---
id: tailwind
title: Tailwind CSS
topics: [styling]
scope: [react, next, vite]
version: 'index'
sections: [index]
---

# Tailwind CSS — Index

Use the version-specific guides:

- Tailwind v3: ./tailwind/3.md
- Tailwind v4: ./tailwind/4.md

General conventions apply to both; defer to version docs where behavior differs.

## Conventions

1. Centralize tokens in `tailwind.config.ts` and CSS variables.
2. Use `cva`/`tv` for variants with typed props.
3. Use `cn()` helper wrapping `clsx` + `tailwind-merge`.

## Examples

```ts
// tailwind.config.ts
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { DEFAULT: '#0f172a' } } } },
};
```

```ts
// lib/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
