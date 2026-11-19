# DuckDuckGo web_search + tools platform — 2026-11-18

## 1. web_search is now DuckDuckGo (per Patrick: "web search must be all use duck duck go api")

lib/rostr/tools.ts runWebSearch rewritten. Three DDG routes, best first, no
paid key:
1. html.duckduckgo.com/html/ (POST) - real web results
2. lite.duckduckgo.com/lite/ - real web results, simpler markup
3. api.duckduckgo.com instant answers - always reachable, entity-lookup only

The result string names the route that served. The DDG anomaly challenge
(HTTP 202) is detected and the next route is tried.

Honest limitation, proven live from this build host: DDG serves its HTML
routes only to clients it does not flag; datacenter IPs get an HTTP 202
anomaly page (curl-verified for html, lite, and the vqd d.js API; the main
page loads but server-renders no results). The instant-answer API answered a
curl request once (real OpenAI abstract) then returned empty 200s to node
fetch from the same IP, i.e. it is also rate-limiting this host. Through the
web-research skill, a current-events query ("Gemini 3 release") exercised the
full chain and returned the tool's honest no-results message naming the
challenge. From an unchallenged IP (his own deployments, residential) route 1
returns real web results; the route-1 parser handles both the html and lite
markup shapes. If guaranteed results from datacenter deployments are needed,
options: run searches through Firecrawl (now built, below) or a residential
proxy. Firecrawl works from this host today.

## 2. Firecrawl tool (his existing key, row 3 of his Key Sheet)

lib/rostr/firecrawl.ts: registerFirecrawlTool adds firecrawl_scrape
(URL -> clean markdown, read-only). Live proof: real scrape of example.com
returned its markdown through the tool (key never logged).

## 3. User-added tools (lib/rostr/user-tools.ts)

Users register their own tools in rostr.tools.json: kind http (URL template
with {arg} placeholders, optional keyEnv, optional account) or kind composio
(slug + connectedAccountId + entityId, reuses the Composio executor). MCP
servers are reachable through their HTTP endpoint as kind http. effect: true
registers through registerEffectTool, so the SAME confirm-before-write hook
governs user tools. Missing keyEnv produces an account-needed message with
the signup link (see affiliates). rostr.tools.example.json ships examples.
Live proof (scripts/e2e-tools-platform.ts, real run):
- github_repo user tool made a real api.github.com call and returned
  diamitani/rostr-platform repo data (http 200).
- A tool with a missing key reported: "tool 'apify' needs an account. Sign up
  here: https://apify.com/sign-up".
- An effect user tool was REFUSED with no confirmer ("no confirmation hook
  registered; refusing") and REFUSED with a denying confirmer, both as
  designed.

## 4. Affiliate-aware signup links (lib/rostr/affiliates.ts)

AFFILIATE_REGISTRY maps tool -> { signupUrl, affiliateId: "", refParam }.
All affiliateId slots are EMPTY; getSignupLink returns the plain signup URL
until an id is filled in, then appends the referral param automatically.
Ships with apify, firecrawl, composio, openrouter. Live proof printed all
four links with affiliateId set: false. No affiliate programs were joined
and no vendor accounts were created - that decision is flagged to main.

Zero spend. Evidence logs: /tmp runs on the build host (ephemeral); the
driver scripts are committed so any stage is reproducible.
