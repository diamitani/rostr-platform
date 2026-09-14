---
name: factors-to-hubspot-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Factors.ai → HubSpot Sync Reference. Use when working with factors.ai → hubspot sync reference."
---

# Factors.ai → HubSpot Sync Reference

This file covers the primary use case: syncing Factors.ai workflow activity into HubSpot,
specifically keeping `factors_abm__workflow_date` accurate on Company records, and wiring
Factors signals to trigger the n8n prospecting automation.

Auth is in `credentials.md`.

---

## The Core Flow

```
Factors.ai account triggers workflow
        ↓
Factors action: Update HubSpot company via native integration
        ↓
HubSpot Company: factors_abm__workflow_date = <timestamp>
        ↓  (optional)
Factors action: POST webhook → n8n
        ↓
n8n prospecting workflow fires for this account
```

The join key throughout: **domain** (Factors account domain ↔ HubSpot company domain property)

---

## Key HubSpot Property

| Property Name | Object | Type | Description |
|--------------|--------|------|-------------|
| `factors_abm__workflow_date` | Company | datetime | Last Factors workflow fire timestamp for this account |

This is the field that drives the n8n prospecting trigger. When it updates, n8n can detect
the change and kick off outreach for the account.

---

## Step 1: Verify the HubSpot Integration in Factors

Before building workflows, confirm the integration is live:

```python
import requests

FACTORS_HEADERS = {
    "Authorization": "Bearer {{FACTORS_AI_KEY}}",
    "Content-Type": "application/json"
}
HS_HEADERS = {
    "Authorization": "Bearer {{CLAY_API_KEY}}",
    "Content-Type": "application/json"
}

# Check integration status
resp = requests.get(
    "https://api.factors.ai/v1/integrations/hubspot",
    headers=FACTORS_HEADERS
)
print(resp.status_code, resp.json())
```

If disconnected: Reconnect in Factors UI → Settings → Integrations → HubSpot → Connect.

---

## Step 2: Verify the Field Mapping

The `factors_abm__workflow_date` field must be explicitly mapped in Factors' HubSpot
integration settings. Check and set it:

```python
# Check current field mappings
resp = requests.get(
    "https://api.factors.ai/v1/integrations/hubspot/field_mapping",
    headers=FACTORS_HEADERS
)
print(resp.json())

# Set the correct mapping (run this if factors_abm__workflow_date isn't mapped)
mapping_payload = {
    "company_mappings": [
        {
            "factors_field": "workflow_triggered_at",
            "hubspot_field": "factors_abm__workflow_date",
            "type": "datetime",
            "sync_on": "workflow_trigger"
        }
    ]
}
resp = requests.put(
    "https://api.factors.ai/v1/integrations/hubspot/field_mapping",
    headers=FACTORS_HEADERS,
    json=mapping_payload
)
print(resp.status_code, resp.json())
```

---

## Step 3: The Canonical HubSpot-Update Workflow

Every Factors workflow that should update HubSpot needs this action block. This is the
correct structure for updating `factors_abm__workflow_date`:

```python
workflow_payload = {
    "name": "ABM Signal → HubSpot Workflow Date",
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
        }
    ],
    "actions": [
        {
            "type": "hubspot_update",
            "object": "company",
            "match_on": "domain",          # ← critical: join key
            "properties": {
                "factors_abm__workflow_date": "{{event.timestamp}}"
            }
        }
    ]
}

resp = requests.post(
    "https://api.factors.ai/v1/workflows",
    headers=FACTORS_HEADERS,
    json=workflow_payload
)
print(resp.status_code, resp.json())
```

**Critical field mapping notes:**
- `match_on: "domain"` — Factors matches the HubSpot company by domain field. If this is
  wrong or missing, the update will fail silently.
- `"{{event.timestamp}}"` — this is the Factors template variable for the event's UTC
  timestamp. It will be written as an ISO 8601 datetime to HubSpot.
- The HubSpot property must be type `datetime` (not `date` or `string`).

---

## Step 4: Add n8n Webhook Trigger (optional but recommended)

Add this as a second action alongside the HubSpot update. This fires the n8n prospecting
automation in real-time when the signal occurs:

```python
n8n_action = {
    "type": "webhook",
    "url": "https://YOUR_N8N_INSTANCE/webhook/factors-abm-trigger",
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    },
    "payload": {
        "account_domain": "{{account.domain}}",
        "account_name": "{{account.name}}",
        "account_id": "{{account.id}}",
        "workflow_id": "{{workflow.id}}",
        "workflow_name": "{{workflow.name}}",
        "trigger_event": "{{event.name}}",
        "event_properties": "{{event.properties}}",
        "timestamp": "{{event.timestamp}}",
        "source": "factors_ai"
    }
}
```

