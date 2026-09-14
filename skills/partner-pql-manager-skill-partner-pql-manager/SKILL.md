---
name: partner-pql-manager-skill-partner-pql-manager
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with partner pql manager. Use when working with partner pql manager."
---

# Partner PQL Workflow Manager

This skill manages Atlas HXM's Partner Qualified Lead (PQL) automation — the n8n workflow that intercepts partner form submissions, classifies them by type (Referral / Reseller / Alliance), routes valid leads to Melissa's HubSpot task queue, and generates partnership-specific follow-up emails.

## Source Files

All workflow files live at:
```
/Users/pdiamitani/Documents/Atlas/partner workflow automation/
├── Partner-PQL-Workflow.json          ← importable n8n workflow (main artifact)
├── Partner-PQL-Project-Brief.md       ← full project context + ownership matrix
├── Partner-PQL-Asana-Project.md       ← task breakdown for team
├── Partner-PQL-Workflow-Diagram.md    ← Mermaid diagrams + node map
├── Partner-PQL-n8n-Build-Guide.md     ← agent build + configuration guide
└── Inbound Automation Workflow.json   ← existing MQL workflow (reference)
```

**Always read `Partner-PQL-Workflow.json` first** before making any changes to the workflow.
**Always read `Partner-PQL-Project-Brief.md`** for full context on what was agreed and what's pending.

---

## System Architecture

### Two-Workflow Model

| Workflow | Trigger | Handles | Owner |
|---------|---------|---------|-------|
| **Inbound MQL** (existing) | Contact Us form webhook | Sales, Career, Support, Press, General | Existing n8n |
| **Partner PQL** (new) | Partner form webhook | All partner form submissions | This skill |

The two workflows are **independent**. Contact Us form → MQL. Partner form → PQL.

The contact-us form redirects to the partner form when "Partner Channel Inquiry" is selected (Rocco manages the form side).

### PQL Workflow — Node Chain

```
Webhook → AI Classify Partner Type → Code: Set PQL Data → IF Valid?
  ├─ YES → Update Partner Props (HubSpot) → Set Lifecycle PARTNERSHIP → Create Task Melissa → Generate Partner Email → Update PQL Response
  └─ NO  → Update Non-Partner Contact (General Enquiry, no task)
```

### HubSpot Lifecycle Value
- PARTNERSHIP lifecycle: `58620755`
- MQL lifecycle: `marketingqualifiedlead`
- OTHER lifecycle: `1141555748`

---

## Partner Type Definitions (Amanda Stelle, 4/17/26)

| Type | HubSpot Value | Definition |
|------|--------------|-----------|
| **Referral Partner** | `referral_partner` | Mutual referral relationship — they refer business to Atlas and/or Atlas refers to them. Goal is gap-filling. Neither party is buying from the other. |
| **Reseller Partner** | `reseller_partner` | Resells Atlas EOR/payroll/compliance services to their own end clients. They become Atlas's direct client. Sometimes described as "white label." |
| **Alliance Partner** | `alliance_partner` | Platform/ecosystem integrations — HRIS (BambooHR, Workday), ATS, payroll software, HR tech companies wanting a formal Atlas integration. |

**Vendor Pitch (NOT a partner):** If someone is offering their own services TO Atlas (staffing, marketing, SaaS, appointment setting, lead gen) — classify as General Enquiry, no task.

---

## What "success" looks like

| Scenario | What the skill does |
|----------|-------------------|
| Build/import workflow | Load JSON, configure Melissa's owner ID, re-link credentials, register webhook |
| Update partner definitions | Edit `Analyze Partner Type` AI prompt in workflow JSON; update definitions section |
| Tune email tone | Edit `Generate Partner Email` AI prompt in workflow JSON |
| Add new partner type | Add to definitions in prompt + add to `partnerTypeMap` in Code node + add HubSpot property value |
| Debug misrouted lead | Read execution log in n8n; trace AI JSON output + Code node output; identify prompt failure |
| Generate test cases | Create curl commands for each partner type + vendor pitch edge cases |
| Audit HubSpot contacts | Query HubSpot for contacts with `partner_type` set; check lifecycle = PARTNERSHIP |
| Update Melissa's owner ID | Find ID in HubSpot settings; update `Create HubSpot Task - Melissa` node jsonBody |

---

## Workflow

### Step 1 — Understand the request

Determine what mode the user is in:

- **Build**: Import workflow from JSON → configure → activate → register webhook
- **Update**: Modify a specific node (prompt, code, HubSpot property, owner ID)
- **Debug**: Analyze a misrouted lead or failed execution
- **Test**: Generate and validate test submissions
- **Audit**: Review HubSpot contacts processed by the workflow

### Step 2 — Load current workflow state

Always read `Partner-PQL-Workflow.json` before making changes. Parse:
- Current AI prompt in `Analyze Partner Type` node
- Current Code logic in `Code: Set PQL Data` node
- Current Melissa owner ID in `Create HubSpot Task - Melissa` node
- Active/inactive state

### Step 3 — Execute the task

#### For BUILD mode:

