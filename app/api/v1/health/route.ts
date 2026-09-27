import { gatewayFromEnv } from "@/lib/rostr/gateway";

// Health is an operational probe, not a build-time snapshot. Do not expose
// secrets or claim the backend works merely because keys are present.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const gateway = gatewayFromEnv();
  const mock = gateway.isMock;
  const authConfigured = Boolean(process.env.SUPABASE_URL?.trim());
  return Response.json(
    {
      status: mock || !authConfigured ? "not_ready" : "configured",
      mock,
      auth_configured: authConfigured,
      time: new Date().toISOString(),
    },
    {
      status: mock || !authConfigured ? 503 : 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
