# Rostr Platform API

## What this is

The Rostr platform API is one shared runtime that every project uses. A project is a folder that describes its agents, its workspaces, and its skill catalog — the runtime reads that description and serves it over HTTP. Artispreneur is the first project running on the platform: its agents sell and fulfill music label services through the same API any future project will use.

## The 3 layers

1. **Shared runtime** — the code in `lib/` and `app/`. It handles agent runs, intent compilation (PAL), intent classification (NPAO), the skill marketplace, purchases, and entitlements. Every project shares this runtime; it is never copied per project.
2. **Project folder** — `projects/<id>/project.json` plus skill folders under `skills/`. This is where a project's identity lives: which agents it has, which workspaces group its skills, and what each skill costs. Adding a project means adding a folder, not forking the code.
3. **Web apps calling the API** — storefronts, dashboards, and checkouts that send `project_id` with every request. They render the data the API returns; they contain no agent logic of their own.

## Quickstart

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mock mode works with zero keys: with `MOCK_MODE=true` the API runs on scripted fixtures, so you can exercise every endpoint locally before wiring any real credentials.

## API reference

Base URL locally: `http://localhost:3000`. Every example below assumes mock mode unless stated otherwise.

### GET /api/v1/health

Liveness check.

```bash
curl http://localhost:3000/api/v1/health
```

### GET /api/v1/projects

List all registered projects.

```bash
curl http://localhost:3000/api/v1/projects
```

### GET /api/v1/projects/artispreneur

Fetch the Artispreneur project definition: agents, workspaces, and the full skill catalog.

```bash
curl http://localhost:3000/api/v1/projects/artispreneur
```

### POST /api/v1/run (SSE)

Start an agent run. The response is a server-sent event stream; use `curl -N` to read it as it arrives.

```bash
curl -N -X POST http://localhost:3000/api/v1/run \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "artispreneur",
    "agent_id": "artispreneur-master",
    "input": "Create a 400-word bio for a soul singer from Chicago named Maya Jones"
  }'
```

The stream emits events like `run.started`, `run.step`, and `run.completed`. Each event carries a `run_id` you can use to fetch the finished run below.

### GET /api/v1/runs/<id>?project_id=artispreneur

Fetch the stored result of a completed run.

```bash
curl "http://localhost:3000/api/v1/runs/run_abc123?project_id=artispreneur"
```

### POST /api/v1/pal/compile

Compile a natural-language request into PAL (the platform's intent representation) before a run.

```bash
curl -X POST http://localhost:3000/api/v1/pal/compile \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "artispreneur",
    "input": "Release my new single on Spotify and Apple Music next month"
  }'
```

### POST /api/v1/npao/classify

Classify a request into the NPAO intent categories used to route work to the right skill.

```bash
curl -X POST http://localhost:3000/api/v1/npao/classify \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "artispreneur",
    "input": "I need a logo for my artist brand"
  }'
```

### GET /api/v1/marketplace/skills?project_id=artispreneur

List the project's purchasable skill catalog: names, descriptions, and prices.

```bash
curl "http://localhost:3000/api/v1/marketplace/skills?project_id=artispreneur"
```

### POST /api/v1/marketplace/purchase

Purchase a skill for a user. In mock mode checkout is simulated; with `STRIPE_SECRET_KEY` set, this creates a real Stripe checkout session.

```bash
curl -X POST http://localhost:3000/api/v1/marketplace/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "artispreneur",
    "skill": "create-an-epk",
    "user_id": "user_123",
    "success_url": "https://myapp.com/success",
    "cancel_url": "https://myapp.com/cancel"
  }'
```

### GET /api/v1/entitlements

List the skills a user has purchased and can run.

```bash
curl "http://localhost:3000/api/v1/entitlements?project_id=artispreneur&user_id=user_123"
```

### POST /api/v1/context/assemble

Build the context pack PAL stage 2 injects into worker prompts. `POST /api/v1/run` calls this internally when a knowledge backend is configured.

```bash
curl -X POST http://localhost:3000/api/v1/context/assemble \
  -H "Content-Type: application/json" \
  -d '{"project_id": "artispreneur", "intent": "how do I register with a PRO?"}'
```

```bash
curl "http://localhost:3000/api/v1/context/assemble?project_id=artispreneur"
```

## Deploy

```bash
vercel login
vercel --prod
```

Then set environment variables in the Vercel dashboard for the project:

- `AI_GATEWAY_API_KEY` — required to go live; without it, runs only work in mock mode.
- `MOCK_MODE=false` — turn off mock mode once real keys are in place.
- Supabase vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, or the equivalents in `.env.example`) — required for real persistence; without them, run history lives in files and does not survive serverless restarts.
- `SUPABASE_SERVICE_KEY` — the service-role key, required for the Context Engine database backend (bypasses RLS for the KB tables).
- `ROSTR_KB_PATH` — enables the local JSON knowledge base (e.g. `./data/kb`); the zero-key way to use the RAG DAL.
- `ROSTR_STORAGE_PATH` — local brain-library root for session memory (default `./storage`); the zero-key way to use the Context Engine loop.
- `STRIPE_SECRET_KEY` — required for real checkout; without it, purchases are simulated.

