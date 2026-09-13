// The runtime loop.
//
// runMaster — the orchestrator: create run -> decompose goal into 2-4
//   subtasks -> NPAO classify -> order N->A->P->O -> compile a manifest per
//   task -> run a worker per task (with verification) -> stream events.
// runWorker — ONE agent working a Manifest: build the prompt -> gateway
//   returns a JSON action -> allowed tool runs -> result recorded ->
//   repeat until DONE or maxSteps, then a verification pass decides the
//   outcome (one retry on FAILED).
//
// The runtime is deliberately thin. PAL decides what the agent is told,
// NPAO decides what runs next, the hub remembers, the tools act.

import { randomUUID } from "node:crypto";
import type {
  Manifest,
  Project,
  RunRecord,
  RunStep,
  SseEvent,
  TaskRecord,
} from "./types";
import { MASTER_PROMPT, WORKER_PROMPT } from "./prompts";
import { GatewayClient } from "./gateway";
import { compileManifest } from "./pal";
import { classify, orderByNpao } from "./npao";
import type { Hub } from "./hub";
import type { ToolRegistry } from "./tools";
import { composioConfigured, executeComposioTool } from "./tools-composio";

export interface RunOptions {
  gateway: GatewayClient;
  hub: Hub;
  tools: ToolRegistry;
  project: Project;
  skillText?: string;
  context?: string;
  onEvent?: (e: SseEvent) => void;
}

function extractJson(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const s = cleaned.indexOf("{");
  const e = cleaned.lastIndexOf("}");
  if (s < 0 || e < 0 || e <= s) {
    throw new Error("no JSON object found in model response");
  }
  return JSON.parse(cleaned.slice(s, e + 1)) as Record<string, unknown>;
}

/** Parse the master's decomposition reply: JSON first, then numbered lines. */
export function parseSubtasks(raw: string): string[] {
  try {
    const obj = extractJson(raw);
    const sub = (obj.subtasks ?? obj.tasks) as
      | Array<{ text?: string } | string>
      | undefined;
    if (Array.isArray(sub)) {
      const texts = sub
        .map((t) => (typeof t === "string" ? t : t.text ?? "").trim())
        .filter(Boolean);
      if (texts.length) return texts.slice(0, 4);
    }
  } catch {
    // Fall through to line parsing.
  }
  const lines: string[] = [];
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*(?:\d+[.)]|[-*])\s+(.+?)\s*$/);
    if (m) lines.push(m[1].trim());
  }
  if (lines.length) return lines.slice(0, 4);
  const fallback = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 3 && !/^\s*[{}\[\]]/.test(l));
  return fallback.slice(0, 4);
}

