---
name: mermaid-diagrams-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Mermaid.js — Diagram & Workflow Creation. Use when working with mermaid.js."
---

# Mermaid.js — Diagram & Workflow Creation

Mermaid is a free, open-source diagramming library that renders text-based diagram definitions
into visual diagrams. Use it any time you need to communicate:
- System/workflow architecture to engineers or stakeholders
- GTM automation flows for ELT presentations
- Project plans and timelines
- Data flows between tools (Clay → n8n → HubSpot → Amplemarket)
- Process breakdowns for non-technical audiences

Mermaid diagrams render natively in Cowork, GitHub, Notion, Confluence, and many markdown tools.
Output as `.mermaid` files or embed in markdown with ` ```mermaid ` fences.

---

## Diagram Types & When to Use Each

| Type | Best for |
|------|---------|
| `flowchart` | Process flows, decision trees, automation logic |
| `sequenceDiagram` | API interactions, step-by-step flows between systems |
| `gantt` | Project timelines, implementation plans |
| `classDiagram` | Data models, system architecture |
| `stateDiagram` | Status transitions (deal stages, lead lifecycle) |
| `erDiagram` | Database/data structure relationships |
| `journey` | Customer/user journey maps |
| `quadrantChart` | Priority/effort matrices, competitive positioning |
| `mindmap` | Brainstorming, feature breakdown |
| `timeline` | Chronological project or launch plans |
| `xychart` | Bar/line charts for data visualization |

---

## Flowcharts — GTM Automation Flows

Use `flowchart TD` (top-down) for automation pipelines, `LR` for left-to-right data flows.

### Example: Full Outbound Pipeline
```mermaid
flowchart TD
    A[📋 Company List\nLinkedIn / Events / Research] --> B[Clay Table\nCompany Enrichment]
    B --> C{ICP Score\n≥ 6?}
    C -->|Yes| D[People Search\nFind HR/Finance Contact]
    C -->|No| Z[❌ Skip Row]
    D --> E{Verified\nEmail Found?}
    E -->|Yes| F[Claygent\nGenerate AI Hook]
    E -->|No| Z2[🔄 Try LinkedIn DM Path]
    F --> G[n8n Webhook Trigger]
    G --> H[HubSpot\nUpsert Contact + Company]
    H --> I{ICP Score\n≥ 8?}
    I -->|High Priority| J[Amplemarket\nPriority Sequence]
    I -->|Standard| K[Amplemarket\nStandard Sequence]
    J --> L[HubSpot\nStatus → IN_PROGRESS]
    K --> L

    style A fill:#f0f4ff,stroke:#4f6ef7
    style B fill:#e8f5e9,stroke:#43a047
    style G fill:#fff3e0,stroke:#fb8c00
    style H fill:#fce4ec,stroke:#e91e63
    style J fill:#e3f2fd,stroke:#1e88e5
    style K fill:#e3f2fd,stroke:#1e88e5
```

### Example: Inbound Lead Routing
```mermaid
flowchart TD
    A[Form Fill\nHubSpot] --> B[n8n: Webhook Received]
    B --> C[Extract Email Domain]
    C --> D[Clay: Add to Enrichment Table]
    D --> E[⏱ Wait for Enrichment\nPoll every 30s, max 5min]
    E --> F[Retrieve Enriched Row]
    F --> G{ICP Tier?}
    G -->|Tier A| H[Route to AE\nHigh Priority]
    G -->|Tier B| I[Route to SDR\nStandard]
    G -->|Tier C/D| J[Nurture Sequence]
    H --> K[HubSpot: Assign Owner\nSet Status: MQL]
    I --> L[HubSpot: Assign SDR\nEnroll Amplemarket]
    J --> M[HubSpot: Add to\nMarketing Nurture]
