---
id: tailwind
title: Tailwind CSS
topics:
  - styling
scope:
  - react
  - next
  - vite
version: index
sections:
  - index
toolingLinks: {}
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

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [React docs](https://react.dev)
- [Next.js docs](https://nextjs.org/docs)
- [Vite docs](https://vitejs.dev/guide/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

