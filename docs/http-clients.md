---
id: http-clients-md
title: "HTTP Clients (Axios / ky) — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
---
# HTTP Clients (Axios / ky) — Conventions & Examples

## Conventions
1. Client factory with baseURL/interceptors in `/lib/http.ts`.
2. Normalize errors to one shape.
3. Support `AbortController` and retries for idempotent GETs.

## Examples
```ts
// lib/http.ts
import ky from "ky";
export const api = ky.create({ prefixUrl: "/api", timeout: 10000 });
export const getUser = (id: string) => api.get(`users/${id}`).json();
```
