import { z } from "zod";
import { GatewayClient, type UsageReport } from "@/lib/rostr/gateway";
import { hubFromEnv } from "@/lib/rostr/hub";
import {
  checkQuota,
  customerIdFor,
  usageStoreFromEnv,
  type UsageEvent,
} from "@/lib/rostr/billing";
import { defaultRegistry } from "@/lib/rostr/tools";
import { attachComposioTools } from "@/lib/rostr/tools-composio";
import { resolveAuth } from "@/lib/rostr/auth";
import { runMaster } from "@/lib/rostr/runtime";
import { kbStore } from "@/lib/rostr/rag-dal";
import {
  maybeCheckpoint,
  shouldCheckpoint,
} from "@/lib/rostr/context-engine";
import { loadProject, loadSkillText } from "@/lib/project";
import type { SseEvent } from "@/lib/rostr/types";

const runBodySchema = z.object({
  project_id: z.string().min(1),
  agent: z.string().min(1),
  skill: z.string().min(1).optional(),
  input: z.string().min(1),
  user_id: z.string().min(1).optional(),
  composio_account_id: z.string().min(1).optional(),
});

// POST /api/v1/run — start an agent run and stream progress as SSE.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = runBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { project_id, agent, skill, input, user_id, composio_account_id } =
    parsed.data;

  // Auth first — the sibling auth contract resolves who owns this request.
  const auth = await resolveAuth(req, {
    projectIdFromBody: project_id,
    userIdFromBody: user_id,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const resolvedProjectId = auth.auth.project_id;
  const resolvedUserId = auth.auth.user_id;

  const project = await loadProject(resolvedProjectId);
  if (!project) {
    return Response.json({ error: "project_not_found" }, { status: 404 });
  }

  const agentDef = (project.agents ?? []).find((a) => a.id === agent);
  if (!agentDef) {
    return Response.json({ error: "agent_not_found" }, { status: 404 });
  }

  // Billing v1: quota is per customer per calendar month. Over quota the
  // run never starts — 402 with a machine-readable code and an upgrade URL.
  const customerId = customerIdFor(auth.auth, req);
  const quota = await checkQuota(customerId);
  if (!quota.ok) {
    const origin = new URL(req.url).origin;
    return Response.json(
      {
        code: "quota_exceeded",
        error: "Monthly run quota exceeded for this plan.",
        plan: quota.plan,
        runs_this_month: quota.runsThisMonth,
        runs_quota: quota.quota,
        upgrade_url: `${origin}/api/v1/billing/plans`,
      },
      { status: 402 }
    );
  }

  // Metering: every gateway.chat call in this run reports usage into
  // usageCalls; the runId is captured from the first streamed event and the
  // whole batch (calls + one aggregate "run" event) is flushed when the
  // stream closes. Flush failures never break the response.
  const usageCalls: UsageReport[] = [];
  let seenRunId: string | null = null;
  const gateway = new GatewayClient({
    onUsage: (u) => {
      usageCalls.push(u);
    },
  });
  const hub = hubFromEnv();

  // Entitlement gate: in live mode a paid skill needs an entitlement.
  // In mock mode we bypass and grant a mock entitlement for consistency.
  if (skill && !gateway.isMock) {
    const entitled = await hub.checkEntitlement(resolvedUserId, resolvedProjectId, skill);
    if (!entitled) {
      return Response.json(
        {
          error: "not_entitled",
          purchase_url: "/api/v1/marketplace/purchase",
        },
        { status: 402 }
      );
    }
  } else if (skill && gateway.isMock) {
    await hub.grantEntitlement({
      userId: resolvedUserId,
      projectId: resolvedProjectId,
      skill,
      grantedVia: "mock",
      usesRemaining: null,
    });
  }

  const skillText = skill ? await loadSkillText(skill) : "";

  // Context Engine (PAL stage 2): assemble the knowledge pack for this
  // goal when a KB backend is configured. Never breaks the run — on any
  // KB failure we proceed with no pack.
  let kbContext = "";
  try {
    const store = kbStore();
    if (store) {
      const pack = await store.assemblePack(resolvedProjectId, input, 5);
      kbContext = pack.packText;
    }
  } catch {
    kbContext = "";
  }

  const encoder = new TextEncoder();

  // Tool registry: built-ins plus any Composio integrations. The Composio
  // attach is best-effort — if it's unconfigured or the API is down the
  // run continues with built-ins only.
  const tools = defaultRegistry();
  try {
    await attachComposioTools(tools, { connectedAccountId: composio_account_id });
  } catch {
    // never breaks the run
  }

  // Context Engine (session memory): the always-on trigger loop runs on
  // every run in the background and never blocks the agent. One session id
  // per run — the mid-stream checkpoint and the final checkpoint upsert
  // into the same row. maybeCheckpoint never throws and its inner work is
  // never awaited.
  const sessionId = `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const runStartMs = Date.now();
  const maxTokens = Number.parseInt(process.env.CONTEXT_MAX_TOKENS ?? "", 10) || 128_000;
  let approxTokens = 0;
  const transcriptParts: string[] = [];
  let midCheckpointDone = false;

  const checkpoint = (why: string) => {
    const transcriptMd = transcriptParts.join("\n").trim();
    if (!transcriptMd) return;
    const elapsedMinutes = (Date.now() - runStartMs) / 60_000;
    void maybeCheckpoint({
      sessionId,
      projectId: resolvedProjectId,
      transcriptMd,
      summary: `${why} checkpoint of run ${sessionId}`,
      contextTokens: approxTokens,
      maxTokens,
      elapsedMinutes,
    });
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enqueue = (event: SseEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        if (!seenRunId && (event as { runId?: string }).runId) {
          seenRunId = (event as { runId?: string }).runId ?? null;
        }
        // Track the stream for the checkpoint loop: approximate tokens as
        // emitted text length / 4, plus a running transcript.
        approxTokens += JSON.stringify(event).length / 4;
        if (event.text) transcriptParts.push(event.text);
        if (!midCheckpointDone) {
          const elapsedMinutes = (Date.now() - runStartMs) / 60_000;
          if (shouldCheckpoint(approxTokens, maxTokens, elapsedMinutes)) {
            midCheckpointDone = true;
            checkpoint("mid-run");
          }
        }
      };
      try {
        await runMaster({
          gateway,
          hub,
          tools,
          project,
          skillText,
          context: kbContext || undefined,
          agentId: agent,
          goal: input,
          skillName: skill,
          onEvent: enqueue,
        });
      } catch (err) {
        enqueue({
          type: "error",
          error: err instanceof Error ? err.message : "run_failed",
        } as SseEvent);
      } finally {
        // At minimum one checkpoint per run, with the final transcript.
        checkpoint("final");
        // Flush metering: one event per LLM call plus an aggregate "run"
        // event that quota counting is based on.
        try {
          const at = new Date().toISOString();
          const runId = seenRunId ?? `orphan_${Date.now().toString(36)}`;
          const events: UsageEvent[] = usageCalls.map((u) => ({
            kind: "call",
            customer_id: customerId,
            project_id: resolvedProjectId,
            run_id: runId,
            agent_id: agent,
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
            project_id: resolvedProjectId,
            run_id: runId,
            agent_id: agent,
            model: null,
            input_tokens: usageCalls.reduce((s, u) => s + u.inputTokens, 0),
            output_tokens: usageCalls.reduce((s, u) => s + u.outputTokens, 0),
            cost_usd: usageCalls.reduce((s, u) => s + u.costUsd, 0),
            estimated: usageCalls.some((u) => u.estimated),
            at,
          });
          await usageStoreFromEnv().recordEvents(events);
        } catch {
          // Metering must never break the response.
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
