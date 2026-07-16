"""PAL Compiler API — natural language → agent manifest with LLM-powered compilation."""

import json
import os
import time
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import httpx

from rostr.pal import PALCompiler
from auth_utils import get_optional_user

router = APIRouter()
pal = PALCompiler()

# ── Global compilation counter (for stats) ──────────────────────
# This is intentionally module-level so stats can read it
compilation_count: int = 0
llm_compilation_count: int = 0
rule_based_count: int = 0


# ── Request / Response models ───────────────────────────────────

class CompileRequest(BaseModel):
    input: str
    hub_context: dict | None = None
    use_llm: bool = True  # Set to False to force rule-based compilation


class CompileResponse(BaseModel):
    primary_intent: str
    domain: str
    subject: str
    constraints: list[str]
    urgency: str
    ambiguity_score: float
    enhanced_instruction: str
    agent_type: str
    model: str
    temperature: float
    tools_allow: list[str]
    routing_phase: str
    completion_criteria: list[str]
    compilation_source: str = "rule-based"  # "rule-based" or "llm"


# ── LLM-powered compilation ─────────────────────────────────────

DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"
DEEPSEEK_MODEL = "deepseek-chat"


async def _llm_compile(user_input: str, api_key: str) -> dict:
    """
    Call DeepSeek API to compile natural language into an agent manifest.
    Returns a dict matching CompileResponse fields, or raises on failure.
    """
    system_prompt = """You are a PAL (Prompt Abstraction Layer) compiler. Your job is to analyze a user's natural language input and produce a structured agent manifest in JSON format.

Output ONLY valid JSON with exactly these fields:
{
  "primary_intent": "what the user wants to do (short phrase)",
  "domain": "one of: code, design, research, ops, sales, content, deploy, debug",
  "subject": "the main subject of the request",
  "constraints": ["list", "of", "constraints"],
  "urgency": "one of: immediate, queued, scheduled",
  "ambiguity_score": 0.0 to 1.0 (lower = more explicit),
  "enhanced_instruction": "an improved, more precise version of the user's request",
  "agent_type": "one of: builder, researcher, reviewer, designer, deployer, debugger",
  "model": "suggested LLM model for this task",
  "temperature": 0.0 to 1.0,
  "tools_allow": ["list", "of", "allowed", "tools"],
  "routing_phase": "one of: PreD, Design, Development, Deployment, Debugging",
  "completion_criteria": ["list", "of", "success", "criteria"]
}

Rules:
- If the user wants to build/code something, domain=code, agent_type=builder, routing_phase=Development
- If they want to research/analyze, domain=research, agent_type=researcher, routing_phase=PreD
- If they mention bugs/fixes, domain=debug, agent_type=debugger, routing_phase=Debugging
- If they mention deploying/shipping, domain=deploy, agent_type=deployer, routing_phase=Deployment
- Be specific and precise in enhanced_instruction. Add success criteria.
- ambiguity_score should be low (0.0-0.3) for clear requests, high (0.5-0.8) for vague ones."""

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{DEEPSEEK_BASE_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": DEEPSEEK_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input},
                ],
                "temperature": 0.3,
                "max_tokens": 1024,
                "response_format": {"type": "json_object"},
            },
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"LLM API error: {response.status_code} — {response.text[:200]}",
            )

        data = response.json()
        content = data["choices"][0]["message"]["content"]
        result = json.loads(content)

        # Validate required fields exist; fill defaults if missing
        defaults = {
            "primary_intent": user_input,
            "domain": "research",
            "subject": user_input,
            "constraints": [],
            "urgency": "queued",
            "ambiguity_score": 0.5,
            "enhanced_instruction": user_input,
            "agent_type": "researcher",
            "model": "deepseek-chat",
            "temperature": 0.3,
            "tools_allow": ["web_search", "file_system:read"],
            "routing_phase": "PreD",
            "completion_criteria": ["Task completed"],
        }
        for key, default in defaults.items():
            if key not in result:
                result[key] = default

        return result


def _rule_based_compile(user_input: str, hub_context: dict | None = None) -> dict:
    """Fallback: use the existing rule-based PAL compiler."""
    intent, enhanced, manifest, phase = pal.compile_intent(user_input, hub_context)

    return {
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


# ── Endpoints ───────────────────────────────────────────────────

@router.post("/compile", response_model=CompileResponse)
async def compile_intent(
    req: CompileRequest,
    user_id: str | None = Depends(get_optional_user),
):
    """Compile natural language input into a typed agent manifest.

    Uses DeepSeek LLM when an API key is available; falls back to rule-based compilation.
    """
    global compilation_count, llm_compilation_count, rule_based_count
    compilation_count += 1

    source = "rule-based"
    result = None

    # Try LLM compilation if requested and key is available
    if req.use_llm:
        from routers.settings import resolve_api_key  # noqa: E402 (lazy import)

        api_key = resolve_api_key(user_id)
        if api_key:
            try:
                result = await _llm_compile(req.input, api_key)
                source = "llm"
                llm_compilation_count += 1
            except Exception:
                # Graceful fallback: use rule-based
                result = None

    # Fallback to rule-based
    if result is None:
        result = _rule_based_compile(req.input, req.hub_context)
        source = "rule-based"
        rule_based_count += 1

    # Record compilation in database
    try:
        import sys as _sys
        _sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
        from db.database import get_db
        conn = get_db()
        conn.execute(
            "INSERT INTO compilations (id, user_id, input_text, output_json, source, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (
                str(uuid.uuid4()),
                user_id,
                req.input,
                json.dumps(result),
                source,
                time.time(),
            ),
        )
        conn.commit()
        conn.close()
    except Exception:
        pass

    return CompileResponse(compilation_source=source, **result)