## Context Engine (session memory)

Every session is saved, compressed, stored, and indexed — in the background, never blocking the agent:

1. **Save** the session as `.md`
2. **Compress** per tier (see below)
3. **Store** in `storage/` — the file path *is* the link
4. **Index** one row in the master brain library (one central index of sessions + sources + links)

The next session pulls the **last** item or **all** items, decompressed on read.

**Continual compression tiers** (by session age), reporting bytes saved:

- **hot** (<7 days) — raw `.md`
- **warm** (<30 days) — gzipped `.md.gz`
- **cold** (>30 days) — extractive auto-summary, then gzipped

**Always-on trigger loop** (`POST /api/v1/run` wires it into every run): when the stream crosses either trigger, the run checkpoints in the background — fire-and-forget, never awaited, never throwing:

- token trigger: emitted tokens ≥ `CONTEXT_CHECKPOINT_TOKENS_PCT` (default 75) of the model window
- time trigger: run streaming ≥ `CONTEXT_CHECKPOINT_MINUTES` (default 30)
- master switch: `CONTEXT_BACKGROUND` (default `true`; set `false` to disable session memory)

**Backends:** `SUPABASE_URL` + key wins (schema: `kb_items` table in `supabase/schema.sql`); otherwise local JSON at `ROSTR_STORAGE_PATH` (default `./storage`): `index.json` plus `sessions/<project>/<id>.md`.

**Endpoints:**

- `POST /api/v1/context/sessions` — save a session (`project_id`, `session_id`, `session_md`, `summary?`)
- `GET /api/v1/context/sessions?project_id=&mode=last|all&limit=` — load sessions, decompressed
- `POST /api/v1/context/compress` — run continual compression for a project; returns `{processed, gzipped, summarized, bytesBefore, bytesAfter, bytesSaved}`

## RAG DAL (research half)

Separate from session memory: ingest URLs or pasted text per project; retrieve the best passages for an intent; inject one context pack into every worker prompt (PAL stage 2 does this automatically in `POST /api/v1/run`). Code: `lib/rostr/rag-dal.ts`; endpoint: `POST /api/v1/context/assemble`.

- **Local (zero keys):** set `ROSTR_KB_PATH`. Files land under `<path>/<project_id>/`. Honest keyword-overlap retrieval.
- **Production:** run `supabase/schema.sql` once in the Supabase SQL editor (pgvector + `kb_sources` / `kb_chunks` / `kb_links` + the `kb_match_chunks` RPC), then set `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, and `AI_GATEWAY_API_KEY` (embeddings via the gateway).
- Every passage carries its source URL and tier (1 = official docs, 2 = reputable press, 3 = everything else). When nothing matches, the pack says so explicitly instead of letting the agent guess.

## How a new project gets its own agent set

1. Create `projects/<id>/project.json` with the project's `agents` and `workspaces`.
2. Drop the project's skill folders into `skills/`, each with its own `manifest.json`.
3. Call the API with `project_id=<id>` — the runtime reads the folder and serves it.

The runtime never gets copied. New projects are data, not code.

## Honest limits

- **Mock mode is scripted.** With `MOCK_MODE=true`, runs return canned fixture responses. It is for wiring and demos, not for real work.
- **JsonHub is file-backed and ephemeral on serverless.** Run history and state written to disk on Vercel (or any serverless host) disappear on cold starts and redeploys. Use Supabase for production persistence.
- **SupabaseHub is a stub.** The Supabase-backed hub interface exists but is not fully implemented yet; do not rely on it until it is wired to real tables.

## Composio integrations

Agents get access to real-world apps (Gmail, Google Calendar, Google Drive, Slack, ...) through Composio, wired into the same tool registry as the built-in file tools. Code: `lib/rostr/tools-composio.ts`.

**Connected-accounts model, in plain words:**

- Each user connects their apps **once** through Composio's own auth flow (on Composio's dashboard, at app.composio.dev). Completing the OAuth flow for an app gives that connection a **connected account id** (looks like `ca_...`).
- The platform stores **only that id** — no OAuth tokens, refresh tokens, or passwords ever live in Rostr. When a run executes a Composio tool, it passes the connected account id along with the request and Composio resolves the credentials on its side.
- To run an agent against a user's connected accounts, pass `composio_account_id` in the `POST /api/v1/run` body. If a different app's account is needed per tool, attach the tools with the account that owns them; multiple accounts can be attached across runs.

**Env var:**

- `COMPOSIO_API_KEY` — your Composio project API key. All Composio REST calls send it as the `x-api-key` header. Keep it server-side; never expose it to clients.

**Endpoints used (Composio REST API v3, base `https://backend.composio.dev/api/v3`):**