function buildWorkerPrompt(
  manifest: Manifest,
  extraContext: string,
  history: string[]
): string {
  const lines: string[] = [
    `TASK: ${manifest.goal}`,
    "",
    "CONSTRAINTS:",
    ...manifest.constraints.map((c) => `  - ${c}`),
    "",
    `TOOLS YOU MAY USE: ${manifest.allowedTools.join(", ") || "(none)"}`,
    "Anything that sends, posts, or spends requires approval — draft it, do not execute.",
  ];
  if (manifest.skillText) {
    lines.push("", "SKILL (follow these steps):", manifest.skillText.slice(0, 4000));
  }
  const context = [manifest.retrievedContext, extraContext]
    .map((c) => c.trim())
    .filter(Boolean)
    .join("\n");
  if (context) {
    lines.push("", "RELEVANT CONTEXT:", context.slice(0, 2000));
  }
  if (history.length) {
    lines.push("", "WHAT HAS HAPPENED SO FAR:");
    for (const h of history.slice(-6)) lines.push(`  - ${h}`);
  }
  lines.push(
    "",
    "Reply with JSON ONLY, one of:",
    '  {"thought": "...", "action": "<tool_name>", "args": {...}}',
    '  {"thought": "...", "done": true, "result": "<what was accomplished>"}',
    "Do not ask questions — make reasonable assumptions and note them in thought."
  );
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

async function workerAttempt(
  opts: RunOptions & { manifest: Manifest; runId?: string; extraContext: string }
): Promise<{ ok: boolean; output: string }> {
  const { gateway, hub, tools, project, manifest, runId, extraContext } = opts;
  const history: string[] = [];
  let output = "";

  for (let n = 1; n <= manifest.maxSteps; n++) {
    const prompt = buildWorkerPrompt(manifest, extraContext, history);
    const messages = [
      { role: "system", content: WORKER_PROMPT },
      { role: "user", content: prompt },
    ] as const;

    let act: Record<string, unknown>;
    try {
      act = extractJson(await gateway.chat([...messages]));
    } catch {
      // One reformat retry, then stop cleanly with what we have.
      const raw = await gateway.chat([
        ...messages,
        { role: "user", content: prompt + "\n\nReply with JSON only." },
      ]);
      try {
        act = extractJson(raw);
      } catch {
        if (runId) {
          await hub.addStep(project.id, runId, {
            kind: "result",
            n,
            text: `parse failed: ${raw.slice(0, 300)}`,
          });
        }
        return { ok: false, output: raw.slice(0, 500) };
      }
    }

    const thought = String(act.thought ?? "");
    if (runId) {
      await hub.addStep(project.id, runId, { kind: "thought", n, text: thought });
    }
    opts.onEvent?.({ type: "thought", runId, text: thought });

    if (act.done) {
      const result = String(act.result ?? "");
      if (runId) {
        await hub.addStep(project.id, runId, {
          kind: "result",
          n,
          text: `Done: ${result.slice(0, 300)}`,
        });
      }
      opts.onEvent?.({ type: "result", runId, text: result.slice(0, 300) });
      return { ok: true, output: result };
    }

    const actionName = String(act.action ?? "");
    const args = (act.args ?? {}) as Record<string, unknown>;
    const tool = tools.getTool(actionName);
    const allowed = new Set(manifest.allowedTools);
    let res: string;
    if (!tool) {
      // Fallback: a Composio tool name the registry didn't pre-register
      // (e.g. attach failed at run start) still runs directly.
      res = composioConfigured()
        ? await executeComposioTool(actionName, args)
        : `error: unknown tool '${actionName}'`;
    } else if (!allowed.has(actionName)) {
      res = `error: tool '${actionName}' is not in this task's allowed tools`;
    } else {
      try {
        res = await tool.run(args);
      } catch (e) {
        res = `error: ${e instanceof Error ? e.message : String(e)}`;
      }
    }

    const summary = `${thought.slice(0, 120)} -> ${actionName} => ${res.slice(0, 160)}`;
    history.push(summary);
    output = res;
    if (runId) {
      await hub.addStep(project.id, runId, { kind: "action", n, text: summary });
    }
    opts.onEvent?.({ type: "action", runId, text: summary });
  }

  return { ok: false, output: output || "max_steps reached without a result" };
}

export async function runWorker(
  opts: RunOptions & { manifest: Manifest; runId?: string }
): Promise<{ ok: boolean; output: string }> {
  const { gateway, manifest } = opts;

  // First attempt.
  let attempt = await workerAttempt({ ...opts, extraContext: "" });

  // CRITICAL FIX (the Python version blindly trusted "done"): verify the
  // output against the goal with an independent gateway call. On FAILED,
  // retry the worker ONCE with the failure reason appended to context,
  // then accept the second result whatever it is.
  const verifyPrompt =
    `Given the goal: ${manifest.goal}\n\n` +
    `Worker output:\n${attempt.output}\n\n` +
    `Does this output satisfy the goal? Reply VERIFIED or FAILED: <reason>`;
  const verdict = await gateway.chat([
    { role: "user", content: verifyPrompt },
  ]);
  const verified = /^\s*VERIFIED\b/i.test(verdict.trim());

  if (!verified) {
    const reason = verdict.replace(/^\s*FAILED:?\s*/i, "").trim();
    attempt = await workerAttempt({
      ...opts,
      extraContext: `\n\nPREVIOUS ATTEMPT FAILED VERIFICATION: ${reason}\nAddress this gap and try again.`,
    });
  }

  return attempt;
}

// ---------------------------------------------------------------------------
// Master
// ---------------------------------------------------------------------------

export async function runMaster(
  opts: RunOptions & { agentId: string; goal: string; skillName?: string }
): Promise<RunRecord> {
  const { gateway, hub, tools, project, agentId, goal, skillName } = opts;
  const agent = project.agents.find((a) => a.id === agentId);
  if (!agent) {
    throw new Error(`agent not found in project: ${agentId}`);
  }

  let run = await hub.createRun(project.id, agentId, goal, skillName);
  const runId = run.id;
  const emit = (e: Omit<SseEvent, "runId">) =>
    opts.onEvent?.({ ...e, runId });

  // The local `run` is the single source of truth for the master; every
  // mutation goes through it and is flushed with save(). After runWorker
  // returns, refresh() re-reads the hub so worker-logged steps are picked
  // up before the master writes again.
  const nowIso = () => new Date().toISOString();
  const pushStep = (kind: RunStep["kind"], text: string) => {
    run.steps.push({
      id: randomUUID().slice(0, 8),
      n: run.steps.length + 1,
      kind,
      text,
      at: nowIso(),
    });
  };
  const pushDecision = (text: string) => {
    run.decisions.push({ at: nowIso(), text });
  };
  const save = () => hub.updateRun(project.id, run);
  const refresh = async () => {
    run = (await hub.getRun(project.id, runId)) ?? run;
  };

  try {
    // 1. Decompose the goal into 2-4 subtasks.
    const raw = await gateway.chat([
      { role: "system", content: MASTER_PROMPT },
      {
        role: "user",
        content:
          `GOAL: ${goal}\n\nDecompose this goal into 2-4 concrete subtasks. ` +
          `Reply with a numbered list, one subtask per line.`,
      },
    ]);
    const subtaskTexts = parseSubtasks(raw);

    // 2. NPAO classify + order N -> A -> P -> O.
    const ordered = orderByNpao(subtaskTexts.map((title) => ({ title })));
    pushDecision(
      `Execution order set by NPAO triage: ${ordered.map((o) => o.npao).join(" -> ")}`
    );

    run.tasks = ordered.map((o) => ({
      id: randomUUID().slice(0, 8),
      title: o.task.title,
      npao: o.npao,
      status: "pending" as const,
    }));
    await save();

    // 3. A worker per task, in order.
    for (const task of run.tasks) {
      task.status = "running";
      await save();

      const manifest = compileManifest({
        projectId: project.id,
        agent,
        goal: task.title,
        skillName,
        skillText: opts.skillText,
        context: opts.context,
      });
      // Gate the registry to the manifest's allow list for this skill.
      tools.allow(manifest.skillName ?? manifest.agentId, manifest.allowedTools);
      task.manifest = manifest;
      await save();

      pushStep("thought", `Starting task [${task.npao}]: ${task.title}`);
      await save();
      emit({ type: "thought", text: `Starting task [${task.npao}]: ${task.title}` });

      const r = await runWorker({ ...opts, manifest, runId });
      await refresh(); // pick up the steps the worker logged
      const current =
        run.tasks.find((t) => t.id === task.id) ?? task;
      current.status = r.ok ? "done" : "failed";
      if (!r.ok) {
        current.error = r.output.slice(0, 500);
      }
      pushDecision(
        `Task "${current.title.slice(0, 60)}" ${current.status}: ${r.output.slice(0, 160)}`
      );
      await save();
    }

    // 4. Report.
    const done = run.tasks.filter((t) => t.status === "done").length;
    pushDecision(
      `${done}/${run.tasks.length} tasks done — master verification pass`
    );
    run.status = "done";
    await save();
    emit({ type: "done", data: run });
    return run;
  } catch (err) {
    const text = err instanceof Error ? err.message : String(err);
    await refresh();
    run.status = "failed";
    await save();
    emit({ type: "error", text });
    return run;
  }
}
