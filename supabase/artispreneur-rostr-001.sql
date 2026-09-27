-- Proposed additive migration for the shared Artispreneur Supabase project.
-- REVIEW against the live schema before applying. Do not run generic schema.sql.
-- Service-role API uses explicit user_id filters; RLS is defense in depth.
-- One shared application project can have many artists. Membership is created
-- only after Artispreneur verifies the Supabase session, never from a caller ID.
create table if not exists public.rostr_project_memberships (
  project_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(project_id, user_id)
);
alter table public.rostr_project_memberships enable row level security;
revoke all on public.rostr_project_memberships from anon, authenticated;
grant select on public.rostr_project_memberships to authenticated;
drop policy if exists rostr_memberships_read_own on public.rostr_project_memberships;
create policy rostr_memberships_read_own on public.rostr_project_memberships
  for select to authenticated using (auth.uid() = user_id);

create table if not exists public.rostr_runs (
  id uuid primary key,
  project_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  record jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rostr_runs_record_identity check (
    record->>'id' = id::text and record->>'projectId' = project_id
  )
);
create index if not exists rostr_runs_owner_recent
  on public.rostr_runs(user_id, project_id, created_at desc);
alter table public.rostr_runs enable row level security;
revoke all on public.rostr_runs from anon, authenticated;
grant select on public.rostr_runs to authenticated;
drop policy if exists rostr_runs_read_own on public.rostr_runs;
create policy rostr_runs_read_own on public.rostr_runs
  for select to authenticated using (auth.uid() = user_id);

create table if not exists public.rostr_reference_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  entry text not null,
  created_at timestamptz not null default now()
);
create index if not exists rostr_reference_log_owner
  on public.rostr_reference_log(user_id, project_id, created_at desc);
alter table public.rostr_reference_log enable row level security;
revoke all on public.rostr_reference_log from anon, authenticated;
grant select on public.rostr_reference_log to authenticated;
drop policy if exists rostr_reference_read_own on public.rostr_reference_log;
create policy rostr_reference_read_own on public.rostr_reference_log
  for select to authenticated using (auth.uid() = user_id);

-- Adapter cache only. Artispreneur website entitlements remain authoritative;
-- do not expose grants until the website entitlement check is wired.
create table if not exists public.rostr_entitlements (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  skill text not null,
  granted_via text not null check (granted_via in ('purchase','subscription','mock')),
  uses_remaining int check (uses_remaining is null or uses_remaining >= 0),
  primary key (user_id, project_id, skill)
);
alter table public.rostr_entitlements enable row level security;
revoke all on public.rostr_entitlements from anon, authenticated;
grant select on public.rostr_entitlements to authenticated;
drop policy if exists rostr_entitlements_read_own on public.rostr_entitlements;
create policy rostr_entitlements_read_own on public.rostr_entitlements
  for select to authenticated using (auth.uid() = user_id);

-- Atomic append prevents concurrent worker/master writes from dropping steps.
-- PostgREST RPC is service-role only and checks both owner and project.
create or replace function public.rostr_append_step(
  p_project_id text, p_user_id uuid, p_run_id uuid, p_step jsonb
) returns jsonb language plpgsql security invoker as $$
declare appended jsonb;
begin
  update public.rostr_runs
  set record = jsonb_set(record, '{steps}',
    coalesce(record->'steps', '[]'::jsonb) ||
      (p_step || jsonb_build_object('n', jsonb_array_length(coalesce(record->'steps', '[]'::jsonb)) + 1))),
      updated_at = now()
  where id = p_run_id and user_id = p_user_id and project_id = p_project_id
  returning record->'steps'->-1 into appended;
  if not found then raise exception 'run not found'; end if;
  return appended;
end; $$;
revoke all on function public.rostr_append_step(text,uuid,uuid,jsonb) from public, anon, authenticated;
grant execute on function public.rostr_append_step(text,uuid,uuid,jsonb) to service_role;

create or replace function public.rostr_append_decision(
  p_project_id text, p_user_id uuid, p_run_id uuid, p_decision jsonb
) returns void language plpgsql security invoker as $$
begin
  update public.rostr_runs
  set record = jsonb_set(record, '{decisions}',
    coalesce(record->'decisions', '[]'::jsonb) || p_decision), updated_at = now()
  where id = p_run_id and user_id = p_user_id and project_id = p_project_id;
  if not found then raise exception 'run not found'; end if;
end; $$;
revoke all on function public.rostr_append_decision(text,uuid,uuid,jsonb) from public, anon, authenticated;
grant execute on function public.rostr_append_decision(text,uuid,uuid,jsonb) to service_role;