- `GET /tools?toolkits=gmail,googlecalendar,...` — discover tools for the configured apps
- `POST /tools/execute/{tool_slug}` — execute a tool; body `{ arguments, connected_account_id? }`, response `{ successful, data, error }`

**Graceful degradation without a key:**

- `composioConfigured()` is false → `listComposioTools()` returns `[]`, `attachComposioTools()` returns `{ configured: false, registered: 0 }`, and `executeComposioTool()` returns an `error: ...` string. Nothing throws, and runs proceed with the built-in file tools only.
- If the Composio API is down mid-run, the tool run returns a clean error string to the worker instead of crashing the run.
- `GET /api/v1/context/compress?project_id=all&cron_secret=` (cron) and the auth-enforced context routes follow the same fail-closed pattern: no `CRON_SECRET` match, or no matching auth, means a 401 and no work done.

## Rostr as a product

Rostr is one shared runtime with a console on top. The dogfood rule: this
console, and the assistant behind it, run on the same `/api/v1/run` pipeline
as everything else — PAL compiles the goal, NPAO triages, workers execute,
the context engine remembers. There is no separate chatbot.

### The 4 setup steps (only Patrick can do these)

1. **Create the Supabase project.** One project at supabase.com. Copy the
   Project URL, the `anon` public key, and the `service_role` secret key.
   What it unlocks: Postgres for runs/messages/artifacts, the KB tables,
   project API keys, and the storage buckets.

2. **Run the SQL.** In the Supabase SQL editor, run `supabase/schema.sql`
   first (enables pgvector, creates the KB tables plus `projects`,
   `api_keys`, `runs`, `messages`, `artifacts`), then `supabase/storage.sql`
   (creates the private `sessions`, `artifacts`, `uploads` buckets and
   their policies). Run each file exactly once.
   What it unlocks: the database and storage the platform reads and writes.

3. **Set env vars in Vercel.** Project → Settings → Environment Variables:
   `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`,
   `AI_GATEWAY_API_KEY` (live models; omit for mock mode),
   `COMPOSIO_API_KEY` (integrations; omit to run without them),
   `CRON_SECRET` (a long random string, for the compression cron).
   What it unlocks: auth enforcement, live model calls, Gmail/Calendar/etc.
   tools, and the nightly compression pass.

4. **Deploy.** `vercel --prod` from this folder. Then add the daily cron in
   the Vercel dashboard (Settings → Cron Jobs): `GET
   /api/v1/context/compress?project_id=all&cron_secret=<CRON_SECRET>`,
   schedule `0 3 * * *`. Keep the secret in the dashboard URL, never in
   `vercel.json`.
   What it unlocks: the hosted platform — console, API, and background
   maintenance.

Local dev needs none of this: with no `SUPABASE_URL` set, the API runs in
dev mode (no auth required) and the console works out of the box with
`npm run dev`.

### Console tour

- `/console` — project picker. Every project on the runtime, with agent and
  skill counts. The header states the dogfood rule outright.
- `/console/[projectId]` — the working view. Left: session sidebar (past
  sessions from the context engine, with compression badges) and the
  artifact list. Center: the chat pane — pick an agent and skill, type a
  goal, watch the real runtime stream thought/action/result events.
- API key field (top of the chat pane): paste a project API key once; it's
  kept in the browser's localStorage and sent as the Bearer token. Leave it
  empty for local dev.

### Auth model

- **Local dev** (no `SUPABASE_URL`): no auth required. `project_id` comes
  from the request, `user_id` defaults to `local-dev`.
- **Hosted**: every `/api/v1` route resolves `project_id` from auth — never
  from the client alone. Two credential types: project API keys (SHA-256
  hash compared against `api_keys`, revoked keys rejected) and Supabase
  JWTs (verified against the Auth API, then checked against project
  ownership). Bad credentials → 401, wrong project → 403.
