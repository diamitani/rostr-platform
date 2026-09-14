---
name: rfp-answer-retriever
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with rfp answer retriever. Use when working with rfp answer retriever."
---

# RFP Answer Retriever — Skill #2

This skill retrieves answers for RFP and questionnaire questions from the {{COMPANY_NAME}} knowledge base. It matches questions semantically (not just by keyword), returns answers with confidence levels, flags partial matches for human review, and creates HubSpot tickets for questions the KB cannot answer.

**This skill depends on Skill #1.** It only works as well as the knowledge base it reads from. If a question cannot be answered, that is a signal to use Skill #1 to extract and add the missing fact.

**Embedded Knowledge Base — no upload needed.** The full KB is bundled directly in this skill:

- `references/master_kb_confirmed.json` — **213 Onspring-confirmed facts** (88 KB). **Load this first.** These are the highest-confidence, audit-ready answers. Field key: `q`=question, `a`=answer, `type`, `owner`, `country`, `source`.
- `references/master_kb_facts.json` — **all 582 facts** (209 KB). Load this for broader search coverage when confirmed facts don't yield a match.

Users do NOT need to upload any Excel file to answer RFP questions. The embedded JSON is the production KB. If the user uploads a newer KB file, prefer it — otherwise load from `references/master_kb_confirmed.json` first, then `references/master_kb_facts.json`.

Read `references/knowledge-base-reference.md` for:
- Full KB structure and retrieval priority order
- Countries covered (51) and known coverage gaps

Read `references/matching-rules.md` for how to score and classify matches.
Read `references/hubspot-tickets.md` for how to create HubSpot tickets for KB gaps.

---

## What "success" looks like

| Scenario | What the skill does |
|---|---|
| KB has a clear, direct answer | Returns answer, marks HIGH confidence, cites source |
| KB has a related but not exact answer | Returns with flag + MEDIUM confidence, recommends review |
| KB has answers for multiple partial matches | Returns ranked options, asks user to confirm best fit |
| KB has no relevant answer | States no answer found, creates HubSpot ticket |
| Country-specific question with matching country fact | Returns country-specific answer, notes it is scoped to that country |
| Country-specific question but only general fact exists | Returns general fact with MEDIUM confidence + note |

---

## Workflow

### Step 1 — Understand the input

Determine what the user is providing:

- **Single question**: answer one question from the KB
- **RFP batch**: a list of questions from an uploaded document — process all at once
- **Full document**: parse the full RFP file into questions first, then answer each

If the input is a file, parse it into a numbered question list before proceeding. Use the document parser script:

```bash
python3 scripts/rfp_parser.py \
  --input "RFP - Schaeffler Group.pdf" \
  --output /tmp/questions.json \
  --source-name "Schaeffler Group"
```

Supports: PDF, DOCX, XLSX, TXT. For Excel files, reads each requirement row as a question. For PDFs/Word, extracts question and requirement statements. Output: numbered JSON array.

### Step 2 — Load the knowledge base

The KB is **embedded in this skill** — no file upload required. Load in priority order:

1. **`references/master_kb_confirmed.json`** — 213 Onspring-confirmed facts. Load this first. These are the highest-confidence answers. Skip any with `status != "confirmed"`.
2. **`references/master_kb_facts.json`** — all 582 facts. Load this if confirmed facts don't yield a match. Filter out any fact where `status = "unreviewed"` — these have pending conflicts and should not be used as authoritative answers.

If the user uploads a newer KB file (e.g. `{{COMPANY_FILE}}2026-04-XX.xlsx`), use that in place of the embedded JSON and read Tab 3 (Onspring-Confirmed) first, then Tab 2 (Country-Specific), then Tab 1 ({{COMPANY_NAME}} Knowledge).

### Step 3 — Match each question

For each question, search the KB using the rules in `references/matching-rules.md`. Use the KB matcher script:

```bash
python3 scripts/kb_matcher.py \
  --questions /tmp/questions.json \
  --kb-dir references/ \
  --output /tmp/matches.json
```

The matcher applies the full scoring rubric (Topic 0–3, Country 0–2, Completeness 0–2) and returns ranked candidates. It searches confirmed facts first, then the full KB. If two candidates score within 1 point of each other, both are surfaced as Option A / Option B for user confirmation. Matching priority:

1. **Country-specific exact match** — if the question names a country and a country-specific fact exists for that country and topic, use it first
2. **Country-specific semantic match** — similar topic, same country
3. **{{COMPANY_NAME}} general exact match** — direct keyword/phrase alignment
4. **{{COMPANY_NAME}} general semantic match** — same concept, different phrasing
5. **Partial / adjacent match** — related topic but not a direct answer

### Step 4 — Assign confidence levels

Read `references/matching-rules.md` for the full scoring rubric. Summary:

