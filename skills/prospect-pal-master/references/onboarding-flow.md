> Source: diamitani/prospect-pal repo (merged into Rostr 2026-09-14). Prospect PAL dashboard/client-portal build specs.

# Campaign: {{campaign_title}}

## Company Profile
...

## Target ICP
...

## Buyer Persona
...

## Tool Stack
...
```

### 2. n8n Workflow JSON (workflow.json)
Production-ready n8n workflow with all nodes configured.

### 3. Email Framework (email-framework.md)
PAS email templates with personalization variables.

### 4. Build Prompts (build-prompts.md)
Prompts for regenerating or adjusting the workflow.

### 5. Deploy Guide (deploy-guide.md)
Step-by-step instructions for going live.

### 6. Skill Definition (skill.md)
Claude Code skill for reuse.

---

## Dashboard Integration

### Campaign List View
```typescript
interface Campaign {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  stats: {
    leads_found: number;
    emails_sent: number;
    replies: number;
    meetings: number;
  };
}
```

### Campaign Workspace View
```typescript
interface CampaignWorkspace {
  campaign: Campaign;
  outputs: {
    workflow_json: string;
    email_framework: string;
    deploy_guide: string;
    skill_definition: string;
  };
  agents: {
    tools: AgentStatus;
    copywriter: AgentStatus;
    workflow: AgentStatus;
    analyst: AgentStatus;
  };
}
```

### Quick Actions
- Edit Campaign
- Download Outputs
- Deploy to n8n
- View Analytics
- Chat with Agent

---

## Webhook Payload

### POST /api/webhook/intake
```json
{
  "company": {
    "name": "...",
    "background": "...",
    "product": "..."
  },
  "campaign": {
    "title": "...",
    "description": "..."
  },
  "icp": {
    "industries": [],
    "company_size": "...",
    "geographies": [],
    "prompt": "..."
  },
  "persona": {
    "titles": [],
    "seniority": [],
    "departments": [],
    "prompt": "..."
  },
  "signals": {
    "triggers": [],
    "pain_points": "...",
    "prompt": "..."
  },
  "tools": {
    "lead_source": "...",
    "enrichment": [],
    "crm": "...",
    "sequencer": "...",
    "approval_gate": true,
    "slack_notifications": true
  }
}
```

### Response
```json
{
  "campaign_id": "uuid",
  "status": "processing",
  "outputs": {
    "workflow_json": "/api/campaigns/{id}/workflow.json",
    "email_framework": "/api/campaigns/{id}/email-framework.md",
    "deploy_guide": "/api/campaigns/{id}/deploy-guide.md",
    "skill_definition": "/api/campaigns/{id}/skill.md"
  },
  "estimated_time_seconds": 30
}
```

---

## Pricing Tiers

### DIY Package ($19.99 one-time)
- n8n workflow templates
- Email framework templates
- Build prompts
- Self-serve deploy guide
- Claude Code skills

### Pro BYOK ($99/month)
- Full dashboard access
- Unlimited campaigns
- All agents (tools, copy, workflow, analyst)
- BYOK API key management
- Priority support

### Custom Build ($999+)
- White-glove implementation
- Custom integrations
- Dedicated support
- Training sessions
- SLA guarantees