Add this to the `actions` array alongside the `hubspot_update` action. Patrick: replace
`YOUR_N8N_INSTANCE` with your actual n8n base URL.

---

## Debugging: Why Isn't `factors_abm__workflow_date` Updating?

Run this diagnostic script step by step:

```python
import requests
from datetime import datetime, timedelta

FACTORS_HEADERS = {"Authorization": "Bearer {{FACTORS_AI_KEY}}", "Content-Type": "application/json"}
HS_HEADERS = {"Authorization": "Bearer {{CLAY_API_KEY}}", "Content-Type": "application/json"}

def diagnose_sync(domain):
    print(f"\n=== Diagnosing Factors → HubSpot sync for: {domain} ===\n")

    # Step 1: Check if account exists in Factors
    resp = requests.get(f"https://api.factors.ai/v1/accounts", headers=FACTORS_HEADERS, params={"domain": domain})
    data = resp.json()
    accounts = data.get("accounts", [])
    if not accounts:
        print(f"❌ STEP 1 FAIL: No account found in Factors for domain '{domain}'")
        print("   → Fix: Add the account via POST /v1/accounts or check if domain is set correctly")
        return
    account = accounts[0]
    print(f"✅ STEP 1: Found Factors account: {account['name']} (id: {account['id']})")

    # Step 2: Check if company exists in HubSpot by domain
    hs_resp = requests.post(
        "https://api.hubapi.com/crm/v3/objects/companies/search",
        headers=HS_HEADERS,
        json={
            "filterGroups": [{"filters": [{"propertyName": "domain", "operator": "EQ", "value": domain}]}],
            "properties": ["name", "domain", "factors_abm__workflow_date"],
            "limit": 1
        }
    )
    hs_data = hs_resp.json()
    hs_results = hs_data.get("results", [])
    if not hs_results:
        print(f"❌ STEP 2 FAIL: No HubSpot company found with domain '{domain}'")
        print("   → Fix: Create the company in HubSpot or ensure domain property is set")
        return
    hs_company = hs_results[0]
    props = hs_company.get("properties", {})
    current_val = props.get("factors_abm__workflow_date", "NOT SET")
    print(f"✅ STEP 2: Found HubSpot company: {props.get('name')} (hs_id: {hs_company['id']})")
    print(f"   Current factors_abm__workflow_date: {current_val}")

    # Step 3: Check for active workflows
    wf_resp = requests.get("https://api.factors.ai/v1/workflows", headers=FACTORS_HEADERS)
    workflows = wf_resp.json().get("workflows", [])
    active = [w for w in workflows if w.get("status") == "active"]
    hs_update_wfs = [w for w in active if any(a.get("type") == "hubspot_update" for a in w.get("actions", []))]
    print(f"\n✅ STEP 3: {len(active)} active workflows, {len(hs_update_wfs)} with HubSpot update actions")
    for w in hs_update_wfs:
        last = w.get("last_triggered_at", "never")
        print(f"   - '{w['name']}' | last triggered: {last}")

    # Step 4: Check recent events for this account
    events_resp = requests.get(
        f"https://api.factors.ai/v1/accounts/{account['id']}/events",
        headers=FACTORS_HEADERS,
        params={"start_date": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")}
    )
    events = events_resp.json().get("events", [])
    print(f"\n✅ STEP 4: {len(events)} events in last 7 days for this account")
    if events:
        for e in events[:5]:
            print(f"   - {e.get('event_name')} @ {e.get('timestamp', '')[:16]}")

    print("\n--- Summary ---")
    if current_val == "NOT SET":
        print("⚠️  factors_abm__workflow_date has never been set. Possible causes:")
        print("   1. No active workflow has fired for this account yet")
        print("   2. The workflow's hubspot_update action has match_on set incorrectly (must be 'domain')")
        print("   3. The Factors → HubSpot integration isn't connected or field isn't mapped")
    else:
        print(f"✅ Last sync: {current_val}")

# Run it:
diagnose_sync("YOUR_DOMAIN_HERE.com")
```

---

## Backfill: Push Historical Workflow Data to HubSpot

Use this when you want to populate `factors_abm__workflow_date` for accounts that
fired workflows in the past (before you had the sync set up).

