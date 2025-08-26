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

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Supabase docs](https://supabase.com/docs)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

