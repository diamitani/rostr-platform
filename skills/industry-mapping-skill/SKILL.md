---
name: industry-mapping-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Semantic Industry Mapping — Reference. Use when working with semantic industry mapping."
---

# Semantic Industry Mapping — Reference

Source spreadsheets carry industry in countless forms ("Software", "SaaS", "Fintech",
"Computer Software", a NAICS sector, or already-valid HubSpot codes). HubSpot's `industry`
is a fixed dropdown, so anything that doesn't match exactly used to be dropped. The
resolver (`scripts/industry_resolver.py`) maps free text to a **valid HubSpot industry
value** and enriches each company with its **NAICS sector + 2-digit code**.

## Data source

`references/industry_mapping.json`, generated from {{COMPANY_NAME}}'s
`OneDrive/Make.com/Industry Mapping.xlsx` (184 HubSpot industries → NAICS code + sector,
across 22 NAICS sectors). It holds three tables:

- `hubspot_to_naics` — each HubSpot industry → `{naics, sector}` (used for enrichment).
- `sector_defaults` — a default HubSpot industry per NAICS sector (broad-input fallback).
- `synonyms` — curated GTM / data-provider terms → HubSpot industry (Software→
  COMPUTER_SOFTWARE, Fintech→FINANCIAL_SERVICES, etc.).

## Resolution ladder (first confident hit wins)

1. **exact** — already a HubSpot option (validated against the live portal snapshot in
   `hubspot_properties.json`).
2. **synonym** — a curated term match.
3. **fuzzy** — close string match against the canonical 184-industry list (cutoff 0.86;
   handles "Information Technology & Services" → `INFORMATION_TECHNOLOGY_AND_SERVICES`).
4. **sector / naics-code** — input names a NAICS sector label or a 2-digit code → that
   sector's default industry.

Every candidate is then checked against the **live portal options**. If it isn't a real
option there (exact or whitespace/punctuation-only difference), the resolver tries the
NAICS-sector default; if that also isn't a portal option, it returns **unresolved** rather
than guessing — no loose fuzzy guessing against the portal (that once mislabeled
"Manufacturing" as a junk option).

## Where it's applied

- **Formatter** (`format_import.py`, companies only): rewrites the `Industry` column to the
  resolved HubSpot value, preserves the original in `Industry (source)`, and adds
  `NAICS Sector` + `NAICS Code` columns — all on the **extended tab** only (the exact
  template stays the 9 official columns). Unresolved values are kept as-is and flagged in
  `Issues` with their NAICS sector as a hint.
- **Uploader** (`hubspot_upload.py`): resolves `industry` before sending; unmappable
  values are dropped so they can't error the batch (the company still uploads).

## Known portal gap

This portal ({{HUBSPOT_PORTAL_ID}}) has **no generic "Manufacturing" option** — only specific types
(e.g. "Industrial Machinery Manufacturing"). Generic "Manufacturing" therefore resolves to
*unmapped* and is flagged. To fix, add a "Manufacturing" option in HubSpot, then refresh
the snapshot — it will resolve automatically afterward.

## Maintenance

- Refresh the **portal option snapshot** when HubSpot dropdowns change:
  `python3 scripts/refresh_hubspot_props.py`.
- Regenerate the **industry map** if the Make.com workbook changes: re-run the small
  generation step that built `industry_mapping.json` (documented in the build history) or
  edit the JSON directly. Add new GTM synonyms to the `synonyms` table — they take effect
  immediately.

## Test it

```bash
python3 scripts/industry_resolver.py "SaaS" "Fintech" "oil & gas" "Manufacturing" "54"
```
