---
id: uploads-md
title: "Uploads (S3 / UploadThing / Uppy) — Conventions & Patterns"
topics: []
scope: []
version: "any"
sections: [golden-rules, s3-style-presigned-upload-direct-to-bucket-, uploadthing, uppy-tus-multipart-, security-compliance, a11y-ux, checklist]
---
# Uploads (S3 / UploadThing / Uppy) — Conventions & Patterns

[← Back to TOC](./README.md)

Guidance for user-generated file uploads with S3-compatible storage or managed services.

---

## Golden rules

1. Validate on server: mime type, size, extension, and business rules (ownership/limits).
2. Upload direct-to-storage with presigned URLs; avoid proxying large files through your app.
3. Write a pending record before upload; finalize in a callback/webhook after the object exists.
4. Use deterministic keys (user/tenant/date/uuid) and never trust client-provided filenames.
5. Store canonical metadata (content-type, byte size, checksum) and derive public URLs server-side.
6. Support resumable uploads for large files (tus/Multipart) and show granular progress.
7. Sanitize user-provided names; never render raw HTML from file contents.
8. If exposing public URLs, set tight CORS and signed/short-lived URLs when needed.

---

## S3-style presigned upload (direct-to-bucket)

```ts
// api/uploads/presign.ts (server)
import crypto from 'node:crypto';

export async function GET(request: Request) {
  // 1) Authn/Authz
  // 2) Validate requested contentType/size
  const { contentType, size } = Object.fromEntries(new URL(request.url).searchParams);
  if (!contentType || Number(size) > 10 * 1024 * 1024) {
    return new Response('invalid', { status: 400 });
  }

  // 3) Generate object key
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}`;

  // 4) Create presigned URL (pseudo; use AWS SDK v3 S3 `getSignedUrl`)
  const url = `https://example-bucket.s3.amazonaws.com/${key}?X-Amz-Signature=...`;

  // 5) Persist a pending DB record with expected size/contentType/key
  // await db.uploads.insert({ key, size, contentType, status: 'pending', userId })

  return Response.json({ url, key });
}
```

Client usage (with fetch + progress):

```ts
async function uploadFile(file: File) {
  const qs = new URLSearchParams({ contentType: file.type, size: String(file.size) });
  const { url, key } = await fetch(`/api/uploads/presign?${qs}`).then((r) => r.json());
  const res = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  if (!res.ok) throw new Error('upload failed');
  // optionally notify server to finalize if no webhook
  await fetch(`/api/uploads/finalize`, { method: 'POST', body: JSON.stringify({ key }) });
}
```

Finalize (webhook or explicit call):

```ts
// api/uploads/finalize.ts (server)
export async function POST(request: Request) {
  const { key } = await request.json();
  // Verify object exists in storage; fetch head metadata if possible
  // await db.uploads.update({ key }, { status: 'ready', url: `https://cdn.example.com/${key}` })
  return Response.json({ ok: true });
}
```

---

## UploadThing

- Centralize file routers; enforce mime/size per route.
- Use callbacks (`onUploadComplete`) to persist metadata and issue URLs.
- Co-locate client components that call the router and handle progress/errors.

---

## Uppy (tus/Multipart)

- Prefer `@uppy/dashboard` for a11y and previews, `@uppy/aws-s3-multipart` for large files.
- Chunk sizes 5–10MB are a good default; allow 3–5 concurrent parts.
- Persist upload state for resume; map uppy file IDs to your DB records.

---

## Security & compliance

- Content validation server-side; verify mime by sniffing magic bytes when possible.
- Virus scanning on server or via provider (e.g., S3 + Lambda, Cloudflare AV).
- Signed URLs for private content; short expirations; scope to GET only.
- CORS: limit origins, methods, and headers to the minimum necessary.
- PII/Compliance: encrypt at rest (SSE-S3/KMS) and in transit; avoid public buckets for sensitive data.

---

## A11y & UX

- Always provide drag-and-drop and keyboard-select; use `<input type="file">` with proper labels.
- Announce progress via `aria-live=polite`; include cancel/retry.
- Preview images/videos with clear remove actions; validate client-side early for faster feedback.

---

## Checklist

- [ ] Server-side policy: size, mime, extensions, limits per role/plan
- [ ] Deterministic keys and foldering strategy
- [ ] Pending DB record + finalize step
- [ ] Resumable/chunked uploads for large files
- [ ] CORS locked down
- [ ] Signed URLs for private assets
- [ ] Virus scanning where required
- [ ] A11y-friendly inputs and progress
