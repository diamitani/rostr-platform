---
name: factors-api-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Factors.ai REST API Reference. Use when working with factors.ai rest api reference."
---

# Factors.ai REST API Reference

Auth is in `credentials.md`. Load that first.

**Base URL:** `https://api.factors.ai`
**Auth:** `Authorization: Bearer {{FACTORS_AI_KEY}}`

> **API Discovery:** If you get a 404 on any endpoint below, try with `/v1/` prefix or
> use `/api/v1/` prefix. Factors.ai's API versioning can vary by endpoint. Always print
> the status code and response body when debugging.

---

## Accounts

Accounts in Factors = companies being tracked. Each account has a domain, optional
segments/tags, and a stream of events and signals.

### List all accounts
```
GET /v1/accounts
```
Params: `page`, `per_page` (default 50), `segment` (filter by segment name)

```python
def list_accounts(segment=None, page=1, per_page=50):
    params = {"page": page, "per_page": per_page}
    if segment:
        params["segment"] = segment
    return factors_get("/v1/accounts", params=params)
```

Response shape:
```json
{
  "accounts": [
    {
      "id": "acc_abc123",
      "name": "Acme Corp",
      "domain": "acme.com",
      "created_at": "2024-11-01T10:00:00Z",
      "last_seen_at": "2025-03-20T14:30:00Z",
      "segments": ["ICP", "Hot"],
      "properties": {
        "industry": "Technology",
        "employee_count": 500
      }
    }
  ],
  "total": 342,
  "page": 1,
  "per_page": 50
}
```

### Get a single account
```
GET /v1/accounts/{account_id}
```

### Search accounts by domain
```
GET /v1/accounts?domain=acme.com
```

### Create an account
```
POST /v1/accounts
{
  "name": "Acme Corp",
  "domain": "acme.com",
  "properties": {
    "industry": "Technology",
    "employee_count": 500,
    "country": "United States"
  },
  "segments": ["ICP Tier 1"]
}
```

### Update an account
```
PATCH /v1/accounts/{account_id}
{
  "properties": {
    "industry": "SaaS"
  },
  "segments": ["ICP Tier 1", "Hot"]
}
```

### Delete an account
```
DELETE /v1/accounts/{account_id}
```

### Bulk create/upsert accounts (by domain)
```
POST /v1/accounts/bulk
{
  "accounts": [
    {
      "domain": "acme.com",
      "name": "Acme Corp",
      "properties": { "industry": "Technology" }
    },
    {
      "domain": "globex.com",
      "name": "Globex Corp",
      "properties": { "industry": "Manufacturing" }
    }
  ],
  "upsert": true
}
```

---

## Events

Events are signals tracked at the account level — page visits, form fills, product
interactions, custom events. These are the raw signals that workflows react to.

### List events for an account
```
GET /v1/accounts/{account_id}/events
```
Params: `start_date`, `end_date`, `event_type`

```python
def get_account_events(account_id, start_date=None, end_date=None):
    params = {}
    if start_date:
        params["start_date"] = start_date  # format: "2025-01-01"
    if end_date:
        params["end_date"] = end_date
    return factors_get(f"/v1/accounts/{account_id}/events", params=params)
```

### List all events (global, across accounts)
```
GET /v1/events
```
Params: `event_type`, `start_date`, `end_date`, `account_domain`, `page`, `per_page`

### Track a custom event (send signal into Factors)
```
POST /v1/events
{
  "event_name": "Pricing Page Visit",
  "account_domain": "acme.com",
  "timestamp": "2025-03-20T14:30:00Z",
  "properties": {
    "page_url": "/pricing",
    "session_duration": 180
  }
}
```

### Event types (common in Factors)
- `$pageview` — website page visit
- `$form_fill` — form submission
- `$session` — session-level aggregate
- `$identify` — user identification event
- Custom event names you define

---

## Workflows

