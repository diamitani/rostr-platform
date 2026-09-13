import { gatewayFromEnv } from "@/lib/rostr/gateway";

// GET /api/v1/health — quick liveness check, also reports mock mode.
export async function GET() {
  const gateway = gatewayFromEnv();
  return Response.json({
    status: "ok",
    mock: gateway.isMock,
    time: new Date().toISOString(),
  });
}
