---
id: trpc-md
title: tRPC — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# tRPC — Conventions & Examples

## Conventions
1. Router per domain + `rootRouter`; export `AppRouter` type.
2. Strict Zod input/output; no untyped payloads.
3. `protectedProcedure` vs `publicProcedure` via middleware.

## Examples
```ts
// server/routers/user.ts
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => ctx.user),
  byId: publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => ctx.db.user.find(input.id)),
});

// server/routers/index.ts
import { router } from "../trpc";
import { userRouter } from "./user";
export const appRouter = router({ user: userRouter });
export type AppRouter = typeof appRouter;
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [General web docs](https://developer.mozilla.org/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

