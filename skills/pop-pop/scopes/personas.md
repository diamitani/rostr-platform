# Persona Defaults

This file defines default personas for POP project intake. When POP detects input, it infers the persona from context and loads these defaults.

---

## Persona: patrick

**Name:** Patrick Diamitani  
**Role:** Founder / Technical Lead  
**Organization:** Diamitani Industries  
**Communication Style:** Imperative, compressed shorthand, execution-first

### Default Settings

**NPAO Priority Weights:**
- Phase Urgency: 0.40 (higher than default 0.35)
- Dependency Impact: 0.25
- Business Impact: 0.25
- Resource Efficiency: 0.10

**Artifact Preferences:**
- Intent Brief: Always
- JTBD Document: Always
- KPI Tracking: Always
- Architecture Diagram: Always
- Project Master Doc: Always
- Build Guide: Always
- Execution Handoff: Always
- PRD: Only if requested
- Project Overview: Only if requested
- Asana Export: Ask first (default: copy-paste format)

**Interview Mode:** Skip questions PAL can infer

**Delivery Preferences:**
- Format: Markdown files in project folder
- Diagram: PNG + Mermaid source
- Handoff: Direct agent bootstrap prompt

### Communication Patterns

**Triggers POP mode when says:**
- "POP"
- "start a project"
- "plan this"
- "scope this"
- "turn this into a project"
- "Hey POP"
- Raw asks with file/link context

**Expects:**
- Immediate action over planning discussion
- Complete artifact packages (no placeholder docs)
- Portable outputs (can hand to any agent/human)
- No jargon explanations (assumes ROSTR framework knowledge)

---

## Persona: executive

**Name:** [To be set on first use]  
**Role:** Executive / Non-technical stakeholder  
**Communication Style:** High-level, business-focused

### Default Settings

**NPAO Priority Weights:**
- Phase Urgency: 0.30
- Dependency Impact: 0.25
- Business Impact: 0.35 (higher than default)
- Resource Efficiency: 0.10

**Artifact Preferences:**
- Intent Brief: Always
- JTBD Document: Always
- KPI Tracking: Always
- Architecture Diagram: Only if requested
- Project Master Doc: Always (simplified)
- Build Guide: Optional
- Execution Handoff: Optional
- PRD: Always
- Project Overview: Always (deck format preferred)
- Asana Export: Always (direct push if enabled)

**Interview Mode:** Full interview (skip nothing)

**Delivery Preferences:**
- Format: Executive summary first, detail docs linked
- Diagram: High-level only, no technical details
- Handoff: Summary for executive, detailed for team

### Communication Patterns

**Expects:**
- Plain-language explanations
- Business value emphasized
- Technical details abstracted
- Clear success metrics
- Risk assessment prominent

---

## Persona: team-lead

**Name:** [To be set on first use]  
**Role:** Engineering Manager / Team Lead  
**Communication Style:** Balanced technical and management

### Default Settings

**NPAO Priority Weights:**
- Phase Urgency: 0.35
- Dependency Impact: 0.35 (higher than default)
- Business Impact: 0.20
- Resource Efficiency: 0.10

**Artifact Preferences:**
- Intent Brief: Always
- JTBD Document: Always
- KPI Tracking: Always
- Architecture Diagram: Always
- Project Master Doc: Always
- Build Guide: Always (emphasis on dependencies)
- Execution Handoff: Always
- PRD: Always
- Project Overview: Optional
- Asana Export: Always (team needs task visibility)

**Interview Mode:** Targeted (focus on team impacts)

**Delivery Preferences:**
- Format: Markdown with task breakdown
- Diagram: Technical architecture with team ownership
- Handoff: Includes team assignment recommendations

### Communication Patterns

**Expects:**
- Clear task breakdowns
- Dependency mapping
- Resource allocation
- Timeline estimates
- Capacity planning considerations

---

## Persona: revops

**Name:** [To be set on first use]  
**Role:** Revenue Operations / Sales Ops  
**Communication Style:** Process-focused, metrics-driven

### Default Settings

**NPAO Priority Weights:**
- Phase Urgency: 0.25
- Dependency Impact: 0.30
- Business Impact: 0.30
- Resource Efficiency: 0.15 (higher than default)

**Artifact Preferences:**
- Intent Brief: Always
- JTBD Document: Always (emphasis on user workflows)
- KPI Tracking: Always (emphasis on ROI metrics)
- Architecture Diagram: Optional
- Project Master Doc: Always (focus on integration points)
- Build Guide: Always (process documentation critical)
- Execution Handoff: Always
- PRD: Optional
- Project Overview: Always
- Asana Export: Always

**Interview Mode:** Full interview (process details matter)

**Delivery Preferences:**
- Format: Process flowcharts + documentation
- Diagram: Integration architecture
- Handoff: Includes training/rollout plan

### Communication Patterns

**Expects:**
- Clear process flows
- Integration requirements
- Training needs
- Adoption metrics
- ROI calculations

---

## Adding New Personas

To add a new persona, create a new section with:

1. **Header:** `## Persona: [slug]`
2. **Metadata:** Name, Role, Organization, Communication Style
3. **Default Settings:** NPAO weights, Artifact preferences, Interview mode, Delivery preferences
4. **Communication Patterns:** Trigger phrases, Expectations

Then update the persona detection logic in POP to recognize the new persona.

---

**Version:** 1.0  
**Last Updated:** [Date]
