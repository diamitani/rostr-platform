# Rostr Platform — Storage buckets

All buckets are **private** (`public = false`). There is no anonymous URL
access; every download goes through an authenticated path (service role on
the API server, or a per-user policy for dashboards).

| Bucket      | Purpose                                       | Object key layout                                      |
|-------------|-----------------------------------------------|--------------------------------------------------------|
| `sessions`  | Context engine `.md.gz` files                 | `sessions/<project_id>/<session_id>.md.gz`             |
| `artifacts` | Generated files (EPKs, exports, renders)      | `artifacts/<project_id>/<run_id>/<name>`               |
| `uploads`   | User-supplied files                           | `uploads/<project_id>/<user_id>/<name>`                |

The first path segment is always the `project_id`, so per-project isolation
can be enforced with a single prefix match.

## Context engine → `sessions` bucket

The context engine previously wrote to a local `storage/` folder; the same
paths map 1:1 onto the `sessions` bucket:

```
local:  storage/<project_id>/<session_id>.md.gz
remote: sessions/<project_id>/<session_id>.md.gz   (bucket: sessions, key: <project_id>/<session_id>.md.gz)
```

Per the existing design, **the path IS the link**: the `kb_items.path`
column records `sessions/<project_id>/<session_id>.md.gz`, and anything that
can resolve a path can find the blob — no secondary lookup needed.

## Artifacts & uploads

- `artifacts/<project_id>/<run_id>/<name>` — each generated file also gets an
  `artifacts` table row; its `storage_path` column holds the key
  (`<project_id>/<run_id>/<name>`), mirroring the path-is-the-link pattern.
- `uploads/<project_id>/<user_id>/<name>` — raw user files; referenced from
  application code, not necessarily indexed in `kb_items`.

## Service-role upload pattern

Server-side code uses the `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS —
no storage policy is needed for API reads/writes. Sketch against the
Storage REST API (`SUPABASE_URL` is the project URL):

```ts
const bucket = "sessions";
const key = `${projectId}/${sessionId}.md.gz`; // key INSIDE the bucket

// upload
await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${key}`, {
  method: "POST",
  headers: {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/gzip",
    "x-upsert": "true",
  },
  body: gzippedBuffer,
});

// signed download URL (buckets are private; never share permanent URLs)
const res = await fetch(
  `${SUPABASE_URL}/storage/v1/object/sign/${bucket}/${key}`,
  {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expiresIn: 3600 }),
  }
);
const { signedURL } = await res.json();
```

(Using `@supabase/supabase-js` with `createClient(url, serviceRoleKey)` and
`supabase.storage.from(bucket).upload(key, buffer, { upsert: true })` is
equivalent; the fetch form above makes the exact HTTP contract explicit.)

## RLS posture

- Service role bypasses RLS automatically — the API needs no storage
  policies to read/write.
- `storage.sql` adds one read-only policy letting `authenticated` users
  `SELECT` objects whose first path segment matches a `project_id` whose
  `owner_id = auth.uid()`.
- There are **no** INSERT/UPDATE/DELETE policies for anon/authenticated —
  only the service role can write objects.
