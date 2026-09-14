---
name: amplemarket-api-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Amplemarket API Reference. Use when working with amplemarket api reference."
---

# Amplemarket API Reference

Amplemarket is {{COMPANY_NAME}}'s sales engagement platform — used for personalized outreach sequences.
Auth is in `references/credentials.md`.

**Base URL:** `https://api.amplemarket.com`
**Auth:** `Authorization: Bearer {{AMPLEMARKET_KEY}}`

> **Note:** Amplemarket's API docs are limited. If an endpoint returns 401/404, try the
> alternate base `https://app.amplemarket.com/api/v1`. Drop Patrick's actual instance URL
> here once confirmed.

---

## Contacts

### List contacts
```
GET /contacts?page=1&per_page=50
```

Query params:
- `page` — page number (1-indexed)
- `per_page` — results per page (max 100)
- `email` — filter by email
- `status` — filter by contact status

Response:
```json
{
  "contacts": [
    {
      "id": "cta_abc123",
      "email": "{{ADMIN_EMAIL}}",
      "first_name": "John",
      "last_name": "Smith",
      "title": "VP of People",
      "company": "Acme Corp",
      "linkedin_url": "linkedin.com/in/john-smith",
      "status": "active",
      "sequences": ["seq_xyz"]
    }
  ],
  "total": 1250,
  "page": 1
}
```

### Get a contact by ID
```
GET /contacts/{contactId}
```

### Get a contact by email
```
GET /contacts?email={{ADMIN_EMAIL}}
```

### Create a contact
```
POST /contacts
{
  "email": "{{ADMIN_EMAIL}}",
  "first_name": "John",
  "last_name": "Smith",
  "title": "VP of People",
  "company": "Acme Corp",
  "company_domain": "acme.com",
  "linkedin_url": "https://linkedin.com/in/john-smith",
  "phone": "+1-555-123-4567",
  "custom_fields": {
    "icp_score": "9",
    "ai_hook": "Your expansion into APAC hiring is exactly where {{COMPANY_NAME}} delivers..."
  }
}
```

### Update a contact
```
PATCH /contacts/{contactId}
{
  "title": "Chief People Officer",
  "custom_fields": {
    "icp_score": "10"
  }
}
```

### Delete / opt-out a contact
```
DELETE /contacts/{contactId}
```
Or to mark as opted-out (preferred over deletion):
```
PATCH /contacts/{contactId}
{ "status": "opted_out" }
```

---

## Sequences (Campaigns)

### List all sequences
```
GET /sequences
```

Response:
```json
{
  "sequences": [
    {
      "id": "seq_abc123",
      "name": "Cold Outbound — HR Leaders",
      "status": "active",
      "steps": 5,
      "enrolled_count": 342
    }
  ]
}
```

### Get a specific sequence
```
GET /sequences/{sequenceId}
```

Returns full sequence with step details (email subjects, bodies, delays).

### Enroll a contact in a sequence
```
POST /sequences/{sequenceId}/enrollments
{
  "contact_id": "cta_abc123",
  "sender_email": "rep@{{COMPANY_FILE}}
  "custom_variables": {
    "first_name": "John",
    "company_name": "Acme Corp",
    "hook": "Your expansion into APAC is where {{COMPANY_NAME}} delivers instantly..."
  }
}
```

Or enroll by email (auto-creates contact if needed):
```
POST /sequences/{sequenceId}/enrollments
{
  "email": "{{ADMIN_EMAIL}}",
  "first_name": "John",
  "last_name": "Smith",
  "company": "Acme Corp",
  "sender_email": "rep@{{COMPANY_FILE}}
}
```

### Bulk enroll contacts in a sequence
```
POST /sequences/{sequenceId}/enrollments/bulk
{
  "contacts": [
    { "contact_id": "cta_abc123" },
    { "contact_id": "cta_def456" }
  ],
  "sender_email": "rep@{{COMPANY_FILE}}
}
```
Max 100 per bulk request.

### Unenroll a contact from a sequence
```
DELETE /sequences/{sequenceId}/enrollments/{contactId}
```

### Get enrollment status
```
GET /sequences/{sequenceId}/enrollments/{contactId}
```

Response includes: status (`active`, `paused`, `completed`, `unsubscribed`), current step, next send time.

---

## Sequence step types

When building sequences via API:

