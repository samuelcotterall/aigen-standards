---
id: drizzle-md
title: "Drizzle (SQL) — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
---
# Drizzle (SQL) — Conventions & Examples

## Conventions
1. `/db` structure: `schema.ts`, `index.ts`, and `queries/` modules.
2. Infer types with `InferModel`; export for server actions/controllers.
3. Keep SQL migrations checked in; stable `drizzle-kit` config paths.

## Examples
```ts
// db/schema.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// types
import { InferModel } from "drizzle-orm";
export type User = InferModel<typeof users>;
```
