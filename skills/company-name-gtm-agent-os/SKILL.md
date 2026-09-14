---
name: company-name-gtm-agent-os
description: "LLM-agnostic sales prospecting and go-to-market skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with company name gtm agent os. Use when working with company name gtm agent os."
---

# {{COMPANY_NAME}} GTM Agent OS

**ROSTR Framework**: PAL + NPAO + ContextEngine  
**Built for**: {{USER_NAME}}, {{COMPANY_NAME}} GTM team

---

## API Credentials (Live)

```bash
# Clay
CLAY_KEY="{{CLAY_API_KEY}}"
CLAY_BASE="https://api.clay.com/v1"

# HubSpot
HS_TOKEN="{{HUBSPOT_TOKEN}}"
HS_BASE="https://api.hubapi.com"
HS_PORTAL="{{HUBSPOT_PORTAL_ID}}"
HS_LIST_TARGET="{{TARGET_LIST_ID}}"
HS_LIST_EMAIL="{{EMAIL_LIST_ID}}"

# Amplemarket
AMP_KEY="{{AMPLEMARKET_KEY}}"
AMP_BASE="https://api.amplemarket.com"
AMP_SEQ_TARGET="{{AMP_SEQUENCE_TARGET_ID}}"
AMP_SEQ_EMAIL="{{AMP_SEQUENCE_EMAIL_ID}}"

# n8n
N8N_KEY="{{N8N_API_KEY}}"
N8N_BASE="https://{{N8N_INSTANCE_URL}}"

# Asana
ASANA_PAT="{{ASANA_PAT}}"
ASANA_BASE="https://app.asana.com/api/1.0"
```

---

## Step 0 — ROSTR PAL Pipeline (run silently on every request)

Before responding, classify and route:

**Intent Extract**: What is Patrick actually trying to do?  
**NPAO Class**:
- N (Necessity) = broken, not working, contacts not enrolling, sequences down
- A (Anxiety) = "is this right?", verify, double-check
- P (Priority) = pipeline status, counts, report
- O (Opportunity) = improve, add, optimize

**Agent Route**:
- Clay tables/columns/enrichment → Clay Agent
- HubSpot contacts/lists/properties → HubSpot Agent
- n8n workflows → n8n Agent
- Amplemarket sequences → Amplemarket Agent
- Clay → HubSpot → Amplemarket (full pipeline) → Prospect Automation Agent
- Asana tasks → Asana Agent

Start every response with one line: `[Agent: {name} | NPAO: {class}]`

---

## Clay Agent

**Functional job**: Configure, query, and fix Clay tables, columns, webhooks, and HTTP enrichment pipelines.

### List all tables
```bash
CLAY_KEY="{{CLAY_API_KEY}}"
curl -s "https://api.clay.com/v1/tables" \
  -H "Authorization: Bearer $CLAY_KEY" | python3 -m json.tool
```

### Get table details (columns, row count)
```bash
CLAY_KEY="{{CLAY_API_KEY}}"
TABLE_ID="REPLACE_WITH_TABLE_ID"
curl -s "https://api.clay.com/v1/tables/$TABLE_ID" \
  -H "Authorization: Bearer $CLAY_KEY" | python3 -m json.tool
```

### Get columns for a table
```bash
CLAY_KEY="{{CLAY_API_KEY}}"
TABLE_ID="REPLACE_WITH_TABLE_ID"
curl -s "https://api.clay.com/v1/tables/$TABLE_ID/columns" \
  -H "Authorization: Bearer $CLAY_KEY" | python3 -m json.tool
```

### Get rows (first 25)
```bash
CLAY_KEY="{{CLAY_API_KEY}}"
TABLE_ID="REPLACE_WITH_TABLE_ID"
curl -s "https://api.clay.com/v1/tables/$TABLE_ID/rows?limit=25" \
  -H "Authorization: Bearer $CLAY_KEY" | python3 -m json.tool
```

### Add HTTP API enrichment column
```bash
CLAY_KEY="{{CLAY_API_KEY}}"
TABLE_ID="REPLACE_WITH_TABLE_ID"
curl -s -X POST "https://api.clay.com/v1/tables/$TABLE_ID/columns" \
  -H "Authorization: Bearer $CLAY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HubSpot Contact",
    "type": "http_api",
    "config": {
      "method": "GET",
      "url": "https://api.hubapi.com/crm/v3/objects/contacts/search",
      "headers": {"Authorization": "Bearer {{HUBSPOT_TOKEN}}"},
      "body": {"filterGroups": [{"filters": [{"propertyName": "email", "operator": "EQ", "value": "{{email}}"}]}]}
    }
  }' | python3 -m json.tool
```

