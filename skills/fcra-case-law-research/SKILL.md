---
name: fcra-case-law-research
description: "Research real FCRA/FDCPA opinions via the CourtListener API for credit-repair dispute strategy. Cardinal rule: never fabricate a holding — every claim traces to downloaded opinion text or is labeled UNVERIFIED."
---

# FCRA Case Law Research

Find real opinions on the Fair Credit Reporting Act (15 U.S.C. §1681 et seq.) and Fair Debt Collection Practices Act (15 U.S.C. §1692), read them, and turn them into memos a non-lawyer can use when preparing dispute strategy with counsel. Research only — this is not legal advice.

## The cardinal rule

**Never fabricate a holding.** Every claim in a memo must trace to downloaded text or be explicitly labeled UNVERIFIED. If you can't download it, you can't cite it as verified. When quoting a holding, copy the sentence exactly; mark paraphrases as paraphrases. Date-stamp everything.

## Step 1 — Search (CourtListener API v3, free, no key)

```
https://www.courtlistener.com/api/rest/v3/search/?q=<query>&type=o&order_by=score%20desc
```

Useful parameters:
- `q` — e.g. `q=FCRA reasonable investigation 1681i` or `q=FDCPA debt validation 1692g`
- `type=o` — opinions only
- `court` — `scotus`, `ca1`–`ca11`, `cadc`; 8th Circuit (`ca8`) covers Iowa, 7th (`ca7`) covers Illinois
- `filed_after` / `filed_before` — `YYYY-MM-DD`
- `order_by=score desc` or `order_by=dateFiled desc`

The JSON returns `results[]` with `caseName`, `court`, `dateFiled`, `absolute_url`, and `opinions[]`.

### Useful FCRA/FDCPA starting queries
- `q=FCRA \"reasonable investigation\" furnisher 1681s-2` — what counts as a reasonable investigation
- `q=FCRA \"maximum possible accuracy\" 1681e(b)` — accuracy standard for bureaus
- `q=FDCPA validation debt 1692g` — collector validation obligations
- `q=FCRA willful violation statutory damages 1681n` — damages exposure theories

## Step 2 — Download the full opinion

Follow the result's `absolute_url`; append `?format=json` or follow the API `opinions` link to get `plain_text` or `html`. Save to `skills outputs → Case Law Research/<Year>_<Case-Short-Name>_<Court>.txt`.

If CourtListener lacks the text, fall back: **Justia**, then **Google Scholar**. If no full text is obtainable, the case gets a one-line entry marked TEXT UNAVAILABLE — never summarize from a headnote or blog alone.

## Step 3 — Read and memo

Write the memo using this schema:

```markdown
# <Case Name>, <Citation>
**Court:** …  **Decided:** …  **Downloaded:** <date> from <source URL>
**Not legal advice** — research for discussion with a licensed consumer-law attorney.

## Facts (from the opinion)
…

## Holding
… (quote the key sentence where possible)

## Reasoning
… (the court's logic, in 3–6 sentences)

## Application to the dispute strategy
… (which facts line up, which don't — be honest about the gaps)

## Use it for / Don't use it for
- USE FOR: …
- DON'T USE FOR: …

## Confidence
- [x] Holding verified from downloaded opinion text
- [ ] UNVERIFIED — summary only, full text not obtained
```

### The one-line verdict
E.g. *"Use it for: arguing a bureau's e-OSCAR auto-verification is not a reasonable investigation under §1681i. Don't use it for: claiming every verified dispute entitles the consumer to deletion."*

## Step 4 — File and index

- Append the memo to a running research index (`Case Law Research/INDEX.md`: case name, citation, one-line verdict, file link).
- Note binding vs. persuasive authority (Supreme Court = binding everywhere; the consumer's circuit = strongest; another circuit = persuasive only).

## Guardrails

- **Not legal advice.** Memos are research for discussion with licensed counsel — the template footer says this.
- **No invented citations, dates, or holdings** — ever.
- **Distinguish binding vs. persuasive** and say which applies to the consumer's jurisdiction.
- Do not advise filing disputes the consumer knows are inaccurate-free — that is not a research question, it is a legal line.
