# Web search + real app tool, live — 2026-11-18 (evening)

User call: "add web search and one real app tool and run it live" ("Yes of
course", phonemsg-01M7RN182WZNASBD6TBDE27FAD). Done with free or
already-keyed routes only; $0 spend.

## New tools

- `web_search` (built-in, free, no key): Wikipedia full-text search API.
  DuckDuckGo's HTML endpoints challenge datacenter clients (HTTP 202), so
  they are not a dependable backend for an unattended agent — noted in code.
- HackerNews via Composio (his existing key from the Key Sheet, no new
  account): six read-only slugs registered (`HACKERNEWS_GET_FRONTPAGE`,
  `HACKERNEWS_GET_LATEST_POSTS`, `HACKERNEWS_GET_TODAYS_POSTS`,
  `HACKERNEWS_SEARCH_POSTS`, `HACKERNEWS_GET_ITEM_WITH_ID`,
  `HACKERNEWS_GET_USER`).

## The manifest gate is intact

`pal.ts` admits only tools on the compile-time read-only sets: built-ins
(`read_file`, `list_dir`, `web_search`) plus Composio slugs listed
individually in `COMPOSIO_READ_ONLY` — never whole toolkits, since toolkits
mix read and write actions. Callers can narrow but never widen authority;
`write_file`/`email_send`/`publish`/`charge` remain denied at compile time
and sealed in the registry. No write-capable tool was added.

## Real bugs found and fixed

- `tools-composio.ts` built endpoint URLs with `new URL(path, base)`, which
  silently drops the base's `/api/v3` prefix — every Composio call 404'd.
  Fixed by concatenation; verified live.
- The v3 tools filter param `toolkits` is silently ignored by the API;
  `toolkit_slug` filters. Fixed and commented.
- Long generations made E2E runs exceed short execution windows: added
  `RunOptions.maxTokens` (+ `E2E_MAX_TOKENS` in the driver) for step/verify
  calls. The done run below took 26s at 700 tokens.

## Live E2E (run 107bcf4d — status: done, 26s)

Free OpenRouter model (`inclusionai/ling-3.2-flash:free`), mock off. The
agent called `web_search('AI agent framework')` → real Wikipedia hit ('AI
agent'), then `HACKERNEWS_GET_FRONTPAGE` → real front page via Composio
(top story: an Nginx RCE advisory, 1123 points), reported one result from
each, and the master verification pass confirmed 1/1. The agent even
flagged the 2026-dated HN data as "reported as-is, unverified" on its own.
Full record: `e2e-live-run-107bcf4d.json`.