Follow Phase 1–8 in `Partner-PQL-n8n-Build-Guide.md`:
1. Verify credentials (Azure OpenAI `xIKG420jsjpPsAPM`, HubSpot `EZyv5jdmdlvyEf3Z`)
2. Verify/create HubSpot properties: `ai_pql_response_1`, `pql_confidence`, `pql_classification_reason`
3. Get Melissa's HubSpot owner ID from HubSpot > Settings > Users
4. Import `Partner-PQL-Workflow.json` into n8n
5. Replace `REPLACE_WITH_MELISSA_HUBSPOT_OWNER_ID` with real ID
6. Re-link all credentials in n8n
7. Activate workflow → copy webhook URL
8. Register webhook URL on HubSpot partner form (coordinate with Rocco)
9. Run 3 test submissions (Referral, Reseller/Alliance, Vendor Pitch)
10. Verify HubSpot contact updated + task created

#### For UPDATE (prompt tuning) mode:

1. Read current prompt from the target node in `Partner-PQL-Workflow.json`
2. Identify what needs changing (new partner type, better examples, clearer rules)
3. Edit the prompt in the JSON file
4. Summarize the change and what behavior it should improve
5. Provide a test case that validates the new behavior

When updating `Analyze Partner Type` prompt:
- Keep output format strict: `{"is_valid_partner": true, "partner_type": "...", "confidence": "...", "reason": "..."}`
- Always include all 3 valid partner types in definitions
- Always include vendor pitch exclusion rule explicitly
- Add concrete examples for any new or edge-case types

#### For DEBUG mode:

1. Ask for the contact email or execution ID
2. If you have n8n API access: fetch the execution log
3. Parse the AI output from `Analyze Partner Type` → was JSON valid?
4. Check `Code: Set PQL Data` output → was `isValidPartner` set correctly?
5. Check IF node routing → did it go true or false branch?
6. Identify the failure point and propose a fix (prompt change, code fix, or credential issue)

Common failure patterns:
- AI outputs markdown-wrapped JSON → add "No markdown code blocks" to prompt
- `vid` is null on task creation → contact wasn't upserted; add explicit HubSpot Get Contact before task
- Lifecycle not updating → contact already at higher stage; this is expected HubSpot behavior
- Vendor pitch routed as valid partner → add more vendor signal examples to exclusion rules in prompt

#### For TEST mode:

Generate curl commands for each scenario. Test in this order:
1. Clear Referral Partner (should classify HIGH confidence)
2. Reseller Partner with white-label language
3. Alliance Partner with platform integration language
4. Ambiguous — no partner_type selected, vague message (should default to valid, LOW confidence)
5. Vendor pitch — should classify as invalid, route to non-partner path
6. Mismatched — form says Referral but message describes reselling

#### For AUDIT mode:

Generate HubSpot API queries:
```
GET contacts with partner_type IS KNOWN
GET contacts with lifecyclestage = 58620755 (PARTNERSHIP)
GET contacts with ai_pql_response_1 IS KNOWN
```

Summarize: total PQLs, type breakdown (referral/reseller/alliance), any with `pql_confidence = LOW` that need review.

### Step 4 — Update source files

After any change to the workflow:
1. Update `Partner-PQL-Workflow.json` with the new node content
2. If partner definitions changed, update the definitions table in `Partner-PQL-Project-Brief.md`
3. If new HubSpot properties added, update the configuration table in `Partner-PQL-Workflow-Diagram.md`

### Step 5 — Verify

After any change:
- If prompt updated → generate a test case and show expected vs actual classification
- If Code node updated → trace the logic manually with a sample input
- If workflow rebuilt → run the 3 standard test submissions

---

## Configuration Reference

| Item | Value | Location |
|------|-------|---------|
| Azure OpenAI credential ID | `xIKG420jsjpPsAPM` | Both AI agent nodes |
| HubSpot credential ID | `EZyv5jdmdlvyEf3Z` | All HubSpot nodes + HTTP Request |
| PARTNERSHIP lifecycle | `58620755` | Code: Set PQL Data → `PARTNERSHIP_LIFECYCLE` const |
| Webhook path | `partner-pql-form` | Get Partner Form Submission node |
| Melissa owner ID | `REPLACE_WITH_MELISSA_HUBSPOT_OWNER_ID` | Create HubSpot Task - Melissa → jsonBody |
| HubSpot task type | `TODO`, status `NOT_STARTED`, priority `HIGH` | Create HubSpot Task - Melissa |
| Partner email stored in | `ai_pql_response_1` | Update PQL Response node |
| Processed flag | `ai_processed = true` | Update PQL Response node |

---

## Related Context

- **Meeting where this was designed:** April 17, 2026 — Kristen Stache, Patrick Diamitani, Rocco Paradiso, Amanda Stelle
- **Melissa:** owns the 24hr SLA qualification call for all PQLs
- **Rocco:** owns HubSpot form changes + property audit + multi-language updates
- **Amanda Stelle:** partnerships lead — source of truth for partner type definitions
- **MQL workflow (parallel):** `Inbound Automation Workflow.json` — handles Contact Us form, unchanged by this project except for prompt definition refresh
- **HubSpot audit required** before renaming `reason_for_contact` property value from "alliance partner channel" → "partner channel inquiry" — Rocco leads this
