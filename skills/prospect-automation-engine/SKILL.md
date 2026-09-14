---
name: prospect-automation-engine
description: "Master Autonomous GTM Architect, n8n Systems Engineer, and Execution Analyst. Unifies 5-Pillar Outbound Architecture (Trigger Ingest, CRM Shield & Dedupe, Data & Contact Reveal, AI PAS Copywriting, Sequencer Enrollment), production n8n JSON compilation & node authoring, sub-workflows, MCP integrations, and deep n8n Public API execution diagnostics & error triage."
---

# Master Prospect Automation Engine & n8n Systems Architect

Use this skill when designing, compiling, deploying, scaling, or debugging autonomous outbound prospecting engines, GTM automation workflows, and production n8n architectures.

This master skill operates across three interconnected systems:
1. **The GTM Prospect Automation Engine (PAE)**: Designing and compiling end-to-end 5-Pillar outbound revenue workflows.
2. **The n8n Systems Engineer**: Authoring production-ready n8n node graphs, expression logic, sub-workflows, and MCP interfaces.
3. **The n8n Execution Analyst & Debugger**: Diagnosing live n8n execution failures, analyzing node errors (`runData[node][0].error`), and synthesizing root-cause fixes.

---

## 🎯 Master Operating Principles

1. **5-Pillar Architecture First**:
   `[ Trigger Ingest ] ➔ [ CRM Dedupe Shield ] ➔ [ Contact Reveal ] ➔ [ AI PAS Copywriting ] ➔ [ Sequencer Enrollment ]`
2. **CRM Shield Mandatory**: Never send an email or enroll a prospect without checking the CRM system of record (HubSpot, Salesforce, Attio, Pipedrive) for active deals, domain ownership, or existing client tags.
3. **Deterministic Data, Agentic Synthesis**:
   - Deterministic nodes for triggers, deduplication, filtering, upserts, and sequence enrollment.
   - LLMs (Claude 3.5 Sonnet, GPT-4o, DeepSeek) strictly for unstructured research and 3-sentence Problem-Agitate-Solve (PAS) copy.
4. **Zero Hardcoded Secrets**: Secrets and credentials must strictly live in `.env` variables or n8n credential stores (`={{ $env.API_KEY }}`), never inline in workflows.
5. **Human Approval Switch**: High-impact actions (cold outreach, mass updates) default to an approval gate routing to Slack with 1-click confirmation.
6. **Execution Observability & Self-Healing**: Workflows must include error handling paths and expose structured execution run data for automated analysis.

---

## 📐 Part 1: The 5-Pillar 9-Node Production Pattern

Every prospect automation workflow specializes the canonical 9-node production graph:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Node 01     │ ──> │     Node 02     │ ──> │     Node 03     │
│ Trigger Ingest  │     │ Data Normalizer │     │ CRM Dedupe Gate │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
┌─────────────────┐     ┌─────────────────┐              ▼
│     Node 06     │ <── │     Node 05     │ <── ┌─────────────────┐
│ Approval Switch │     │ AI PAS Reasoner │     │     Node 04     │
└─────────────────┘     └─────────────────┘     │ Data Enrichment │
         │                                      └─────────────────┘
         ├───────────────┐
         ▼ (Auto/Approved)▼ (Needs Review)
