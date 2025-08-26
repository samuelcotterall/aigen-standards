---
id: supabase-md
title: "Supabase JS — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
---
# Supabase JS — Conventions & Examples

## Conventions
1. Singleton client per runtime (`/lib/supabase/server.ts` vs `/client.ts`).
2. Default to user RLS; use service role only in server contexts when necessary.
3. Generate types from DB and use to type queries and RPCs.

## Examples
```ts
// lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
```
