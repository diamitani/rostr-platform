// Live driver for the skills layer: runs a skill end-to-end against real
// providers (mock off) and prints each stage. Used to prove the write-email
// skill: analyze -> draft -> suggested edit -> (optional) confirmed send.
//
//   OPENROUTER_API_KEY=... E2E_SKILL=write-email \
//   E2E_GOAL="email the beta testers ..." E2E_EDIT="make it warmer" \
//   node dist/scripts/e2e-skill-run.js
//
// Sending is opt-in (E2E_SEND=1) and passes the effect confirm hook, which
// in this test build only approves owner mailboxes (E2E_SAFE_RECIPIENTS).

import { GatewayClient } from "../lib/rostr/gateway";
import { ToolRegistry } from "../lib/rostr/tools";
import { WriteEmailSkill, listSkills, registerSuggestEditTool } from "../lib/rostr/skills";

async function main(): Promise<void> {
  const skillName = process.env.E2E_SKILL ?? "write-email";
  const goal = process.env.E2E_GOAL ?? "";
  if (!goal) throw new Error("E2E_GOAL is required");

  const gateway = new GatewayClient({ mock: false });
  const tools = new ToolRegistry();
  registerSuggestEditTool(tools, gateway, process.env.E2E_MODEL);
  tools.allow(skillName, ["suggest_edit"]);

  console.log(`skill registry: ${listSkills().map((s) => s.name).join(", ")}`);
  console.log(`running skill: ${skillName}\ngoal: ${goal}\n`);

  if (skillName !== "write-email") {
    throw new Error(`skill '${skillName}' is registered but not staged yet`);
  }

  const skill = new WriteEmailSkill(gateway, process.env.E2E_MODEL);

  // Long skills can be run stage-by-stage (each stage is its own live model
  // call): E2E_STAGE=analyze|draft|suggest|send, state passed as JSON files.
  const stage = process.env.E2E_STAGE;
  if (stage === "analyze") {
    const a = await skill.analyze(goal);
    console.log(JSON.stringify(a, null, 2));
    return;
  }
  if (stage === "draft") {
    const a = JSON.parse(
      require("node:fs").readFileSync(process.env.E2E_ANALYSIS_FILE ?? "", "utf-8")
    );
    const d = await skill.draft(a, goal);
    console.log(JSON.stringify(d, null, 2));
    return;
  }
  if (stage === "suggest") {
    const d = JSON.parse(
      require("node:fs").readFileSync(process.env.E2E_DRAFT_FILE ?? "", "utf-8")
    );
    const r = await skill.suggest(d, process.env.E2E_EDIT ?? "");
    console.log(JSON.stringify(r, null, 2));
    return;
  }

  if (stage === "send") {
    // Send a previously drafted email (draft JSON file) through the effect
    // tool with the test confirmer; no model calls in this stage.
    const d = JSON.parse(
      require("node:fs").readFileSync(process.env.E2E_DRAFT_FILE ?? "", "utf-8")
    );
    process.env.E2E_SEND = "1";
    const { attachComposioEffectTool } = await import("../lib/rostr/tools-composio");
    const ca = process.env.E2E_GMAIL_CA ?? "";
    const ent = process.env.E2E_GMAIL_ENTITY ?? "";
    if (!ca || !ent) throw new Error("send stage needs E2E_GMAIL_CA and E2E_GMAIL_ENTITY");
    attachComposioEffectTool(tools, {
      name: "email_send",
      slug: "GMAIL_SEND_EMAIL",
      connectedAccountId: ca,
      entityId: ent,
    });
    const own = new Set(
      (process.env.E2E_SAFE_RECIPIENTS ?? "").split(",").map((m) => m.trim()).filter(Boolean)
    );
    tools.setEffectConfirmer(async (tool, args) => {
      const to = String(args.recipient_email ?? "");
      if (!own.has(to)) return `recipient '${to}' is not an owner mailbox`;
      console.log(`[confirm] ${tool} to ${to} approved by test policy`);
      return true;
    });
    tools.allow(skillName, ["email_send"]);
    const result = await tools.call(skillName, "email_send", {
      recipient_email: process.env.E2E_TO ?? "",
      subject: d.subject,
      body: d.body,
    });
    console.log(result);
    return;
  }

  // Stage 1: semantic analysis.
  const analysis = await skill.analyze(goal);
  console.log("== stage 1: analysis ==");
  console.log(JSON.stringify(analysis, null, 2));

  // Stage 2: formatted draft.
  let draft = await skill.draft(analysis, goal);
  console.log("\n== stage 2: draft ==");
  console.log(`form: ${draft.form}\nsubject: ${draft.subject}\n\n${draft.body}`);

  // Stage 3: suggested edit (Gmail-style) when an instruction is given.
  const edit = process.env.E2E_EDIT;
  if (edit) {
    const revised = await skill.suggest(draft, edit);
    console.log("\n== stage 3: suggested edit ==");
    console.log(`instruction: ${edit}`);
    console.log(`change: ${revised.changeSummary}`);
    console.log(`subject: ${revised.subject}\n\n${revised.body}`);
    draft = { form: revised.form, subject: revised.subject, body: revised.body };
  }

  // Stage 4 (optional): confirmed send through the effect tool.
  if (process.env.E2E_SEND === "1") {
    const { attachComposioEffectTool } = await import("../lib/rostr/tools-composio");
    const ca = process.env.E2E_GMAIL_CA ?? "";
    const ent = process.env.E2E_GMAIL_ENTITY ?? "";
    if (!ca || !ent) throw new Error("E2E_SEND=1 needs E2E_GMAIL_CA and E2E_GMAIL_ENTITY");
    attachComposioEffectTool(tools, {
      name: "email_send",
      slug: "GMAIL_SEND_EMAIL",
      connectedAccountId: ca,
      entityId: ent,
    });
    const own = new Set(
      (process.env.E2E_SAFE_RECIPIENTS ?? "").split(",").map((m) => m.trim()).filter(Boolean)
    );
    tools.setEffectConfirmer(async (tool, args) => {
      const to = String(args.recipient_email ?? "");
      if (!own.has(to)) return `recipient '${to}' is not an owner mailbox`;
      console.log(`[confirm] ${tool} to ${to} approved by test policy`);
      return true;
    });
    tools.allow(skillName, ["email_send"]);
    const to = process.env.E2E_TO ?? analysis.recipient;
    console.log(`\n== stage 4: confirmed send to ${to} ==`);
    const result = await tools.call(skillName, "email_send", {
      recipient_email: to,
      subject: draft.subject,
      body: draft.body,
    });
    console.log(result);
  }
  console.log("\nSKILL RUN COMPLETE");
}

main().catch((e) => {
  console.error("skill run failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
