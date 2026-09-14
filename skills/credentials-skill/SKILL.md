---
name: credentials-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with GTM Architect — Credentials & Auth Config. Use when working with gtm architect."
---

# GTM Architect — Credentials & Auth Config

> **Security note:** This file contains live API credentials for Patrick's GTM stack.
> Keep this file private. Do not log, echo, or expose these values in outputs shown to others.

---

## n8n

**Auth type:** Bearer JWT
**Token:**
```
{{N8N_API_KEY}}
```

**Base URL:** `https://your-n8n-instance.com/api/v1`
⚠️ **Action needed:** Replace `your-n8n-instance.com` with your actual n8n host (e.g., `n8n.{{COMPANY_FILE}} or `app.n8n.cloud/...`). Patrick — drop your n8n URL and I'll update this.

**Header pattern:**
```python
headers = {
    "X-N8N-API-KEY": "<token above>",
    "Content-Type": "application/json"
}
```
Note: n8n's public API uses `X-N8N-API-KEY` header, not `Authorization: Bearer`.

---

## HubSpot

**Auth type:** Private App Token (PAT) — all scopes granted
**Token:**
```
{{CLAY_API_KEY}}
```

**Base URL:** `https://api.hubapi.com`

**Header pattern:**
```python
headers = {
    "Authorization": "Bearer {{CLAY_API_KEY}}",
    "Content-Type": "application/json"
}
```

---

## Amplemarket

**Auth type:** API Key
**Key:**
```
{{AMPLEMARKET_KEY}}
```

**Base URL:** `https://api.amplemarket.com`
(Verify if your account is on a subdomain — some Amplemarket instances use `https://app.amplemarket.com/api`)

**Header pattern:**
```python
headers = {
    "Authorization": "Bearer {{AMPLEMARKET_KEY}}",
    "Content-Type": "application/json"
}
```
Alternative if Bearer doesn't work:
```python
headers = {
    "X-API-Key": "{{AMPLEMARKET_KEY}}",
    "Content-Type": "application/json"
}
```

---

## Clay

**Auth type:** Bearer API Key
**Key:** Retrieve from Clay UI → Settings → API Keys (not stored here — use Clay Secrets for column configs)

**Base URL:** `https://api.clay.com/v1`

**Header pattern:**
```python
headers = {
    "Authorization": "Bearer YOUR_CLAY_API_KEY",
    "Content-Type": "application/json"
}
```

---

## Python boilerplate — all four tools

```python
import requests

# n8n
N8N_BASE = "https://your-n8n-instance.com/api/v1"  # UPDATE THIS
N8N_HEADERS = {
    "X-N8N-API-KEY": "{{N8N_API_KEY}}",
    "Content-Type": "application/json"
}

# HubSpot
HS_BASE = "https://api.hubapi.com"
HS_HEADERS = {
    "Authorization": "Bearer {{CLAY_API_KEY}}",
    "Content-Type": "application/json"
}

# Amplemarket
AMP_BASE = "https://api.amplemarket.com"
AMP_HEADERS = {
    "Authorization": "Bearer {{AMPLEMARKET_KEY}}",
    "Content-Type": "application/json"
}

# Clay
CLAY_BASE = "https://api.clay.com/v1"
CLAY_HEADERS = {
    "Authorization": "Bearer YOUR_CLAY_API_KEY",
    "Content-Type": "application/json"
}
```
