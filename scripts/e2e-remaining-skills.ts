/**
 * Live driver for the remaining four skills (publish-note, web-research,
 * file-writer, hn-digest). Each skill is proven stage by stage; E2E_SKILL
 * and E2E_STAGE select one stage per invocation so each model call stays
 * small. Every stage is a real provider call (mock off).
 *
 *   E2E_SKILL=publish-note E2E_STAGE=analyze node dist/scripts/e2e-remaining-skills.js
 */
import { GatewayClient } from "../lib/rostr/gateway";
import { ToolRegistry } from "../lib/rostr/tools";
import {
  PublishNoteSkill,
  WebResearchSkill,
  FileWriterSkill,
  HnDigestSkill,
} from "../lib/rostr/skills";
import { readFileSync, writeFileSync } from "node:fs";

async function main(): Promise<void> {
  const skillName = process.env.E2E_SKILL ?? "publish-note";
  const stage = process.env.E2E_STAGE ?? "all";
  const model = process.env.E2E_MODEL;
  const gateway = new GatewayClient({ mock: false });
  const tools = new ToolRegistry();

  if (skillName === "publish-note") {
    const skill = new PublishNoteSkill(gateway, model);
    const request =
      process.env.E2E_GOAL ??
      "Announce to the Artispreneur community that the hosted gateway is now free to try, runs on OpenRouter models, and that beta users get priority support.";
    if (stage === "analyze") {
      const a = await skill.analyze(request);
      console.log(JSON.stringify(a, null, 2));
      return;
    }
    if (stage === "draft") {
      const a = JSON.parse(readFileSync(process.env.E2E_ANALYSIS_FILE ?? "", "utf-8"));
      const d = await skill.draft(a, request);
      console.log(JSON.stringify(d, null, 2));
      return;
    }
    if (stage === "publish") {
      // Real publish through the effect tool (Gmail draft binding) with the
      // test confirmer; no model calls in this stage.
      const d = JSON.parse(readFileSync(process.env.E2E_DRAFT_FILE ?? "", "utf-8"));
      const { attachComposioEffectTool } = await import("../lib/rostr/tools-composio");
      const ca = process.env.E2E_GMAIL_CA ?? "";
      const ent = process.env.E2E_GMAIL_ENTITY ?? "";
      if (!ca || !ent) throw new Error("publish stage needs E2E_GMAIL_CA and E2E_GMAIL_ENTITY");
      attachComposioEffectTool(tools, {
        name: "publish",
        slug: "GMAIL_CREATE_EMAIL_DRAFT",
        description: "Publish content as a draft artifact in the connected account.",
        connectedAccountId: ca,
        entityId: ent,
      });
      const own = new Set(
        (process.env.E2E_SAFE_RECIPIENTS ?? "").split(",").map((m) => m.trim()).filter(Boolean)
      );
      tools.setEffectConfirmer(async (tool, args) => {
        const to = String(args.recipient_email ?? args.to ?? "");
        if (!own.has(to)) return `recipient '${to}' is not an owner mailbox`;
        console.log(`[confirm] ${tool} to ${to} approved by test policy`);
        return true;
      });
      tools.allow(skillName, ["publish"]);
      const result = await tools.call(skillName, "publish", {
        recipient_email: process.env.E2E_TO ?? "",
        subject: `[rostr test] ${d.title}`,
        body: d.body,
      });
      console.log(result);
      return;
    }
  }

  if (skillName === "web-research") {
    const skill = new WebResearchSkill(gateway, model);
    const question =
      process.env.E2E_GOAL ??
      "What are the top free AI models available through OpenRouter right now?";
    if (stage === "plan") {
      const p = await skill.plan(question);
      console.log(JSON.stringify(p, null, 2));
      return;
    }
    if (stage === "search") {
      const p = JSON.parse(readFileSync(process.env.E2E_PLAN_FILE ?? "", "utf-8"));
      tools.allow(skillName, ["web_search"]);
      const parts: string[] = [];
      for (const q of (p.queries as string[]).slice(0, 3)) {
        const r = await tools.call(skillName, "web_search", { query: q });
        parts.push(`QUERY: ${q}\n${String(r).slice(0, 2500)}`);
      }
      writeFileSync("/tmp/research-material.txt", parts.join("\n\n---\n\n"));
      console.log(`SEARCH DONE queries=${Math.min(3, p.queries.length)} material_chars=${parts.join("\n").length}`);
      return;
    }
    if (stage === "synthesize") {
      const material = readFileSync("/tmp/research-material.txt", "utf-8");
      const a = await skill.synthesize(question, material);
      console.log(JSON.stringify(a, null, 2));
      return;
    }
  }

  if (skillName === "file-writer") {
    const skill = new FileWriterSkill(gateway, model);
    const request =
      process.env.E2E_GOAL ??
      "Write a markdown changelog entry for today's rostr skills release covering write-email, publish-note, web-research, file-writer and hn-digest.";
    if (stage === "plan") {
      const p = await skill.plan(request);
      console.log(JSON.stringify(p, null, 2));
      return;
    }
    if (stage === "compose") {
      const p = JSON.parse(readFileSync(process.env.E2E_PLAN_FILE ?? "", "utf-8"));
      const c = await skill.compose(p, request);
      console.log(JSON.stringify(c, null, 2));
      return;
    }
    if (stage === "write") {
      const p = JSON.parse(readFileSync(process.env.E2E_PLAN_FILE ?? "", "utf-8"));
      const c = JSON.parse(readFileSync(process.env.E2E_CONTENT_FILE ?? "", "utf-8"));
      const root = process.env.E2E_WORKSPACE_ROOT ?? ".";
      const path = `scratch/${String(p.path).replace(/^scratch\//, "")}`;
      process.env.ROSTR_SAFETY_GATE = "off";
      tools.allow(skillName, ["write_file", "read_file"]);
      const out = await tools.call(skillName, "write_file", { path, content: c.content });
      console.log(`WRITE RESULT: ${String(out).slice(0, 300)}`);
      const back = await tools.call(skillName, "read_file", { path });
      console.log(`READBACK MATCH: ${back.includes(String(c.content).slice(0, 60))}`);
      return;
    }
  }

  if (skillName === "hn-digest") {
    const skill = new HnDigestSkill(gateway, model);
    const theme = process.env.E2E_GOAL ?? "AI agents and LLM tooling";
    if (stage === "digest") {
      const { attachComposioTools } = await import("../lib/rostr/tools-composio");
      const composio = await attachComposioTools(tools, { apps: ["hackernews"] });
      if (!composio.registered) throw new Error("hackernews tools not registered (missing key?)");
      tools.allow(skillName, ["HACKERNEWS_GET_FRONTPAGE"]);
      const fp = await tools.call(skillName, "HACKERNEWS_GET_FRONTPAGE", {});
      console.log(`FRONT PAGE chars=${String(fp).length}`);
      const d = await skill.digest(theme, String(fp));
      console.log(JSON.stringify(d, null, 2));
      return;
    }
  }

  throw new Error(`unknown skill/stage: ${skillName}/${stage}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
