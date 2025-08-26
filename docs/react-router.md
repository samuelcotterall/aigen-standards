---
id: react-router
title: React Router
topics:
  - routing
scope:
  - react
  - vite
version: '>=6.4'
sections:
  - conventions
  - examples
  - golden-rules
  - route-module-anatomy
  - router-setup
  - patterns
  - gotchas
  - references
toolingLinks: {}
---

# React Router — Conventions & Examples

## Conventions

1. Co-locate route modules: element, loader, action, ErrorBoundary in one file per route.
2. Prefer route objects with `lazy` to code-split at route boundaries.
3. Parse inputs at boundaries (loader/action) with zod; return typed data.

## Examples

```tsx
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./routes/_layout'),
  },
]);
export default function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
```

## Golden rules

1. Co-locate route modules: element, loader, action, ErrorBoundary in one file per route.
2. Prefer route objects with `lazy` to code-split at route boundaries.
3. Parse inputs at boundaries (loader/action) with zod; return typed data.
4. Use `defer` + `<Await>` for large/parallel data; block only what’s necessary.
5. Surface failures with route-level error boundaries and `useRouteError()`.
6. Redirect in loaders for auth/ACL checks using `redirect()`.
7. Centralize `shouldRevalidate` to avoid excess refetching; opt into revalidation on meaningful mutations.
8. Prefer `useFetcher` for background mutations/data without navigation.
9. Use `ScrollRestoration` and `basename` where applicable; keep URLs canonical.
10. Keep route keys and params stable; encode IDs, never trust user input.

## Route module anatomy

```tsx
// routes/users.$userId.tsx
import * as React from 'react';
import {
  defer,
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from 'react-router-dom';
import { Await, useLoaderData, useRouteError } from 'react-router-dom';
import { z } from 'zod';

const paramsSchema = z.object({ userId: z.string().uuid() });

async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw json({ message: 'User not found' }, { status: res.status });
  return res.json() as Promise<{ id: string; email: string; name: string }>;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { userId } = paramsSchema.parse(params);
  // Example auth gate
  const isAuthed = true; // replace with real check
  if (!isAuthed)
    return redirect(`/login?next=${encodeURIComponent(new URL(request.url).pathname)}`);
  return defer({ user: getUser(userId) });
}

const formSchema = z.object({ name: z.string().min(1) });
export async function action({ request, params }: ActionFunctionArgs) {
  const { userId } = paramsSchema.parse(params);
  const form = await request.formData();
  const payload = formSchema.parse({ name: form.get('name') });
  const res = await fetch(`/api/users/${userId}`, { method: 'PUT', body: JSON.stringify(payload) });
  if (!res.ok) throw json({ message: 'Failed to update' }, { status: 400 });
  return redirect(`/users/${userId}`);
}

export function ErrorBoundary() {
  const err = useRouteError() as any;
  return <p role="alert">Error: {err?.data?.message ?? 'Something went wrong'}</p>;
}

export default function UserRoute() {
  const data = useLoaderData() as { user: Promise<{ id: string; email: string; name: string }> };
  return (
    <React.Suspense fallback={<p>Loading…</p>}>
      <Await resolve={data.user}>
        {(user) => (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            {/* form posts to the same route's action */}
            <form method="post">
              <input name="name" defaultValue={user.name} />
              <button type="submit">Save</button>
            </form>
          </div>
        )}
      </Await>
    </React.Suspense>
  );
}
```

## Router setup

```tsx
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./routes/_layout'),
  },
]);

export default function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
```

## Patterns

- Auth guard in loader: use `redirect()`; never guard via element logic only.
- Data preloading: use `useFetcher()` in components to load data without navigation.
- Revalidation: implement `shouldRevalidate` to prevent unnecessary refetches on search/hash changes.
- Code-splitting: prefer `lazy` on routes; avoid wrapping elements in React.lazy when using data routers.
- Forms: `Form` for declarative submissions; `useNavigation()` for pending states.
- Errors: throw `json()` from loaders/actions; read via `useRouteError()`.
- Nested routes: use layout routes with `Outlet` for composition and data inheritance via `useLoaderData()` in children using `useRouteLoaderData(parentId)` when needed.

## Gotchas

- Avoid inline object route keys; use stable strings for route IDs if accessing parent loader data.
- Keep loader return shapes stable; it’s part of your route contract.
- Do not fetch in components when a loader exists for the same data; centralize in loader for better error and pending UX.
- Remember loaders run on navigation, not on state-only updates; use `fetcher` or local state for component-only data.

## References

- React Router docs: https://reactrouter.com
- Data routers: https://reactrouter.com/en/main/route/loader
- Defer/Await: https://reactrouter.com/en/main/guides/data-defer
