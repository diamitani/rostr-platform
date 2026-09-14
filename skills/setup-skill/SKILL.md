---
name: setup-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with MSA DocuSign Skill — One-Time Setup (per seller). Use when working with msa docusign skill."
---

# MSA DocuSign Skill — One-Time Setup (per seller)

The skill fills the DocuSign MSA intake form in your browser. For that it needs ONE of the connections below. You only do this once. If nothing is set up, the skill will detect it and walk you through this in chat.

## Option 1 — Claude for Chrome extension (recommended)
1. Open Google Chrome (desktop only).
2. Go to the Chrome Web Store and search "Claude" (Claude for Chrome, by Anthropic).
3. Click **Add to Chrome** and accept the permissions.
4. Sign in with your {{COMPANY_NAME}} Claude account when prompted.
5. Pin it: click the puzzle-piece icon in the toolbar, then the pin next to "Claude".
6. Done. Keep Chrome open when you run the MSA skill.

Notes:
- Requires a Claude plan with browser-use access (currently in beta — Max plans have it; if your {{COMPANY_NAME}} account doesn't show the extension working, tell Patrick and use Option 2).
- Security: the extension is official Anthropic software. The skill only fills form fields in YOUR logged-in DocuSign session, on your screen, with you watching. It never uploads the document and never clicks Submit — you do those.
- Counterparties/vendors never install anything. This setup is for {{COMPANY_NAME}} sellers only.

## Option 2 — Control Chrome (Claude Desktop extension, no browser extension)
1. In the Claude Desktop app: Settings → Extensions (Connectors directory).
2. Find and enable **Control Chrome** (drives your Chrome via AppleScript — macOS).
3. Approve the macOS automation permission when prompted (System Settings → Privacy & Security → Automation → Claude → allow Chrome).
4. Done. Keep Chrome open when you run the MSA skill.

## Option 3 — None of the above
The skill still works: it gives you the validated values as a copy-paste block and the form link. ~60 seconds of pasting. No installs.

## Test it
In a new Claude chat type: `start msa <your HubSpot deal URL>` and walk through the 3 confirmation steps. At the fill step, the skill should open/use Chrome and type everything for you. You attach the MSA document and click Submit.

## Troubleshooting
- "No browser automation connected": Chrome isn't open, the extension isn't signed in, or it's disabled. Open Chrome, click the Claude icon once, retry in chat.
- Fields filled in the wrong boxes: tell the skill — it re-reads the page and re-fills; it verifies every field after filling.
- Anything else: ping Patrick (pdiamitani@{{COMPANY_FILE}}
