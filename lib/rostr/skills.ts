// Skills — one per tool. A skill is more than a prompt: it analyzes the
// request semantically (via the model), picks a form, drafts with proper
// formatting for that form, and offers suggested edits to the draft
// (Gmail-style suggest-a-rewrite) before any effect tool runs.
//
// Owner call: "each tool needs a skill so there should be write email skill
// based on semantic analysis of what you want or suggested update like
// google but with the proper formatting etc." (2026-11-18).

import type { GatewayClient } from "./gateway";

// -- Write-email skill ---------------------------------------------------------

export interface EmailAnalysis {
  form: string; // one of EMAIL_FORMS keys
  recipient: string;
  goal: string; // what the email must achieve, one line
  tone: string;
  keyPoints: string[];
}

export interface EmailDraft {
  form: string;
  subject: string;
  body: string;
}

/** Forms the skill can pick, each with its own formatting contract. */
export const EMAIL_FORMS: Record<string, string> = {
  "thank-you":
    "Subject: gratitude + specifics, <= 8 words. Open with the thanks in the first sentence, name the concrete thing they did, one short paragraph of impact, warm single-line close. No ask. 60-120 words.",
  "follow-up":
    "Subject: 'Re:' style continuity or a gentle nudge, <= 8 words. One-line context reminder, one clear question or ask, one-line close. 50-100 words.",
  announcement:
    "Subject: the news itself, <= 10 words. Lead sentence states the news, 2-3 short paragraphs (what, why it matters to them, what happens next), optional single CTA line, sign-off. 100-180 words.",
  "cold-outreach":
    "Subject: specific value for them, <= 8 words. First line about THEM (not you), one credibility line, one concrete offer, one low-friction ask (a question, not a call demand). 70-120 words.",
  request:
    "Subject: the ask in plain words, <= 8 words. Context in one line, the specific ask with any deadline, one-line reason it matters, thanks in advance. 60-110 words.",
  reply:
    "Subject keeps the thread. Answer their question in the first two sentences, then at most one additional point, one-line close. 40-100 words.",
};

const ANALYZE_PROMPT = `You are the analysis stage of a write-email skill.
Given an email request, reply with JSON ONLY:
{"form": "<one of: ${Object.keys(EMAIL_FORMS).join(", ")}>", "recipient": "<who it is to, from the request>", "goal": "<one line: what the email must achieve>", "tone": "<one or two words>", "keyPoints": ["<point the email must include>", ...]}
Pick the form by meaning, not keywords. If the request mixes forms, pick the dominant one.`;

const DRAFT_PROMPT = `You are the drafting stage of a write-email skill.
Write the email for this analysis. Follow the form's formatting contract EXACTLY.
Reply with JSON ONLY: {"subject": "...", "body": "..."}
Body uses plain paragraphs separated by blank lines. Include a greeting and a sign-off with the sender's name if known, otherwise a generic sign-off. No markdown, no bullet lists unless the form calls for them.`;

const SUGGEST_PROMPT = `You are the suggest-a-rewrite stage of a write-email skill (like Gmail's suggested edits).
Given a draft and the user's edit instruction, produce the revised email, and summarize what changed in one line.
Keep the form's formatting contract unless the instruction overrides it.
Reply with JSON ONLY: {"subject": "...", "body": "...", "changeSummary": "..."}`;

/** One model call + JSON parse, with a single retry: free models
 *  intermittently truncate or emit empty content despite reasoning.exclude. */
async function chatJson<T>(
  gateway: GatewayClient,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  model: string | undefined,
  maxTokens: number
): Promise<T> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = await gateway.chat(messages, { model, maxTokens });
    try {
      return parseJson<T>(raw);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

function parseJson<T>(raw: string): T {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`skill expected JSON, got: ${raw.slice(0, 120)}`);
  }
  return JSON.parse(raw.slice(start, end + 1)) as T;
}

export class WriteEmailSkill {
  readonly name = "write-email";
  constructor(private gateway: GatewayClient, private model?: string) {}

  /** Stage 1 — semantic analysis: what kind of email is this, to whom, why. */
  async analyze(request: string): Promise<EmailAnalysis> {
    const a = await chatJson<EmailAnalysis>(
      this.gateway,
      [
        { role: "system", content: ANALYZE_PROMPT },
        { role: "user", content: request },
      ],
      this.model,
      1500
    );
    if (!EMAIL_FORMS[a.form]) a.form = "reply";
    return a;
  }

