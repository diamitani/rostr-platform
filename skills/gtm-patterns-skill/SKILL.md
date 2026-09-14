---
name: gtm-patterns-skill
description: "LLM-agnostic sales prospecting and go-to-market skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with GTM Architect Patterns — {{COMPANY_NAME}}. Use when working with gtm architect patterns."
---

# GTM Architect Patterns — {{COMPANY_NAME}}

End-to-end workflow patterns that wire Clay + n8n + HubSpot + Amplemarket together.

---

## Table Design Doc Template

When building a Clay table, always produce this first:

```
## Clay Table Design: [Table Name]
**Purpose:** [What this table accomplishes]
**Input:** [What data you start with]
**Output:** [What a rep gets from this table]
**Downstream:** [Where data goes — HubSpot? Amplemarket? n8n webhook?]
**Credit estimate:** [Rough credits per row]

### Column sequence
| # | Column Name | Type | Input | Output | Notes |
|---|------------|------|-------|--------|-------|
| 1 | company_name | text | manual | — | Input |
| 2 | ... | ... | ... | ... | ... |
```

---

## {{COMPANY_NAME}} ICP Definition

Use this when writing Claygent scoring prompts or configuring HubSpot filters:

**Company signals (strong fit):**
- 50–5,000 employees
- Industries: tech/SaaS, fintech, e-commerce, biotech/pharma, professional services, consulting
- Growth signals: Series B+, recent funding, international job postings, offices in 2+ countries
- HQ in US, UK, Canada, Australia, Germany
- Using competitor EOR tools (Deel, Remote, Rippling, Velocity Global) = displacement opportunity

**Contact personas (strong fit):**
- HR/People: CHRO, CPO, VP HR, Head of People, HR Director
- Finance: CFO, VP Finance, Head of Global Finance
- Legal/Compliance: General Counsel, VP Legal
- Operations: COO, VP Operations, Head of Global Ops
- C-suite at <200 employee companies: CEO, Founder, Co-Founder

**Disqualify:** <20 employees, government/public sector, purely domestic ops, existing {{COMPANY_NAME}} customer

---

## Pattern 1: Full Outbound Pipeline (Clay → HubSpot → Amplemarket)

**The complete new prospect workflow.**

### Phase 1: Clay table
Input: company names + websites (from LinkedIn Sales Nav export, conference list, etc.)

```
Column sequence:
1. company_name          [text]
2. website               [text]

3. company_enrich        [company_search, by_domain]
   → employee_count, industry, description, hq_country, tech_stack, funding_stage

4. icp_score             [claygent]
   Prompt: "Score 1-10 how likely {{company_name}} ({{industry}}, {{employee_count}} employees,
   HQ: {{hq_country}}, funding: {{funding_stage}}) would need {{COMPANY_NAME}}'s global Employer of
   Record service to hire internationally without setting up legal entities. {{COMPANY_NAME}} serves
   growth-stage companies expanding across borders. 10 = perfect fit. Return only the number."
   runCondition: {{employee_count}} !== ''

5. competitor_deel        [formula] → {{tech_stack}}.toLowerCase().includes('deel') ? 'Yes' : 'No'
6. competitor_remote      [formula] → {{tech_stack}}.toLowerCase().includes('remote.com') ? 'Yes' : 'No'
7. competitor_rippling    [formula] → {{tech_stack}}.toLowerCase().includes('rippling') ? 'Yes' : 'No'
8. has_competitor         [formula] → {{competitor_deel}} === 'Yes' || {{competitor_remote}} === 'Yes' || {{competitor_rippling}} === 'Yes' ? 'Yes' : 'No'

9. contact_search         [people_search, by_domain]
   Search titles containing: "Head of People" OR "VP HR" OR "Chief People Officer" OR "CHRO"
   → first_name, last_name, email, email_verified, title, linkedin_url
   runCondition: {{icp_score}} >= 6

10. personalized_hook     [claygent]
    Prompt: "Write a 1-sentence cold email hook (max 25 words) for {{contact_first_name}} at
    {{company_name}}. They work in {{industry}} with {{employee_count}} employees based in
    {{hq_country}}. {{has_competitor === 'Yes' ? 'They currently use a competitor EOR tool. Angle
    toward switching to a direct, single-provider model.' : 'Angle toward speed and compliance
    of global hiring.'}} {{COMPANY_NAME}} handles EOR in 160+ countries with no third parties.
    Write only the hook, no greeting or preamble."
    runCondition: {{contact_email}} !== ''

11. outreach_ready        [formula] → {{contact_email_verified}} === true && {{icp_score}} >= 6 ? 'Yes' : 'No'
```

### Phase 2: n8n workflow — Clay → HubSpot upsert

Set up a webhook in n8n triggered by Clay (when `outreach_ready = 'Yes'`):

```
Nodes:
1. Webhook (POST /clay-to-hubspot)
2. IF → icp_score >= 8? → "High Priority" vs "Standard"
3. HTTP Request → POST /crm/v3/objects/companies/batch/upsert (by domain)
4. HTTP Request → POST /crm/v3/objects/contacts/batch/upsert (by email)
5. HTTP Request → POST /crm/v4/associations (link contact to company)
6. HTTP Request → POST /crm/v3/objects/notes (attach AI hook + enrichment summary)
7. IF → has_competitor = 'Yes'? → add tag "competitor-displacement"
```

