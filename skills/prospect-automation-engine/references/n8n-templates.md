> Source: diamitani PAE repos (merged into Rostr 2026-09-14). Sample/template content is illustrative — replace placeholders with your own verified data before production use.

# n8n Production Architecture & Workflow Schema Template

This reference documents the exact node schema, IDs, positions, and graph connections for the 9-Node Prospect Automation Engine in n8n.

---

## 📐 Complete 9-Node Topology

| Node ID | Node Name | n8n Type | Role |
|---|---|---|---|
| `sticky-note-spec` | Intake & Architecture Spec | `n8n-nodes-base.stickyNote` | Visual canvas documentation |
| `node-01-trigger` | Inbound Trigger Ingest | `n8n-nodes-base.webhook` / `scheduleTrigger` | Ingests CSV, CRM signals, intent or cron |
| `node-01-agent-webhook` | Agent Skill Webhook | `n8n-nodes-base.webhook` | Receives CLI slash commands (`/prospect-search`) |
| `node-02-normalizer` | Date & Domain Normalizer | `n8n-nodes-base.code` | Normalizes timestamps & deduplicates domains |
| `node-03-crm-dedupe` | CRM Deduplication Shield | `n8n-nodes-base.httpRequest` | Checks CRM to prevent deal collision |
| `node-04-data-enrichment`| Contact & ICP Reveal | `n8n-nodes-base.httpRequest` | Queries Apollo/Clay with exact ICP titles |
| `node-05-ai-reasoning` | AI PAS Copywriter | `n8n-nodes-base.httpRequest` | Claude 3.5 / GPT-4o Problem-Agitate-Solve |
| `node-06-approval-gate` | Approval Gate | `n8n-nodes-base.if` | Routes to Slack review or autopilot pass-through |
| `node-07-crm-upsert` | CRM Contact Upsert | `n8n-nodes-base.httpRequest` | Upserts contact with AI research notes |
| `node-08-sequencer-enroll`| Sequencer Enrollment | `n8n-nodes-base.httpRequest` | Enrolls verified email into active campaign |
| `node-09-slack-alert` | Slack Review Alert | `n8n-nodes-base.httpRequest` | Posts rich Slack card for 1-click human review |

---

## 🔗 Valid Connections Graph

```json
{
  "01 Spreadsheet Ingest & Binary Parser Webhook": {
    "main": [[{ "node": "02 Calculate Date Ranges & Normalize Input", "type": "main", "index": 0 }]]
  },
  "01 Claude Code Skill Webhook (Claude Code Skills)": {
    "main": [[{ "node": "02 Calculate Date Ranges & Normalize Input", "type": "main", "index": 0 }]]
  },
  "02 Calculate Date Ranges & Normalize Input": {
    "main": [[{ "node": "03 HubSpot Intent Query & Deduplication Shield", "type": "main", "index": 0 }]]
  },
  "03 HubSpot Intent Query & Deduplication Shield": {
    "main": [[{ "node": "04 Apollo.io Contact & ICP Reveal", "type": "main", "index": 0 }]]
  },
  "04 Apollo.io Contact & ICP Reveal": {
    "main": [[{ "node": "05 Claude Pain-Point Reasoner & PAS Copywriter", "type": "main", "index": 0 }]]
  },
  "05 Claude Pain-Point Reasoner & PAS Copywriter": {
    "main": [[{ "node": "06 Approval Gate (Slack Review)", "type": "main", "index": 0 }]]
  },
  "06 Approval Gate (Slack Review)": {
    "main": [
      [{ "node": "09 Slack Approval Review Alert", "type": "main", "index": 0 }],
      [{ "node": "07 HubSpot Contact & Opportunity Upsert", "type": "main", "index": 0 }]
    ]
  },
  "07 HubSpot Contact & Opportunity Upsert": {
    "main": [[{ "node": "08 Smartlead Sequence Enrollment", "type": "main", "index": 0 }]]
  }
}
```
