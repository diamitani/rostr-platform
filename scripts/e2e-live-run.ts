/**
 * E2E live-agent run — real model, real tools, mock mode refused.
 *
 * Usage:
 *   AI_GATEWAY_API_KEY=<key> ROSTR_GATEWAY_URL=<openai-compatible chat url> \
 *   node build/scripts/e2e-live-run.js
 *
 * The gateway client only leaves mock mode when a key is present; this
 * driver hard-refuses to run in mock mode, because the point is proving a
 * REAL end-to-end run. File tools are sandboxed to process.cwd() — run it
 * from e2e-workspace/.
 */
import { GatewayClient } from "../lib/rostr/gateway";
import { JsonHub } from "../lib/rostr/hub";
import { ToolRegistry } from "../lib/rostr/tools";
import { runMaster } from "../lib/rostr/runtime";
import type { Project } from "../lib/rostr/types";

async function main(): Promise<void> {
  const gateway = new GatewayClient();
  console.log(`gateway mock mode: ${gateway.isMock}`);
  if (gateway.isMock) {
    console.error(
      "REFUSING to run: mock mode is on. Set AI_GATEWAY_API_KEY and ROSTR_GATEWAY_URL."
    );
    process.exit(2);
  }

  const hub = new JsonHub(process.env.E2E_HUB_DIR ?? "./e2e-runs");
  const tools = new ToolRegistry();

  // Real app tools: attach read-only HackerNews tools through Composio when
  // his key is present; degrades to zero extra tools without it.
  const { attachComposioTools } = await import("../lib/rostr/tools-composio");
  const composio = await attachComposioTools(tools, { apps: ["hackernews"] });
  console.log(
    `composio: configured=${composio.configured} registered=${composio.registered}`
  );
  // Effect tools (E2E_EFFECTS=1): real email_send + publish via Composio,
  // bound to the connected account named in the env. The confirmation hook
  // is the owner-scoped confirm-before-write flow; this test confirmer only
  // approves mail addressed to the owner's own mailboxes with a [rostr test]
  // subject, and refuses everything else with a reason.
  if (process.env.E2E_EFFECTS === "1") {
    const { attachComposioEffectTool } = await import(
      "../lib/rostr/tools-composio"
    );
    const ca = process.env.E2E_GMAIL_CA ?? "";
    const ent = process.env.E2E_GMAIL_ENTITY ?? "";
    if (!ca || !ent) throw new Error("E2E_EFFECTS=1 needs E2E_GMAIL_CA and E2E_GMAIL_ENTITY");
    attachComposioEffectTool(tools, {
      name: "email_send",
      slug: "GMAIL_SEND_EMAIL",
      description: "Send an email through the connected Gmail account.",
      connectedAccountId: ca,
      entityId: ent,
    });
    attachComposioEffectTool(tools, {
      name: "publish",
      slug: "GMAIL_CREATE_EMAIL_DRAFT",
      description: "Publish content as a draft artifact in the connected account.",
      connectedAccountId: ca,
      entityId: ent,
    });
    const OWN_MAILBOXES = new Set(
      (process.env.E2E_SAFE_RECIPIENTS ?? "").split(",").map((m) => m.trim()).filter(Boolean)
    );
    tools.setEffectConfirmer(async (tool, args) => {
      const to = String(args.recipient_email ?? args.to ?? "");
      const subject = String(args.subject ?? "");
      if (!OWN_MAILBOXES.has(to)) {
        return `recipient '${to}' is not an owner mailbox`;
      }
      if (!subject.startsWith("[rostr test]")) {
        return "subject must start with '[rostr test]' in the test policy";
      }
      console.log(`[confirm] ${tool} to ${to} approved by test policy`);
      return true;
    });
    console.log("effects: email_send + publish registered (confirm hook active)");
  }

  const requestedTools = (
    process.env.E2E_TOOLS ??
    [
      "read_file",
      "list_dir",
      "web_search",
      ...(composio.registered ? ["HACKERNEWS_GET_FRONTPAGE"] : []),
    ].join(",")
  )
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const project: Project = {
    id: "e2e-project",
    name: "E2E live run",
    agents: [
      {
        id: "e2e-agent",
        name: "E2E Agent",
        systemPrompt: "",
        skills: ["workspace-inspector"],
        model: process.env.E2E_MODEL,
      },
    ],
    workspaces: [],
    skills: {},
  };

  const run = await runMaster({
    gateway,
    hub,
    tools,
    project,
    agentId: "e2e-agent",
    goal:
      process.env.E2E_GOAL ??
      "Inspect the workspace with the file tools and summarize in 3 bullets what the rostr-core package contains.",
    skillName: "workspace-inspector",
    allowedTools: requestedTools,
    maxTokens: Number(process.env.E2E_MAX_TOKENS ?? "0") || undefined,
    forceSingleTask: process.env.E2E_SINGLE_TASK === "1",
    maxSteps: Number(process.env.E2E_MAX_STEPS ?? "6"),
    skillText: process.env.E2E_SKILL_TEXT ??
      'Steps: 1) call list_dir with args {"path": "."} to see the workspace. ' +
      '2) call read_file with args {"path": "README.md"} and read the first part. ' +
      "3) reply done with result: a 3-bullet summary of what rostr-core contains.",
    onEvent: (e) =>
      console.log(`[event] ${e.type}: ${(e.text ?? "").slice(0, 160)}`),
  });

  console.log("\n=== RUN RECORD ===");
  console.log(
    JSON.stringify(
      {
        id: run.id,
        status: run.status,
        goal: run.goal,
        tasks: run.tasks.map((t) => ({
          title: t.title.slice(0, 80),
          npao: t.npao,
          status: t.status,
          output: (t.output ?? t.error ?? "").slice(0, 200),
        })),
        steps: run.steps.length,
        decisions: run.decisions.map((d) => d.text.slice(0, 140)),
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
