---
name: n8n-engineer-skill
description: "LLM-agnostic systems engineering skill that instructs any AI model (Claude, GPT-4o, Gemini, Antigravity, Cursor) to design, compile, and validate production-ready n8n JSON workflows with sovereign architecture, robust error-handling, and zero hardcoded secrets."
---

# n8n Systems Engineer Master Skill

Use this skill when generating, modifying, or auditing n8n workflow JSON graphs for B2B GTM and revenue automation.

---

## 📐 Core Engineering Principles

1. **Deterministic Logic Over Flaky Scripts**:
   - Use native n8n node types (`n8n-nodes-base.httpRequest`, `n8n-nodes-base.code`, `n8n-nodes-base.if`, `n8n-nodes-base.switch`) for predictable pipeline operations.
   - Restrict LLM / Agent nodes strictly to unstructured analysis, entity extraction, and dynamic Problem-Agitate-Solve copy generation.

2. **Zero Hardcoded Secrets**:
   - Never embed raw API keys, tokens, or webhook secrets in JSON node parameters.
   - Always reference environment variables (`={{ $env.SECRET_KEY }}`) or n8n credential objects (`genericAuthType`, `httpHeaderAuth`).

3. **CRM Dedupe Shield Mandatory**:
   - Before executing any outbound action (Smartlead, Instantly, Email, Slack dispatch), query the primary CRM (HubSpot, Salesforce, Attio) to verify:
     - Is the domain or contact an existing active customer?
     - Is there an open deal in progress with another rep?
     - Is the contact marked `Do Not Contact`?

4. **Error Handling & Observability**:
   - Configure retry on failure (3 retries with exponential backoff for external APIs).
   - Wire error triggers (`n8n-nodes-base.errorTrigger`) to route failure payloads (`runData[node][0].error`) directly to RevOps Slack channels.

---

## 🛠️ Canonical JSON Node Schema (v1.x Engine)

```json
{
  "name": "Production GTM Workflow",
  "nodes": [
    {
      "parameters": {},
      "id": "unique-uuid-01",
      "name": "Trigger Node",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300]
    }
  ],
  "connections": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```