| Level | Meaning | When to use |
|---|---|---|
| **HIGH** | KB answer directly addresses the question | Direct match, confirmed or new status, country matches if relevant |
| **MEDIUM** | KB answer is related but not precise | General answer for country-specific question; partial topic overlap; "new" status that hasn't been confirmed |
| **LOW** | KB answer is tangentially related | Used only when explicitly flagging for review — never present LOW as an answer |
| **NO MATCH** | Nothing relevant found | Trigger HubSpot ticket creation |

Never present a LOW confidence answer as an answer. If the best match is LOW, treat it as NO MATCH.

### Step 5 — Format the response

For each question, produce a response block:

```
Q: [question as asked in the RFP]

ANSWER: [answer text, ready to paste into RFP]

Confidence: HIGH | MEDIUM
Source: [KB source document]
Owner: [team who owns this fact]
KB Fact: [question as phrased in KB] ← include so reviewer can verify
⚠️ REVIEW NOTE: [only if MEDIUM — explain what to verify] ← omit if HIGH
```

For NO MATCH questions:
```
Q: [question]

NO KB ANSWER FOUND
A HubSpot ticket has been created for this question.
Ticket details: [subject, owner, priority]
```

### Step 6 — Handle batch RFPs

When processing multiple questions at once:

1. Process all questions in sequence
2. After all answers are produced, include a **Coverage Summary** at the top:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RFP COVERAGE SUMMARY — [RFP Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total questions:   [N]
✅ Answered (HIGH): [N]
⚠️  Needs review (MEDIUM): [N]
❌ No answer / Ticketed: [N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then list all answers below.

### Step 7 — Create HubSpot tickets for gaps

For every NO MATCH question, run the ticket creation script:

```bash
python3 scripts/create_hubspot_ticket.py \
  --token "pat-na1-..." \
  --question "The question text" \
  --rfp-source "RFP - [Name]" \
  --suggested-owner "[Product|HRSD|Finance|VGM|Implementation]" \
  --priority "MEDIUM"
```

If the user has not provided an API token in this session, ask for it once before proceeding. Do not attempt to create tickets without a valid token.

If the API call fails, note the failure in the response and provide the ticket details in a formatted block so the user can create it manually.

### Step 8 — Produce the output document (for full RFP processing)

When processing a full RFP (batch mode), run the response builder script to produce a formatted Excel or Word output:

```bash
python3 scripts/build_rfp_response.py \
  --input /tmp/rfp_answers.json \
  --output rfp_response_[name]_[date].xlsx
```

The output workbook includes:
- All questions from the RFP
- Answers (or "No KB Answer" for gaps)
- Confidence levels
- Sources
- Review flags

---

## Accuracy guardrails

- Do not answer a question by combining two partial KB facts unless both are explicitly compatible and the combined answer adds no new information.
- Do not upgrade MEDIUM confidence to HIGH unless the user confirms the match is correct.
- Do not invent qualifiers or caveats that are not in the KB fact.
- Do not present a country-specific answer as a general {{COMPANY_NAME}} answer.
- If the KB contains a conflict-flagged fact, do not use it as an answer. Note that the fact is under review and create a HubSpot ticket instead.
- The answer text should be minimally tailored — adjust pronoun/tense for fit, but do not rephrase the substance.

---

## Output formats

**Single question**: Response block in conversation (no file needed unless requested)
**3–10 questions**: Response blocks in conversation + optional Excel if user asks
**Full RFP (10+ questions)**: Always produce the Excel response document + summary

---

## Full pipeline — one command

For end-to-end processing (parse → match → ticket → export), use the orchestrator:

```bash
python3 scripts/rfp_retriever.py \
  --input "RFP - Schaeffler Group.pdf" \
  --rfp-name "Schaeffler Group" \
  --output rfp_response_schaeffler_20260326.xlsx \
  --kb-dir references/ \
  --token pat-na1-...   # optional — omit to skip ticket creation
```

Or, if questions are already parsed:

```bash
python3 scripts/rfp_retriever.py \
  --questions /tmp/questions.json \
  --rfp-name "IPPF" \
  --output rfp_response_ippf_20260326.xlsx \
  --kb-dir references/
```

The orchestrator runs all 4 steps in sequence and prints a coverage summary on completion.

## Scripts reference

| Script | Purpose | Input | Output |
|---|---|---|---|
| `rfp_parser.py` | Extract questions from RFP files | PDF/DOCX/XLSX/TXT | questions.json |
| `kb_matcher.py` | Score questions against KB, assign confidence | questions.json + KB dir | matches.json |
| `create_hubspot_ticket.py` | Create HubSpot ticket for a single gap | CLI args | Ticket ID or manual block |
| `build_rfp_response.py` | Generate formatted Excel response workbook | matches.json | .xlsx |
| `rfp_retriever.py` | Full pipeline orchestrator (calls all above) | RFP file or questions.json | .xlsx + tickets |

---

## What this skill does NOT do

- It does not draft narrative proposal text or executive summaries — that is for `{{COMPANY_NAME}}-proposal` skill.
- It does not update or write to the knowledge base — that is Skill #1.
- It does not resolve KB conflicts — route those back to Skill #1 for human review.
- It does not write to Onspring directly — Phase 2.
