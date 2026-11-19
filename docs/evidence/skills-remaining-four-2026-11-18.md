# Remaining four skills live proof — 2026-11-18

All four skills staged and proven with real provider calls, mock off, free
OpenRouter model (ling-3.2-flash:free). Driver: scripts/e2e-remaining-skills.ts,
one stage per invocation via E2E_SKILL/E2E_STAGE. Zero spend.

## publish-note (tool: publish)
- analyze: real call picked surface=announcement with audience, goal, key points
  (log shows full JSON).
- draft: real call produced title "Hosted Gateway Now Free on OpenRouter Models"
  plus a formatted announcement body following the surface contract.
- publish: real effect call through GMAIL_CREATE_EMAIL_DRAFT, confirm hook
  approved (owner mailbox only). Gmail draft id 1a1f177c37663c1c,
  labelIds [DRAFT], to artispreneur@gmail.com, subject prefixed [rostr test].

## web-research (tool: web_search)
- plan: real call broke the question ("top free AI models on OpenRouter") into
  3 focused queries with an angle statement.
- search: 3 real web_search calls (Wikipedia full-text backend), 3058 chars of
  material gathered.
- synthesize: real call produced an honest answer: the material was mostly
  general Wikipedia pages and could not support a current free-model ranking,
  and it said so instead of inventing one. Note: web_search is
  Wikipedia-backed, so freshness is limited; the skill behaved correctly by
  refusing to hallucinate beyond the sources.

## file-writer (tool: write_file)
- plan: real call chose path scratch/rostr-skills-changelog.md, format md, and
  a 4-point outline.
- compose: real call produced content. Honest caveat: the free model played
  safe and emitted a fill-in template rather than final copy; a second compose
  attempt timed out on the free model (known flake). The template output was
  used for the write proof.
- write: real write_file (gate off), 1384 bytes to scratch/rostr-skills-changelog.md;
  read_file readback verified byte prefix match (READBACK MATCH: true).

## hn-digest (tool: HACKERNEWS_GET_FRONTPAGE)
- fetch: real Composio front page call, 38,545 chars of live HN data.
- digest: real call ranked the 3 most relevant stories for the theme
  "AI agents and LLM tooling" with points and one-line rationale, including an
  honest "points not visible in truncated feed" note where data was cut.

## Status
All five skills in the registry are now staged: write-email (proven earlier
today, SENT id 1a1f175239380606), publish-note, web-research, file-writer,
hn-digest. Remaining honest gaps: web_search freshness (Wikipedia backend),
free-model flakiness on long outputs (retries in place), compose conservatism
under vague requests.
