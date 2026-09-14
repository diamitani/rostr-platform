---
name: n8n-execution-analyst
description: "LLM-agnostic workflow automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with n8n execution analyst. Use when working with n8n execution analyst."
---

# n8n Execution Analyst

Monitors every workflow execution in Atlas's n8n instance, stores full history, answers
questions about it, and alerts on failures — without inventing any data. All answers are
computed from stored execution records and cite real execution IDs.

## Setup (one time)
1. Get a valid n8n API key: n8n → **Settings → n8n API → Create an API key** (a long `eyJ...` JWT).
2. Set environment variables before any live run:
   ```bash
   export N8N_API_KEY="eyJ..."                       # required for live pulls
   export N8N_BASE_URL="https://atlas-hxm.app.n8n.cloud"
   # optional alerting (off by default):
   export ALERT_WEBHOOK_URL="https://hooks.slack.com/services/..."
   export ALERT_DRY_RUN="false"                      # only when ready to send real alerts
   ```
3. Initialize: `python scripts/store.py`

## Routing — pick the action from the user's intent

| User says… | Do this |
|---|---|
| "pull / refresh / sync executions", "check n8n now" | `python scripts/ingest.py` (add `--full` for backfill, `--limit N` for a safe pilot) |
| "run the daily report / cycle" | `python scripts/run_daily.py` (ingest → alert check → rebuild dashboard) |
| any question about runs, failures, rates, dates, stalls, a specific execution | `python scripts/query.py "<their question>"` and relay the `answer` |
| "build / open the dashboard" | `python dashboard/build.py` then present `dashboard/index.html` |
| "alert the team / check health" | `python scripts/alert.py` (dry-run unless explicitly enabled) |
| offline demo / no key yet | add `--from-fixtures tests/fixtures` to `ingest.py`, or `--fixtures tests/fixtures` to `run_daily.py` |

After running a query script, **read the JSON it prints and answer the user in plain
language**, quoting the execution IDs / counts from the `data` field. Never state a number
that isn't in that output.

## What gets captured per execution
Workflow name + ID · execution date/time · status · mode · last node executed (where it
stopped) · per-node error message + failing node · full node run data + raw JSON (in the
`executions.raw_json` column and `node_runs` table) · stop-reason diagnosis · error category.

## Hard guardrails (do not violate)
- **Read-only n8n API.** Only GET. Never call DELETE/activate/deactivate.
- **Secrets from env only.** Never print, log, hardcode, or commit `N8N_API_KEY`.
- **No fabrication.** Absent fields are stored/returned as null. If the store has no data
  for a question, say so — never guess.
- **Alerts are dry-run by default.** Confirm with the user before setting `ALERT_DRY_RUN=false`.
- **Idempotent.** Re-running ingestion never duplicates executions (upsert on execution ID).

## Modules
`scripts/store.py` (SQLite DAL, Postgres-ready) · `scripts/parse.py` (extractor) ·
`scripts/diagnose.py` (stop-node + reason, recurring, stalls) · `scripts/ingest.py`
(n8n API client) · `scripts/query.py` (grounded NL query) · `scripts/alert.py` (notifier) ·
`dashboard/build.py` (HTML) · `scripts/run_daily.py` (orchestrator).

## Example questions this answers
- "How many times did Clay → HubSpot Sync fail today?"
- "Why did execution 1003 fail?"
- "What's our n8n success rate this week?"
- "Any recurring failures?"
- "Which active workflows have stopped running?"

## Scheduling
Wire `scripts/run_daily.py` to a daily 06:00 CT scheduled task. Safe to run any time.

See `docs/` for README, schema, and the alert runbook.
