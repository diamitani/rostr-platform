// GET /api/usage?user_id= — this customer's plan, runs used this month,
// quota, and metered spend. Pass your app's authenticated user id as
// ?user_id=, or authenticate with "Authorization: Bearer <api key>".
import { customerIdForRequest, usageStoreFromEnv } from "../../../lib/metering";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const customerId = customerIdForRequest(req, params.get("user_id"));
  if (!customerId) {
    return Response.json(
      { error: "unauthorized", message: "Pass ?user_id= or a Bearer API key." },
      { status: 401 }
    );
  }
  const summary = await usageStoreFromEnv().getSummary(customerId);
  return Response.json(summary);
}
