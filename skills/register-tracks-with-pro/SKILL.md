---
name: register-tracks-with-pro
description: Batch work registration + key sheet entry. Use when the user wants: Register your tracks with a P.R.O.. NPAO N.
allowed-tools: mcp__supabase upsert pro_keysheet
---

# Register your tracks with a P.R.O.

- **Subagent:** @pro-agent
- **Category:** Publishing
- **NPAO:** N
- **List price:** $19
- **Source:** PRO guide

## When to use
Batch work registration + key sheet entry.

## Steps
1. Export catalogue from mcp__supabase
2. Confirm splits
3. Submit works form
4. Update key sheet table

## Outputs
works-registration.csv

## Reference tools
- mcp__supabase upsert pro_keysheet

## Guardrails
Composition vs recording IDs stay distinct.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