Workflows = automation rules. Each workflow has a trigger (signal/event condition),
optional filters (segment, account property), and actions (HubSpot update, Slack message, webhook).

### List all workflows
```
GET /v1/workflows
```

Response shape:
```json
{
  "workflows": [
    {
      "id": "wf_xyz789",
      "name": "High Intent → HubSpot Update",
      "status": "active",
      "trigger": {
        "type": "event",
        "event_name": "$pageview",
        "conditions": [
          { "property": "page_url", "operator": "contains", "value": "/pricing" }
        ]
      },
      "filters": [
        { "type": "segment", "segment_name": "ICP Tier 1" }
      ],
      "actions": [
        {
          "type": "hubspot_update",
          "object": "company",
          "properties": {
            "factors_abm__workflow_date": "{{timestamp}}"
          }
        }
      ],
      "created_at": "2025-01-15T09:00:00Z",
      "last_triggered_at": "2025-03-21T11:45:00Z"
    }
  ]
}
```

### Get a single workflow
```
GET /v1/workflows/{workflow_id}
```

### Create a workflow — full field setup
```
POST /v1/workflows
{
  "name": "High Intent Account → HubSpot ABM Date",
  "status": "active",
  "trigger": {
    "type": "event",
    "event_name": "$pageview",
    "frequency": "once_per_account_per_day",
    "conditions": [
      {
        "property": "page_url",
        "operator": "contains",
        "value": "/pricing"
      }
    ]
  },
  "filters": [
    {
      "type": "segment",
      "segment_name": "ICP Tier 1"
    },
    {
      "type": "account_property",
      "property": "employee_count",
      "operator": "gte",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "hubspot_update",
      "object": "company",
      "match_on": "domain",
      "properties": {
        "factors_abm__workflow_date": "{{event.timestamp}}"
      }
    },
    {
      "type": "webhook",
      "url": "https://YOUR_N8N_INSTANCE/webhook/factors-trigger",
      "method": "POST",
      "payload": {
        "account_domain": "{{account.domain}}",
        "account_name": "{{account.name}}",
        "workflow_id": "{{workflow.id}}",
        "workflow_name": "{{workflow.name}}",
        "trigger_event": "{{event.name}}",
        "timestamp": "{{event.timestamp}}"
      }
    }
  ]
}
```

**Trigger types:**
- `event` — fires when a specific event occurs
- `segment_enter` — fires when an account joins a segment
- `segment_exit` — fires when an account leaves a segment
- `score_threshold` — fires when account score crosses a value
- `schedule` — runs on a cron schedule (good for backfill/reporting)

**Frequency options:**
- `every_time` — fires on every matching event
- `once_per_account_per_day`
- `once_per_account_per_week`
- `once_per_account` — fires once ever per account

**Action types:**
- `hubspot_update` — update HubSpot company/contact properties
- `slack_message` — send a Slack notification
- `webhook` — POST to any URL (use for n8n)
- `email_alert` — send email notification
- `add_to_segment` — add account to a Factors segment

### Update a workflow
```
PATCH /v1/workflows/{workflow_id}
{
  "status": "paused",
  "name": "Updated Workflow Name"
}
```

### Delete a workflow
```
DELETE /v1/workflows/{workflow_id}
```

### Get workflow execution history
```
GET /v1/workflows/{workflow_id}/executions
```
Params: `start_date`, `end_date`, `account_domain`

```python
def get_workflow_executions(workflow_id, start_date=None, end_date=None):
    params = {}
    if start_date: params["start_date"] = start_date
    if end_date: params["end_date"] = end_date
    return factors_get(f"/v1/workflows/{workflow_id}/executions", params=params)
```

---

## Alerts

Alerts = notifications sent to your team when specific signals occur. Different from
workflows in that they're primarily for human notification, not system updates.

### List all alerts
```
GET /v1/alerts
```

