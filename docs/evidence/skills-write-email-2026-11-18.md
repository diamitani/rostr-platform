# Skills layer: write-email, live-proven — 2026-11-18 (evening)

Owner call: "each tool needs a skill so there should be write email skill
based on semantic analysis of what you want or suggested update like google
but with the proper formatting etc." (phonemsg-01M7RPSZ9T8ZS2GXFVXBEEVFBX).

## What was built

- `lib/rostr/skills.ts`: the skills layer. WriteEmailSkill has three
  model-backed stages — analyze (semantic: picks the email FORM by meaning,
  extracts recipient/goal/tone/key points), draft (writes to the form's
  formatting contract), suggest (Gmail-style suggested edit: revises a draft
  from a natural-language instruction and summarizes the change). Six forms
  ship with explicit formatting contracts: thank-you, follow-up,
  announcement, cold-outreach, request, reply.
- Skill registry, one skill per tool: write-email (email_send), publish-note
  (publish), web-research (web_search), file-writer (write_file), hn-digest
  (HACKERNEWS_GET_FRONTPAGE). write-email is fully staged; the others are
  registered with their contracts and grow stages next.
- New tool: `suggest_edit` (read-only, model-backed) — any agent can hand it
  text + an instruction and get a rewrite with a change summary.
- `scripts/e2e-skill-run.ts`: live driver; stages can run individually
  (E2E_STAGE=analyze|draft|suggest|send) for short execution windows.
- Gateway hardening found necessary during live runs: empty-content
  responses (a recurring free-model flake) now retry; skill JSON stages
  retry once on truncated/invalid JSON with higher token caps.

## Live proof (free OpenRouter model, mock off, each stage a real call)

Request: "Write an email to Patrick thanking the beta testers who signed up
this week for Artispreneur, mentioning the new credit wallet and model
picker, and inviting feedback by reply."

Stage 1 analysis (live): form=thank-you, tone="warm, appreciative",
keyPoints=[thank this week's testers, credit wallet, model picker, invite
feedback by reply].

Stage 2 draft (live):
  Subject: Thanks for trying Artispreneur's credit wallet, model picker
    Hi Patrick,
  
  Thank you for joining Artispreneur as a beta tester this week — we're truly grateful.
  
  You now have early access to our new credit wallet, keeping your usage simple and transparent, and the new model picker, so you can choose the right model for every creative task. Feedback from testers like you is already shaping how these features evolve.
  
  Reply anytime with your thoughts — we'd love to hear them.
  
  Warmly,
  The Artispreneur Team

Stage 3 suggested edit (live) — instruction: "Make it shorter and warmer,
and add that the first month of credits is free."
  Model's change summary: "Trimmed to one impact paragraph, removed the reply request, added free first month of credits, and warmed the close."
  Subject: Thanks for testing our credit wallet, model picker
    Hi Patrick,
  
  Thank you for trying Artispreneur's new credit wallet and model picker this week — we're so glad you're here.
  
  Your early feedback is already shaping how these features grow, helping us build something genuinely useful for creative work. And your first month of credits is on us, so you can explore both freely, without worry.
  
  With gratitude,
  The Artispreneur Team
  (Honest note: the model dropped the reply-invite line on its own while
  applying the edit and admitted it in its summary.)

Stage 4 send (live): the revised draft was sent through email_send
(Composio, his working Gmail connection) to his own mailbox after the
confirm hook approved it. Gmail response: labelIds ["SENT"], message id
1a1f175239380606.

## Scope

- Charge tools remain unbuilt (flagged).
- publish-note, web-research, file-writer, hn-digest skills are registered
  with contracts; their staged implementations are the next build step.
- The skill run sent exactly one real email (the proof above) to his own
  mailbox.
