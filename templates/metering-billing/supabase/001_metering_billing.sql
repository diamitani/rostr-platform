-- Metering + billing: customers/plans + usage events.
-- Run ONCE in the Supabase dashboard (SQL editor) for the project behind
-- SUPABASE_URL. One Supabase project can serve MANY apps: every event
-- carries a project_id, and quotas are per customer per app naturally
-- because each app keeps its own billing_customers rows (customer ids are
-- namespaced by the app's own user ids / API keys).
--
-- The API degrades gracefully until these tables exist (usage is kept in
-- memory and quotas are best-effort), but nothing is durable across
-- serverless invocations until you run this.

create table if not exists billing_customers (
  customer_id text primary key,
  plan text not null default 'free',
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null default 'call', -- 'call' (one LLM call) | 'run' (aggregate)
  customer_id text not null,
  project_id text not null,
  run_id text,
  agent_id text,
  model text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd numeric(12, 6) not null default 0,
  estimated boolean not null default false
);

create index if not exists usage_events_customer_created
  on usage_events (customer_id, created_at desc);
create index if not exists usage_events_run
  on usage_events (run_id) where run_id is not null;

-- The API uses the service-role key, which bypasses RLS. Enable RLS so no
-- anon key can ever read these tables.
alter table billing_customers enable row level security;
alter table usage_events enable row level security;
