---
name: azure-ai-foundry-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Azure AI Foundry. Use when working with azure ai foundry."
---

# Azure AI Foundry

Use this reference when the workflow-builder output needs a model recommendation, deployment note, or prompt orchestration plan through Azure AI Foundry.

Official doc:
- `https://learn.microsoft.com/azure/foundry/foundry-models/how-to/use-foundry-models-claude`

## Current Anthropic Claude Deployments To Reference

Based on the current Microsoft Learn Azure AI Foundry Claude guidance:

- `claude-sonnet-4-6`: strongest default for reasoning-heavy workflow decomposition, system planning, and design-direction generation
- `claude-sonnet-4-5`: acceptable fallback when 4.6 is unavailable
- `claude-haiku-4-5`: faster and lighter for rapid iterations, rewrites, variants, and prompt compression

Do not rename deployments in final outputs. If the environment-specific deployment name is unknown, call it out and refer to the model family plus the expected deployment alias.

## Recommended Role Split

- Use Sonnet 4.6 to:
  - unpack ambiguous briefs
  - identify actors, states, and exception paths
  - generate high-quality design direction
  - critique weak visual prompts

- Use Haiku 4.5 to:
  - spin multiple prompt variants
  - rewrite copy to fit frames or nodes
  - compress detailed briefs into concise image prompts
  - generate low-risk alternatives quickly

## Prompt Orchestration Pattern

Use a three-step chain:

1. reasoning
2. structured brief
3. final prompt

Example structure:

```text
Reasoning prompt:
Turn this rough request into a workflow specification, identify hidden constraints, and propose one bold but practical design direction.

Structured brief:
Return JSON with objective, audience, workflow_layers, visual_style, palette, constraints, and frame_plan.

Final prompt:
Generate one concise image prompt for a polished concept board using the structured brief only.
```

## Guardrails

- Keep secrets and endpoint details outside the prompt body.
- Avoid asking the model to invent unsupported tools or product features.
- Use the reasoning model to decide what to draw; use the lighter model to vary how it is phrased.
