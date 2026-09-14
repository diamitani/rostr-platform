---
name: entity-readiness-baseline-analyst
description: "LLM-agnostic workflow automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to analyze the {{COMPANY_NAME}} Entity Readiness Change Report baseline from an exported CSV or a run of its specific n8n workflow. Use when a user asks about the entity_readiness_baseline table, ready-country totals, status changes, baseline coverage, or Entity Readiness execution results without changing…."
---

# Entity Readiness Baseline Analyst

Use this skill only for the {{COMPANY_NAME}} Entity Readiness Change Report, read-only. It supports two reliable sources:

1. A CSV downloaded from the n8n Data Tables UI.
2. An execution URL or ID containing the workflow's Data Table and normalization outputs.

Project scope: workflow `EirKWJBySSXugv3a`, table `entity_readiness_baseline` (`DWg0YxdKbQcNcwtv`), source Onspring Report 954. Do not edit a Data Table, create a workflow, or use undocumented internal n8n routes. This Cloud instance currently does not expose Data Table rows through its public API.

## Analyze a CSV

```bash
python3 scripts/analyze_baseline.py --csv "/absolute/path/entity_readiness_baseline.csv"
```

The CSV should contain `country`, `ready`, and optionally `status` and `updated_at`. The script reports row count, unique countries, ready/not-ready counts, readiness-status counts, and timestamp coverage.

## Analyze the latest execution

```bash
export N8N_ENTITY_REPORT_API_KEY="..."
python3 scripts/analyze_baseline.py --execution "<execution URL or ID>"
```

It rejects executions from other workflows, then calls only `GET /api/v1/executions/{id}?includeData=true` and summarizes the normalized output, baseline/diff state, report subject, and storage output count.

## Answer questions

Translate the JSON into direct answers. State the source used and any missing evidence. For Entity Readiness, define ready as exactly `Ready to Hire Locals` or `Ready to Hire All`; never infer readiness from another status. A seeded baseline means there was no prior comparison, so zero reported changes is expected.
