// LLM access through the Vercel AI Gateway (OpenAI-compatible endpoint).
// Mock mode is the default: with no API key, or when MOCK_MODE=true, chat()
// returns scripted-but-varied responses so the whole runtime runs for free.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-sonnet-4-20250514";

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
  private mock: boolean;

  constructor(opts?: { apiKey?: string; mock?: boolean }) {
    const key = opts?.apiKey ?? process.env.AI_GATEWAY_API_KEY ?? "";
    this.apiKey = key;
    // Mock unless explicitly disabled AND a key is present.
    this.mock = opts?.mock ?? (process.env.MOCK_MODE === "true" || !key);
  }

  get isMock(): boolean {
    return this.mock;
  }

  async chat(
    messages: ChatMessage[],
    opts?: { model?: string; maxTokens?: number }
  ): Promise<string> {
    if (this.mock) {
      return mockComplete(messages);
    }
    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: opts?.model ?? DEFAULT_MODEL,
        messages,
        max_tokens: opts?.maxTokens ?? 1024,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Gateway HTTP ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Gateway returned no content");
    }
    return content;
  }
}

export function gatewayFromEnv(): GatewayClient {
  return new GatewayClient();
}