- The compression cron bypasses user auth with `CRON_SECRET` (timing-safe
  comparison, fail-closed).

### What's real vs. still stubbed

- Real: runtime, PAL, NPAO, JSON hub, session-memory context engine with
  compression tiers, RAG DAL ingest/retrieve, Composio tool execution,
  auth, console, cron wiring, marketplace/entitlement stubs.
- Stubbed: `SupabaseHub` (runs/messages still JSON-backed; the `runs` and
  `messages` tables are ready for the swap), live Stripe checkout,
  per-user storage RLS policies (service-role-only writes for now),
  artifact downloads (the table + listing exist; signed-URL downloads are
  next).

---

## ROSTR Python monorepo track

The sections below come from the repo's earlier Python/FastAPI track (backend, rostr-core library, Docusaurus docs site). Both tracks live in this repo; the TypeScript platform above is the current product surface.

<div align="center">

<img src="https://img.shields.io/badge/ROSTR-Platform-22d3ee?style=for-the-badge" alt="ROSTR Platform">
<img src="https://img.shields.io/badge/license-MIT-34d399?style=for-the-badge" alt="MIT License">
<img src="https://img.shields.io/badge/python-3.10+-a78bfa?style=for-the-badge" alt="Python 3.10+">
<img src="https://img.shields.io/badge/FastAPI-SaaS%20Backend-009688?style=for-the-badge" alt="FastAPI">
<img src="https://img.shields.io/badge/Docusaurus-Docs%20Site-3ECC5F?style=for-the-badge" alt="Docusaurus">

<br><br>

# 🧠 ROSTR Platform — Agent Operating System Monorepo

**Runtime · Orchestration · State · Tools · Reference**

*The full-stack platform powering ROSTR — the production-grade multi-agent operating system. Includes the SaaS backend API, the open-source core library, the documentation site, and deployment configs.*

<br>

