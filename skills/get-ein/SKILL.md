---
name: get-ein
description: Guided IRS EIN packet after entity choice. Use when the user wants: Get an E.I.N.. NPAO N.
allowed-tools: mcp__google_drive upload
---

# Get an E.I.N.

- **Subagent:** @legal-setup
- **Category:** Legal
- **NPAO:** N
- **List price:** $19
- **Source:** How To Incorporate Your Brand.docx

## When to use
Guided IRS EIN packet after entity choice.

## Steps
1. Confirm legal name and entity
2. Identify responsible party (offline)
3. Draft SS-4
4. File at IRS.gov EIN
5. Save EIN letter to Drive

## Outputs
ss4-draft.md, ein-checklist.md

## Reference tools
- WebFetch irs.gov EIN online
- mcp__google_drive upload

## Guardrails
Never store SSN/ITIN. Not legal advice.

## Parent handoff
Summarize artifacts + blockers. If a dependent skill/capability is missing, name it and stop.
