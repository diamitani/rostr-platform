---
name: maia-chatbot-marketer
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with maia chatbot marketer. Use when working with maia chatbot marketer."
---

# Maia AI Assistant — Marketer's Guide

**Maia** is {{COMPANY_NAME}}'s AI chatbot on the pricing page. She answers EOR questions, qualifies leads,
and routes them to the right rep. This skill is for marketers and SDRs who need to check, test,
or report on Maia — no coding required.

Credentials: `~/.claude/skills/hubspot-chatbot-manager/.env`

---

## Quick Reference

| Resource | Link |
|---|---|
| Test the chatbot live | https://app.hubspot.com/customer-agent-tester/{{HUBSPOT_PORTAL_ID}} |
| Maia settings (UI) | https://app.hubspot.com/customer-agent/{{HUBSPOT_PORTAL_ID}} |
| Guidelines editor | https://app.hubspot.com/customer-agent/{{HUBSPOT_PORTAL_ID}}/guidelines |
| Chatflow config | https://app.hubspot.com/chatflows/{{HUBSPOT_PORTAL_ID}}/edit/live-chat/86381848/build |
| Live on site | https://www.{{COMPANY_FILE}} |
| Azure Function (country data) | https://{{COMPANY_NAME}}-country-data-action.azurewebsites.net/api/country-data |

---

## What Can Maia Do?

Maia is trained to:
- Answer questions about {{COMPANY_NAME}}'s EOR services, payroll, compliance, and onboarding
- Look up country-specific availability (35+ supported countries)
- Quote pricing: starts at $599/employee/month
- Capture lead info (name, email, company, countries, headcount, timeline)
- Route conversations to a human rep when needed
- Recognize Turkey and Türkiye as the same country

Maia will NOT:
- Share VGM (Vendor of Global Mobility) status unless directly asked
- Quote discounts (redirects to volume pricing conversation)
- Claim {{COMPANY_NAME}} doesn't use payroll partners (this was incorrect — she routes to team)
- Use bold/italic formatting (plain conversational responses only)
- Show sources or mention the knowledge base
- Re-ask for contact details already provided in the same conversation

---

## Task: Check If Maia Is Live

```bash
source ~/.claude/skills/hubspot-chatbot-manager/scripts/hs-api.sh 2>/dev/null

# Is chatflow enabled?
curl -s \
  -H "Authorization: Bearer $HUBSPOT_PAT" \
  "https://api.hubapi.com/crm/v3/objects/contacts?limit=1" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('API OK — Maia should be live')" 2>/dev/null || echo "API error"

echo ""
echo "Visit the live site to verify: https://www.{{COMPANY_FILE}}
echo "Test directly: https://app.hubspot.com/customer-agent-tester/{{HUBSPOT_PORTAL_ID}}"
```

---

## Task: See Recent Chat Leads

Pull the last 10 contacts created from chatbot sessions:

```bash
source ~/.claude/skills/hubspot-chatbot-manager/scripts/hs-api.sh 2>/dev/null

curl -s -X POST \
  -H "Authorization: Bearer $HUBSPOT_PAT" \
  -H "Content-Type: application/json" \
  "https://api.hubapi.com/crm/v3/objects/contacts/search" \
  -d '{
    "filterGroups": [{"filters": [
      {"propertyName": "hs_latest_source", "operator": "EQ", "value": "CHATBOT"}
    ]}],
    "properties": ["firstname","lastname","email","company","lifecyclestage","hs_lead_status","createdate"],
    "sorts": [{"propertyName": "createdate", "direction": "DESCENDING"}],
    "limit": 10
  }' | python3 -c "
import sys, json
data = json.load(sys.stdin)
results = data.get('results', [])
print(f'Found {len(results)} chatbot leads:')
for c in results:
    p = c.get('properties', {})
    print(f\"  {p.get('firstname','')} {p.get('lastname','')} | {p.get('email','')} | {p.get('company','')} | {p.get('lifecyclestage','')} | {p.get('createdate','')[:10]}\")
"
```

---

## Task: Test Maia on a Specific Country

To see how Maia responds to a country question, test these via the Agent Tester:

1. Go to: https://app.hubspot.com/customer-agent-tester/{{HUBSPOT_PORTAL_ID}}
2. Type: "Can {{COMPANY_NAME}} hire someone in [country]?"
3. Expected: Maia should pull country data and give a clear yes/no + details

Example test questions to try:
- "We want to hire someone in Germany"
- "What about China?"
- "How does Turkey work?"
- "What's the pricing?"

---

## Task: View Maia's Current Guidelines

The full guidelines are in HubSpot UI:
→ https://app.hubspot.com/customer-agent/{{HUBSPOT_PORTAL_ID}}/guidelines

Key sections:
- **Identity**: Who Maia is, her tone
- **Custom instructions**: Pricing rules, country data rules, what NOT to say
- **Tone & Voice**: Friendly, direct, no jargon, no markdown formatting

---

## Task: Check Country Data API

Test if the Azure country data function is responding:

