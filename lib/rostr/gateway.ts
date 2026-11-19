// LLM access through the Vercel AI Gateway (OpenAI-compatible endpoint).
// Mock mode is the default: with no API key, or when MOCK_MODE=true, chat()
// returns scripted-but-varied responses so the whole runtime runs for free.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** One metered LLM call. costUsd comes from the gateway response when the
 *  provider reports it (Vercel AI Gateway: providerMetadata.gateway.cost);
 *  otherwise it is estimated from the token counts and marked estimated. */
export interface UsageReport {
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  estimated: boolean;
}

// Fallback price table, USD per 1M tokens [input, output]. Only used when
// the gateway does not report a cost. Provider list prices move — check
// vercel.com/ai-gateway/models for current rates.
const PRICE_TABLE: Record<string, [number, number]> = {
  "anthropic/claude-sonnet-4-6": [3.0, 15.0],
  "anthropic/claude-sonnet-4-20250514": [3.0, 15.0],
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const [pin, pout] = PRICE_TABLE[model] ?? [3.0, 15.0];
  return (inputTokens / 1e6) * pin + (outputTokens / 1e6) * pout;
}

// Gateway endpoint: explicit ROSTR_GATEWAY_URL wins; otherwise OpenRouter
// when only OPENROUTER_API_KEY is set, else the Vercel AI Gateway. Default
// route is a free OpenRouter model so the runtime costs nothing out of the
// box; override the model per manifest/agent or via ROSTR_MODEL.
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const VERCEL_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
const GATEWAY_URL =
  process.env.ROSTR_GATEWAY_URL ??
  (process.env.OPENROUTER_API_KEY && !process.env.AI_GATEWAY_API_KEY
    ? OPENROUTER_URL
    : VERCEL_URL);
const DEFAULT_MODEL =
  process.env.ROSTR_MODEL ??
  (GATEWAY_URL.includes("openrouter")
    ? "inclusionai/ling-3.2-flash:free"
    : "anthropic/claude-sonnet-4-20250514");
// Minimum spacing between calls; Vercel team plans enforce ~5 req/min per
// model per region, OpenRouter free tier ~20 req/min.
const MIN_CALL_INTERVAL_MS = Number(
  process.env.ROSTR_MIN_CALL_INTERVAL_MS ?? "12500"
);

// ---------------------------------------------------------------------------
// Mock mode: deterministic per-input responses. Outputs always include words
// derived from the input, so two different inputs never get identical text.
// ---------------------------------------------------------------------------

let mockDecomposeCount = 0;
let mockVerifyCount = 0;
let mockWorkerCount = 0;

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with",
  "into", "from", "that", "this", "your", "you", "our", "we", "it", "is",
  "are", "be", "as", "at", "by", "goal", "objective", "task", "please",
  "decompose", "subtasks", "subtask", "numbered", "reply", "list", "each",
  "one", "per", "line", "json", "only", "given", "does", "output",
  "satisfy", "verified", "failed", "reason", "content",
]);

function topicWords(text: string, max = 6): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
    .slice(0, max);
}

function mockDecompose(lastUser: string): string {
  mockDecomposeCount += 1;
  const words = topicWords(lastUser);
  const topic = words.slice(0, 4).join(" ") || "the goal";
  const n = mockDecomposeCount;
  const templates = [
    `Research the requirements for ${topic}`,
    `Draft the main deliverable for ${topic}`,
    `Review and verify the ${topic} output for gaps`,
    `Save the ${topic} results and write a short summary`,
  ];
  const count = 2 + (n % 3); // 2-4 subtasks, varies per call
  const picked = templates.slice(0, Math.min(count, templates.length));
  return picked.map((t, i) => `${i + 1}. ${t} (run ${n})`).join("\n");
}

function mockVerify(lastUser: string): string {
  mockVerifyCount += 1;
  const checked = lastUser.slice(0, 60).replace(/\s+/g, " ").trim();
  if (mockVerifyCount % 2 === 1) {
    return `VERIFIED: ${checked} — output addresses the goal.`;
  }
  const words = topicWords(lastUser, 3).join(", ") || "the goal";
  return `FAILED: the output does not fully address ${words} — a key deliverable is missing.`;
}

function mockWorker(lastUser: string): string {
  mockWorkerCount += 1;
  const topic = topicWords(lastUser, 4).join(" ") || "the assigned task";
  if (mockWorkerCount % 2 === 1) {
    return JSON.stringify({
      thought: `I will list the working directory to see what exists for ${topic}.`,
      action: "list_dir",
      args: { path: "." },
    });
  }
  return JSON.stringify({
    thought: `The work for ${topic} is complete and meets the criteria.`,
    done: true,
    result: `Completed ${topic}: deliverable produced and checked (run ${mockWorkerCount}).`,
  });
}

