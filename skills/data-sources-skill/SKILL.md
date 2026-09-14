---
name: data-sources-skill
description: "LLM-agnostic data engineering and analytics skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Maia Data Sources — Pull Recipes. Use when working with maia data sources."
---

# Maia Data Sources — Pull Recipes

All bash blocks start with:
```bash
source ~/.claude/skills/maia-chatbot-analyst/scripts/env.sh
```
`hs_get` / `hs_post` wrap curl with the bearer token (same helpers as
hubspot-chatbot-manager). Date math: compute ISO timestamps in ms for HubSpot search
filters (`date -v-7d +%s` × 1000 on macOS).

---

## 1. Conversations / Inbox / Chatflow

Threads in Maia's inbox (paginate with `after`):
```bash
hs_get "/conversations/v3/conversations/threads?limit=100&sort=-id" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(json.dumps(d,indent=2)[:3000])"
```
- Filter client-side to `inboxId == "1736871815"` ("Hubspot Marketing Chatbot" — Maia's
  live inbox, verified 2026-07-15). List all inboxes anytime:
  `hs_get /conversations/v3/conversations/inboxes`. Thread fields: `id`, `createdAt`,
  `status` (OPEN/CLOSED), `latestMessageTimestamp`, `assignedTo`, `associatedContactId`.
- Messages/transcript for a thread: `hs_get /conversations/v3/conversations/threads/{threadId}/messages`
  — message `type` MESSAGE vs COMMENT; `senders[].actorId` `A-` prefix = agent (Maia),
  `V-` = visitor.
- Chatflow config: **no public API** (`/conversations/v3/chatflows/{id}` returns 404,
  verified 2026-07-15). Chatflow/Customer Agent status is UI-only — link Patrick to the
  editor instead of guessing.
- Conversation ↔ contact matching quirks: see project doc `MAIA_CONVERSATION_CONTACT_MATCH.md`.

**Count "conversations handled" for a period** = threads in inbox 1736871815 with
`createdAt` in range. Note: transcript text also gets stamped onto the contact
(`chatbot_transcript`, `maia_chat_summary`), which is often faster for analysis than
walking thread messages.

## 2. Contacts / Leads / MQLs

**Cohort definition (verified live 2026-07-15):** the Maia cohort is
`chatbot_session_id HAS_PROPERTY` — 24 contacts at verification time. The boolean flags
`ai_chatbot_processed` and `chatbot_mql_status` exist in the portal but are **never
populated** by the current n8n workflow (0 contacts each) — do not filter on them.

Maia contacts created in range:
```bash
hs_post "/crm/v3/objects/contacts/search" '{
  "filterGroups":[{"filters":[
    {"propertyName":"chatbot_session_id","operator":"HAS_PROPERTY"},
    {"propertyName":"createdate","operator":"GTE","value":"'"$SINCE_MS"'"}
  ]}],
  "properties":["email","firstname","lastname","company","jobtitle","createdate",
    "lifecyclestage","chatbot_lead_temperature","maia_chat_summary",
    "chatbot_recommended_next_step","chatbot_disqualification_reason","chatbot_countries",
    "chatbot_session_id","chatbot_last_session_date","chatbot_intent_classification"],
  "sorts":[{"propertyName":"createdate","direction":"DESCENDING"}],
  "limit":100}'
```
- **MQLs** = `lifecyclestage EQ marketingqualifiedlead` within the cohort. Secondary
  quality signal: `chatbot_lead_temperature` — actual values are lowercase **`hot` / `low`**
  (not HOT/WARM/COLD).
- Lifecycle stage internal IDs in this portal: `32928931`=Suspect, `58620755`=PQL,
  `59683497`=Unqualified, `1141555748`=Other (full map in project
  `scripts/customer_agent_daily_report.py`).
- Returning visitors: `chatbot_last_session_date` newer than `createdate`.
- `ai_mql_response_1` has data on 514 contacts — that's a broader/legacy AI-touch population,
  not the Maia cohort; don't mix them in the same KPI.

## 3. Meetings booked

```bash
hs_post "/crm/v3/objects/meetings/search" '{
  "filterGroups":[{"filters":[
    {"propertyName":"hs_createdate","operator":"GTE","value":"'"$SINCE_MS"'"}
  ]}],
  "properties":["hs_meeting_title","hs_meeting_start_time","hs_meeting_outcome","hs_createdate"],
  "limit":100}'
```
Attribute to Maia by either (a) meeting associated to a Maia-sourced contact
(walk `/crm/v4/objects/contacts/{id}/associations/meetings` for the §2 cohort — preferred),
or (b) booking via the Maia meeting link `meetings.hubspot.com/{{COMPANY_NAME}}/{{COMPANY_NAME}}-eor-customer-agent`.

