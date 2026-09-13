"""NPAO API — phase classification + priority scoring + agent allocation."""

from fastapi import APIRouter
from pydantic import BaseModel
from rostr.npao import NPAO, PhaseType, AgentSpec
import sys, os, time, uuid, json

router = APIRouter()
npao = NPAO()


class ClassifyRequest(BaseModel):
    task_description: str
    domain: str = ""
    blocked_tasks: int = 0
    revenue_impact: bool = False
    user_impact: bool = False
    team_impact: bool = False
    estimated_hours: float = 4.0


class TaskCreateRequest(BaseModel):
    description: str
    domain: str = ""


def _parse_list(val):
    """Parse a value that could be JSON array, comma-separated string, or empty."""
    if not val:
        return []
    if isinstance(val, list):
        return val
    s = str(val).strip()
    if s.startswith("["):
        try:
            return json.loads(s)
        except json.JSONDecodeError:
            pass
    return [x.strip() for x in s.split(",") if x.strip()]


def _load_agents():
    """Load agents from SQLite into NPAO registry."""
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db

    conn = get_db()
    rows = conn.execute("SELECT * FROM agents").fetchall()
    conn.close()

    npao.agent_registry.clear()
    for row in rows:
        tools = _parse_list(row["tools"])
        phases_raw = _parse_list(row["phases"])
        phases = []
        for p in phases_raw:
            try:
                phases.append(PhaseType[p.upper().replace("-", "").replace(" ", "_")])
            except KeyError:
                phases.append(PhaseType.PRED)

        npao.register_agent(AgentSpec(
            agent_id=row["id"],
            name=row["name"],
            agent_type=row["agent_type"],
            capabilities=_parse_list(row["capabilities"]),
            tools=tools,
            phases=phases,
            model=row["model"],
            max_parallel_tasks=row["max_parallel_tasks"],
            current_tasks=row["current_tasks"],
        ))


@router.post("/classify")
def classify(req: ClassifyRequest):
    """Classify task phase + score priority + allocate agent."""
    _load_agents()
    result = npao.process(
        task_description=req.task_description,
        domain=req.domain,
        blocked_tasks=req.blocked_tasks,
        revenue_impact=req.revenue_impact,
        user_impact=req.user_impact,
        team_impact=req.team_impact,
        estimated_hours=req.estimated_hours,
    )
    return result


@router.post("/tasks")
def create_task(req: TaskCreateRequest):
    """Create a classified task and persist to database."""
    _load_agents()
    result = npao.process(task_description=req.description, domain=req.domain)

    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db

    task_id = str(uuid.uuid4())
    now = time.time()

    conn = get_db()
    conn.execute(
        """INSERT INTO tasks (id, description, phase, priority_score, priority_status,
           allocated_agent_id, orchestration_pattern, status, created_at)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        (
            task_id, req.description, result["phase"],
            result["priority"]["composite"], result["priority"]["status"],
            result["allocation"]["agent"], result["orchestration"],
            "pending", now,
        ),
    )
    conn.commit()
    conn.close()

    return {"task_id": task_id, **result}


@router.get("/tasks")
def list_tasks(limit: int = 20):
    """List all classified tasks."""
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db
    conn = get_db()
    rows = conn.execute("SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]
