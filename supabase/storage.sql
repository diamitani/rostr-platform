-- Rostr Platform storage layer — run after schema.sql in the Supabase SQL editor.
--
-- Three PRIVATE buckets (public = false: no anonymous URL access, ever):
--   sessions  — context engine .md.gz files
--   artifacts — generated files (EPKs, exports, renders)
--   uploads   — user-supplied files
--
-- Object layout inside each bucket: <project_id>/<path...>  (see storage.md).
--
-- RLS notes:
--   * The runtime API uses the SERVICE ROLE key, which bypasses RLS
--     entirely — no policy is required for server-side upload/download.
--   * The policy below additionally lets an authenticated user SELECT
--     objects whose first path segment matches a project they own
--     (projects.owner_id = auth.uid()), as a read-only convenience for
--     dashboards. It is narrowly scoped; tighten or remove it if the
--     dashboard never reads via the anon/authenticated key.

-- ---------------------------------------------------------------------------
-- Buckets (idempotent)
insert into storage.buckets (id, name, public)
values
  ('sessions',  'sessions',  false),
  ('artifacts', 'artifacts', false),
  ('uploads',   'uploads',   false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS on storage.objects
-- (objects RLS is enabled by default in Supabase projects; the ALTER is
--  included for clarity / self-hosted installs.)
alter table storage.objects enable row level security;

-- Authenticated users can SELECT (download) objects in the rostr buckets
-- when the first path segment equals a project they own.
--
-- NOTE: the exact way to extract the first path segment varies by
-- Supabase version. Newer versions provide the helper
--   storage.foldername(objects.name)[1]
-- which returns the top-level folder. If your version lacks it, replace
--   (storage.foldername(objects.name))[1]
-- with
--   split_part(objects.name, '/', 1)
-- Both forms are equivalent for <project_id>/<rest-of-path> keys.
drop policy if exists "rostr authenticated project read" on storage.objects;
create policy "rostr authenticated project read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id in ('sessions', 'artifacts', 'uploads')
    and exists (
      select 1
        from projects p
       where p.owner_id = auth.uid()::text
         and p.id = (storage.foldername(objects.name))[1]
    )
  );

-- No INSERT/UPDATE/DELETE policies: only the service role (which bypasses
-- RLS) may write objects. Anon/authenticated writes are denied.