[Website](https://rostr-framework.vercel.app) · [API Docs](https://rostr-framework.vercel.app/docs) · [Paper](https://arxiv.org/abs/2604.XXXXX) · [rostr-core on PyPI](https://pypi.org/project/rostr-core)

</div>

---

## 📦 Monorepo Structure

```
rostr-platform/
├── backend/          # FastAPI SaaS API — wraps rostr-core for production use
│   ├── main.py       # App entrypoint, router registration
│   ├── routers/      # PAL, RAG DAL, NPAO, Hub, Stats endpoints
│   ├── db/           # SQLite/persistent database layer
│   └── requirements.txt
├── rostr-core/       # Open-source Python library (pip install rostr-core)
│   ├── src/          # PAL, RAGDAL, NPAO, RostrHub implementations
│   ├── examples/     # Working agent demos
│   ├── tests/        # Test suite
│   └── pyproject.toml
├── pal-site/         # Docusaurus documentation website (deployed on Vercel)
│   ├── docs/         # Markdown documentation pages
│   └── src/          # React components and pages
├── deploy/           # Deployment configs (Railway, Docker, etc.)
└── Dockerfile        # Monorepo Docker build (backend + rostr-core)
```

---

## 🔥 What Is ROSTR?

ROSTR is a **modular agent operating system** — four integrated components that solve the hardest problems in production multi-agent AI:

| Problem | ROSTR Component | What It Does |
|---------|----------------|--------------|
| Prompting bottleneck | **PAL** — Prompt Abstraction Layer | Compiles natural language into precise Agent Manifests via a 5-stage LLM compiler |
| Retrieval brittleness | **RAG DAL** — Dynamic Acquisition Layer | Multi-pass autonomous retrieval with 3-tier source credibility scoring |
| Context loss | **Rostr Hub** | 4-level persistent state (Session → Project → Org → Agent) with knowledge compounding |
| Naive task routing | **NPAO** | Phase-aware orchestration using 5D workflow taxonomy + 4D priority scoring |

```
User Input → PAL (Compiler) → NPAO (Orchestrator) → Agents + RAG DAL + Hub → Output
```

---

## 🚀 Quick Start

### Run the SaaS Backend

```bash
git clone https://github.com/diamitani/rostr-platform.git
cd rostr-platform

# Install dependencies
pip install fastapi uvicorn pydantic

# Start the API server
cd backend
uvicorn main:app --reload
```

API will be live at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Or Use Docker

```bash
docker build -t rostr-platform .
docker run -p 8000:8000 rostr-platform
```

### Install the Core Library Only

```bash
pip install rostr-core
```

```python
from rostr import PALCompiler, NPAO, RAGDAL, RostrHub

pal = PALCompiler()
intent, _, manifest, phase = pal.compile_intent('Research top 3 GTM automation platforms')
print(f'Phase: {phase}, Agent: {manifest.agent_type.value}, Model: {manifest.model}')
```

---

## 🛠 API Endpoints

The `backend/` FastAPI server exposes the full ROSTR stack as a REST API:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/pal/compile` | Compile natural language → Agent Manifest |
| `POST` | `/ragdal/search` | Multi-pass retrieval with credibility scoring |
| `POST` | `/ragdal/ingest` | Ingest knowledge into persistent base |
| `POST` | `/npao/classify` | Classify task into 5D phase + priority score |
| `GET` | `/hub/agents` | List registered agents |
| `POST` | `/hub/agents` | Register a new agent |
| `GET` | `/hub/decisions` | List logged decisions |
| `POST` | `/hub/decisions` | Log a decision |
| `GET` | `/hub/learnings` | List logged learnings |
| `POST` | `/hub/learnings` | Log a learning |
| `GET` | `/hub/compound` | Knowledge compounding report |
| `GET` | `/stats` | Live system stats |

---

## 🏗 Component Deep Dive

### PAL — The LLM Compiler

Transforms raw natural language into structured, reproducible Agent Manifests through 5 deterministic stages:

```
Raw NL Input → Intent Extraction → Context Injection → Semantic Enhancement
             → Runtime Compilation → Output Routing (to NPAO)
```

### RAG DAL — The Knowledge Engine

Iterative multi-pass retrieval with autonomous gap detection and cross-source validation:

- **Tier 1** (credibility 1.0) — Academic: arXiv, PubMed, .gov, journals
- **Tier 2** (credibility 0.75) — Editorial: Reuters, Gartner, McKinsey, trade pubs
- **Tier 3** (credibility 0.40) — Community: Blogs, forums, social media

Passes continue until confidence ≥ 0.8 or all gaps resolved.

### NPAO — The Decision Engine

Routes, prioritizes, and allocates work across agents using:

- **5D Phase Taxonomy**: PreD → Design → Development → Deployment → Debugging
- **4D Priority Formula**: `(Phase_Urgency × 0.35) + (Dependency_Impact × 0.30) + (Business_Impact × 0.25) + (Resource_Efficiency × 0.10)`
- **Orchestration Patterns**: Sequential, Parallel Fan-Out, Aggregation Fan-In, Conditional Branch

### Rostr Hub — Persistent State

```
rostr-hub/
├── projects/{id}/   → README, goals, decisions, architecture, learnings
├── orgs/{id}/       → Identity, ICP, positioning, playbooks
├── teams/{id}/      → Agents, conventions, shared context
└── global/          → Knowledge base, agent templates
```

---

## 📚 Documentation Site

The `pal-site/` directory is a [Docusaurus](https://docusaurus.io/) site deployed to Vercel at [rostr-framework.vercel.app](https://rostr-framework.vercel.app).

```bash
cd pal-site
npm install
npm start        # dev server at localhost:3000
npm run build    # production build
```

---

## 🌐 Deployment

### Backend — Railway

```bash
cd backend
railway up
```

Railway config is at `backend/railway.json`.

### Backend — Docker

```bash
docker build -t rostr-platform .
docker run -p 8000:8000 rostr-platform
```

### Docs Site — Vercel

Deploy `pal-site/` to Vercel. Config is at `pal-site/vercel.json`.

---

## 📊 Research

**"ROSTR: A Unified Architecture for Production-Grade Multi-Agent Systems with Phase-Aware Orchestration and Persistent Knowledge Compounding"**

Patrick Diamitani · April 2026 · 22,000 words · 27 references

- **arXiv**: [2604.XXXXX](https://arxiv.org/abs/2604.XXXXX)
- **Keywords**: multi-agent systems, agent orchestration, RAG, prompt engineering, knowledge management, workflow automation

---

## 🤝 Contributing

This monorepo is MIT-licensed. See [`rostr-core/CONTRIBUTING.md`](rostr-core/CONTRIBUTING.md) for contribution guidelines.

```bash
git clone https://github.com/diamitani/rostr-platform.git
cd rostr-platform/rostr-core
pip install -e ".[dev]"
pytest
```

---

## 📜 License

MIT © Patrick Diamitani, 2026

---

<div align="center">
<b>ROSTR Platform</b> — The full-stack monorepo powering the billion-dollar agent operating system.
<br><br>
<a href="https://rostr-framework.vercel.app">Website</a> · <a href="https://arxiv.org/abs/2604.XXXXX">Paper</a> · <a href="https://github.com/rostr-ai/rostr">rostr-core</a>
</div>
