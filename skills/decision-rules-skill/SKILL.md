---
name: decision-rules-skill
description: "LLM-agnostic developer tooling skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Decision Rules. Use when working with decision rules."
---

# Decision Rules

Reference this file when classifying facts and routing ownership. These rules enforce consistency across all extractions, regardless of source document.

---

## Knowledge Type Classification

### {{COMPANY_NAME}} General Knowledge

A fact belongs in **{{COMPANY_NAME}} General Knowledge** if it describes something that is true across all or most of {{COMPANY_NAME}}'s operating footprint, regardless of which country the prospect is hiring in.

Examples of {{COMPANY_NAME}} General facts:
- {{COMPANY_NAME}}'s direct EOR model (no third-party aggregators)
- The number of countries {{COMPANY_NAME}} operates in (160+)
- Platform capabilities (HXM platform features, integrations, APIs)
- Onboarding timelines (global average, not country-specific)
- Data security certifications (SOC 2, ISO 27001, etc.)
- Contract terms and SLA structure (general)
- Implementation methodology
- Support model (dedicated CSM, 24/7, etc.)
- Global payroll capabilities
- {{COMPANY_NAME}}'s legal entity ownership model

**Classification test:** Would this answer be equally true if the prospect asked about Germany, Brazil, and Singapore all at once? If yes → {{COMPANY_NAME}} General.

---

### Country-Specific Knowledge

A fact belongs in **Country-Specific Knowledge** if it describes something that varies by geography, local law, or country-level operating nuance.

Examples of Country-Specific facts:
- Statutory benefits in a particular country (pension contributions, health insurance mandates)
- Probation period rules by jurisdiction
- Termination notice periods and severance requirements
- Payroll cycle norms (weekly, bi-weekly, monthly) by country
- Local compliance requirements (work permits, tax registration)
- Country-specific onboarding timelines
- Visa and mobility rules
- In-country banking and payment rails
- Specific country availability ("{{COMPANY_NAME}} operates in X via a direct entity")

**Classification test:** Would the answer change if the prospect asked about a different country? If yes → Country-Specific.

**Edge cases:**
- If the document says "{{COMPANY_NAME}} supports X in most countries" without specifying which → {{COMPANY_NAME}} General, but note the caveat in the Answer and set `Review Status = needs_review` until confirmed.
- If the document gives a country list for a feature → split into one {{COMPANY_NAME}} General fact (feature exists) and one Country-Specific fact per region group (or note the geography in the Answer).
- If the document answers a question about one country but the answer is likely globally applicable → keep it as Country-Specific for the named country. Do not promote it to {{COMPANY_NAME}} General without explicit confirmation.

---

## Owner Assignment

Assign one owner per fact. The owner is the team at {{COMPANY_NAME}} best positioned to maintain, verify, and update this fact over time.

| Owner | Owns facts about |
|---|---|
| **Product** | Platform capabilities, integrations, APIs, feature availability, product roadmap, HXM platform, technology certifications, data security |
| **HRSD** | HR processes, onboarding workflows, offboarding, benefits administration, leave management, employee documentation, HR compliance, employment contracts |
| **Finance** | Payroll processing, invoicing, billing, FX/currency handling, tax filings, payroll audits, financial reporting, payment timelines |
| **VGM** | Visa and global mobility, work authorization, immigration support, international transfers, relocation |
| **Implementation** | Onboarding timelines, implementation methodology, data migration, system setup, go-live readiness |
| **Other** | Facts that span multiple owners, commercial/legal terms not clearly owned by one team, or anything truly uncategorized |

**Routing logic:**

1. Read the Answer. What function would an {{COMPANY_NAME}} employee need to call to verify or update this answer? Assign that team.
2. If the answer spans two teams (e.g., payroll + compliance), assign the team that owns the *primary* obligation in the answer. Note the secondary team in `Notes`.
3. If genuinely uncertain, use `Other` and flag `Review Status = needs_review` so a human can correct it.

**Common routing patterns:**

- "Does {{COMPANY_NAME}} withhold taxes in country X?" → Finance
- "How long does onboarding take in country X?" → Implementation (if about setup timeline) or HRSD (if about employee onboarding experience)
- "What benefits are mandated in country X?" → HRSD
- "Does {{COMPANY_NAME}} support HRIS integrations?" → Product
- "Can {{COMPANY_NAME}} support visa sponsorship?" → VGM
- "What is {{COMPANY_NAME}}'s data residency policy?" → Product
- "How does {{COMPANY_NAME}} handle FX conversion?" → Finance
- "Does {{COMPANY_NAME}} provide a dedicated HR contact?" → HRSD
- "What is the termination process in country X?" → HRSD (process) + Finance (final pay) — assign HRSD, note Finance in Notes

---

## Conflict Detection Rules

When comparing a newly extracted fact against the existing knowledge base:

### `confirmed`
New answer is substantively the same as the KB answer. Same meaning, possibly different wording. No action needed beyond noting the source.

**Set when:** The core claim, qualifiers, and scope are equivalent.

### `enrichment`
New answer adds specificity, detail, or a more recent data point to a fact that already exists in the KB, without contradicting it.

**Set when:** New source has a more specific number, a newer date, or an additional qualifier that strengthens rather than conflicts with the existing answer.
**Route to:** The assigned Owner for review and approval before updating.

### `conflict`
New answer is substantively different from the KB answer — different scope, different claim, or direct contradiction.

**Set when:** If both the new answer and the KB answer cannot be true at the same time.
**Route to:** The assigned Owner. Display both answers and both sources in `Notes`. Do not resolve automatically.

### `scope_reduction`
KB says something is generally true; new source says it is only true in specific conditions or geographies.

**Set when:** The KB claims a global capability, but the new source limits it to certain countries or conditions.
**Route to:** The assigned Owner. This is often the most consequential type of discrepancy — a prospect may have been told {{COMPANY_NAME}} can do something that turns out to be scoped.

### `new`
No matching fact exists in the KB. The extracted fact is being proposed for the first time.

**Set when:** No semantically similar question exists in the KB.

---

## Ambiguity Handling

If extraction, classification, or comparison produces genuine uncertainty, always choose the conservative path:

| Situation | Conservative action |
|---|---|
| Not sure if General or Country-Specific | Country-Specific |
| Not sure which owner | Other + needs_review |
| Source text is vague or conditional | Include the qualifier in the Answer, set needs_review |
| New source partially overlaps with two KB facts | Create two rows, each compared to its most likely match |
| The source document contradicts itself | Extract both claims separately, flag both as conflict |
