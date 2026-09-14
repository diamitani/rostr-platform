---
name: case-law-research
description: >
  Download and analyze real case law per state for Patrick's cases. Searches the free
  CourtListener API v3 (no key required), filters by jurisdiction (e.g., Iowa state courts,
  8th Circuit), downloads full opinion text, and produces a structured, citation-verified
  memo per case. Fallbacks: Justia, Google Scholar.
  Triggers: case law, precedent, research opinion, court ruling, holding, case citation,
  what does the law say, find cases, Shepardize, appellate decision.
tools: Read, Write, Bash, WebFetch
---

# Case Law Research

Find real opinions, read them, and turn them into memos Patrick (a non-lawyer) can actually use with counsel. The cardinal rule: **never fabricate a holding.** Every claim in a memo must trace to downloaded text or be explicitly labeled UNVERIFIED.

## Step 1 — Search (CourtListener API v3, free, no key)

Base endpoint:

```
https://www.courtlistener.com/api/rest/v3/search/?q=<query>&type=o&order_by=score%20desc
```

Useful parameters:
- `q` — query text, e.g. `q="reasonable expectations" insurance Iowa`
- `type=o` — opinions only
- `court` — e.g. `court=iactapp` (Iowa Ct. App.), `court=iasc` (Iowa Supreme Court), `court=ca8` (8th Circuit), `court=scotus`
- `filed_after` / `filed_before` — `YYYY-MM-DD`
- `order_by=score desc` or `order_by=dateFiled desc`

Example (Iowa insurance opinions mentioning garaging):

```
https://www.courtlistener.com/api/rest/v3/search/?q=garaging%20misrepresentation%20automobile%20insurance&type=o&court=iasc&order_by=score%20desc
```

Fetch with `curl -s` or WebFetch. The JSON returns `results[]` with `caseName`, `court`, `dateFiled`, `absolute_url`, and `opinions[]`.

### Jurisdiction cheat sheet (CourtListener court codes)
- Iowa Supreme Court: `iasc` · Iowa Court of Appeals: `iactapp`
- Illinois Supreme Court: `ill` · Illinois Appellate Court: `illappct`
- 8th Circuit (federal, covers Iowa): `ca8` · 7th Circuit (covers Illinois): `ca7`
- U.S. Supreme Court: `scotus`

## Step 2 — Download the full opinion

Each result's `absolute_url` points to the opinion page; the opinion JSON (append `?format=json` or follow the API `opinions` link) contains `plain_text` or `html` of the full opinion. Save it:

```
skills outputs → 04 Case Law Research/<Year>_<Case-Short-Name>_<Court>.txt
```

If CourtListener lacks the text, fall back in order: **Justia** (search `site:justia.com`), **Google Scholar** (fetch the opinion page). If no full text is obtainable, the case gets a one-line entry marked TEXT UNAVAILABLE — never summarize from a headnote or blog alone.

## Step 3 — Read and memo

Read the downloaded opinion. Then write the memo to `04 Case Law Research/<Year>_<Case-Short-Name>_MEMO.md` using this exact schema:

```markdown
# <Case Name>, <Citation>
**Court:** …  **Decided:** …  **Downloaded:** <date> from <source URL>

## Facts (from the opinion)
…

## Holding
… (quote the key sentence where possible)

## Reasoning
… (the court's logic, in 3–6 sentences)

## Application to Patrick's facts
… (which facts line up, which don't — be honest about the gaps)

## Use it for / Don't use it for
- USE FOR: …
- DON'T USE FOR: …

## Confidence
- [x] Holding verified from downloaded opinion text
- [ ] UNVERIFIED — summary only, full text not obtained
```

### The one-line verdict
The "Use it for / Don't use it for" line is the whole point for a non-lawyer: e.g. *"Use it for: arguing ambiguous garaging language is construed against the insurer. Don't use it for: claiming an insurer can never cancel for misrepresentation."*

## Step 4 — File and index

- Append the memo to the per-case research index (a running `04 Case Law Research/INDEX.md`: case name, citation, one-line verdict, file link).
- Update the case fact sheet's "authorities" section with the citation and verdict line.

## Guardrails

- **No invented citations.** If you can't download it, you can't cite it as verified.
- **Quote precisely.** When quoting a holding, copy the sentence exactly; mark paraphrases as paraphrases.
- **Date-stamp everything.** Law moves; a 2026 memo must say when the opinion was read and from where.
- **Not legal advice.** Memos are research for discussion with licensed counsel — the memo template says this in its footer.
- **Distinguish binding vs. persuasive.** Note whether the court actually binds an Iowa court (Iowa Supreme Court = binding in Iowa; 8th Circuit on Iowa state law = persuasive-ish; another state's supreme court = persuasive only).
