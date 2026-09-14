> Source: diamitani PAE repos (merged into Rostr 2026-09-14). Sample/template content is illustrative — replace placeholders with your own verified data before production use.

# Inbound & Outbound Ingestion Trigger Reference

This reference documents the 5 primary trigger ingestion patterns for the Prospect Automation Engine and how each is implemented in n8n.

---

## 1. Spreadsheet CSV / Excel Upload (`n8n-nodes-base.webhook`)

### Use Case
Used when SDRs or growth leads receive CSV exports from conference attendee rosters, trade show registries, or third-party databases.

### n8n Node Configuration
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "prospect-spreadsheet-upload",
    "options": {
      "binaryData": true
    }
  },
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1.1,
  "id": "node-01-trigger",
  "name": "01 Spreadsheet Ingest & Binary Parser Webhook"
}
```

### Downstream Normalization
The subsequent code node reads `$input.item.binary.data` and parses CSV lines into normalized objects containing `domain`, `company_name`, `source_list`.

---

## 2. Direct CRM Import / Stage Change Poller (`n8n-nodes-base.httpRequest`)

### Use Case
Triggered when an unconverted Lead or Account is created in the CRM or moves to a specific qualification stage (e.g. `Stage = Needs Outbound`).

### n8n Node Configuration (HubSpot Example)
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.hubapi.com/crm/v3/objects/contacts/search",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Authorization", "value": "Bearer {{ $env.HUBSPOT_API_KEY }}" },
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={\n  \"filterGroups\": [\n    {\n      \"filters\": [\n        { \"propertyName\": \"lifecyclestage\", \"operator\": \"EQ\", \"value\": \"lead\" },\n        { \"propertyName\": \"outreach_status\", \"operator\": \"NOT_HAS_PROPERTY\" }\n      ]\n    }\n  ],\n  \"limit\": 50\n}"
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.3,
  "id": "node-01-trigger",
  "name": "01 HubSpot Lead Trigger & Poller"
}
```

---

## 3. Data Tool Scheduled Search (`n8n-nodes-base.scheduleTrigger`)

### Use Case
Continuously runs automated ICP search queries against Apollo, Clay, or ZoomInfo on a daily or weekly schedule.

### n8n Node Configuration
```json
{
  "parameters": {
    "rule": {
      "interval": [{ "field": "hours", "triggerAtHour": 2 }]
    }
  },
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.2,
  "id": "node-01-trigger",
  "name": "01 Scheduled Apollo.io ICP Search Trigger"
}
```

---

## 4. Real-Time Intent Webhook (`n8n-nodes-base.webhook`)

### Use Case
Receives instant webhook payloads from website visitor identification tools (RB2B, Clearbit Reveal, Warmly, Snitcher) as soon as an anonymous company visits the website.

### n8n Node Configuration
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "prospect-intent-stream",
    "responseMode": "responseNode",
    "options": {}
  },
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1.1,
  "id": "node-01-trigger",
  "name": "01 Real-Time Intent Webhook (RB2B/Clearbit)"
}
```

---

## 5. Daily Scheduled Cron (`n8n-nodes-base.scheduleTrigger`)

### Use Case
Standard morning outbound batch execution triggering every day at 2:00 AM local time.

### n8n Node Configuration
```json
{
  "parameters": {
    "rule": {
      "interval": [{ "field": "hours", "triggerAtHour": 2 }]
    }
  },
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.2,
  "id": "node-01-trigger",
  "name": "01 Daily Schedule Trigger (2:00 AM Cron)"
}
```