```json
{
  "steps": [
    {
      "step_number": 1,
      "type": "email",
      "delay_days": 0,
      "subject": "{{company_name}} + {{COMPANY_NAME}}",
      "body": "Hi {{first_name}},\n\n{{hook}}\n\nWe help companies like yours hire globally in 160+ countries without setting up a legal entity.\n\nOpen to a quick call?\n\n{{sender_name}}"
    },
    {
      "step_number": 2,
      "type": "email",
      "delay_days": 3,
      "subject": "Re: {{company_name}} + {{COMPANY_NAME}}",
      "body": "Following up, {{first_name}}. Just wanted to make sure my first note landed..."
    },
    {
      "step_number": 3,
      "type": "linkedin_message",
      "delay_days": 5,
      "body": "Hi {{first_name}} — sent you an email about global hiring. Happy to connect here instead."
    },
    {
      "step_number": 4,
      "type": "call",
      "delay_days": 7,
      "instructions": "Reference the email. Ask about their current international hiring setup."
    }
  ]
}
```

---

## Analytics

### Get sequence performance
```
GET /sequences/{sequenceId}/analytics
```

Returns: sent_count, open_rate, reply_rate, bounce_rate, unsubscribe_rate per step.

### Get contact activity
```
GET /contacts/{contactId}/activities
```

Returns: emails sent, opens, clicks, replies, calls logged.

---

## Python patterns

```python
import requests

AMP_BASE = "https://api.amplemarket.com"
AMP_HEADERS = {
    "Authorization": "Bearer {{AMPLEMARKET_KEY}}",
    "Content-Type": "application/json"
}

def list_sequences():
    """List all active sequences."""
    resp = requests.get(f"{AMP_BASE}/sequences", headers=AMP_HEADERS)
    resp.raise_for_status()
    return resp.json()["sequences"]

def create_and_enroll(sequence_id, contact_data, sender_email):
    """
    Create a contact in Amplemarket and enroll in a sequence.
    contact_data = {email, first_name, last_name, company, title, ...}
    """
    # Create contact
    create_resp = requests.post(f"{AMP_BASE}/contacts", headers=AMP_HEADERS, json=contact_data)
    create_resp.raise_for_status()
    contact_id = create_resp.json()["id"]

    # Enroll in sequence
    enroll_payload = {
        "contact_id": contact_id,
        "sender_email": sender_email,
        "custom_variables": {
            "first_name": contact_data.get("first_name", ""),
            "company_name": contact_data.get("company", ""),
        }
    }
    enroll_resp = requests.post(
        f"{AMP_BASE}/sequences/{sequence_id}/enrollments",
        headers=AMP_HEADERS,
        json=enroll_payload
    )
    enroll_resp.raise_for_status()
    return {"contact_id": contact_id, "enrollment": enroll_resp.json()}

def bulk_enroll_from_clay(sequence_id, clay_rows, sender_email):
    """
    Enroll a list of Clay-enriched rows into an Amplemarket sequence.
    clay_rows = list of dicts with: email, first_name, last_name, company_name, ai_hook
    """
    enrolled = []
    errors = []

    for row in clay_rows:
        try:
            result = create_and_enroll(
                sequence_id,
                {
                    "email": row["contact_email"],
                    "first_name": row["contact_first_name"],
                    "last_name": row["contact_last_name"],
                    "company": row["company_name"],
                    "title": row.get("contact_title", ""),
                    "custom_fields": {"ai_hook": row.get("ai_hook", "")}
                },
                sender_email
            )
            enrolled.append(result)
        except Exception as e:
            errors.append({"row": row, "error": str(e)})

    print(f"Enrolled: {len(enrolled)} | Errors: {len(errors)}")
    return {"enrolled": enrolled, "errors": errors}
```

---

## Troubleshooting Amplemarket API

| Issue | Likely cause | Fix |
|-------|-------------|-----|
| 401 Unauthorized | Wrong auth format | Try `X-API-Key` header instead of `Authorization: Bearer` |
| 404 on /contacts | Wrong base URL | Try `https://app.amplemarket.com/api/v1/contacts` |
| Contact already exists | Duplicate email | Use PATCH to update instead of POST |
| Enrollment fails | Contact not in Amplemarket yet | Create contact first, then enroll |
| Sequence not found | Wrong sequence ID | Call GET /sequences to get current IDs |
