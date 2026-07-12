"""RAG DAL API — multi-pass retrieval + knowledge ingestion."""

from fastapi import APIRouter
from pydantic import BaseModel
from rostr.ragdal import RAGDAL, KnowledgeEntry, SourceTier, DataType
import uuid
import time

router = APIRouter()
ragdal = RAGDAL(confidence_threshold=0.8, max_passes=4)


class SearchRequest(BaseModel):
    query: str


class IngestRequest(BaseModel):
    query_origin: str
    content: str
    summary: str = ""
    source_url: str = ""
    source_title: str = ""
    source_tier: float = 0.4
    credibility_score: float = 0.0
    topics: list[str] = []
    entities: list[str] = []
    data_type: str = "factual"


@router.post("/search")
def search(req: SearchRequest):
    """Execute multi-pass retrieval with credibility scoring."""
    report = ragdal.multi_pass_retrieve(req.query)
    results = ragdal.query_knowledge_base(req.query, top_k=10)

    return {
        "query": req.query,
        "passes_completed": report.passes_completed,
        "sources_used": report.sources_used,
        "is_complete": report.is_complete,
        "gaps": report.gaps,
        "confidence_per_topic": report.confidence_per_topic,
        "results": [r.to_dict() for r in results],
        "total_entries": len(ragdal.knowledge_base),
    }


@router.post("/ingest")
def ingest(req: IngestRequest):
    """Ingest a knowledge entry into the persistent knowledge base."""
    entry = KnowledgeEntry(
        entry_id=str(uuid.uuid4()),
        query_origin=req.query_origin,
        content=req.content,
        summary=req.summary,
        source_url=req.source_url,
        source_title=req.source_title,
        source_tier=SourceTier(req.source_tier),
        credibility_score=req.credibility_score,
        topics=req.topics,
        entities=req.entities,
        data_type=DataType(req.data_type),
    )
    result = ragdal.ingest(entry)

    # Also persist to SQLite
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db
    conn = get_db()
    conn.execute(
        """INSERT INTO knowledge_entries (id, query_origin, content, summary, source_url, source_title,
           source_tier, credibility_score, topics, entities, data_type, confidence, created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (
            result.entry_id, result.query_origin, result.content, result.summary,
            result.source_url, result.source_title, result.source_tier.value,
            result.credibility_score, str(result.topics), str(result.entities),
            result.data_type.value, result.confidence, time.time(),
        ),
    )
    conn.commit()
    conn.close()

    return result.to_dict()


@router.get("/knowledge")
def list_knowledge(limit: int = 20):
    """List all knowledge entries."""
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    from db.database import get_db
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM knowledge_entries ORDER BY created_at DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()

    return [dict(r) for r in rows]
