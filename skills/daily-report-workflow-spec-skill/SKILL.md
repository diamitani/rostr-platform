---
name: daily-report-workflow-spec-skill
description: "LLM-agnostic workflow automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Spec — Maia Daily Report Workflow (hand to /n8n-engineer). Use when working with spec."
---

# Spec — Maia Daily Report Workflow (hand to /n8n-engineer)

**Goal:** every morning 07:00 CT, deliver a digest of yesterday's Maia activity to Patrick
(+ optional stakeholder distribution): all conversations, contacts created, and a table of
conversation · associated contact · conversation summary · MQL result · next step — the same
shape the MQL Classification workflow (`SKUv0NlJUsWyNB4Z`) captures per-conversation, rolled
up daily.

**Starting assets (reuse, don't rebuild):**
- `n8n_customer_agent_daily_reporter.json` (project dir) — prior daily reporter draft; audit
  and extend rather than starting blank.
- `scripts/customer_agent_daily_report.py` (project dir) — working pull/aggregation logic
  (intent map, lifecycle map) to port into n8n Code nodes.
- Credentials: existing HubSpot credential in the {{COMPANY_NAME}} n8n instance (same one
  `SKUv0NlJUsWyNB4Z` uses). No new secrets in workflow JSON.

**Nodes (suggested):**
1. **Schedule Trigger** — daily 07:00 America/Chicago.
2. **HubSpot: threads pull** — Conversations API, inbox `1736871815` ("Hubspot Marketing
   Chatbot"), createdAt within
   yesterday (00:00–24:00 CT). Paginate.
3. **HubSpot: contacts pull** — contacts search `chatbot_session_id HAS_PROPERTY` AND
   (`createdate` OR `chatbot_last_session_date` within yesterday). Properties: email, name,
   company, jobtitle, lifecyclestage, chatbot_lead_temperature (values `hot`/`low`),
   maia_chat_summary, chatbot_recommended_next_step, chatbot_disqualification_reason,
   chatbot_session_id.
4. **Code: join** — match threads ↔ contacts via `chatbot_session_id` / thread
   associatedContactId (fallback rules in `MAIA_CONVERSATION_CONTACT_MATCH.md`).
5. **Code: KPIs** — conversations, leads created, MQLs, unmatched conversations; deltas vs.
   prior day (store prior day totals in workflow static data).
6. **n8n API self-check (optional but wanted):** GET
   `/api/v1/executions?workflowId=SKUv0NlJUsWyNB4Z&status=error` for yesterday → "Automation
   health" line + gaps list.
7. **Format** — HTML email table + plain-text fallback. Columns: Thread ID (linked to
   HubSpot inbox) · Contact (linked) · Company · Summary · Temp · MQL · Next step. Sections:
   KPIs → table → Gaps/Failures.
8. **Deliver** — email to pdiamitani@{{COMPANY_FILE}} (Microsoft 365 / SMTP credential already
   in instance if present; else HubSpot single-send). Optional Slack later.
9. **Error handling** — n8n error workflow or try/catch: on failure, send a short "report
   failed: <node>: <error>" email instead of silence.

**Constraints:** read-only against HubSpot (search/GET only) · idempotent per day ·
timezone America/Chicago everywhere · no PII beyond what HubSpot already holds · workflow
name: `Marketing Chatbot | Send Daily Report` (matches the reporting framework's naming
convention and its "Send Daily Report - n8n" entry).

**HubSpot-native alternative (if Patrick prefers):** scheduled dashboard email of Maia
report lists + a HubSpot workflow on a daily-enrolling list — but note HubSpot cannot
render the joined conversation/contact/summary table; n8n is the recommended path.
