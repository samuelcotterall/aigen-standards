---
id: nextauth-md
title: "NextAuth / Auth.js — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
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
