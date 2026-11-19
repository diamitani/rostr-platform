// Firecrawl tool: turn any URL into clean markdown via his Firecrawl key.
// Read-only tool (a scrape changes nothing), so it registers as an ordinary
// tool. Key comes from FIRECRAWL_API_KEY, never logged.

import { ToolRegistry } from "./tools";

export function registerFirecrawlTool(
  tools: ToolRegistry,
  opts?: { apiKey?: string; baseUrl?: string }
): boolean {
  const key = opts?.apiKey ?? process.env.FIRECRAWL_API_KEY ?? "";
  if (!key) return false;
  const base = opts?.baseUrl ?? "https://api.firecrawl.dev";
  tools.register({
    name: "firecrawl_scrape",
    description:
      "Scrape a URL into clean markdown using Firecrawl. Args: {url, formats?}. Read-only.",
    run: async (args) => {
      const url = String(args.url ?? "").trim();
      if (!url) return "error: firecrawl_scrape requires a 'url' argument";
      try {
        const res = await fetch(`${base}/v1/scrape`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, formats: ["markdown"] }),
          signal: AbortSignal.timeout(30000),
        });
        if (!res.ok) return `error: firecrawl http ${res.status}`;
        const d = (await res.json()) as {
          success?: boolean;
          data?: { markdown?: string; metadata?: { title?: string; sourceURL?: string } };
        };
        if (!d.success || !d.data) return "error: firecrawl scrape failed";
        const md = d.data.markdown ?? "";
        const title = d.data.metadata?.title ?? "";
        return `[firecrawl] ${title}\n${d.data.metadata?.sourceURL ?? url}\n\n${md.slice(0, 8000)}`;
      } catch (e) {
        return `error: firecrawl ${e instanceof Error ? e.message : String(e)}`;
      }
    },
  });
  return true;
}
