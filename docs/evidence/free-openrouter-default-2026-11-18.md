# Free OpenRouter model as the default route — 2026-11-18 (evening)

User call: "Use free model open router." The runtime and classifier now
default to a free OpenRouter model so rostr runs at $0 with no credits.

## What changed

- `lib/rostr/gateway.ts`: provider resolution — `ROSTR_GATEWAY_URL` wins,
  else OpenRouter when only `OPENROUTER_API_KEY` is set, else Vercel AI
  Gateway. Default model on the OpenRouter route:
  `inclusionai/ling-3.2-flash:free` (override per manifest/agent or via
  `ROSTR_MODEL`). Call spacing now configurable via
  `ROSTR_MIN_CALL_INTERVAL_MS` (default 12500 for Vercel team plans).
  `max_tokens` default raised 1024 -> 4096 and `reasoning: {exclude: true}`
  sent: several hosted models spend leading tokens on hidden reasoning,
  starving the answer (observed: null content / truncated JSON at 1024).
- `rostr-core/src/rostr/npao/llm.py`: same reasoning fix (`max_tokens`
  100 -> 600, `reasoning.exclude`), null content now a clean error instead
  of a crash, and the model defaults to `inclusionai/ling-3.2-flash:free`
  when the base URL is OpenRouter and `ROSTR_LLM_MODEL` is unset.
- `benchmarks/phase_classifier_benchmark.py`: `ROSTR_BENCH_DELAY` (pacing)
  and `ROSTR_BENCH_SLICE` (run the dataset in chunks under the free-tier
  20 req/min limit), `ROSTR_BENCH_OUT` for partial result files.

## Benchmark on the free model (real numbers)

45-task phase-classification suite, `inclusionai/ling-3.2-flash:free`,
run in 5 paced slices at 3s spacing, zero keyword fallbacks:

| classifier | accuracy | tricky (18) |
|---|---|---|
| keyword-heuristic | 66.7% (30/45) | 4/18 |
| model: inclusionai/ling-3.2-flash:free (OpenRouter, $0) | **97.8% (44/45)** | **17/18** |
| model: deepseek/deepseek-chat-v3.1 (paid, earlier run) | 100% (45/45) | 18/18 |

Single confusion: one PRED task labeled DEBUGGING.

## Live E2E on the free model

Run `7c4afe78` — **status: done** (`e2e-live-run-7c4afe78.json`). Only
`OPENROUTER_API_KEY` was set: the run exercised the new default provider,
default free model, pacing and reasoning fixes end to end. The agent called
the real `read_file` tool on NOTES.md and reported the four rostr-core
components correctly; master verification passed 1/1.

Spend: $0 (free tier). Free-model availability and upstream rate limits
fluctuate; the first free-model pick of the day (gemma-4-31b-it) was
upstream-limited at probe time, so the default may need a retry or a model
swap via `ROSTR_MODEL` on a bad day.
