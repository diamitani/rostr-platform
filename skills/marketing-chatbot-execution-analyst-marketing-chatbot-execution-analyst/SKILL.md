---
name: marketing-chatbot-execution-analyst-marketing-chatbot-execution-analyst
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with marketing chatbot execution analyst. Use when working with marketing chatbot execution analyst."
---

# Marketing Chatbot Execution Analyst

Scoped fork of the n8n Execution Analyst that watches **only the Marketing Chatbot's
workflows**. Every ingest is server-side filtered to the chatbot's n8n workflow, so the
local store never mixes in other automations. Companion skills:
`maia-chatbot-analyst` (business results/reporting) · `hubspot-chatbot-manager` (config) ·
generic `n8n-execution-analyst` (everything else in the n8n instance).

## Scope — the ONLY workflows this skill covers

| System | Workflow | ID / Link |
|---|---|---|
| n8n | Marketing Chatbot \| MQL Classification (14 nodes, active) | `SKUv0NlJUsWyNB4Z` · https://{{N8N_INSTANCE_URL}}/workflow/SKUv0NlJUsWyNB4Z |
| HubSpot | Marketing Chatbot \| Update Contact | flow `1843970484` · https://app.hubspot.com/workflows/{{HUBSPOT_PORTAL_ID}}/platform/flow/1843970484/edit |
| HubSpot | Marketing Chatbot \| MQL Classification | flow `1842490003` · https://app.hubspot.com/workflows/{{HUBSPOT_PORTAL_ID}}/platform/flow/1842490003/edit |

If asked about any other workflow, say it's out of scope here and route to
`/n8n-execution-analyst`.

## Setup

```bash
source ~/.claude/skills/maia-chatbot-analyst/scripts/env.sh   # loads N8N_API_KEY + HUBSPOT_PAT
cd ~/.claude/skills/marketing-chatbot-execution-analyst
python3 scripts/store.py    # one-time DB init (data/executions.sqlite — chatbot-only store)
```

Scoping is baked in: `scripts/ingest.py` defaults `N8N_WORKFLOW_FILTER=SKUv0NlJUsWyNB4Z`
and passes it as a server-side `workflowId` filter. Widen only by exporting a
comma-separated `N8N_WORKFLOW_FILTER` (rarely wanted — prefer the generic skill).

## Routing

| User says… | Do this |
|---|---|
| "pull / refresh chatbot executions" | `python3 scripts/ingest.py` (`--full` backfill, `--limit N` pilot) |
| "run the daily chatbot execution report" | `python3 scripts/run_daily.py` (ingest → alert check → dashboard) |
| any question about chatbot runs, failures, rates, a specific execution | `python3 scripts/query.py "<question>"` — relay the `answer`, cite execution IDs from `data` |
| "chatbot execution dashboard" | `python3 dashboard/build.py` → present `dashboard/index.html` |
| "did conversation/contact X get scored?" | ingest, then query executions around the conversation close time; cross-check the contact's property history: `hs_get "/crm/v3/objects/contacts/{id}?propertiesWithHistory=lifecyclestage"` |
| HubSpot workflow (1843970484 / 1842490003) questions | HubSpot exposes no execution-log API — check flow definition via `hs_get /automation/v4/flows/{id}` and per-contact property history; for anything deeper, link to the flow's History tab in the UI and say so honestly |
| "create an artifact / report / table from execution data" | query the store, then build the artifact (markdown/xlsx/HTML dashboard) — every number from stored executions, cite execution IDs |

## Guardrails (inherited + scoped)

- **Read-only** n8n + HubSpot APIs. GET only. Never activate/deactivate/delete.
- **Chatbot scope only.** Never report on other workflows from this skill.
- **No fabrication.** Answers come from the store (`scripts/query.py`) or live API JSON —
  if data is absent, say so.
- **Secrets from env only** (`N8N_API_KEY`, `HUBSPOT_PAT`). Never print them.
- **Alerts dry-run by default** (`scripts/alert.py`).
- Store is idempotent (upsert on execution ID); safe to re-run anytime.

## What gets captured per execution

Workflow name + ID · start/stop time · status · mode · last node executed · per-node
error + failing node · full node run data (raw JSON) · stop-reason diagnosis · error
category. See `docs/SCHEMA.md`.

## Scheduling

Wire `scripts/run_daily.py` daily 06:00 CT — it feeds the "Automation health" section of
the Maia Daily Digest (see maia-chatbot-analyst
`references/daily-report-workflow-spec.md`, node 6).
