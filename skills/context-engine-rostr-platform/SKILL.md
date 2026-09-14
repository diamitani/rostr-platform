---
name: context-engine-rostr-platform
description: "LLM-agnostic AI agent development skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Feed the agent a memory. Ingest URLs and text into the project's knowledge base; the Context Engine retrieves the right passages and injects them into every worker prompt. Use when working with feed the agent a memory. ingest."
---

# context-engine

> Feed the agent a memory. Ingest URLs and text into the project's knowledge
> base; the Context Engine retrieves the right passages and injects them into
> every worker prompt.

**Price:** $15 · **Vertical:** developer · **Version:** 1.0.0

## When to use

Any time an agent needs facts that are not in its instructions: product docs,
API references, past decisions, research the project collected. If the worker
would otherwise guess, ingest first.

## Inputs

- `source` (required) — an `https://` URL or pasted text.
- `project_id` (required) — knowledge never crosses projects.
- `tier` — 1 = official docs/APIs, 2 = reputable press, 3 = everything else
  (default). Retrieval prefers lower tiers on ties.
- `intent` — when retrieving: the goal text to match against.

## The flow: ingest → store → retrieve → inject

### 1. Ingest

- URL: fetch (30s timeout), strip to text, extract outbound links into the
  link graph (`kb_links`), chunk into ~500-token paragraphs, store.
- Pasted text: same pipeline minus the fetch. Give it a `title`.
- Same content ingested twice is stored once (content-hash dedupe).

### 2. Store

- **Local (zero keys):** JSON files under `ROSTR_KB_PATH/<project_id>/`.
- **Production:** Supabase tables `kb_sources`, `kb_chunks` (pgvector
  embeddings via the Vercel AI Gateway), `kb_links`. Schema in
  `supabase_schema.sql`. Enable with `SUPABASE_URL` +
  `SUPABASE_SERVICE_KEY`.

### 3. Retrieve

`retrieve(query, project_id, top_k)` returns the best chunks with their
source URL, tier, and score. Local backend uses honest keyword-overlap
scoring; Supabase backend uses cosine similarity on embeddings.

**Gap detection (hard rule):** if nothing scores above the threshold, the
pack says so explicitly — "No stored knowledge matched this intent" — and
the agent must note what is unknown instead of inventing facts.

### 4. Inject

`assemble_pack(intent, project_id)` builds one string: top passages with
tier + source labels, related links from the link graph, and relevant past
decisions from the hub. PAL stage 2 injects it into every compiled prompt.

## Link-following rules

- Max **2 hops** from an ingested source when expanding the graph.
- Same project only — links never pull another project's sources in.
- A link is stored as metadata (URL + anchor text); following it means a
  new ingest, which gets its own tier + provenance row.

## Outputs

- `pack_text` — the injectable context string.
- Provenance on everything: every passage carries its source URL and tier.

## Pairs well with

- Any skill that answers from docs (`release-music-with-dsp`,
  `register-with-pro`, `file-business-taxes`).
- `build-a-skill` — ingest the docs first, then write the skill from them.