```

---

## Sequence Diagrams — API & System Interactions

Use for showing how tools talk to each other — great for engineers and RevOps.

### Example: Clay → n8n → HubSpot Data Flow
```mermaid
sequenceDiagram
    participant Clay
    participant n8n
    participant HubSpot
    participant Amplemarket

    Clay->>n8n: POST /webhook/clay-enriched<br/>{company, contact, icp_score, ai_hook}
    n8n->>n8n: Check: icp_score >= 6?
    n8n->>HubSpot: POST /crm/v3/objects/companies/batch/upsert
    HubSpot-->>n8n: 200 {company_id}
    n8n->>HubSpot: POST /crm/v3/objects/contacts/batch/upsert
    HubSpot-->>n8n: 200 {contact_id}
    n8n->>HubSpot: POST /crm/v4/associations (link contact→company)
    HubSpot-->>n8n: 200
    n8n->>HubSpot: POST /crm/v3/objects/notes (attach ai_hook)
    HubSpot-->>n8n: 200
    n8n->>Amplemarket: POST /sequences/{id}/enrollments
    Amplemarket-->>n8n: 200 {enrollment_id}
    n8n->>HubSpot: PATCH contact {hs_lead_status: IN_PROGRESS}
    HubSpot-->>n8n: 200
```

---

## Gantt Charts — Project Plans & Implementation Timelines

### Example: {{COMPANY_NAME}} Sales Cycle + Implementation
```mermaid
gantt
    title {{COMPANY_NAME}} Deal → First Hire Timeline
    dateFormat  YYYY-MM-DD
    section Sales Cycle
    Discovery Call           :a1, 2025-01-06, 3d
    Proposal Preparation     :a2, after a1, 4d
    Proposal Presented       :a3, after a2, 2d
    Legal Review (MSA/SOW)   :a4, after a3, 7d
    Contract Signed          :milestone, after a4, 0d

    section Implementation
    Deposit Payment          :b1, after a4, 3d
    Template & Policy Setup  :b2, after b1, 7d
    Employee Townhalls       :b3, after b2, 3d
    Census Submission        :b4, after b3, 2d
    Employee Onboarding      :b5, after b4, 14d
    First Payday             :milestone, after b5, 0d
```

### Example: GTM Automation Build Plan
```mermaid
gantt
    title GTM Automation Initiative — Q1 2025
    dateFormat  YYYY-MM-DD
    section Clay Setup
    Outbound Prospecting Table    :c1, 2025-01-06, 7d
    Inbound Enrichment Table      :c2, after c1, 5d
    Competitive Signal Table      :c3, after c2, 5d

    section n8n Workflows
    Clay → HubSpot Sync           :n1, 2025-01-13, 7d
    Inbound Routing Workflow      :n2, after n1, 7d
    Deal Stage → Amplemarket      :n3, after n2, 5d
    Weekly Pipeline Report        :n4, after n3, 3d

    section HubSpot Config
    Custom Properties Setup       :h1, 2025-01-06, 3d
    Pipeline Stage Mapping        :h2, after h1, 3d

    section Testing & QA
    End-to-End Testing            :t1, 2025-02-03, 7d
    Rep Training                  :t2, after t1, 5d
    Go Live                       :milestone, after t2, 0d
```

---

## State Diagrams — Lead & Deal Lifecycle

### Example: HubSpot Lead Lifecycle
```mermaid
stateDiagram-v2
    [*] --> New : Form fill / Clay sync
    New --> InProgress : SDR claims / AE assigns
    New --> Nurture : Low ICP score
    InProgress --> MQL : Discovery call booked
    MQL --> SQL : Demo completed
    SQL --> Opportunity : Proposal sent
    Opportunity --> ClosedWon : Contract signed
    Opportunity --> ClosedLost : No decision / competitor
    Nurture --> New : Re-engagement trigger
    ClosedLost --> Nurture : 90-day recycle