```python
import requests
from datetime import datetime

FACTORS_HEADERS = {"Authorization": "Bearer {{FACTORS_AI_KEY}}", "Content-Type": "application/json"}
HS_HEADERS = {"Authorization": "Bearer {{CLAY_API_KEY}}", "Content-Type": "application/json"}

def backfill_workflow_dates(workflow_id, start_date="2024-01-01", end_date=None):
    """
    For a given Factors workflow, find all historical executions,
    then update the corresponding HubSpot company with the most recent
    execution timestamp per account.
    """
    if not end_date:
        end_date = datetime.now().strftime("%Y-%m-%d")

    print(f"Fetching executions for workflow {workflow_id} from {start_date} to {end_date}...")

    # Get all executions
    resp = requests.get(
        f"https://api.factors.ai/v1/workflows/{workflow_id}/executions",
        headers=FACTORS_HEADERS,
        params={"start_date": start_date, "end_date": end_date}
    )
    executions = resp.json().get("executions", [])
    print(f"Found {len(executions)} executions")

    # Group by account domain, keep most recent timestamp
    domain_to_latest = {}
    for ex in executions:
        domain = ex.get("account", {}).get("domain")
        ts = ex.get("executed_at")
        if domain and ts:
            if domain not in domain_to_latest or ts > domain_to_latest[domain]:
                domain_to_latest[domain] = ts

    print(f"Unique accounts to update: {len(domain_to_latest)}")

    # Batch upsert to HubSpot by domain
    inputs = [
        {
            "idProperty": "domain",
            "id": domain,
            "properties": {
                "factors_abm__workflow_date": ts
            }
        }
        for domain, ts in domain_to_latest.items()
    ]

    # Process in batches of 100
    updated = 0
    errors = []
    for i in range(0, len(inputs), 100):
        batch = inputs[i:i+100]
        hs_resp = requests.post(
            "https://api.hubapi.com/crm/v3/objects/companies/batch/upsert",
            headers=HS_HEADERS,
            json={"inputs": batch}
        )
        if hs_resp.ok:
            updated += len(hs_resp.json().get("results", []))
        else:
            errors.append(hs_resp.text)

    print(f"\n✅ Updated {updated} HubSpot companies")
    if errors:
        print(f"⚠️  {len(errors)} errors: {errors[:3]}")

    return domain_to_latest

# Run backfill:
# backfill_workflow_dates("wf_YOUR_WORKFLOW_ID", start_date="2024-10-01")
```

---

## n8n Integration: Triggering the Prospecting Workflow

In n8n, create a Webhook trigger node:
- **Method:** POST
- **Path:** `/factors-abm-trigger`
- **Authentication:** none (or add a header secret for security)

The Factors webhook payload will include:
```json
{
  "account_domain": "acme.com",
  "account_name": "Acme Corp",
  "account_id": "acc_abc123",
  "workflow_id": "wf_xyz789",
  "workflow_name": "High Intent → HubSpot Update",
  "trigger_event": "$pageview",
  "timestamp": "2025-03-21T14:30:00Z",
  "source": "factors_ai"
}
```

Use `account_domain` in n8n to:
1. Look up the HubSpot company (search by domain)
2. Get associated contacts
3. Check if there's an active deal
4. If no deal → enroll contacts in Amplemarket prospecting sequence
5. Create a HubSpot note logging the Factors signal

---

## Canonical Workflow Templates

These are the recommended workflows for the {{COMPANY_NAME}} ABM motion. Create all of them.

### Template 1: Pricing Page Visit → HubSpot Date
Trigger: `$pageview` with `/pricing` in URL
Frequency: once per account per day
Filter: ICP Tier 1 segment
Action: Update `factors_abm__workflow_date` on HubSpot company

### Template 2: High Intent Session → HubSpot Date + n8n
Trigger: `$session` with engagement score > 70 (or session duration > 5 min)
Frequency: once per account per day
Filter: any ICP account
Actions: Update HubSpot date + POST to n8n webhook

### Template 3: Return Visitor (3+ sessions) → HubSpot Date
Trigger: `$session` count threshold (account visited 3+ times in 7 days)
Frequency: once per account per week
Filter: ICP accounts without active deal
Action: Update HubSpot date + Slack alert to #gtm-alerts

### Template 4: Demo/Contact Page → Immediate Alert
Trigger: `$pageview` with `/demo` or `/contact` in URL
Frequency: every time
Filter: any tracked account
Actions: Slack alert (#gtm-alerts) + Update HubSpot date
