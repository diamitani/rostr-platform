---
name: correspondence-drafter
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with correspondence drafter. Use when working with correspondence drafter."
---

# Correspondence Drafter

Write the way a good coverage lawyer writes: short sentences, numbered facts, exhibits cited by name, relief requested precisely. No threats, no adjectives doing the work of evidence, no bluffing about lawsuits.

## Before drafting — the intake gate

Do not draft until these are in hand; ask for what's missing:

1. **The case manifest + fact sheet** (from `case-intake-organizer`) — draft only from filed, verified documents.
2. **The theory** — which 1–3 dispute patterns from `insurance-coverage-playbook` §3 are being argued, and which verified authorities support them.
3. **The ask** — the exact relief requested (reconsideration? retroactive reinstatement? claim reopening? documents produced?).
4. **The recipient's own words** — quote the denial/notice being answered; answer *it*, not a strawman.
5. **Counsel-only screen** — re-read the fact sheet's PRIVATE section and confirm none of it is in the draft unless Patrick explicitly authorized its inclusion.

## The three draft types

### 1. Insurer reconsideration / appeal letter
```
[Date] — VIA [method]
[Recipient, title, company, address]

Re: Request for Reconsideration — Policy [___], Claim [___]

Dear [Name]:

1. INTRODUCTION (2–3 sentences: who, what happened, what is requested)
2. FACTUAL BACKGROUND (numbered, chronological, each citing an exhibit: "See Ex. 3")
3. BASIS FOR RECONSIDERATION (numbered arguments; each = facts + why they matter; cite verified authorities only)
4. RELIEF REQUESTED (bulleted, specific: "reverse the coverage denial dated ___ and reopen claim ___")
5. DOCUMENTS REQUESTED (if any: mailing logs, underwriting notes, call recordings — itemized)
6. CLOSING (one paragraph: professional, no threats, states expectation of written response)

Respectfully,
Patrick S. Diamitani
[contact]

---
EXHIBIT LIST
APPROVAL CHECKLIST (see below)
```

### 2. Regulator complaint (e.g., Iowa Insurance Division)
- Answer the form's fields factually; keep the narrative under the character limit with room to spare.
- **Remember: the regulator forwards the complaint AND attachments to the insurer.** The draft must include a pre-submission review step: every sentence true, every attachment appropriate, no PRIVATE material.
- Relief section mirrors the letter's "relief requested" — specific, not "justice."

### 3. Attorney intake memo (PRIVATE by default)
- Full candor: include the counsel-only facts here — this document exists so a lawyer gets the truth up front.
- Structure: posture summary → chronology → documents → theories (ranked strong→weak, with honest weaknesses) → what Patrick wants → questions for counsel.
- Mark the file PRIVATE in filename or Drive description. Never attach to anything outbound without explicit authorization.

## Tone spec

- Firm, factual, no bluster. "The July 24 email stated the policy 'recently canceled,' arriving nine days before the August 3 deadline in your July 13 memo" — not "your company's outrageous and contradictory communications."
- Numbers over adjectives. Dates over "recently." Quotes over paraphrase.
- Never threaten litigation you aren't filing. Never cite an unverified case. Never overstate what a document says — the other side has the same documents.

## The approval checklist (every draft ends with this)

```markdown
## APPROVAL CHECKLIST — DO NOT SEND UNTIL PATRICK APPROVES
- [ ] Facts verified against the case manifest (exhibit numbers correct)
- [ ] No counsel-only / PRIVATE material included (or explicitly authorized)
- [ ] Every legal assertion backed by a verified authority or labeled as argument
- [ ] Dates, names, policy/claim numbers triple-checked
- [ ] Relief requested is specific and within the recipient's power to grant
- [ ] Tone check: firm, factual, no bluster, no empty threats
- [ ] Patrick's explicit send instruction received: __ (date/time)
```

## Guardrails

- **This skill cannot send.** It has no transmission tool. If asked to "send it," produce the draft + checklist and wait for explicit instruction — then hand the sending step to Patrick (or a tool he operates).
- **Never draft from memory of a document** — open the manifest entry and quote it.
- **Weak theories get labeled weak.** If Patrick wants a weak argument included, include it under a "weaker arguments" heading with the honest caveats — don't dress it up.
- **Regulator complaints get the forwarding warning every time.** No exceptions.
