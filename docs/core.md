---
id: core-md
title: Core Packages — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - react-hook-form
  - conventions
  - examples
  - zod
  - conventions
  - examples
  - tanstack-query-react-query-
  - conventions
  - examples
  - swr
  - conventions
  - examples
  - framer-motion
  - conventions
  - examples
  - zustand
  - conventions
  - examples
  - msw-mock-service-worker-
  - conventions
  - examples
  - react-window
  - conventions
  - examples
  - '-vitejs-plugin-react'
  - conventions
  - examples
  - shadcn-ui
  - conventions
  - examples
toolingLinks: {}
---
# Core Packages — Conventions & Examples

This doc covers common libraries used across React/Next/Vite projects.

---

## React Hook Form

### Conventions
1. Form hooks per component; share methods with `FormProvider`.
2. Schema-first validation using `zodResolver`.
3. Small field wrappers for repeated patterns.

### Examples
```tsx
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof schema>;

function EmailInput() {
  const { register } = useFormContext<FormValues>();
  return <input {...register("email")} placeholder="you@example.com" />;
}

export default function DemoForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <EmailInput />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```
---

## Zod

### Conventions
1. Keep schemas in `/schemas` (or `/lib/schemas`) by domain.
2. Parse at boundaries (API routes, server actions, before DB writes).
3. Compose with `extend/pick/omit` and export `z.infer` types.

### Examples
```ts
// schemas/user.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

// In a route
const user = UserSchema.parse(await request.json());
```
---

## TanStack Query (React Query)

### Conventions
1. Key factories per feature to avoid key drift.
2. Service layer for fetchers; hooks just wire `queryKey` + `queryFn`.
3. Cache-aware mutations (optimistic updates, targeted invalidation).

### Examples
```ts
// queryKeys.ts
export const queryKeys = {
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
  },
};

// useUser.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const getUser = (id: string) => fetch(`/api/users/${id}`).then(r => r.json());
export const useUser = (id: string) =>
  useQuery({ queryKey: queryKeys.users.detail(id), queryFn: () => getUser(id) });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => fetch("/api/users", { method: "PUT", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
};
```
---

## SWR

### Conventions
1. Stable key helpers; never inline object keys.
2. Global fetcher singleton via `SWRConfig`.
3. Optimistic updates with `mutate` for snappy UX.

### Examples
```ts
// swr.ts
export const keys = { user: (id: string) => `/api/users/${id}` };
export const fetcher = (url: string) => fetch(url).then(r => r.json());

// component.tsx
import useSWR, { mutate } from "swr";
const { data } = useSWR(keys.user("1"), fetcher);
mutate(keys.user("1"), { ...data, name: "Temp" }, { optimisticData: true });
```
---

## Framer Motion

### Conventions
1. Centralize variant objects.
2. Respect `prefers-reduced-motion`.
3. Standardize interactions (`whileHover`, `whileTap`).

### Examples
```tsx
import { motion, useReducedMotion } from "framer-motion";

const fade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } };

export function Card({ children }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 220 }}
      whileHover={{ scale: reduced ? 1 : 1.02 }}
    >
      {children}
    </motion.div>
  );
}
```
---

## Zustand

### Conventions
1. One typed store per domain.
2. Prefer selectors to limit re-renders.
3. Guard `persist/devtools` by environment and namespace keys.

### Examples
```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: string[];
  add: (id: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(persist(
  (set) => ({
    items: [],
    add: (id) => set((s) => ({ items: [...s.items, id] })),
    clear: () => set({ items: [] }),
  }),
  { name: "cart" }
));

// usage
const items = useCart((s) => s.items);
```
---

## MSW (Mock Service Worker)

### Conventions
1. Handlers mirror API routes; use response factories.
2. Separate Node `setupServer` (tests) and `worker.start()` (dev).
3. Scenario toggles via query params/headers/env flags.

### Examples
```ts
// mocks/handlers/user.ts
import { rest } from "msw";
export const userHandlers = [
  rest.get("/api/users/:id", (req, res, ctx) => {
    if (req.url.searchParams.get("scenario") === "error") return res(ctx.status(500));
    return res(ctx.json({ id: req.params.id, name: "Test" }));
  }),
];
```
---

## react-window

### Conventions
1. Pure, memoized row renderers.
2. Document sizing contracts and constants.
3. Stable `itemKey` mapped to data IDs.

### Examples
```tsx
import { FixedSizeList as List } from "react-window";
const ITEM_HEIGHT = 36;
const Row = ({ index, style, data }) => <div style={style}>{data.items[index].label}</div>;

<List
  height={400}
  itemCount={items.length}
  itemSize={ITEM_HEIGHT}
  itemKey={(i) => items[i].id}
  itemData={{ items }}
>
  {Row}
</List>
```
---

## @vitejs/plugin-react

### Conventions
1. Keep `vite.config.ts` minimal.
2. Avoid module-scope side effects; consistent exports.
3. Path aliases mirrored in `tsconfig.json`.

### Examples
```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": "/src" } },
});

// tsconfig.json (excerpt)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```
---

## shadcn/ui

### Conventions
1. Generate components locally under `components/ui/*`.
2. Wrap primitives to freeze API/branding.
3. Use `cn()` + `cva`/`tv` for variants.

### Examples
```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva("inline-flex items-center rounded-xl px-3 py-2", {
  variants: { intent: { primary: "bg-black text-white", ghost: "bg-transparent" }, size: { sm:"h-8", md:"h-10" } },
  defaultVariants: { intent: "primary", size: "md" },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, intent, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ intent, size }), className)} {...props} />;
}
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [General web docs](https://developer.mozilla.org/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

