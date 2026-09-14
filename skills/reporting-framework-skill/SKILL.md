---
name: reporting-framework-skill
description: "LLM-agnostic data engineering and analytics skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Marketing Chatbot — Reporting Framework (Patrick's canonical asset registry, 2026-07-15). Use when working with marketing chatbot."
---

# Marketing Chatbot — Reporting Framework (Patrick's canonical asset registry, 2026-07-15)

The reporting framework = **Segments** (contact & company lists) + **Workflows** (HubSpot
and n8n) + **Reports** (plus master dashboard). Execution detail comes from the
`marketing-chatbot-execution-analyst` skill. When a stakeholder asks for a metric that one
of these assets already answers, LINK the asset first, then offer a live pull.

## Segments (HubSpot lists — use for counts via `/crm/v3/lists/{listId}/memberships`)

| List ID | Name | Link |
|---|---|---|
| 31302 | Chatbot Contacts (Total Contacts Created) | https://app.hubspot.com/contacts/{{HUBSPOT_PORTAL_ID}}/objectLists/31302/filters |
| 31489 | Chatbot Companies (Total Companies Created) | https://app.hubspot.com/contacts/{{HUBSPOT_PORTAL_ID}}/objectLists/31489/filters |
| 31488 | Chatbot Deals (Total Contacts in Deal Stage) | https://app.hubspot.com/contacts/{{HUBSPOT_PORTAL_ID}}/objectLists/31488/filters |
| 31487 | Chatbot MQLs (Total MQLs) | https://app.hubspot.com/contacts/{{HUBSPOT_PORTAL_ID}}/objectLists/31487/filters |

## Workflows

| System | Name | ID / Link |
|---|---|---|
| HubSpot | Marketing Chatbot \| Update Contact | flow `1843970484` · https://app.hubspot.com/workflows/{{HUBSPOT_PORTAL_ID}}/platform/flow/1843970484/edit |
| HubSpot | Marketing Chatbot \| MQL Classification | flow `1842490003` · https://app.hubspot.com/workflows/{{HUBSPOT_PORTAL_ID}}/platform/flow/1842490003/edit |
| n8n | Marketing Chatbot \| MQL Classification | `SKUv0NlJUsWyNB4Z` · https://{{N8N_INSTANCE_URL}}/workflow/SKUv0NlJUsWyNB4Z |
| n8n | Send Daily Report (to build — see daily-report-workflow-spec.md) | — |

Contact updates run through Update Contact (HubSpot/n8n path and HubSpot-only path);
MQL classification runs in both HubSpot and n8n. Execution questions → route to
`/marketing-chatbot-execution-analyst`.

## Reports & Dashboard (HubSpot-native — link these for self-serve stakeholders)

| Type | Name | Link |
|---|---|---|
| Report | MQLs from Chat — by Date | https://app.hubspot.com/reports-list/{{HUBSPOT_PORTAL_ID}}/340694178 |
| Report | MQLs from Chat — by Page | https://app.hubspot.com/reports-list/{{HUBSPOT_PORTAL_ID}}/340615572 |
| Report | Conversations by Page — Chatbot | https://app.hubspot.com/reports-list/{{HUBSPOT_PORTAL_ID}}/340500083 |
| Report | Daily Conversations — Chatbot | https://app.hubspot.com/reports-list/{{HUBSPOT_PORTAL_ID}}/340500353 |
| Report | Deals from Chat — by Create Date | https://app.hubspot.com/advanced-builder/{{HUBSPOT_PORTAL_ID}}/report/340720530 |
| **Dashboard** | **Marketing Chatbot (master)** | https://app.hubspot.com/reports-dashboard/{{HUBSPOT_PORTAL_ID}}/view/21114973 |
| SharePoint (Excel) | Hubspot Chatbot Reporting | https://strategichrandcomp.sharepoint.com/:x:/s/HubspotMarketingChatbotSite/IQDOOnNzFJf7Salls1bLvJHlAYPG1Q4EQZO9AJxqctR0k50?e=qeoL9O |

## Metric matrix (each cut = Total · Daily · Per Source URL · Per Attribution)

- Contacts Created · Companies Created · Contacts in Deal Stage · MQLs · Conversations
- "Per Source URL" = the page the chat started on (see "by Page" reports);
  "Per Attribution" = HubSpot attribution model on the report/dashboard.
- For a cut no existing report covers, pull raw per `data-sources.md` and build the table —
  never guess from a dashboard you can't read via API.
