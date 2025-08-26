---
id: nextjs-md
title: "Next.js (App Router) — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
---
# Next.js (App Router) — Conventions & Examples

## Conventions
1. Route groups & shared layouts (`(marketing)`, `(app)`), `loading.tsx`/`error.tsx` per segment.
2. Server-first actions colocated with forms; validate with Zod at boundaries.
3. File naming: `route.ts` for HTTP endpoints, `page.tsx` for UI; `lib/` for server utilities.

## Examples
```tsx
// app/(marketing)/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl p-6">{children}</div>;
}

// app/user/[id]/page.tsx
import { UserSchema } from "@/schemas/user";
export default async function UserPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.API_URL}/users/${params.id}`, { cache: "no-store" });
  const data = await res.json();
  const user = UserSchema.parse(data);
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}

// app/api/users/route.ts
import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json([{ id: "1" }]); }
```
