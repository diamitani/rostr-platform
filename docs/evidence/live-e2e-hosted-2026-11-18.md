# Live E2E on a hosted instruct model — 2026-11-18 (evening)

Real end-to-end run against a hosted model through Vercel AI Gateway, mock
mode off, real tool calls. Complements the morning local-model proof
(live-e2e-2026-11-18.md).

## Result

Run `2e6cdc07` — **status: done** (full run record:
`e2e-live-run-2e6cdc07.json`).

- Model: `google/gemini-2.5-flash` via Vercel AI Gateway
  (`AI_GATEWAY_API_KEY`), manifest model pass-through (`E2E_MODEL`).
- Goal: "Read NOTES.md with the read_file tool and report the four
  components of rostr-core."
- The agent called the real `read_file` tool, read `NOTES.md`, and answered:
  PAL (Prompt Abstraction Layer), RAG DAL, NPAO, Rostr Hub — correct.
- Master verification pass: 1/1 tasks done.
- Run used the new `forceSingleTask` runtime option (skips decomposition)
  to fit a short-burst execution environment.

## Rate limiting found and handled

The Vercel AI Gateway team plan enforces ~5 requests/minute per model per
region. Multi-task runs hit HTTP 429 mid-run (runs `e34bba10` on
`deepseek/deepseek-v3.1` and `5c4b40fe` on `gemini-2.5-flash` both died on
429 before this fix). Fixes shipped in this commit:

- `lib/rostr/gateway.ts`: 12.5s minimum spacing between gateway calls plus
  retry with backoff on HTTP 429/5xx (4 attempts).
- `rostr-core/src/rostr/npao/llm.py`: one retry on 429/5xx.
- `lib/rostr/runtime.ts`: `forceSingleTask` option; model pass-through to
  `gateway.chat` (manifest/agent `model` now honored); history result window
  widened 160 -> 2000 chars.

## Benchmark on a real model

`rostr-core/benchmarks/results/phase_classifier_benchmark.json`:

| classifier | accuracy | tricky (18) |
|---|---|---|
| keyword-heuristic | 66.7% (30/45) | 4/18 |
| model: deepseek/deepseek-chat-v3.1 (OpenRouter) | **100% (45/45)** | **18/18** |

Zero heuristic fallbacks during the model run.

## Spend

~$0.03 total (OpenRouter usage $0.028 before its credits ran out, Vercel
gateway calls in the pennies), against an approved $5 cap.
