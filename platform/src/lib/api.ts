const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8420";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }

  return res.json();
}

export const api = {
  getAgents: () => apiFetch<unknown[]>("/api/agents"),
  getAgent: (id: string) => apiFetch<unknown>(`/api/agents/${id}`),
  createAgent: (data: unknown) =>
    apiFetch<unknown>("/api/agents", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getStatus: () => apiFetch<unknown>("/api/status"),
  getLogs: (agentId?: string) =>
    apiFetch<unknown[]>(
      agentId ? `/api/logs?agentId=${agentId}` : "/api/logs"
    ),
  saveApiKey: (key: string) =>
    apiFetch<unknown>("/api/settings/key", {
      method: "POST",
      body: JSON.stringify({ key }),
    }),
};

export function getApiBaseUrl(): string {
  return API_BASE;
}