┌─────────────────┐     ┌─────────────────┐
│     Node 07     │     │     Node 09     │
│   CRM Upsert    │     │   Slack Alert   │
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│     Node 08     │
│ Sequencer Enrl  │
└─────────────────┘
```

### The 3 Ingestion Trigger Patterns (Node 01):
- **Spreadsheet / CSV Upload**: `n8n-nodes-base.webhook` with `options.binaryData = true` + CSV Parser.
- **Scheduled CRM Sync / Daily Cron**: `n8n-nodes-base.scheduleTrigger` configured for daily batch (e.g. 2:00 AM) pulling uncontacted leads.
- **Real-Time Intent Stream / Webhook**: `n8n-nodes-base.webhook` listening for website visitor identification (RB2B, Clearbit, Warmly).

### Node-by-Node Specification:
- **Node 01 (Trigger Ingest)**: Ingests raw prospect stream (Webhook or Schedule).
- **Node 02 (Data Normalizer)**: Code node (JS/Python) that cleans company domain, trims whitespaces, normalizes job titles, and standardizes payload schemas.
- **Node 03 (CRM Dedupe Shield)**: Queries CRM by domain/email. If open deal, active pipeline stage, or client tag exists, drops/halts to prevent deal collision.
- **Node 04 (Data Tool / Contact Reveal)**: HTTP Request to Clay, Apollo, ZoomInfo, or Amplemarket with exact boolean ICP titles (e.g. `["VP of Sales", "Head of RevOps"]`).
- **Node 05 (AI Research & PAS Copywriting)**: `langchain.agent` or LLM node generating a 3-sentence email:
  * *Sentence 1 (Problem)*: Specific observation about the company/role.
  * *Sentence 2 (Agitate)*: Operational friction or revenue loss quantification.
  * *Sentence 3 (Solve)*: Low-friction introduction to client's offer with clear value and low-commitment CTA.
- **Node 06 (Approval Switch)**: IF/Switch node checking `auto_approved_actions` vs `require-approval`.
- **Node 07 (CRM Upsert)**: Creates or updates contact with status `OUTREACH_ACTIVE` and saves AI research notes.
- **Node 08 (Sequencer Enrollment)**: Enrolls verified contact with personalized PAS body and subject into Smartlead, Instantly, Lemlist, or HubSpot Sales.
- **Node 09 (Slack Alert)**: Sends a rich Block Kit card to SDR channel with prospect summary and 1-click approval webhook button.

---

## ⚡ Part 2: n8n Systems Engineer Mastery

When authoring or modifying n8n workflows:

1. **Official Node Types & Syntax**:
   - Expression syntax: Always use `={{ $json.fieldName }}` or `={{ $node["NodeName"].json.fieldName }}`.
   - Code Nodes: Use `return items.map(item => ({ json: { ...item.json } }));` for clean data pipelines.
   - HTTP Request Nodes: Set `authentication: 'predefinedCredentialType'` or externalize headers via `={{ $env.API_KEY }}`.
2. **Sub-Workflows & Modularization**:
   - Isolate repeated business logic (e.g., Domain Deduplication, Company Enrichment, Web Scraping) into dedicated sub-workflows called via `n8n-nodes-base.executeWorkflow`.
3. **MCP (Model Context Protocol) Integration**:
   - **Instance-Level MCP**: Recommend as default control plane for Claude / Cursor to discover and run approved workflows across an n8n instance.
   - **MCP Server Trigger**: Expose purpose-built tools from a specific workflow.
   - **MCP Client Tool**: Enable an n8n AI Agent to query external MCP servers.

---

## 🔬 Part 3: n8n Execution Analyst & Debugger

When analyzing n8n health or diagnosing failures:

### The Diagnostic Flow:
1. **Resolve Workflow**:
   - Accept workflow ID, full URL (`https://<instance>/workflow/<id>`), or fuzzy search query via `GET /workflows?limit=100&cursor=...`.
2. **Fetch Execution Run Data**:
   - Query `GET /executions?workflowId={id}&status=error&limit=10`.
   - Pull full execution detail with `GET /executions/{id}?includeData=true`.
3. **Extract Node-Level Errors**:
   - Inspect `data.resultData.runData.[nodeName][0].error`.
   - Extract:
     * Failing node name and node type
     * Exact error message, HTTP status code (e.g., 401 Unauthorized, 429 Rate Limit, 500 Server Error)
     * First-failure timestamp and failure frequency
     * Input payload that triggered the failure
4. **Synthesize Diagnosis & Output**:
   - **Plain-English Root Cause**: What went wrong and why (e.g., "The Clay Enrichment node failed with 429 Too Many Requests because batches exceeded 10 req/sec").
   - **Remediation Plan**: Exact step-by-step fix (e.g., "Add Split In Batches node with 1000ms delay", "Update expired API key in n8n Credentials").
   - **Export Formats**: Deliver analysis as Markdown prose, structured summary tables, or downloadable `.xlsx` reports.

---

## 📦 Master Deliverables Package

For every prospect automation or n8n build request, provide:
1. **`.n8n.json`**: Production-ready workflow JSON importable directly into n8n.
2. **`BUILD_PROMPT.md`**: Step-by-step deploy instructions and credential checklist.
3. **`.env.template`**: All required environment variables and API placeholders.
4. **`PRD.md`**: Architectural specification of the GTM pipeline and ICP matrix.
5. **`email-framework.md`**: 3-Sentence PAS copywriting templates and variable schema.
6. **`Ack JSON Contract`**: Structured runtime status and connector binding receipt.
