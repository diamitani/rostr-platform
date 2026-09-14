import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Guarantee CORS for the public v1 API so browser clients (e.g. the
// Salesgency Package Portal) can call /api/v1/* cross-origin.
export function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

export const config = {
  matcher: "/api/v1/:path*",
};
