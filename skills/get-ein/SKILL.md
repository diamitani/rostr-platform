---
name: get-ein
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Guided IRS EIN packet after entity choice. Use when the user wants to get an e.i.n."
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
