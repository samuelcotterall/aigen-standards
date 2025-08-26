---
id: nextauth-md
title: NextAuth / Auth.js — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# NextAuth / Auth.js — Conventions & Examples

## Conventions
1. `auth()` helper on server; client uses `useSession()` sparingly.
2. Typed session via `next-auth.d.ts`; provider config in `/lib/auth.ts`.
3. Protect routes in `middleware.ts` with matchers; prefer server redirects.

## Examples
```ts
// next-auth.d.ts
import "next-auth";
declare module "next-auth" {
  interface Session { user: { id: string; email: string } }
}

// lib/auth.ts
import NextAuth from "next-auth";
export const { auth, handlers } = NextAuth({ providers: [], callbacks: {} });

// middleware.ts
export { auth as middleware } from "@/lib/auth";
export const config = { matcher: ["/app/:path*"] };
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Next.js docs](https://nextjs.org/docs)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

