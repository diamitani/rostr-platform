import { gatewayFromEnv } from "@/lib/rostr/gateway";

// Health is an operational probe, not a build-time snapshot. Do not expose
// secrets or claim the backend works merely because keys are present.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const gateway = gatewayFromEnv();
  const mock = gateway.isMock;
  const authConfigured = Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_ANON_KEY?.trim());
  const hubConfigured = Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_KEY?.trim());
  // This is a conservative configuration probe, not an active storage test.
  const enabled = process.env.ARTISPRENEUR_ROSTR_ENABLED === "true";
  // This is a configuration probe. It is never evidence of working tables,
  // membership, an authenticated run, or model delivery.
  const ready = !mock && authConfigured && hubConfigured && enabled;
  return Response.json(
    {
      status: ready ? "configured" : "not_ready",
      mock,
      auth_configured: authConfigured,
      hub_configured: hubConfigured,
      artispreneur_enabled: enabled,
      time: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
