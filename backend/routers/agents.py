"""Agent CRUD API — create, list, get, delete, and run agents with PAL compilation."""

import json
import time
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth_utils import get_current_user

router = APIRouter()


# ── Helper ──────────────────────────────────────────────────────

def _db():
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db
    return get_db()


# ── Request / Response models ───────────────────────────────────

class AgentCreateRequest(BaseModel):
    name: str
    description: str = ""
    tools: list[str] = []
    model: str = "deepseek-chat"


class AgentResponse(BaseModel):
    id: str
    name: str
    description: str
    tools: list[str]
    model: str
    status: str
    logs: list[str]
    created_at: float
    last_run_at: float | None = None


class AgentRunRequest(BaseModel):
    prompt: str


class AgentRunResponse(BaseModel):
    agent_id: str
    prompt: str
    result: dict
    log: str


# ── Endpoints ───────────────────────────────────────────────────

@router.post("", response_model=AgentResponse, status_code=201)
def create_agent(req: AgentCreateRequest, user_id: str = Depends(get_current_user)):
    """Create a new agent for the authenticated user."""
    conn = _db()
    agent_id = str(uuid.uuid4())
    now = time.time()
    tools_json = json.dumps(req.tools)
    logs_json = json.dumps([])

    conn.execute(
        """INSERT INTO user_agents (id, user_id, name, description, tools, model, status, logs, created_at)
           VALUES (?, ?, ?, ?, ?, ?, 'idle', ?, ?)""",
        (agent_id, user_id, req.name, req.description, tools_json, req.model, logs_json, now),
    )
    conn.commit()
    conn.close()

    return AgentResponse(
        id=agent_id,
        name=req.name,
        description=req.description,
        tools=req.tools,
        model=req.model,
        status="idle",
        logs=[],
        created_at=now,
    )


@router.get("", response_model=list[AgentResponse])
def list_agents(user_id: str = Depends(get_current_user)):
    """List all agents for the authenticated user."""
    conn = _db()
    rows = conn.execute(
        "SELECT * FROM user_agents WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,),
    ).fetchall()
    conn.close()

    return [
        AgentResponse(
            id=r["id"],
            name=r["name"],
            description=r["description"] or "",
            tools=json.loads(r["tools"]) if r["tools"] else [],
            model=r["model"],
            status=r["status"],
            logs=json.loads(r["logs"]) if r["logs"] else [],
            created_at=r["created_at"],
            last_run_at=r["last_run_at"],
        )
        for r in rows
    ]


@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(agent_id: str, user_id: str = Depends(get_current_user)):
    """Get agent detail including logs."""
    conn = _db()
    row = conn.execute(
        "SELECT * FROM user_agents WHERE id = ? AND user_id = ?",
        (agent_id, user_id),
    ).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Agent not found")

    return AgentResponse(
        id=row["id"],
        name=row["name"],
        description=row["description"] or "",
        tools=json.loads(row["tools"]) if row["tools"] else [],
        model=row["model"],
        status=row["status"],
        logs=json.loads(row["logs"]) if row["logs"] else [],
        created_at=row["created_at"],
        last_run_at=row["last_run_at"],
    )


@router.delete("/{agent_id}")
def delete_agent(agent_id: str, user_id: str = Depends(get_current_user)):
    """Remove an agent."""
    conn = _db()
    cur = conn.execute(
        "DELETE FROM user_agents WHERE id = ? AND user_id = ?",
        (agent_id, user_id),
    )
    conn.commit()
    deleted = cur.rowcount
    conn.close()

    if deleted == 0:
        raise HTTPException(status_code=404, detail="Agent not found")

    return {"status": "deleted", "agent_id": agent_id}


@router.post("/{agent_id}/run", response_model=AgentRunResponse)
def run_agent(agent_id: str, req: AgentRunRequest, user_id: str = Depends(get_current_user)):
    """Execute an agent with a prompt using PAL compilation."""
    conn = _db()
    row = conn.execute(
        "SELECT * FROM user_agents WHERE id = ? AND user_id = ?",
        (agent_id, user_id),
    ).fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Agent not found")

    now = time.time()

    # Mark agent as active
    conn.execute(
        "UPDATE user_agents SET status = 'active', last_run_at = ? WHERE id = ?",
        (now, agent_id),
    )

    # Run PAL compilation
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from rostr.pal import PALCompiler

    pal = PALCompiler()
    intent, enhanced, manifest, phase = pal.compile_intent(req.prompt)

    result = {
        "primary_intent": intent.primary_intent,
        "domain": intent.domain.value,
        "subject": intent.subject,
        "constraints": intent.constraints,
        "urgency": intent.urgency.value,
        "ambiguity_score": intent.ambiguity_score,
        "enhanced_instruction": enhanced,
        "agent_type": manifest.agent_type.value,
        "model": manifest.model,
        "temperature": manifest.temperature,
        "tools_allow": manifest.tools_allow,
        "routing_phase": phase,
        "completion_criteria": manifest.completion_criteria,
    }

    log_entry = f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ran prompt: '{req.prompt}' → phase={phase}, agent_type={manifest.agent_type.value}"

    # Append to logs
    existing_logs = json.loads(row["logs"]) if row["logs"] else []
    existing_logs.append(log_entry)
    # Keep only last 100 log entries
    if len(existing_logs) > 100:
        existing_logs = existing_logs[-100:]

    conn.execute(
        "UPDATE user_agents SET status = 'idle', logs = ? WHERE id = ?",
        (json.dumps(existing_logs), agent_id),
    )

    # Record compilation
    import uuid as _uuid
    try:
        conn.execute(
            "INSERT INTO compilations (id, user_id, input_text, output_json, source, created_at) VALUES (?, ?, ?, ?, 'pal-pipeline', ?)",
            (str(_uuid.uuid4()), user_id, req.prompt, json.dumps(result), now),
        )
    except Exception:
        pass

    conn.commit()
    conn.close()

    return AgentRunResponse(
        agent_id=agent_id,
        prompt=req.prompt,
        result=result,
        log=log_entry,
    )
