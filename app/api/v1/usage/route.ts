import { resolveAuth } from "@/lib/rostr/auth";
import { customerIdFor, usageStoreFromEnv } from "@/lib/rostr/billing";

// GET /api/v1/usage?project_id=&user_id= — this customer's plan, runs used
// this month, quota, and metered spend. Auth contract mirrors the
// entitlements route: in dev mode identity falls back to ?user_id=.
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const auth = await resolveAuth(req, {
    projectIdFromQuery: params.get("project_id") ?? undefined,
    userIdFromBody: params.get("user_id") ?? undefined,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  const customerId = customerIdFor(auth.auth, req);
  const summary = await usageStoreFromEnv().getSummary(customerId);
  return Response.json(summary);
}
