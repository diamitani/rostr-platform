---
name: output-spec-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Output Specification. Use when working with output specification."
---

# Output Specification

This document defines the exact structure of the two-tab Excel workbook produced by this skill.

---

## Workbook Structure

**File name:** `{{COMPANY_FILE}}

**Tab 1: {{COMPANY_NAME}} Knowledge**
All rows where `knowledge_type = "{{COMPANY_NAME}} General Knowledge"`

**Tab 2: Country-Specific Knowledge**
All rows where `knowledge_type = "Country-Specific Knowledge"`

---

## Column Schema (both tabs)

| # | Column Name | Type | Description |
|---|---|---|---|
| 1 | **Question** | Text | Neutral, reusable question phrasing. Should be answerable by the Answer in this row. |
| 2 | **Answer** | Text | Source-grounded answer. Include qualifiers. 1–4 sentences max. |
| 3 | **Knowledge Type** | Enum | `{{COMPANY_NAME}} General Knowledge` or `Country-Specific Knowledge` |
| 4 | **Owner** | Enum | `Product` / `HRSD` / `Finance` / `VGM` / `Implementation` / `Other` |
| 5 | **Country** | Text | Country name if Country-Specific. Leave blank for {{COMPANY_NAME}} General. |
| 6 | **Source** | Text | Name of the source document or ticket (e.g., "RFP - Schaeffler Group", "HubSpot Ticket #12345") |
| 7 | **Review Status** | Enum | See values below |
| 8 | **Conflict Flag** | Enum | See values below |
| 9 | **Notes / Reviewer Comment** | Text | Auto-populated context for conflicts. Also used for human reviewer comments post-delivery. |
| 10 | **Date Extracted** | Date | Date this row was generated (YYYY-MM-DD) |
| 11 | **Onspring Ready** | Boolean | `TRUE` once a human has reviewed and approved. Default: `FALSE` for needs_review, `TRUE` for confirmed/new facts that passed extraction. |

---

## Review Status Values

| Value | Meaning |
|---|---|
| `new` | No matching fact in the existing KB. Proposed for first-time addition. |
| `confirmed` | Matches an existing KB fact. Source confirmed the answer. No change needed. |
| `needs_review` | Ambiguous classification, uncertain owner, conditional answer, or weak source. Requires human judgment before acceptance. |

---

## Conflict Flag Values

| Value | Meaning |
|---|---|
| *(blank)* | No conflict detected |
| `enrichment` | New fact adds detail to an existing KB fact without contradicting it |
| `conflict` | New fact contradicts an existing KB fact |
| `scope_reduction` | New fact narrows the scope of an existing KB fact (e.g., General → Country-Specific) |

---

## Notes Field Format (auto-populated for conflicts)

When a conflict is detected, auto-populate the `Notes` field in this format:

```
[CONFLICT TYPE: conflict | enrichment | scope_reduction]

EXISTING KB ANSWER:
"[existing answer text]"
Source: [existing KB source]

NEW PROPOSED ANSWER:
"[new answer text]"
Source: [new source document]

REASON FOR FLAG:
[1–2 sentence explanation of why this was flagged]

RECOMMENDED REVIEWER: [Owner]
```

For `new` facts with no conflict, leave `Notes` blank or include a brief extraction note.

---

## Formatting Rules

- Header row: bold, dark blue background (#1A2E5A), white text
- Tab 1 header accent: {{COMPANY_NAME}} blue (#0057B8)
- Tab 2 header accent: teal (#007C7C) to visually distinguish country-specific rows
- Row height: auto (wrap text enabled)
- Column widths:
  - Question: 45
  - Answer: 65
  - Knowledge Type: 25
  - Owner: 18
  - Country: 18
  - Source: 28
  - Review Status: 18
  - Conflict Flag: 18
  - Notes: 55
  - Date Extracted: 16
  - Onspring Ready: 16
- Freeze top row on both tabs
- Conflict rows (Conflict Flag != blank): light yellow fill (#FFFACD) for easy visual scanning
- needs_review rows: light orange fill (#FFF0D9)

---

## Onspring Compatibility Notes

When the operations team is ready to upload from Excel to Onspring:

- The `Question` column maps to the Onspring "Task Name" or fact title field
- The `Answer` column maps to the primary response body
- The `Owner` column maps to the Onspring owner/assignee field
- The `Country` column maps to the geography tag
- `Knowledge Type` maps to the category field
- `Onspring Ready = TRUE` is the filter criterion for the upload batch
- `Review Status` and `Conflict Flag` are internal workflow fields — they may not have direct Onspring equivalents in v1

This workbook is designed so that an ops team member can filter `Onspring Ready = TRUE` and paste/import the matching rows without additional transformation.