### Create an alert
```
POST /v1/alerts
{
  "name": "ICP Account Pricing Page Visit",
  "trigger": {
    "type": "event",
    "event_name": "$pageview",
    "conditions": [
      { "property": "page_url", "operator": "contains", "value": "/pricing" }
    ]
  },
  "filters": [
    { "type": "segment", "segment_name": "ICP Tier 1" }
  ],
  "notifications": [
    {
      "type": "slack",
      "channel": "#gtm-alerts",
      "message": "🔥 {{account.name}} just visited the pricing page"
    },
    {
      "type": "email",
      "recipients": ["pdiamitani@{{COMPANY_FILE}}
    }
  ],
  "frequency": "once_per_account_per_day"
}
```

### Update an alert
```
PATCH /v1/alerts/{alert_id}
{ "status": "paused" }
```

### Delete an alert
```
DELETE /v1/alerts/{alert_id}
```

---

## Segments

Segments = named groups of accounts. Workflows and alerts can filter to specific segments.

### List segments
```
GET /v1/segments
```

### Create a segment
```
POST /v1/segments
{
  "name": "ICP Tier 1",
  "description": "Top ICP accounts — 50-5000 employees, global hiring signals",
  "rules": [
    { "property": "employee_count", "operator": "gte", "value": 50 },
    { "property": "employee_count", "operator": "lte", "value": 5000 }
  ]
}
```

### Add accounts to a segment manually
```
POST /v1/segments/{segment_id}/accounts
{
  "account_ids": ["acc_abc123", "acc_def456"],
  "domains": ["acme.com", "globex.com"]
}
```

---

## Integrations

### Check HubSpot integration status
```
GET /v1/integrations/hubspot
```

### Configure HubSpot field mapping
```
PUT /v1/integrations/hubspot/field_mapping
{
  "company_mappings": [
    {
      "factors_field": "workflow_triggered_at",
      "hubspot_field": "factors_abm__workflow_date",
      "type": "datetime",
      "sync_on": "workflow_trigger"
    },
    {
      "factors_field": "account.domain",
      "hubspot_field": "domain",
      "type": "string",
      "sync_on": "always"
    }
  ]
}
```

### List active integrations
```
GET /v1/integrations
```

---

## Python helper scripts (ready to run)

### List all accounts as a clean table
```python
import requests
import json

FACTORS_BASE = "https://api.factors.ai"
FACTORS_HEADERS = {
    "Authorization": "Bearer {{FACTORS_AI_KEY}}",
    "Content-Type": "application/json"
}

def list_all_accounts():
    all_accounts = []
    page = 1
    while True:
        resp = requests.get(
            f"{FACTORS_BASE}/v1/accounts",
            headers=FACTORS_HEADERS,
            params={"page": page, "per_page": 100}
        )
        resp.raise_for_status()
        data = resp.json()
        accounts = data.get("accounts", [])
        all_accounts.extend(accounts)
        if len(accounts) < 100:
            break
        page += 1
    return all_accounts

accounts = list_all_accounts()
print(f"Total accounts: {len(accounts)}\n")
print(f"{'Name':<30} {'Domain':<25} {'Last Seen':<20} {'Segments'}")
print("-" * 90)
for a in accounts[:50]:
    print(f"{a.get('name',''):<30} {a.get('domain',''):<25} {a.get('last_seen_at','')[:10]:<20} {', '.join(a.get('segments', []))}")
```

### List all workflows with status
```python
resp = requests.get(f"{FACTORS_BASE}/v1/workflows", headers=FACTORS_HEADERS)
resp.raise_for_status()
workflows = resp.json().get("workflows", [])
print(f"{'Name':<40} {'Status':<10} {'Trigger':<20} {'Last Triggered'}")
print("-" * 90)
for w in workflows:
    last = w.get("last_triggered_at", "never")[:10] if w.get("last_triggered_at") else "never"
    print(f"{w['name']:<40} {w['status']:<10} {w['trigger']['type']:<20} {last}")
```
