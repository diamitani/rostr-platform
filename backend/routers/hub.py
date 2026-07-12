"""Rostr Hub API — agents, decisions, learnings, knowledge compounding."""

from fastapi import APIRouter
from pydantic import BaseModel
import sys, os, time, uuid, json

router = APIRouter()


def _db():
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db
    return get_db()


# ── Agents ────────────────────────────────────────────────────

class AgentCreate(BaseModel):
    name: str
    agent_type: str
    capabilities: list[str] = []
    tools: list[str] = []
    phases: list[str] = ["PreD"]
    model: str = "claude-sonnet-4-6"
    max_parallel_tasks: int = 3


@router.get("/agents")
def list_agents():
    conn = _db()
    rows = conn.execute("SELECT * FROM agents ORDER BY last_active_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/agents")
def register_agent(req: AgentCreate):
    conn = _db()
    agent_id = str(uuid.uuid4())
    now = time.time()
    conn.execute(
        """INSERT INTO agents (id, name, agent_type, capabilities, tools, phases, model,
           max_parallel_tasks, created_at, last_active_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)""",
        (agent_id, req.name, req.agent_type, json.dumps(req.capabilities),
         json.dumps(req.tools), json.dumps(req.phases), req.model,
         req.max_parallel_tasks, now, now),
    )
    conn.commit()
    conn.close()
    return {"agent_id": agent_id, "status": "registered"}


@router.get("/agents/{agent_id}")
def get_agent(agent_id: str):
    conn = _db()
    row = conn.execute("SELECT * FROM agents WHERE id = ?", (agent_id,)).fetchone()
    conn.close()
    return dict(row) if row else {"error": "not found"}


# ── Decisions ─────────────────────────────────────────────────

class DecisionCreate(BaseModel):
    context: str
    decision: str
    rationale: str = ""
    alternatives: list[str] = []
    namespace: str = ""


@router.get("/decisions")
def list_decisions(limit: int = 20):
    conn = _db()
    rows = conn.execute("SELECT * FROM decisions ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/decisions")
def log_decision(req: DecisionCreate):
    conn = _db()
    decision_id = str(uuid.uuid4())
    conn.execute(
        """INSERT INTO decisions (id, context, decision, rationale, alternatives, namespace, created_at)
           VALUES (?,?,?,?,?,?,?)""",
        (decision_id, req.context, req.decision, req.rationale,
         json.dumps(req.alternatives), req.namespace, time.time()),
    )
    conn.commit()
    conn.close()
    return {"decision_id": decision_id, "status": "logged"}


# ── Learnings ─────────────────────────────────────────────────

class LearningCreate(BaseModel):
    context: str
    insight: str
    outcome: str = "observation"
    source: str = ""
    tags: list[str] = []


@router.get("/learnings")
def list_learnings(limit: int = 20):
    conn = _db()
    rows = conn.execute("SELECT * FROM learnings ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/learnings")
def log_learning(req: LearningCreate):
    conn = _db()
    learning_id = str(uuid.uuid4())
    conn.execute(
        """INSERT INTO learnings (id, context, insight, outcome, source, tags, created_at)
           VALUES (?,?,?,?,?,?,?)""",
        (learning_id, req.context, req.insight, req.outcome, req.source,
         json.dumps(req.tags), time.time()),
    )
    conn.commit()
    conn.close()
    return {"learning_id": learning_id, "status": "logged"}


# ── Knowledge Compounding ─────────────────────────────────────

@router.get("/compound")
def compound():
    conn = _db()
    agents_count = conn.execute("SELECT COUNT(*) FROM agents").fetchone()[0]
    decisions_count = conn.execute("SELECT COUNT(*) FROM decisions").fetchone()[0]
    learnings_count = conn.execute("SELECT COUNT(*) FROM learnings").fetchone()[0]
    knowledge_count = conn.execute("SELECT COUNT(*) FROM knowledge_entries").fetchone()[0]
    tasks_count = conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
    completed_tasks = conn.execute(
        "SELECT COUNT(*) FROM tasks WHERE status = 'completed'"
    ).fetchone()[0]
    conn.close()

    return {
        "total_agents": agents_count,
        "total_decisions": decisions_count,
        "total_learnings": learnings_count,
        "total_knowledge_entries": knowledge_count,
        "total_tasks": tasks_count,
        "completed_tasks": completed_tasks,
        "knowledge_compounding_active": learnings_count > 0,
    }
