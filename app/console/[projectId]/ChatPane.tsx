"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentDef, SseEvent } from "@/lib/rostr/types";

interface ChatPaneProps {
  projectId: string;
  agents: AgentDef[];
  skills: Record<string, { name: string; description: string }>;
}

interface StreamMessage {
  type: SseEvent["type"];
  text: string;
  data?: unknown;
}

const API_KEY_STORAGE = "rostr_api_key";

function labelFor(type: SseEvent["type"]): string {
  switch (type) {
    case "thought":
      return "Thought";
    case "action":
      return "Action";
    case "result":
      return "Result";
    case "done":
      return "Done";
    case "error":
      return "Error";
    case "reply":
      return "Reply";
  }
}

export default function ChatPane({ projectId, agents, skills }: ChatPaneProps) {
  const [agentId, setAgentId] = useState<string>(agents[0]?.id ?? "");
  const [skillName, setSkillName] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [streaming, setStreaming] = useState<boolean>(false);
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setApiKey(window.localStorage.getItem(API_KEY_STORAGE) ?? "");
    } catch {
      // localStorage unavailable — leave empty
    }
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    try {
      window.localStorage.setItem(API_KEY_STORAGE, value);
    } catch {
      // localStorage unavailable — key stays in memory for this session
    }
  };

  const appendEvents = (raw: string): string => {
    // raw is the leftover buffer from the previous chunk; returns new leftover.
    const buffer = raw;
    const parts = buffer.split("\n\n");
    const leftover = parts.pop() ?? "";
    for (const part of parts) {
      const lines = part.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload) continue;
        try {
          const event = JSON.parse(payload) as SseEvent;
          setMessages((prev) => [
            ...prev,
            { type: event.type, text: event.text ?? "", data: event.data },
          ]);
        } catch {
          // malformed frame — skip
        }
      }
    }
    return leftover;
  };

  const send = async () => {
    const trimmedGoal = goal.trim();
    if (!trimmedGoal || streaming || !agentId) return;
    setStreaming(true);
    setGoal("");

    const body: Record<string, string> = {
      project_id: projectId,
      agent: agentId,
      input: trimmedGoal,
    };
    if (skillName) body.skill = skillName;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey.trim()) headers["Authorization"] = `Bearer ${apiKey.trim()}`;

    let leftover = "";
    try {
      const res = await fetch("/api/v1/run", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok || !res.body) {
        let detail = "";
        try {
          detail = await res.text();
        } catch {
          detail = "";
        }
        setMessages((prev) => [
          ...prev,
          { type: "error", text: `Request failed (${res.status})${detail ? `: ${detail.slice(0, 500)}` : ""}` },
        ]);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        leftover = appendEvents(leftover + decoder.decode(value, { stream: true }));
      }
      // Flush any trailing frame without a closing blank line.
      appendEvents(leftover + "\n\n");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          text: `Stream interrupted: ${err instanceof Error ? err.message : "network error"}`,
        },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  const skillEntries = Object.entries(skills);
  const activeAgent = agents.find((a) => a.id === agentId);
  const allowedSkills = activeAgent ? new Set(activeAgent.skills) : null;
  const visibleSkills = allowedSkills
    ? skillEntries.filter(([key]) => allowedSkills.has(key))
    : skillEntries;

  return (
    <div>
      <div className="rc-message-list" ref={listRef} aria-live="polite">
        {messages.length === 0 && (
          <p className="rc-empty">
            Send a goal and watch the runtime work: PAL compiles it, NPAO triages it, workers
            execute it, and every step streams back here live.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`rc-msg rc-msg-${m.type}`}>
            <span className="rc-msg-label">{labelFor(m.type)}</span>
            {m.text}
          </div>
        ))}
        {streaming && (
          <div className="rc-msg rc-msg-thought">
            <span className="rc-msg-label">Streaming</span>
            Receiving events from the runtime…
          </div>
        )}
      </div>

      <form
        className="rc-form"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <div className="rc-field-row">
          <div className="rc-field">
            <label htmlFor="rc-agent">Agent</label>
            <select
              id="rc-agent"
              value={agentId}
              onChange={(e) => {
                setAgentId(e.target.value);
                setSkillName("");
              }}
              disabled={streaming}
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="rc-field">
            <label htmlFor="rc-skill">Skill (optional)</label>
            <select
              id="rc-skill"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              disabled={streaming}
            >
              <option value="">None</option>
              {visibleSkills.map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rc-field">
          <label htmlFor="rc-goal">Goal</label>
          <textarea
            id="rc-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe what you want the agent to do…"
            disabled={streaming}
          />
        </div>

        <div className="rc-field">
          <label htmlFor="rc-apikey">API key (optional)</label>
          <input
            id="rc-apikey"
            type="text"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="Saved to this browser only"
            autoComplete="off"
            spellCheck={false}
            disabled={streaming}
          />
        </div>

        <button className="rc-btn" type="submit" disabled={streaming || !goal.trim() || !agentId}>
          {streaming ? "Running…" : "Send"}
        </button>
      </form>
    </div>
  );
}