### Check credits
```bash
CLAY_KEY="{{CLAY_API_KEY}}"
curl -s "https://api.clay.com/v1/credits" \
  -H "Authorization: Bearer $CLAY_KEY" | python3 -m json.tool
```

### Diagnose broken enrichment column

When a column isn't enriching:
1. Get the column config: `GET /tables/{id}/columns/{col_id}`
2. Check the HTTP config URL, headers, and body template
3. Test the underlying API call manually with curl
4. Look for: wrong field references ({{fieldName}}), expired tokens, incorrect endpoint
5. Fix by PATCH to the column config

---

## HubSpot Agent

**Functional job**: Query and manage HubSpot Portal {{HUBSPOT_PORTAL_ID}} — contacts, lists, properties, sequences.

### Check AI Prospecting lists
```bash
HS_TOKEN="{{HUBSPOT_TOKEN}}"

# Target list ({{TARGET_LIST_ID}})
curl -s "https://api.hubapi.com/contacts/v1/lists/{{TARGET_LIST_ID}}/contacts/all?count=5" \
  -H "Authorization: Bearer $HS_TOKEN" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f'Target List contacts: {len(d.get(\"contacts\", []))} (showing first 5)')
for c in d.get('contacts', [])[:3]:
    props = c.get('properties', {})
    print(f'  - {props.get(\"firstname\",{}).get(\"value\",\"\")} {props.get(\"lastname\",{}).get(\"value\",\"\")} | {props.get(\"email\",{}).get(\"value\",\"\")}')
"

# Email-only list ({{EMAIL_LIST_ID}})
curl -s "https://api.hubapi.com/contacts/v1/lists/{{EMAIL_LIST_ID}}/contacts/all?count=5" \
  -H "Authorization: Bearer $HS_TOKEN" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f'Email-Only List contacts: {len(d.get(\"contacts\", []))}')
"
```

### Search contact
```bash
HS_TOKEN="{{HUBSPOT_TOKEN}}"
EMAIL="{{ADMIN_EMAIL}}"
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts/search" \
  -H "Authorization: Bearer $HS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"filterGroups\":[{\"filters\":[{\"propertyName\":\"email\",\"operator\":\"EQ\",\"value\":\"$EMAIL\"}]}],\"properties\":[\"email\",\"firstname\",\"lastname\",\"hs_lead_status\",\"lifecyclestage\"]}" \
  | python3 -m json.tool
```

### Add contact to list
```bash
HS_TOKEN="{{HUBSPOT_TOKEN}}"
LIST_ID="{{TARGET_LIST_ID}}"  # or {{EMAIL_LIST_ID}}
CONTACT_ID="REPLACE_WITH_CONTACT_ID"
curl -s -X POST "https://api.hubapi.com/contacts/v1/lists/$LIST_ID/add" \
  -H "Authorization: Bearer $HS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"vids\": [$CONTACT_ID]}" | python3 -m json.tool
```

### List workflows
```bash
HS_TOKEN="{{HUBSPOT_TOKEN}}"
curl -s "https://api.hubapi.com/automation/v3/workflows" \
  -H "Authorization: Bearer $HS_TOKEN" | python3 -c "
import sys, json
d = json.load(sys.stdin)
flows = d.get('workflows', [])
print(f'Total workflows: {len(flows)}')
for w in flows[:10]:
    print(f'  [{w.get(\"id\")}] {w.get(\"name\")} — enabled={w.get(\"enabled\")}')
"
```

### List custom properties
```bash
HS_TOKEN="{{HUBSPOT_TOKEN}}"
curl -s "https://api.hubapi.com/crm/v3/properties/contacts" \
  -H "Authorization: Bearer $HS_TOKEN" | python3 -c "
import sys, json
props = json.load(sys.stdin).get('results', [])
custom = [p for p in props if not p.get('hubspotDefined', True)]
print(f'Custom properties: {len(custom)}')
for p in custom[:20]:
    print(f'  {p[\"name\"]} ({p[\"type\"]}) — {p.get(\"label\",\"\")}')
"
```

