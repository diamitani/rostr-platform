// UsageCollector: the bridge between your app's LLM calls and the meter.
//
// Pattern (works with ANY LLM provider — OpenAI, Anthropic, Gemini,
// Vercel AI Gateway, ...):
//
//   const collector = new UsageCollector({
//     customerId, projectId, runId, agentId,
//   });
//   ... after each LLM call:
//   collector.add(reportLlmCall({
//     model: "anthropic/claude-sonnet-4-6",
//     promptTokens: res.usage?.input_tokens ?? 0,
//     completionTokens: res.usage?.output_tokens ?? 0,
//     // Best: pass the real cost when your provider reports it.
//     // Vercel AI Gateway: res.providerMetadata?.gateway?.cost
//     reportedCostUsd: res.providerMetadata?.gateway?.cost,
//   }));
//   ... when the work is done (finally block):
//   await usageStoreFromEnv().recordEvents(collector.toEvents());
//
// Metering must never break the product: reportLlmCall never throws, and
// recordEvents swallows store failures (see lib/metering.ts).

import type { UsageEvent } from "./metering";

export interface LlmCallReport {
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  estimated: boolean;
}

// Fallback price table, USD per 1M tokens [input, output]. Only used when
// the provider does not report a real cost. Provider list prices move —
// check your provider's pricing page and extend this table for the models
// you actually use.
const PRICE_TABLE: Record<string, [number, number]> = {
  "anthropic/claude-sonnet-4-6": [3.0, 15.0],
  "anthropic/claude-sonnet-4-20250514": [3.0, 15.0],
  "anthropic/claude-haiku-4-5": [1.0, 5.0],
  "openai/gpt-5": [1.25, 10.0],
  "openai/gpt-5-mini": [0.25, 2.0],
  "google/gemini-2.5-pro": [1.25, 10.0],
  "google/gemini-2.5-flash": [0.3, 2.5],
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const [pin, pout] = PRICE_TABLE[model] ?? [3.0, 15.0];
  return (inputTokens / 1e6) * pin + (outputTokens / 1e6) * pout;
}

/** Normalize one LLM call into a metered report. Prefers the provider's
 *  reported cost; falls back to the price table and marks it estimated. */
export function reportLlmCall(data: {
  model: string;
  promptTokens?: number | null;
  completionTokens?: number | null;
  reportedCostUsd?: number | null;
}): LlmCallReport {
  try {
    const inputTokens = Math.max(0, Math.floor(Number(data.promptTokens) || 0));
    const outputTokens = Math.max(
      0,
      Math.floor(Number(data.completionTokens) || 0)
    );
    const reported = Number(data.reportedCostUsd);
    const estimated = !(Number.isFinite(reported) && reported >= 0);
    return {
      model: data.model,
      inputTokens,
      outputTokens,
      costUsd: estimated
        ? estimateCost(data.model, inputTokens, outputTokens)
        : reported,
      estimated,
    };
  } catch {
    return {
      model: data.model,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
      estimated: true,
    };
  }
}

export interface CollectorOpts {
  customerId: string;
  /** Your app's id for this product (lets one Supabase serve many apps). */
  projectId: string;
  /** Groups calls into one billable "run" (a UUID per user action). */
  runId: string;
  agentId?: string | null;
}

/** Accumulates per-call reports during one unit of work, then converts
 *  them into UsageEvents — one "call" event per LLM call plus one
 *  aggregate "run" event that quota counting is based on. */
export class UsageCollector {
  private calls: LlmCallReport[] = [];
  private opts: CollectorOpts;

  constructor(opts: CollectorOpts) {
    this.opts = opts;
  }

  add(report: LlmCallReport): void {
    this.calls.push(report);
  }

  get callCount(): number {
    return this.calls.length;
  }

  toEvents(at: string = new Date().toISOString()): UsageEvent[] {
    const { customerId, projectId, runId, agentId } = this.opts;
    const events: UsageEvent[] = this.calls.map((u) => ({
      kind: "call",
      customer_id: customerId,
      project_id: projectId,
      run_id: runId,
      agent_id: agentId ?? null,
      model: u.model,
      input_tokens: u.inputTokens,
      output_tokens: u.outputTokens,
      cost_usd: u.costUsd,
      estimated: u.estimated,
      at,
    }));
    events.push({
      kind: "run",
      customer_id: customerId,
      project_id: projectId,
      run_id: runId,
      agent_id: agentId ?? null,
      model: null,
      input_tokens: this.calls.reduce((s, u) => s + u.inputTokens, 0),
      output_tokens: this.calls.reduce((s, u) => s + u.outputTokens, 0),
      cost_usd: this.calls.reduce((s, u) => s + u.costUsd, 0),
      estimated: this.calls.some((u) => u.estimated),
      at,
    });
    return events;
  }
}
