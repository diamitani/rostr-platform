---
name: knowledge-base-reference-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with {{COMPANY_NAME}} Master Knowledge Base — Reference Guide. Use when working with {{company_name}} master knowledge base."
---

# {{COMPANY_NAME}} Master Knowledge Base — Reference Guide

Last updated: 2026-03-26
Version: 1.0 (post-ingestion, 582 facts)

---

## Active Knowledge Base File

**File name:** `{{COMPANY_FILE}}2026-03-26.xlsx`
**Location:** Workspace folder — `RFP Builder Skill/{{COMPANY_FILE}}2026-03-26.xlsx`
**Total facts:** 582
**Countries covered:** 51
**Source documents ingested:** 226

When a user does not provide their own KB file, reference this as the current master KB. Ask the user to upload it, or confirm it is already in the workspace.

---

## KB Structure — Five Tabs

### Tab 1: {{COMPANY_NAME}} Knowledge (146 facts)
General {{COMPANY_NAME}}-wide facts that apply across all geographies. Covers:
- EOR model and direct-entity structure (no third-party aggregators)
- Platform capabilities (HXM platform, integrations, APIs)
- Security and compliance certifications (SOC 2, ISO 27001, GDPR)
- Service offering breadth (EOR, payroll, benefits, HCM, VGM, HR outsourcing)
- Onboarding and implementation timelines
- SLA commitments
- Pricing and billing model

### Tab 2: Country-Specific Knowledge (436 facts, 51 countries)
Facts scoped to a specific country or region. Each row includes:
- `Country` column — the applicable country name
- `Knowledge Type` = "Country-Specific Knowledge"
- Full Q/A pair, source, owner, review status

Countries with the most facts: Bangladesh, Germany, Philippines, Brazil, India, UK, France, Canada, Australia, Mexico.

### Tab 3: Onspring-Confirmed (213 facts)
Subset of all facts where `Review Status = confirmed` and `Onspring Ready = TRUE`. These are the highest-confidence facts in the KB — verified through Onspring, Azure Blob approved sources, or formal RFP responses. Use these as the authoritative reference when a HIGH confidence answer is needed.

Source collections that feed this tab:
- Azure Blob Storage (approved facts from UniFirst, Citi, Sophos, Pinnacle Group RFPs)
- Onspring country data export (28 countries, full entity + benefits data)

### Tab 4: Country Index (51 countries)
Quick reference table — one row per country. Columns:
- Country name
- Entity name (e.g., "{{COMPANY_NAME}} Bangladesh Pvt Ltd.")
- Operates as EOR (Y/N)
- Can sponsor work permits (Y/N)
- General and country-specific fact counts

### Tab 5: Document Index (226 documents)
Full catalog of all source documents ingested into the KB. Columns:
- Document name, category, format, country (or "Global"), source collection

---

## Source Collections — What Was Ingested

| Collection | Doc Count | Description |
|---|---|---|
| RFP Source Documents | 32 | Formal RFP/questionnaire files: Schaeffler, IPPF, Bangladesh, UniFirst, Citi, Sophos, Pinnacle Group |
| Country Summaries | 18 | Country-level PDF summaries — EOR terms, payroll, benefits, local law |
| Policies & Certifications | 24 | SOC 2, ISO 27001, SLA docs, privacy policies, DPAs |
| Case Studies & Reports | 19 | Customer stories, EOR market reports |
| Benefits Documentation | 14 | {{COMPANY_NAME}} benefit plan docs, flex benefit guides by country |
| Approved Facts (Azure Blob) | 66 | Onspring-approved Q/A facts from live RFP responses (ptsalesgtmstorage / sales-enablement) |
| Country Data (Onspring) | 53 | Structured entity records for 28 countries from Onspring system |

---

## Fact Distribution by Owner

| Owner | Count | Topics |
|---|---|---|
| HRSD | 262 | HR processes, employment terms, benefits, offboarding, local compliance |
| Finance | 134 | Payroll, billing, FX, deposit requirements, invoicing, fees |
| Product | 97 | Platform capabilities, integrations, APIs, certifications, security |
| Implementation | 46 | Onboarding timelines, go-live, CSM model |
| Other | 40 | Legal/contract terms, cross-functional |
| VGM | 3 | Visa, work permits, immigration (expand with dedicated VGM sources) |

---

## Review Status Distribution

| Status | Count | Meaning |
|---|---|---|
| confirmed | 213 | Verified against Onspring or approved source — highest confidence |
| new | 350 | Extracted from RFP/source, not yet formally verified |
| unreviewed | 19 | Flagged for review — potential conflict or ambiguity |

---

## How to Reference the KB in Skill Workflows

### Skill #1 — Adding new facts:
1. Compare new extractions against Tab 1 and Tab 2 first
2. Check Tab 3 (Onspring-Confirmed) for authoritative confirmed answers on the same topic
3. Record the exact source document name matching Tab 5 entries where possible
4. When saving new facts, merge into the master KB and update the date stamp

### Skill #2 — Retrieving answers:
1. **Prioritize Tab 3 (Onspring-Confirmed)** — highest confidence, use for HIGH confidence answers
2. Fall back to **Tab 2** (Country-Specific Knowledge) for geographic questions
3. Fall back to **Tab 1** ({{COMPANY_NAME}} Knowledge) for general questions
4. Skip any fact with `Review Status = unreviewed` or `Conflict Flag ≠ ""` — create HubSpot ticket instead

---

## Known Gaps / Areas for Expansion

- **VGM:** Only 3 facts — significantly underrepresented. Ingest {{COMPANY_NAME}} visa/immigration policy documents.
- **Country name normalization:** Minor variant spellings exist (Côte d'Ivoire variants, Trinidad & Tobago). Tab 4 uses canonical forms.
- **Phase 2 — Onspring write-back:** Facts with `onspring_ready = TRUE` are ready for Onspring API upload (not yet implemented in v1 skill).
- **Azure Blob live sync:** Currently ingested via manual zip download. Phase 2 will add direct Blob SDK integration.