## 4. Deals / Revenue / WSEs

Preferred method (proven in `MAIA_DEAL_ATTRIBUTION_REPORT_2026-07-12.md`): start from the
Maia contact cohort (§2), then walk associations:
```bash
hs_get "/crm/v4/objects/contacts/${CONTACT_ID}/associations/deals"
hs_get "/crm/v3/objects/deals/${DEAL_ID}?properties=dealname,amount,dealstage,closedate,createdate,hs_is_closed_won"
```
- WSE count: check the deal's WSE property (verify name via §5 properties call; historical
  docs reference a `wse_count`-style field — confirm before reporting).
- Tier the attribution honestly, like the 2026-07-12 report: **Tier A** = contact created by
  Maia before deal creation (first-touch); **Tier B** = chatbot-engaged contact on an
  existing deal (influence). Never present Tier B as "sourced."

## 5. Lists, Properties, HubSpot Workflows

- Lists (canonical segments, see `reporting-framework.md`): Chatbot Contacts `31302`,
  Companies `31489`, Deals `31488`, MQLs `31487`. Counts:
  `hs_get /crm/v3/lists/{listId}/memberships` (or `/crm/v3/lists/{listId}` for metadata).
- Properties: `hs_get "/crm/v3/properties/contacts/chatbot_mql_status"` (or list all and
  grep `chatbot_|maia_|customer_agent_`).
- Workflows: `hs_get "/automation/v4/flows/1843970484"` (Update Contact) and
  `hs_get "/automation/v4/flows/1842490003"` (MQL Classification). Flow enrollment history
  is not fully exposed via API; for "did it run for contact X" check the contact's property
  history: `hs_get "/crm/v3/objects/contacts/{id}?propertiesWithHistory=lifecyclestage"`.

## 6. Dashboards & Reports

HubSpot's Reports API cannot read arbitrary dashboard data. Be honest about this. Options:
- Link stakeholders to the **Marketing Chatbot master dashboard**
  (https://app.hubspot.com/reports-dashboard/{{HUBSPOT_PORTAL_ID}}/view/21114973) and the named reports
  in `reporting-framework.md` (MQLs by Date/Page, Conversations by Page, Daily
  Conversations, Deals from Chat).
- Recreate the metric from raw pulls (§1–§5) — the normal path for this skill.
- MCP connector (when present): `get_content_analytics_report`,
  `get_campaign_attribution_reports`, `query_crm_data` for aggregate queries.
- Local live dashboard: project `scripts/maia_dashboard_server.py`.

## 7. Property map (audited 2026-07-01 — portal already has ALL of these; never create new ones)

- **Booleans (booleancheckbox, write/read `true`/`false`):** `chatbot_mql_status`, `ai_chatbot_processed`
- **Numbers:** `maia_lead_score`, `maia_headcount`
- **Text/textarea:** `chatbot_transcript`, `chatbot_timeline`, `chatbot_countries`,
  `chatbot_eor_intent`, `chatbot_entity_intent`, `chatbot_wses`,
  `chatbot__eor_workforce_setup` (double underscore), `chatbot_buyer_need`,
  `chatbot_pain_points`, `chatbot_questions_asked`, `chatbot_recommended_next_step`,
  `chatbot_disqualification_reason`, `chatbot_session_id`, `chatbot_last_session_date`,
  `chatbot_intent_classification`, `chatbot_lead_temperature`, `chatbot_mql_email`,
  `ai_mql_response_1`, `maia_chat_summary`, `maia_target_country`,
  `customer_agent_country`, `customer_agent_headcount`, `jobtitle`
- **Enums (exact tokens):** `customer_agent_intent`, `customer_agent_timeline`,
  `customer_agent_qualification_status`, `maia_intent_type`, `maia_timeline`,
  `lifecyclestage` (= `marketingqualifiedlead` when MQL)
- There is **no** `lead_score`, `confidence`, or custom `job_title` property.

## 8. n8n (via /n8n-execution-analyst)

- Instance: `https://{{N8N_INSTANCE_URL}}` · API path `/api/v1` · header `X-N8N-API-KEY`
- Maia MQL Classification workflow: **`SKUv0NlJUsWyNB4Z`**
  (n8n name: "Marketing Chatbot - MQL Classification")
- Always prefer the analyst skill's scripts (ingest → query) over raw curl so history is
  stored and answers stay grounded. Raw check if ever needed:
  `curl -s "$N8N_BASE_URL/api/v1/executions?workflowId=SKUv0NlJUsWyNB4Z&limit=20" -H "X-N8N-API-KEY: $N8N_API_KEY"`
