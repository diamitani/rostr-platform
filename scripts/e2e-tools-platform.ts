/**
 * Live proof for the tools-platform additions: Firecrawl scrape, user-added
 * tools (config-driven, same confirm-before-write rules), and the affiliate
 * signup-link registry.
 */
import { ToolRegistry } from "../lib/rostr/tools";
import { registerFirecrawlTool } from "../lib/rostr/firecrawl";
import { loadUserTools } from "../lib/rostr/user-tools";
import { AFFILIATE_REGISTRY, getSignupLink, accountNeededMessage } from "../lib/rostr/affiliates";
import { writeFileSync } from "node:fs";

async function main(): Promise<void> {
  const stage = process.env.E2E_STAGE ?? "all";
  const tools = new ToolRegistry();

  if (stage === "firecrawl" || stage === "all") {
    const ok = registerFirecrawlTool(tools);
    console.log(`firecrawl registered: ${ok}`);
    if (!ok) throw new Error("FIRECRAWL_API_KEY missing");
    tools.allow("qa", ["firecrawl_scrape"]);
    const out = await tools.call("qa", "firecrawl_scrape", { url: "https://example.com" });
    console.log("SCRAPE:", String(out).slice(0, 300));
  }

  if (stage === "user-tools" || stage === "all") {
    // Config-driven user tools: a read-only GitHub repo lookup (proves the
    // http kind) and a write tool (proves the confirm hook governs it).
    writeFileSync(
      "/tmp/rostr.tools.json",
      JSON.stringify([
        {
          name: "github_repo",
          kind: "http",
          description: "Look up a GitHub repo: {owner}/{repo}",
          url: "https://api.github.com/repos/{owner}/{repo}",
        },
        {
          name: "needs_apify_account",
          kind: "http",
          description: "example tool whose key is missing",
          url: "https://api.apify.com/v2/acts",
          keyEnv: "MISSING_ON_PURPOSE_KEY",
          account: "apify",
        },
        {
          name: "fake_write",
          kind: "http",
          effect: true,
          description: "write tool to prove the confirm hook",
          url: "https://example.com/api/write",
          method: "POST",
        },
      ])
    );
    const res = loadUserTools(tools, "/tmp/rostr.tools.json");
    console.log("user tools loaded:", res.loaded.join(", ") || "none");
    console.log("needs account:", res.needsAccount.join(" | ") || "none");

    tools.allow("qa", ["github_repo", "fake_write"]);
    const repo = await tools.call("qa", "github_repo", { owner: "diamitani", repo: "rostr-platform" });
    console.log("GITHUB TOOL:", String(repo).slice(0, 200));

    // Effect user tool without a confirmer must be refused.
    const refused = await tools.call("qa", "fake_write", {});
    console.log("EFFECT NO CONFIRMER:", String(refused).slice(0, 150));

    // With a confirmer that says no, it must still be refused with the reason.
    tools.setEffectConfirmer(async () => "test policy: never confirm fake_write");
    const refused2 = await tools.call("qa", "fake_write", {});
    console.log("EFFECT DENIED:", String(refused2).slice(0, 150));
  }

  if (stage === "affiliates" || stage === "all") {
    console.log("affiliate registry:");
    for (const e of AFFILIATE_REGISTRY) {
      console.log(`  ${e.tool}: ${getSignupLink(e.tool)} (affiliateId set: ${Boolean(e.affiliateId)})`);
    }
    console.log("missing account msg:", accountNeededMessage("apify"));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