```

---

## Quadrant Charts — Prioritization & Strategy

### Example: GTM Automation Priority Matrix
```mermaid
quadrantChart
    title GTM Automation — Impact vs. Effort
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Build First
    quadrant-2 Plan Carefully
    quadrant-3 Skip / Defer
    quadrant-4 Quick Wins
    Clay Outbound Table: [0.3, 0.9]
    n8n Clay→HubSpot Sync: [0.35, 0.85]
    Inbound Enrichment: [0.4, 0.8]
    Amplemarket Enrollment: [0.45, 0.75]
    Weekly Pipeline Report: [0.25, 0.6]
    Competitive Signal Monitor: [0.55, 0.7]
    Deal Stage Automation: [0.6, 0.65]
    Post-Demo Automation: [0.65, 0.6]
    Custom HubSpot Reports: [0.2, 0.35]
    Manual Data Cleanup: [0.8, 0.2]
```

---

## Mind Maps — System Breakdown for Stakeholders

### Example: {{COMPANY_NAME}} GTM Stack Overview
```mermaid
mindmap
  root(({{COMPANY_NAME}} GTM Stack))
    Clay
      Outbound Prospecting
        Company Enrichment
        Contact Finding
        ICP Scoring
        AI Hook Generation
      Inbound Enrichment
        Lead Scoring
        ICP Tier Assignment
      Competitive Monitoring
        Tech Stack Detection
        Displacement Signals
    n8n
      Clay → HubSpot Sync
      Inbound Routing
      Deal Stage Triggers
      Scheduled Reports
      Amplemarket Enrollment
    HubSpot CRM
      Contacts & Companies
      Deal Pipeline
      Sequences
      Custom Properties
      Owner Assignment
    Amplemarket
      Outreach Sequences
      Sequence Variables
      Contact Enrollment
      Performance Analytics
```

---

## Timeline — Product/Initiative Launches

```mermaid
timeline
    title {{COMPANY_NAME}} AI GTM Initiative Roadmap
    section Q1 2025
        January  : Clay tables live
                 : HubSpot custom properties
        February : n8n workflows deployed
                 : Inbound routing live
        March    : Amplemarket integration
                 : First automated sequence enrolled
    section Q2 2025
        April    : Competitive signal monitoring
        May      : AI hook generation at scale
        June     : Weekly pipeline automation
                 : Rep training complete
    section Q3 2025
        July     : Post-demo automation
        Q3       : Full GTM stack running
                 : ELT reporting dashboard live
```

---

## Best Practices for Stakeholder Diagrams

**For ELT / Executive audiences:**
- Use flowcharts with clear swim lanes (use `subgraph` to group by team/system)
- Keep to 1 diagram = 1 concept; don't try to show everything in one chart
- Label decision nodes clearly — executives want to see the logic, not the tech
- Gantt charts land well for timelines and project plans
- Lead with the business outcome, not the tooling

**For engineers / technical audiences:**
- Sequence diagrams for API flows
- Class/ER diagrams for data models
- Use proper technical names (endpoint paths, payload fields)

**For sales / GTM teams:**
- Journey maps and flowcharts
- State diagrams for deal/lead lifecycle
- Quadrant charts for prioritization discussions

**Swim lane pattern (group nodes by owner):**
```mermaid
flowchart LR
    subgraph Clay ["🔵 Clay"]
        A[Enrich] --> B[Score] --> C[Hook]
    end
    subgraph n8n ["🟠 n8n"]
        D[Receive Webhook] --> E[Route]
    end
    subgraph HubSpot ["🔴 HubSpot"]
        F[Create Contact] --> G[Assign Owner]
    end
    subgraph Amplemarket ["🟢 Amplemarket"]
        H[Enroll Sequence]
    end
    C --> D
    E --> F
    G --> H
```

---

## Saving and Sharing

- Save as `workflow-name.mermaid` in the outputs folder
- Embed in markdown: wrap in ` ```mermaid ``` ` fences
- Render in: Cowork (native), GitHub, Notion, Confluence, VS Code (Mermaid extension), mermaid.live (online editor)
- For presentations: paste into Notion or Confluence, screenshot, drop into slides
- For ELT: export from mermaid.live as SVG for crisp vector rendering in decks
