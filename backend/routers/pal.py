"""PAL Compiler API — natural language → agent manifest."""

from fastapi import APIRouter
from pydantic import BaseModel
from rostr.pal import PALCompiler

router = APIRouter()
pal = PALCompiler()


class CompileRequest(BaseModel):
    input: str
    hub_context: dict | None = None


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


@router.post("/compile", response_model=CompileResponse)
def compile_intent(req: CompileRequest):
    """Compile natural language input into a typed agent manifest."""
    intent, enhanced, manifest, phase = pal.compile_intent(req.input, req.hub_context)

    return CompileResponse(
        primary_intent=intent.primary_intent,
        domain=intent.domain.value,
        subject=intent.subject,
        constraints=intent.constraints,
        urgency=intent.urgency.value,
        ambiguity_score=intent.ambiguity_score,
        enhanced_instruction=enhanced,
        agent_type=manifest.agent_type.value,
        model=manifest.model,
        temperature=manifest.temperature,
        tools_allow=manifest.tools_allow,
        routing_phase=phase,
        completion_criteria=manifest.completion_criteria,
    )