```bash
# Test Germany
curl -s "https://{{COMPANY_NAME}}-country-data-action.azurewebsites.net/api/country-data?country=Germany" \
  | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    meta = d.get('metadata', {})
    print(f\"Country: {meta.get('country_name')}\")
    print(f\"Can hire: {meta.get('can_hire')}\")
    print(f\"Status: {meta.get('entity_status')}\")
    print(f\"Onboarding: {meta.get('onboarding_timeline')}\")
except:
    print('API response issue — may need API key')
"
```

---

## Task: Check Lead Volume by Day

See how many chatbot leads came in over the last 30 days:

```bash
source ~/.claude/skills/hubspot-chatbot-manager/scripts/hs-api.sh 2>/dev/null

# Get count of chatbot contacts created recently
THIRTY_DAYS_AGO=$(python3 -c "import time; print(int((time.time() - 30*86400)*1000))")

curl -s -X POST \
  -H "Authorization: Bearer $HUBSPOT_PAT" \
  -H "Content-Type: application/json" \
  "https://api.hubapi.com/crm/v3/objects/contacts/search" \
  -d "{
    \"filterGroups\": [{\"filters\": [
      {\"propertyName\": \"hs_latest_source\", \"operator\": \"EQ\", \"value\": \"CHATBOT\"},
      {\"propertyName\": \"createdate\", \"operator\": \"GTE\", \"value\": \"$THIRTY_DAYS_AGO\"}
    ]}],
    \"properties\": [\"createdate\"],
    \"limit\": 100
  }" | python3 -c "
import sys, json
data = json.load(sys.stdin)
total = data.get('total', 0)
print(f'Chatbot leads in last 30 days: {total}')
"
```

---

## Current Guidelines Summary (as of April 2026)

These are the active rules Maia follows. If you see her breaking any of these, flag to Patrick.

### Critical Rules
1. **Never volunteer VGM info** — if asked, capture contact info and route to team
2. **Entity status messaging** — "{{COMPANY_NAME}} can support [country] — let me connect you with our team for specifics" (not "entity is not fully set up")
3. **Pricing** — Always lead with $599/employee/month when asked about cost
4. **Payroll partners** — Don't say "{{COMPANY_NAME}} doesn't use partners" — say "{{COMPANY_NAME}} manages payroll details vary by country, our team can walk you through your specific setup"

### Moderate Rules
5. **Turkey = Türkiye** — recognize both spellings as the same country
6. **Discount codes** — don't search for codes; redirect to volume pricing conversation
7. **No re-asking** — if email/name already given in conversation, don't ask again

### Formatting Rules
8. **No bold/italic** — plain conversational text only
9. **No source citations** — never mention knowledge base files or Azure Search

---

## Common Questions From Reps

**Q: Maia said we don't have entities in China — is that right?**
A: No, it was wrong. We fixed the data. China should now say can_hire = true with 32 WSE employees. If it's still wrong, let Patrick know.

**Q: Maia quoted a discount code — is that OK?**
A: No. She shouldn't do that. If you see this, screenshot it and flag to Patrick.

**Q: A prospect said Maia told them we don't use payroll partners — is that true?**
A: No, that's incorrect. {{COMPANY_NAME}} uses partners in some markets. Maia should now route to the team for specifics instead of making blanket claims.

**Q: Why does Maia take so long to respond?**
A: The "thinking" indicator is always on — this is built into HubSpot and can't be turned off. The actual response time depends on the AI model load.

---

## Supported Countries (as of April 2026)

Countries where {{COMPANY_NAME}} can hire (can_hire = true):

Australia, Brazil, Canada, Chile, China, Colombia, Croatia, Czech Republic, Denmark, France, Germany, Hungary, India, Isle of Man, Italy, Japan, Lithuania, Mexico, Netherlands, New Zealand, Norway, Papua New Guinea, Philippines, Poland, Singapore, Spain, Sweden, Switzerland, Turkey (Türkiye), Ukraine, United Kingdom, United States

Countries not yet fully supported — route to team for details: check with Patrick for latest list.

---

## Escalation Path

If you see Maia doing something wrong:
1. Screenshot the conversation
2. Note the exact question asked and wrong response
3. Ping {{USER_NAME}} (pdiamitani@{{COMPANY_FILE}}
4. He'll update the guidelines or country data and republish

For urgent issues (bot completely broken, wrong pricing, legal/compliance risk):
→ Escalate to Patrick immediately — he can disable the chatflow in under 2 minutes

---

## Files & Locations

| File | Purpose |
|---|---|
| `~/.claude/skills/hubspot-chatbot-manager/SKILL.md` | Full technical skill (for Patrick/devs) |
| `~/.claude/skills/maia-chatbot-marketer/SKILL.md` | This file — marketer guide |
| `~/.claude/skills/hubspot-chatbot-manager/.env` | Credentials (never share) |
| `{{USER_HOME}}/Desktop/maia-agent/scripts/regenerate-country-blobs.py` | Country data rebuild script |
| `https://ptsalesgtmstorage.blob.core.windows.net/chatbot-country-data/` | Azure blob storage (country JSONs) |
