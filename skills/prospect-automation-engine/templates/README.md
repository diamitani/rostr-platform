# PAE Workflow Templates

Production-ready n8n workflow JSONs. Import via **Workflows → Import from File** in n8n.

| File | Nodes | Description |
|---|---|---|
| `prospect-automation-engine-master.n8n.json` | 11 | Master PAE production workflow: trigger ingest → normalizer → CRM dedupe shield → Apollo/Clay enrichment → AI PAS copywriter → approval gate → CRM upsert → sequencer enrollment → Slack alert |
| `onthestage-custom-workflow.n8n.json` | 11 | Client-customized variant of the master workflow for an education/performing-arts vertical (theatre prospecting) |

Required environment variables (set in n8n, never hardcoded):
`HUBSPOT_API_KEY`, `APOLLO_API_KEY`, `CLAY_API_KEY`, `ANTHROPIC_API_KEY`, `SMARTLEAD_API_KEY`, `SMARTLEAD_CAMPAIGN_ID`, `AMPLEMARKET_API_KEY`, `OUTREACH_SEQUENCE_ID`, `SLACK_WEBHOOK_KEY`, `SLACK_WEBHOOK_PATH`, `REQUIRE_HUMAN_APPROVAL`, `CLIENT_OFFERING_SUMMARY`
