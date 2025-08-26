---
id: prisma-md
title: Prisma — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# Prisma — Conventions & Examples

## Conventions
1. Group related models; use `@map/@@map` only for legacy names.
2. Repository/data-access layer returning plain types.
3. Strict migration discipline; seed per environment.

## Examples
```prisma
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())
}
```

```ts
// data/user.ts
import { prisma } from "@/lib/prisma";
export const getUser = async (id: string) => prisma.user.findUnique({ where: { id } });
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Prisma docs](https://www.prisma.io/docs)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

