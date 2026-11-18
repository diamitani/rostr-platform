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
    forceSingleTask: process.env.E2E_SINGLE_TASK === "1",
    maxSteps: Number(process.env.E2E_MAX_STEPS ?? "6"),
    skillText:
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
