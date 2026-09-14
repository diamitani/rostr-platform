---
name: mcp-guide-skill
description: "LLM-agnostic AI agent development skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with MCP Guide: session_info Tools. Use when working with mcp guide."
---

# MCP Guide: session_info Tools

This skill uses two MCP tools from the `session_info` server to access today's Cowork sessions.

---

## Tool 1: `mcp__session_info__list_sessions`

**Purpose**: Returns a list of all Claude Cowork sessions.

**Call pattern**:
```
mcp__session_info__list_sessions()
```

No required parameters. The tool returns session metadata including session IDs, timestamps, and titles/descriptions where available.

**Date filtering**:
The tool may return sessions across multiple days. Filter the results by comparing the session timestamp against today's date (from `currentDate` in your context: `2026-06-05` format). Keep only sessions where the date portion matches today.

**What the response includes** (typical fields):
- `session_id` or `id` — use this to call read_transcript
- `created_at` or `timestamp` — use for date filtering and ordering
- `title` or `description` — may be available, may be null
- `message_count` — helpful to know session size before reading

**If the call fails**: Tell the user "I couldn't connect to the session index right now — try again in a moment" and stop.

---

## Tool 2: `mcp__session_info__read_transcript`

**Purpose**: Returns the full message history for a given session.

**Call pattern**:
```
mcp__session_info__read_transcript(session_id: "<id>")
```

Pass the `session_id` (or `id`) from the list_sessions response.

**Response format**: Typically returns an array of messages with `role` (user/assistant) and `content` fields.

**Reading strategy for large transcripts**:
- If a session has many messages, focus on: the first user message (what they asked for), the last few assistant messages (what was delivered), and any messages containing words like "here's", "I've created", "saved to", "next steps", "TODO", "follow up"
- You don't need to read every line — extract the signal, skip the noise
- For very long transcripts (50+ messages), skim by reading every 3rd-5th exchange

**Ordering**: Process sessions newest-first so the report opens with the most recent work.

---

## Error Handling

| Scenario | What to do |
|---|---|
| `list_sessions` returns empty array | Report "No sessions found for today" gracefully |
| `list_sessions` fails entirely | Tell user to retry; don't crash |
| `read_transcript` fails for one session | Skip it, log "1 session unavailable" in report footer |
| Transcript is empty / 0 messages | Skip silently |
| Session is from a different day | Filter it out before reading |

---

## Example Flow

```
1. list_sessions() → returns 4 sessions
2. Filter to today → 3 sessions match
3. Order by timestamp descending → [session_C, session_B, session_A]
4. read_transcript(session_C) → most recent session
5. read_transcript(session_B) → second session  
6. read_transcript(session_A) → earliest session
7. Extract + synthesize → write report
```

---

## Notes

- The `session_info` MCP is read-only — this skill never modifies or deletes anything
- Session data is private to the user's Cowork workspace
- If `list_sessions` returns sessions without timestamps, try to infer order from session IDs or content clues

---

## Asana Tools

This skill uses two Asana MCP tools to pull today's task activity.

### Tool 3: `mcp__555be8f8-37df-4a20-8299-f9d35d9f3e69__asana_search_tasks`

**Purpose**: Find tasks modified or created today across the user's Asana workspace.

**Getting the workspace GID first:**
Call `mcp__555be8f8-37df-4a20-8299-f9d35d9f3e69__asana_list_workspaces` with no arguments to get the workspace GID. Use the first workspace returned (Patrick has one workspace: {{COMPANY_NAME}}).

**Call pattern for today's modified tasks:**
```
asana_search_tasks(
  workspace: "<workspace_gid>",
  modified_since: "<today's date in ISO format, e.g. 2026-06-06T00:00:00Z>"
)
```

**Also useful:** To find tasks *completed* today, add `completed: true` and `completed_since` = today's date.

**What the response includes:**
- `gid` — task ID, use this for get_stories_for_task
- `name` — task title
- `completed` / `completed_at` — whether it was finished
- `created_at` — whether it's a new task
- `modified_at` — last modified time
- `assignee` — who owns it
- `projects` — which project(s) it belongs to

**Limit results:** If many tasks are returned, focus on tasks where `modified_at` is today (not just the search boundary).

---

### Tool 4: `mcp__555be8f8-37df-4a20-8299-f9d35d9f3e69__asana_get_stories_for_task`

**Purpose**: Get comments and activity log for a specific task.

**Call pattern:**
```
asana_get_stories_for_task(task_gid: "<task_gid>")
```

**What the response includes:**
- `type` — `"comment"` (user-written) or `"system"` (auto-generated activity like status changes)
- `text` — content of the comment or activity description
- `created_at` — when it was added
- `created_by` — who added it

**Filter to today:** Only surface stories where `created_at` is today's date.

**Don't over-fetch:** Only call get_stories for tasks that appear interesting (completed today, have recent comments, or were flagged as blockers). Skip routine system activity like "moved to section".

---

## Updated Error Handling (Asana)

| Scenario | What to do |
|---|---|
| `list_workspaces` fails | Skip Asana section, note "(Asana unavailable)" in footer |
| `search_tasks` returns empty | Skip Asana section silently |
| `get_stories_for_task` fails for one task | Skip stories for that task, continue |
| Too many tasks returned (50+) | Cap at 20 most recently modified; note "showing 20 of N" in report |

---

## Updated Example Flow

```
1. list_sessions() → 3 sessions today
2. read_transcript(session_C, B, A) → extract Claude work
3. list_workspaces() → {{COMPANY_NAME}} workspace GID
4. search_tasks(workspace, modified_since=today) → 8 tasks
5. get_stories_for_task(task_1) → 2 comments today
6. get_stories_for_task(task_4) → 1 comment today
7. [skip tasks with no comments/stories]
8. Synthesize everything → write unified report
```
