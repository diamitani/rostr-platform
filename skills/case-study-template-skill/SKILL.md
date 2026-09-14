---
name: case-study-template-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Case Study / Project Overview — Template. Use when working with case study / project overview."
---

# Case Study / Project Overview — Template

Build the Case Study from this structure. Lead with outcome. Name technologies and translate
them (see pal-depth-guide.md). Include only the optional sections the evidence earns.

Title format: **[Outcome-led title] — [What it was]**
e.g., *"From 6 Hours to 6 Minutes: An AI Pipeline That Builds Prospect Lists Automatically"*

---

## 1. At a glance (the executive hook)
A 3–4 line box a busy reader can absorb in 10 seconds:

- **The challenge:** [one line]
- **What I built:** [one line]
- **The result:** [one line — lead with the metric if there is one]
- **Stack at a glance:** [Claude/Opus · n8n · HubSpot API · Clay · …] (logos-of-words, scannable)

## 2. The challenge
2–3 short paragraphs. What was the problem, who had it, why it mattered, what it was costing
(time, money, errors, missed opportunity). Make the reader feel the pain before the solution.

## 3. The approach
How the problem was framed and the path chosen. This is where **systems thinking** shows:
what was the plan, what tradeoffs were weighed, why this solution over alternatives. Keep it
narrative, not a spec.

## 4. What I built (How it worked)
The heart of the document. Walk through the solution end-to-end using the **NPAO** spine:
- **Navigate** — the research/feasibility groundwork.
- **Prioritize** — what mattered most and got built first.
- **Allocate** — which tool/agent/person did which job.
- **Orchestrate** — how it all ran together, start to finish.

Embed the **architecture diagram** here if the project warrants one (Mermaid). Use
name-then-translate for every technology mentioned.

## 5. Tools & Integrations  *(include if APIs/MCPs/platforms were used)*
A scannable table — this is the proof of technical range. NEVER a secret value; describe auth.

| Tool / Tech | What it is (plain English) | How it was used here | Connection / auth |
|---|---|---|---|
| Claude Opus | Anthropic's most capable AI model | Generated and QA'd the output | — |
| n8n | App-to-app automation platform | Orchestrated the pipeline | self-hosted |
| HubSpot | CRM | Read deals, wrote contacts | private-app token (stored securely) |
| Clay | Data-enrichment tool | Found + verified contacts | API key (in secret store) |
| MCP server(s) | AI-to-tool secure connector | Let Claude act inside live tools | scoped credentials |

## 6. Systems thinking  *(include if ≥2 systems probes hit — see intake-questionnaire.md)*
Call out explicitly how the project reasoned about the whole system: data flow, failure
handling, scale (built for 50+ reps?), human-in-the-loop gates, feedback/monitoring, and the
key tradeoff decisions. This section is what tells a decision-maker "this person architects,
they don't just script."

## 7. Results & impact
Lead with hard numbers if they exist (time saved, volume, $, accuracy, adoption). If none are
evidenced, give honest qualitative outcomes and scope ("now used by the full SDR team",
"runs daily unattended"). **Never fabricate a metric.** A truthful qualitative result beats
a made-up number that collapses under one follow-up question.

## 8. What this demonstrates  *(portfolio close)*
2–4 bullets naming the transferable skills this project proves: e.g., *API integration,
multi-tool orchestration, AI prompt design, systems architecture, turning a manual process
into an automated one.* This is the "why you should hire/engage me" payload — keep it
confident and specific, never boastful.

---

## Rendering notes
- **HTML version**: use references/html-template.html. The "At a glance" box becomes the hero;
  the Tools table becomes cards; the architecture diagram renders via Mermaid from CDN.
- **.docx/PDF**: route through the `{{COMPANY_NAME}}-docs` skill for Gelion fonts + {{COMPANY_NAME}} branding.
  The **redacted** version keeps the layout but **removes the {{COMPANY_NAME}} logo and any client logo**
  and swaps named entities for category descriptors.
- **Markdown**: this structure verbatim, clean headings, the tables as Markdown tables.
