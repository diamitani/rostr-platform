---
name: entity-readiness-execution-health-skill-entity-readiness-execution-health
description: "LLM-agnostic workflow automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to inspect the Atlas Entity Readiness Change Report n8n workflow for execution success, errors, Onspring pull health, delivery completion, baseline writes, and activation state. Use when read-only post-run validation, error triage, or confirming that this specific weekly entity-readiness report is safe to deploy."
---

# Entity Readiness Execution Health

Use this skill only for the Atlas Entity Readiness Change Report. It is read-only: never retry, stop, activate, deactivate, create, update, or delete anything in n8n.

## Project scope

- n8n workflow: `Entity Readiness Change Report - Weekly` (`EirKWJBySSXugv3a`)
- Source: Onspring Report 954
- Baseline table: `entity_readiness_baseline` (`DWg0YxdKbQcNcwtv`)
- Ready statuses: `Ready to Hire Locals` and `Ready to Hire All`

## Run the inspector

Require an approved `N8N_ENTITY_REPORT_API_KEY` environment variable. The script also accepts `N8N_API_KEY` for backward compatibility. Do not print, save, paste, or hard-code the key in this skill.

```bash
export N8N_ENTITY_REPORT_API_KEY="..."
python3 scripts/inspect_execution.py --execution "<execution URL or ID>"
```

The workflow ID is intentionally fixed. The script rejects an execution from any other workflow and calls only `GET /api/v1/workflows/{id}` and `GET /api/v1/executions/{id}?includeData=true`.

## Interpret the result

- Treat `status: success`, `error: null`, and all node errors empty as a successful run.
- Confirm delivery nodes report success, and storage nodes processed the expected number of items.
- Verify `Normalize Readiness` processed the intended country count; inspect `Diff Readiness` for `seeded`, `hadBaseline`, and `changeCount`; then confirm both email nodes and the Data Table upsert completed.
- If `workflow_active` is false, state plainly that a schedule will not run until a human activates it. Do not activate it yourself.
- Cite execution IDs and distinguish facts from inference. Never describe a run as deployed merely because a manual run passed.

## Error handling

Classify failures as authentication, data-shape, source/downstream HTTP, delivery, storage, or unknown. Report the failing node, message, and a safe human action. For missing execution data or unavailable API access, ask for an execution URL or exported JSON rather than using undocumented endpoints.
