// Auth: resolves the caller identity for v1 API routes.
//
// Three modes:
//   - dev:      SUPABASE_URL is not set. Trusts the caller-supplied project_id
//               (opts.projectIdFromBody ?? opts.projectIdFromQuery) and user_id
//               (opts.userIdFromBody ?? "local-dev"). 401 if no project_id.
//   - api_key:  SUPABASE_URL is set. The bearer token is a project API key:
//               its SHA-256 hex digest is looked up in the `api_keys` table
//               (key_hash, revoked=false). user_id is "api_key".
//   - jwt:      SUPABASE_URL is set. The bearer token is a Supabase user JWT
//               (verified via /auth/v1/user); the requested project_id must be
//               in the user's owned projects, else 403 "project_forbidden".
//
// No new dependencies: fetch + node:crypto only. Never throws — every
// failure path returns an AuthResult with { ok: false, status, error }.

import { createHash } from "node:crypto";

export interface AuthContext {
  user_id: string;
  project_id: string;
  mode: "api_key" | "jwt" | "dev";
}

export type AuthResult =
  | { ok: true; auth: AuthContext }
  | { ok: false; status: number; error: string };

function bearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const match = /^bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return null;
  const token = match[1].trim();
  return token ? token : null;
}

function supabaseUrl(): string {
  return (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Auth fetches must never hang a request: 8s cap, fail closed to the
// next check (a dead Supabase must not wedge the API).
function authFetch(input: string, init?: RequestInit): Promise<Response> {
  return fetch(input, { ...init, signal: AbortSignal.timeout(8000) });
}

export async function resolveAuth(
  req: Request,
  opts?: {
    projectIdFromBody?: string;
    projectIdFromQuery?: string;
    userIdFromBody?: string;
  }
): Promise<AuthResult> {
  const url = supabaseUrl();

  // ---- dev mode: no Supabase configured -----------------------------------
  if (!url) {
    const projectId = opts?.projectIdFromBody ?? opts?.projectIdFromQuery;
    if (!projectId) {
      return { ok: false, status: 401, error: "project_id_required" };
    }
    return {
      ok: true,
      auth: {
        user_id: opts?.userIdFromBody ?? "local-dev",
        project_id: projectId,
        mode: "dev",
      },
    };
  }

  // ---- Supabase mode: bearer token required --------------------------------
  const token = bearerToken(req);
  if (!token) {
    return { ok: false, status: 401, error: "auth_required" };
  }

  const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? "";
  const anonKey = process.env.SUPABASE_ANON_KEY ?? "";

  // (a) Project API key: SHA-256 hex of the token -> api_keys.key_hash.
  // Needs SUPABASE_SERVICE_KEY; otherwise skip to the JWT check.
  if (serviceKey) {
    try {
      const keyHash = createHash("sha256").update(token, "utf8").digest("hex");
      const res = await authFetch(
        `${url}/rest/v1/api_keys?key_hash=eq.${keyHash}&revoked=eq.false&select=project_id`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
        }
      );
      if (res.ok) {
        const rows = (await safeJson(res)) as Array<{
          project_id?: string;
        }> | null;
        const row = Array.isArray(rows) ? rows[0] : undefined;
        if (row?.project_id) {
          return {
            ok: true,
            auth: {
              user_id: "api_key",
              project_id: row.project_id,
              mode: "api_key",
            },
          };
        }
      }
    } catch {
      // Network/parse failure: fall through to the JWT check.
    }
  }

  // (b) Supabase user JWT.
  if (anonKey) {
    try {
      const me = await authFetch(`${url}/auth/v1/user`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
        },
      });
      if (me.ok) {
        const body = (await safeJson(me)) as { id?: string } | null;
        const uid = body?.id;
        const requested =
          opts?.projectIdFromBody ?? opts?.projectIdFromQuery;
        if (uid && requested && serviceKey) {
          const owned = await authFetch(
            `${url}/rest/v1/projects?owner_id=eq.${encodeURIComponent(
              uid
            )}&select=id`,
            {
              headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
              },
            }
          );
          if (owned.ok) {
            const rows = (await safeJson(owned)) as Array<{
              id?: string;
            }> | null;
            const ids = Array.isArray(rows)
              ? rows.map((r) => r.id)
              : [];
            if (ids.includes(requested)) {
              return {
                ok: true,
                auth: {
                  user_id: uid,
                  project_id: requested,
                  mode: "jwt",
                },
              };
            }
          }
        }
        // Valid user, but no requested project we could authorize.
        return { ok: false, status: 403, error: "project_forbidden" };
      }
    } catch {
      // Fall through to invalid_token.
    }
  }

  // (c) Neither the API-key check nor the JWT check succeeded.
  return { ok: false, status: 401, error: "invalid_token" };
}