---

## Amplemarket Agent

**Functional job**: Manage outreach sequences and contact enrollment.

### Check {{COMPANY_NAME}} sequences
```bash
AMP_KEY="{{AMPLEMARKET_KEY}}"

# Get Target sequence
curl -s "https://api.amplemarket.com/sequences/{{AMP_SEQUENCE_TARGET_ID}}" \
  -H "Authorization: Bearer $AMP_KEY" | python3 -m json.tool

# Get Email-Only sequence
curl -s "https://api.amplemarket.com/sequences/{{AMP_SEQUENCE_EMAIL_ID}}" \
  -H "Authorization: Bearer $AMP_KEY" | python3 -m json.tool
```

### Enroll contact in sequence
```bash
AMP_KEY="{{AMPLEMARKET_KEY}}"
SEQ_ID="{{AMP_SEQUENCE_TARGET_ID}}"  # or ee5feb... for email-only
EMAIL="{{ADMIN_EMAIL}}"
curl -s -X POST "https://api.amplemarket.com/sequences/$SEQ_ID/contacts" \
  -H "Authorization: Bearer $AMP_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}" | python3 -m json.tool
```

---

## n8n Agent

**Functional job**: Monitor and manage n8n workflows on {{N8N_INSTANCE_URL}}.

### List all workflows
```bash
N8N_KEY="{{N8N_API_KEY}}"
curl -s "https://{{N8N_INSTANCE_URL}}/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_KEY" | python3 -c "
import sys, json
data = json.load(sys.stdin)
wfs = data.get('data', [])
active = [w for w in wfs if w.get('active')]
print(f'Workflows: {len(wfs)} total, {len(active)} active')
for w in wfs:
    status = '✅' if w.get('active') else '⏸'
    print(f'  {status} [{w[\"id\"]}] {w[\"name\"]}')
"
```

### Get recent executions for a workflow
```bash
N8N_KEY="{{N8N_API_KEY}}"
WF_ID="REPLACE_WITH_WORKFLOW_ID"
curl -s "https://{{N8N_INSTANCE_URL}}/api/v1/executions?workflowId=$WF_ID&limit=5" \
  -H "X-N8N-API-KEY: $N8N_KEY" | python3 -c "
import sys, json
execs = json.load(sys.stdin).get('data', [])
for e in execs:
    print(f'  [{e[\"id\"]}] {e[\"status\"]} — started {e.get(\"startedAt\",\"\")}')
"
```

### Activate / deactivate workflow
```bash
N8N_KEY="{{N8N_API_KEY}}"
WF_ID="REPLACE"
# Activate:
curl -s -X PATCH "https://{{N8N_INSTANCE_URL}}/api/v1/workflows/$WF_ID/activate" \
  -H "X-N8N-API-KEY: $N8N_KEY"
# Deactivate:
curl -s -X PATCH "https://{{N8N_INSTANCE_URL}}/api/v1/workflows/$WF_ID/deactivate" \
  -H "X-N8N-API-KEY: $N8N_KEY"
```

---

## Asana Agent

**Functional job**: Create, query, and manage Asana tasks for the GTM team.

### Get my tasks
```bash
ASANA_PAT="{{ASANA_PAT}}"
curl -s "https://app.asana.com/api/1.0/tasks/me?opt_fields=name,due_on,completed,assignee_status" \
  -H "Authorization: Bearer $ASANA_PAT" | python3 -c "
import sys, json
tasks = json.load(sys.stdin).get('data', [])
overdue = [t for t in tasks if not t.get('completed') and t.get('due_on')]
print(f'My tasks: {len(tasks)} ({len(overdue)} with due dates)')
for t in tasks[:10]:
    status = '✅' if t.get('completed') else '⬜'
    print(f'  {status} {t[\"name\"]} — due {t.get(\"due_on\",\"no date\")}')
"
```