### Phase 3: n8n workflow — HubSpot → Amplemarket enrollment

Triggered when HubSpot contact is created with lead_status = "NEW":

```
Nodes:
1. HubSpot Trigger (contact property changed: hs_lead_status → NEW)
2. HTTP Request → GET contact details (with clay_ai_hook, icp_score)
3. IF → icp_score >= 8? → "Priority Sequence" vs "Standard Sequence"
4. HTTP Request → POST /contacts (create in Amplemarket)
5. HTTP Request → POST /sequences/{id}/enrollments (enroll with ai_hook as variable)
6. HTTP Request → PATCH HubSpot contact (set hs_lead_status = IN_PROGRESS)
```

---

## Pattern 2: Inbound Lead Enrichment + Routing

**Form fill → enrich → score → route to right rep or sequence.**

### n8n workflow

```
Nodes:
1. Webhook (receives HubSpot form submission)
2. HTTP Request → GET HubSpot contact by email
3. Code node → extract email domain
4. HTTP Request → POST Clay API /rows (add to "Inbound Enrichment" table)
5. Wait node (poll Clay every 30s until enrichment_status = complete, max 5 min)
6. HTTP Request → GET Clay row (enriched data)
7. Code node → parse ICP tier from AI response
8. IF → tier = 'A'? → route to AE
   IF → tier = 'B'? → route to SDR
   IF → tier = 'C/D'? → nurture
9. HTTP Request → PATCH HubSpot contact (update owner, lead_status, custom props)
10. HTTP Request → POST Amplemarket enrollment (if SDR route)
```

---

## Pattern 3: Competitive Displacement Campaign

**Target companies using Deel/Remote/Rippling.**

### Clay table
```
Columns:
1. company_name, website    [text inputs]
2. company_enrich           [company_search] → tech_stack, employee_count, industry
3. uses_deel                [formula] → includes 'deel'
4. uses_remote              [formula] → includes 'remote'
5. uses_rippling            [formula] → includes 'rippling'
6. competitor               [formula] → which one they use (first match)
7. contact_search           [people_search] → HR leader with verified email
8. displacement_hook        [claygent]
   Prompt: "Write a 20-word cold email hook for {{first_name}} at {{company_name}}.
   They currently use {{competitor}} for global employment. {{COMPANY_NAME}} is a 100% direct EOR
   (no aggregators) with guaranteed compliance in 160+ countries. Focus on the risk of
   aggregator models and the switching benefit. Hook only, no greeting."
```

### Amplemarket sequence to use
"Competitive Displacement — EOR Switch" sequence with:
- Email 1: Direct displacement pitch (use ai hook variable)
- Email 2: Risk angle (aggregator compliance risks)
- Email 3: Case study (similar company that switched)
- LinkedIn step: Connect + brief note
- Email 4: Final breakup

---

## Pattern 4: Post-Demo Follow-Up Automation

**Deal moves to "Demo Complete" in HubSpot → auto-generate follow-up assets.**

### n8n workflow
```
Nodes:
1. HubSpot Trigger → dealstage changes to "presentationscheduled" (or your stage ID)
2. HTTP Request → GET deal associations → find contact
3. HTTP Request → GET contact properties (company, title, pain points from notes)
4. HTTP Request → POST Clay API (add row to "Call Prep" table with contact data)
5. Wait for Clay enrichment (poll status)
6. HTTP Request → GET enriched Clay row (news, job postings, AI brief)
7. Code node → compose follow-up email body using AI hook + enrichment
8. HTTP Request → POST HubSpot engagement (log draft follow-up as note)
9. Slack node → notify rep with "Your follow-up draft is ready" + link to deal
```

---

## Pattern 5: Weekly Pipeline Health Check

**Every Monday 8am: check pipeline, flag stale deals, generate rep action lists.**

### n8n workflow (scheduled)
```
Nodes:
1. Schedule Trigger → every Monday 8:00 AM CT
2. HTTP Request → POST HubSpot deals/search (all open deals, last activity > 7 days)
3. Code node → group by owner, calculate days since last activity
4. HTTP Request → GET owner details (email, name)
5. For each owner with stale deals:
   → Slack node → DM rep with their stale deal list + suggested actions
6. HTTP Request → POST HubSpot note on each stale deal (auto-log "Pipeline review flag")
7. Code node → build summary JSON for leadership
8. Slack node → post summary to #gtm-leadership channel
```

---

## Connecting the stack: data field mapping

When data moves between tools, use these field mappings:

| Clay Column | HubSpot Property | Amplemarket Field |
|------------|-----------------|------------------|
| `company_name` | `company` | `company` |
| `website` | `domain` (company obj) | `company_domain` |
| `contact_first_name` | `firstname` | `first_name` |
| `contact_last_name` | `lastname` | `last_name` |
| `contact_email` | `email` | `email` |
| `contact_title` | `jobtitle` | `title` |
| `contact_linkedin` | `linkedin_url` (custom) | `linkedin_url` |
| `icp_score` | `clay_icp_score` (custom) | custom_fields.icp_score |
| `personalized_hook` | `clay_ai_hook` (custom) | custom_fields.ai_hook / sequence variable |
| `has_competitor` | `competitor_tool` (custom) | — |
| `outreach_ready` | triggers n8n webhook | — |
