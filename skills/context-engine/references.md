# Context Engine — operator references

## Tier scoring (what each tier means in practice)

- **Tier 1 — official docs / APIs.** The vendor's own documentation, API
  references, changelogs, terms of service. Treat as authoritative unless
  contradicted by a newer tier-1 source (check `fetched_at`).
- **Tier 2 — reputable press / established publications.** Major outlets,
  industry trades, peer-reviewed or editorially reviewed work. Trust but
  verify numbers against tier 1 where possible.
- **Tier 3 — everything else.** Blogs, forums, social posts, pasted notes.
  Useful for leads and color; never the sole basis for a factual claim the
  user will act on.

When two passages conflict, the lower tier wins. When tiers tie, the newer
`fetched_at` wins. Record the conflict in the pack so the agent can surface
it instead of silently picking.

## Gap detection

The pack must distinguish three states:
1. **Matched** — passages above threshold: inject them.
2. **Weak match** — passages exist but score low: inject with a
   "low confidence" flag on the pack.
3. **No match** — nothing above threshold: inject the explicit
   no-knowledge notice. The agent then says what it doesn't know and,
   if the run allows it, proposes what to ingest next.

Never let state 3 look like state 1. A confident-sounding answer built on
no sources is the failure this module exists to prevent.

## Chunking notes

- ~500 tokens (~2,000 chars) per chunk, split on paragraph boundaries.
- Oversized single paragraphs are hard-split; nothing is dropped silently.
- Each chunk stores `chunk_index` so passages can be reassembled in order.

## Embeddings (Supabase backend)

- Model: `openai/text-embedding-3-small` via the Vercel AI Gateway,
  1536 dimensions, matching `vector(1536)` in the schema.
- The query is embedded with the same model at retrieval time.
- If the gateway key is missing, ingest/retrieve raise a clear error —
  they never silently store chunks without embeddings.

## Link graph

- `kb_links` records every outbound link found during ingest: source,
  destination URL, anchor text, discovery time.
- The graph answers "what else did our sources point at" without
  re-fetching. Following a link = a new ingest with its own provenance.
- 2-hop max keeps expansion bounded; project scoping keeps it clean.

## Env vars

| Var | Backend | Purpose |
|---|---|---|
| `ROSTR_KB_PATH` | JSON | Directory for local knowledge files |
| `SUPABASE_URL` | Supabase | Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase | Service-role key (bypasses RLS) |
| `AI_GATEWAY_API_KEY` | Supabase | Embeddings via the gateway |

Supabase wins when fully configured; JSON when only `ROSTR_KB_PATH` is set;
inactive when neither is set (PAL falls back silently).