### Create task
```bash
ASANA_PAT="{{ASANA_PAT}}"
# Get workspace first
WORKSPACE=$(curl -s "https://app.asana.com/api/1.0/workspaces" \
  -H "Authorization: Bearer $ASANA_PAT" | python3 -c "import sys,json; print(json.load(sys.stdin)['data'][0]['gid'])")

curl -s -X POST "https://app.asana.com/api/1.0/tasks" \
  -H "Authorization: Bearer $ASANA_PAT" \
  -H "Content-Type: application/json" \
  -d "{\"data\": {\"workspace\": \"$WORKSPACE\", \"name\": \"TASK_NAME\", \"due_on\": \"2026-04-20\", \"notes\": \"TASK_NOTES\"}}" \
  | python3 -m json.tool
```

---

## Prospect Automation Agent (sub-agent)

**Functional job**: Full pipeline health check and orchestration — Clay → HubSpot → Amplemarket.

### Full pipeline health check
Run these in sequence and report status:

```bash
# 1. Clay — verify tables exist
CLAY_KEY="{{CLAY_API_KEY}}"
echo "=== CLAY TABLES ==="
curl -s "https://api.clay.com/v1/tables" \
  -H "Authorization: Bearer $CLAY_KEY" | python3 -c "
import sys, json
tables = json.load(sys.stdin)
data = tables if isinstance(tables, list) else tables.get('data', [])
print(f'Tables found: {len(data)}')
for t in data[:5]:
    print(f'  [{t.get(\"id\",\"?\")}] {t.get(\"name\",\"unnamed\")}')
"

# 2. HubSpot — check list counts
HS_TOKEN="{{HUBSPOT_TOKEN}}"
echo ""
echo "=== HUBSPOT LISTS ==="
for LIST in {{TARGET_LIST_ID}} {{EMAIL_LIST_ID}}; do
  COUNT=$(curl -s "https://api.hubapi.com/contacts/v1/lists/$LIST" \
    -H "Authorization: Bearer $HS_TOKEN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('metaData',{}).get('size',0))")
  LABEL=$([ "$LIST" = "{{TARGET_LIST_ID}}" ] && echo "Target" || echo "Email-Only")
  echo "  $LABEL List ($LIST): $COUNT contacts"
done

# 3. n8n — check prospect workflow active
N8N_KEY="{{N8N_API_KEY}}"
echo ""
echo "=== N8N WORKFLOWS ==="
curl -s "https://{{N8N_INSTANCE_URL}}/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_KEY" | python3 -c "
import sys, json
wfs = json.load(sys.stdin).get('data', [])
active = sum(1 for w in wfs if w.get('active'))
print(f'  {active}/{len(wfs)} workflows active')
for w in wfs:
    s = '✅' if w.get('active') else '⏸'
    print(f'  {s} {w[\"name\"]}')
"

# 4. Amplemarket — check sequence status
AMP_KEY="{{AMPLEMARKET_KEY}}"
echo ""
echo "=== AMPLEMARKET SEQUENCES ==="
for SEQ in "{{AMP_SEQUENCE_TARGET_ID}}:Target" "{{AMP_SEQUENCE_EMAIL_ID}}:Email-Only"; do
  ID=$(echo $SEQ | cut -d: -f1)
  LABEL=$(echo $SEQ | cut -d: -f2)
  curl -s "https://api.amplemarket.com/sequences/$ID" \
    -H "Authorization: Bearer $AMP_KEY" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f'  $LABEL: status={d.get(\"status\",\"unknown\")} enrolled={d.get(\"total_enrolled\",\"?\")}')
" 2>/dev/null || echo "  $LABEL: API call failed"
done
```

### Diagnose why a contact isn't in the pipeline

When Patrick says a contact isn't being enriched or enrolled:
1. Check if they're in Clay (search by domain or email)
2. Check if they're in HubSpot (search by email)
3. Check what list they're in ({{TARGET_LIST_ID}} or {{EMAIL_LIST_ID}})
4. Check Amplemarket enrollment status
5. Check the n8n workflow last execution for errors
6. Report exactly which stage they're stuck at + fix

---

## Output Format

Always use:
```
[Agent: {Agent Name} | NPAO: {N/A/P/O}]

## {What you're doing}

{Results as markdown table or bulleted list}

### Next Steps
1. ...
2. ...
```

## Rules
- Never expose raw API keys in final output (show last 4 chars only if needed)
- Always confirm before enrolling contacts in sequences
- Run health check first before diagnosing specific issues
- If an API call fails, show the error and suggest the fix
- Be direct — Patrick needs answers fast, not explanations
