---
id: nextjs-md
title: Next.js (App Router) — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---

# Next.js (App Router) — Conventions & Examples

## Conventions

1. Route groups & shared layouts (`(marketing)`, `(app)`), `loading.tsx`/`error.tsx` per segment.
2. Server-first actions colocated with forms; validate with Zod at boundaries.
3. File naming: `route.ts` for HTTP endpoints, `page.tsx` for UI; `lib/` for server utilities.

## Examples

````tsx
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
## Validated snippets

These snippets are aligned with Next.js App Router best-practices (layouts, data fetching, caching).

Root layout (app/layout.tsx):

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
````

Server component data fetch with revalidation:

```ts
export default async function Page() {
  const res = await fetch('https://api.example.com/data', { next: { revalidate: 60 } });
  const data = await res.json();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

Loading UI (app/[segment]/loading.tsx):

```tsx
export default function Loading() {
  return <div>Loading…</div>;
}
```

Route handler (app/api/hello/route.ts):

```ts
export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Next.js docs](https://nextjs.org/docs)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

```
