import { z } from "zod";
import { orderByNpao } from "@/lib/rostr/npao";
import { resolveAuth } from "@/lib/rostr/auth";

// Accepts either { tasks: string[] } or { texts: string[] }.
// project_id is optional and only used for auth scoping (classification
// itself is stateless); in dev mode it is required by the auth layer.
const classifyBodySchema = z
  .object({
    tasks: z.array(z.string().min(1)).optional(),
    texts: z.array(z.string().min(1)).optional(),
    project_id: z.string().min(1).optional(),
  })
  .refine((v) => v.tasks !== undefined || v.texts !== undefined, {
    message: "one of tasks or texts is required",
  });

// POST /api/v1/npao/classify — classify tasks and return them in NPAO order.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = classifyBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const auth = await resolveAuth(req, {
    projectIdFromBody: parsed.data.project_id,
  });
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const titles = parsed.data.tasks ?? parsed.data.texts ?? [];
  // orderByNpao classifies each task and returns them in priority order.
  const ordered = orderByNpao(titles.map((title) => ({ title })));

  return Response.json(ordered.map((r) => ({ title: r.task.title, npao: r.npao })));
}