  /** Stage 2 — draft with the form's formatting contract. */
  async draft(a: EmailAnalysis, request: string): Promise<EmailDraft> {
    const d = await chatJson<EmailDraft>(
      this.gateway,
      [
        { role: "system", content: DRAFT_PROMPT },
        {
          role: "user",
          content:
            `FORM: ${a.form}\nFORMATTING CONTRACT: ${EMAIL_FORMS[a.form]}\n` +
            `RECIPIENT: ${a.recipient}\nGOAL: ${a.goal}\nTONE: ${a.tone}\n` +
            `KEY POINTS: ${a.keyPoints.join("; ")}\n\nORIGINAL REQUEST: ${request}`,
        },
      ],
      this.model,
      2500
    );
    return { form: a.form, subject: d.subject, body: d.body };
  }

  /** Stage 3 — suggested edit: revise the draft per a natural instruction. */
  async suggest(
    draft: EmailDraft,
    instruction: string
  ): Promise<EmailDraft & { changeSummary: string }> {
    const d = await chatJson<EmailDraft & { changeSummary: string }>(
      this.gateway,
      [
        { role: "system", content: SUGGEST_PROMPT },
        {
          role: "user",
          content:
            `FORMATTING CONTRACT: ${EMAIL_FORMS[draft.form]}\n\n` +
            `CURRENT DRAFT:\nSubject: ${draft.subject}\n\n${draft.body}\n\n` +
            `EDIT INSTRUCTION: ${instruction}`,
        },
      ],
      this.model,
      2500
    );
    return { form: draft.form, subject: d.subject, body: d.body, changeSummary: d.changeSummary };
  }
}

// -- Skill registry (one skill per tool) ---------------------------------------

export interface SkillInfo {
  name: string;
  tool: string;
  summary: string;
}

/** The skill-per-tool map. write-email is fully staged; the rest describe
 *  their contract and grow stages as they are built out. */
export function listSkills(): SkillInfo[] {
  return [
    { name: "write-email", tool: "email_send", summary: "Analyze request -> pick form -> formatted draft -> suggested edits -> confirmed send." },
    { name: "publish-note", tool: "publish", summary: "Structure content for the target surface, draft, suggest edits, confirmed publish (draft binding today)." },
    { name: "web-research", tool: "web_search", summary: "Plan queries from the question, search, synthesize with sources." },
    { name: "file-writer", tool: "write_file", summary: "Choose path/format from intent, write, read back to verify." },
    { name: "hn-digest", tool: "HACKERNEWS_GET_FRONTPAGE", summary: "Fetch front page, rank by relevance to a theme, summarize top items." },
  ];
}

// -- suggest_edit tool (model-backed, read-only) --------------------------------

import type { ToolRegistry } from "./tools";

/** Registers `suggest_edit`: give it text plus a natural-language edit
 *  instruction, get back the revised text and a one-line change summary.
 *  Read-only (returns text, touches nothing), so it enters manifests under
 *  the standard gate. */
export function registerSuggestEditTool(
  registry: ToolRegistry,
  gateway: GatewayClient,
  model?: string
): void {
  registry.register({
    name: "suggest_edit",
    description:
      "Rewrite the given text following a natural-language edit instruction (Gmail-style suggested edit). Args: {text, instruction}. Returns the revised text with a change summary.",
    run: async (args) => {
      const text = String(args.text ?? "");
      const instruction = String(args.instruction ?? "");
      if (!text.trim() || !instruction.trim()) {
        return "error: suggest_edit needs 'text' and 'instruction'";
      }
      const raw = await gateway.chat(
        [
          {
            role: "system",
            content:
              "Rewrite the TEXT following the INSTRUCTION. Reply with JSON ONLY: " +
              '{"revised": "...", "changeSummary": "..."}',
          },
          {
            role: "user",
            content: `TEXT:\n${text}\n\nINSTRUCTION: ${instruction}`,
          },
        ],
        { model, maxTokens: 1200 }
      );
      try {
        const d = parseJson<{ revised: string; changeSummary: string }>(raw);
        return `${d.revised}\n\n(change: ${d.changeSummary})`;
      } catch {
        return raw;
      }
    },
  });
}