function mockComplete(messages: ChatMessage[]): string {
  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const low = lastUser.toLowerCase();
  if (low.includes("decompose") || (low.includes("break") && low.includes("subtask"))) {
    return mockDecompose(lastUser);
  }
  if (/does this output satisfy|reply verified or failed/i.test(lastUser)) {
    return mockVerify(lastUser);
  }
  if (/reply with json only/i.test(lastUser)) {
    return mockWorker(lastUser);
  }
  const words = topicWords(lastUser, 5);
  const topic = words.join(" ") || "the request";
  return `Mock result for "${topic}": examined the request and recorded a result. No spend, no keys.`;
}

// ---------------------------------------------------------------------------

export class GatewayClient {
  private apiKey: string;
  // Team rate limit is per-minute: keep at least 12.5s between calls.
  private lastCallAt = 0;
  private mock: boolean;
  private onUsage?: (u: UsageReport) => void;

  constructor(opts?: {
    apiKey?: string;
    mock?: boolean;
    onUsage?: (u: UsageReport) => void;
  }) {
    const key =
      opts?.apiKey ??
      process.env.AI_GATEWAY_API_KEY ??
      process.env.OPENROUTER_API_KEY ??
      "";
    this.apiKey = key;
    // Mock unless explicitly disabled AND a key is present.
    this.mock = opts?.mock ?? (process.env.MOCK_MODE === "true" || !key);
    this.onUsage = opts?.onUsage;
  }

  get isMock(): boolean {
    return this.mock;
  }

  private reportUsage(
    model: string,
    data: {
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
      providerMetadata?: { gateway?: { cost?: number } };
    }
  ): void {
    if (!this.onUsage) return;
    try {
      const inputTokens = Number(data.usage?.prompt_tokens ?? 0) || 0;
      const outputTokens = Number(data.usage?.completion_tokens ?? 0) || 0;
      const reported = Number(data.providerMetadata?.gateway?.cost);
      const estimated = !(Number.isFinite(reported) && reported >= 0);
      this.onUsage({
        model,
        inputTokens,
        outputTokens,
        costUsd: estimated
          ? estimateCost(model, inputTokens, outputTokens)
          : reported,
        estimated,
      });
    } catch {
      // Metering must never break the call.
    }
  }

  async chat(
    messages: ChatMessage[],
    opts?: { model?: string; maxTokens?: number }
  ): Promise<string> {
    if (this.mock) {
      return mockComplete(messages);
    }
    const body = JSON.stringify({
      model: opts?.model ?? DEFAULT_MODEL,
      messages,
      // Generous cap: several hosted models spend leading tokens on hidden
      // reasoning before emitting content; a tight cap starves the answer.
      max_tokens: opts?.maxTokens ?? 4096,
      // Ask OpenRouter-style routers to skip the reasoning preamble.
      reasoning: { exclude: true },
    });
    // Rate limits (per-minute team caps) and transient 5xx: back off and
    // retry instead of killing the whole run.
    const wait = MIN_CALL_INTERVAL_MS - (Date.now() - this.lastCallAt);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    this.lastCallAt = Date.now();
    let res: Response | null = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body,
      });
      if (res.ok) break;
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) =>
          setTimeout(r, res!.status === 429 ? 13000 : 4000)
        );
        continue;
      }
      break;
    }
    if (!res || !res.ok) {
      const text = res ? await res.text().catch(() => "") : "";
      throw new Error(
        `Gateway HTTP ${res?.status}: ${text.slice(0, 300)}`
      );
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
      providerMetadata?: { gateway?: { cost?: number } };
    };
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      this.reportUsage(opts?.model ?? DEFAULT_MODEL, data);
      return content;
    }
    // Empty content is a transient provider flake (observed repeatedly on
    // free models): retry a few times before giving up.
    let lastErr: Error = new Error("Gateway returned no content");
    for (let attempt = 0; attempt < 3; attempt++) {
      await new Promise((r) => setTimeout(r, 4000));
      try {
        return await this.chat(messages, opts);
      } catch (e) {
        lastErr = e instanceof Error ? e : new Error(String(e));
        if (!/no content/.test(lastErr.message)) throw lastErr;
      }
    }
    throw lastErr;
  }
}

export function gatewayFromEnv(): GatewayClient {
  return new GatewayClient();
}
