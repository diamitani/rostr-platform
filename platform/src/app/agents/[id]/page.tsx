import { AgentDetailClient } from "./client";
import { mockAgents } from "@/lib/mockData";

export function generateStaticParams() {
  return mockAgents.map((a) => ({ id: a.id }));
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <AgentDetailClient params={params} />;
}
