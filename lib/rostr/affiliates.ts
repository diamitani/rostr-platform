// Affiliate-aware signup links. When a tool needs an account the user lacks,
// rostr points them at the signup page from this registry. Affiliate ID slots
// are EMPTY: no affiliate program has been signed up for. When one is added,
// the link gains its referral parameter automatically. Signing up for
// affiliate programs or vendor accounts is never rostr's call.

export interface AffiliateEntry {
  tool: string;
  signupUrl: string;
  /** Empty until the owner joins the program and fills it in. */
  affiliateId: string;
  /** Query param the referral id goes in, when affiliateId is set. */
  refParam?: string;
}

export const AFFILIATE_REGISTRY: AffiliateEntry[] = [
  { tool: "apify", signupUrl: "https://apify.com/sign-up", affiliateId: "" },
  { tool: "firecrawl", signupUrl: "https://www.firecrawl.dev/signup", affiliateId: "" },
  { tool: "composio", signupUrl: "https://composio.dev/", affiliateId: "" },
  { tool: "openrouter", signupUrl: "https://openrouter.ai/signup", affiliateId: "" },
];

/** The signup link to show for a tool. Adds the referral param only when an
 *  affiliate id has actually been filled in. */
export function getSignupLink(tool: string): string | null {
  const e = AFFILIATE_REGISTRY.find((x) => x.tool === tool.toLowerCase());
  if (!e) return null;
  if (!e.affiliateId) return e.signupUrl;
  const param = e.refParam ?? "ref";
  const sep = e.signupUrl.includes("?") ? "&" : "?";
  return `${e.signupUrl}${sep}${param}=${encodeURIComponent(e.affiliateId)}`;
}

/** One-line message for when a tool needs an account. */
export function accountNeededMessage(tool: string): string {
  const link = getSignupLink(tool);
  return link
    ? `tool '${tool}' needs an account. Sign up here: ${link}`
    : `tool '${tool}' needs an account; no signup link is registered for it.`;
}
