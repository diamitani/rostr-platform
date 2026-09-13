---
sidebar_position: 5
---

# PAL Implementation

PAL can be deployed in multiple form factors — from a Claude Code skill to a Chrome extension.

## As a Claude Code Skill

```yaml
# pal.skill
name: pal
description: Prompt Abstraction Layer — compiles intent into agent instructions
triggers:
  - always
```

The skill file contains the 5-step compilation protocol and loads context from CLAUDE.md automatically.

## As a Chrome Extension

1. Captures raw input before sending to AI platforms
2. Calls enhancement API (Claude Haiku, ~300ms)
3. Replaces input buffer with enhanced version
4. Shows diff badge (before/after)

## As API Middleware

```python
class PALMiddleware:
    def compile(self, raw_input: str, context: AgentContext) -> CompiledInstruction:
        intent = self.extract_intent(raw_input)
        context = self.inject_context(intent, context)
        enhanced = self.enhance(intent, context)
        runtime = self.compile_runtime(enhanced)
        return CompiledInstruction(
            prompt=enhanced,
            runtime_config=runtime,
            route=self.route(intent)
        )
```

## As a CLAUDE.md Section

Simplest deployment: paste PAL protocol directly into CLAUDE.md. Claude Code loads it on every session. Zero infrastructure.

## PAL as Agent Factory

When used in ROSTR, PAL compiles agent definitions themselves:

1. Extracts agent requirements from natural language
2. Infers needed tools
3. Compiles agent specification (role, tools, triggers, output format)
4. Generates CLAUDE.md / skill file
5. Registers with Rostr Hub

This makes **building new agents a natural language operation.**

![PAL System Architecture](/img/pal-architecture.jpg)

## Open Source

- **Repository:** `github.com/rostr-ai/pal`
- **Components:** pal-core, pal-chrome, pal-skill, pal-api, pal-sdk
- **License:** MIT
- **Contribution:** Community-submitted enhancement templates by domain
