#!/usr/bin/env python3
"""
ROSTR Framework — Working Example: GTM Research Agent
=======================================================
Demonstrates the full ROSTR pipeline:
  PAL compile → NPAO classify → RAG DAL retrieve → Hub persist

Usage:
  python examples/gtm_research_agent.py
"""

import sys
import os

# Add src to path for local development
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from rostr.pal import PALCompiler
from rostr.npao import NPAO, PhaseType, AgentSpec
from rostr.ragdal import RAGDAL, KnowledgeEntry, SourceTier, DataType
from rostr.hub import RostrHub, AgentRegistration, StateLevel


def main():
    print("=" * 70)
    print("  ROSTR Framework — GTM Research Agent Demo")
    print("  Billion-Dollar Agent Operating System")
    print("=" * 70)

    # ── Initialize the Hub ───────────────────────────────────
    hub = RostrHub(base_path=".rostr-demo")

    # Register a research agent
    research_agent = AgentRegistration(
        name="GTM Researcher",
        agent_type="researcher",
        capabilities=["web_search", "competitor_analysis", "market_sizing"],
        tools=["web_search", "file_system:read"],
        phases=["PreD", "Design"],
        model="claude-sonnet-4-6",
    )
    hub.register_agent(research_agent)

    # Register a builder agent
    builder_agent = AgentRegistration(
        name="Full-Stack Builder",
        agent_type="builder",
        capabilities=["code_generation", "test_writing", "refactoring"],
        tools=["web_search", "code_execution", "file_system:write"],
        phases=["Development", "Debugging"],
        model="claude-sonnet-4-6",
    )
    hub.register_agent(builder_agent)

    print(f"\n📋 Registered {len(hub.agents)} agents:")
    for aid, agent in hub.agents.items():
        print(f"   • {agent.name} ({agent.agent_type}) — phases: {agent.phases}")

    # ── PAL: Compile User Intent ─────────────────────────────
    print("\n" + "─" * 70)
    print("  PAL Compilation Pipeline")
    print("─" * 70)

    pal = PALCompiler()

    user_input = "Research the top 3 GTM automation platforms for B2B SaaS and recommend the best one"
    print(f"\n📝 User Input: \"{user_input}\"")

    intent, enhanced, manifest, phase = pal.compile_intent(user_input)

    print(f"\n   Stage 1 — Extracted Intent:")
    print(f"     primary_intent: {intent.primary_intent}")
    print(f"     domain: {intent.domain.value}")
    print(f"     subject: {intent.subject}")
    print(f"     ambiguity_score: {intent.ambiguity_score}")

    print(f"\n   Stage 3 — Enhanced Instruction:")
    print(f"     {enhanced[:120]}...")

    print(f"\n   Stage 4 — Compiled Manifest:")
    print(f"     agent_type: {manifest.agent_type.value}")
    print(f"     model: {manifest.model}")
    print(f"     temperature: {manifest.temperature}")
    print(f"     tools: {manifest.tools_allow}")

    print(f"\n   Stage 5 — Routed Phase: {phase}")

    # ── NPAO: Classify & Prioritize ──────────────────────────
    print("\n" + "─" * 70)
    print("  NPAO Decision Engine")
    print("─" * 70)

    npao = NPAO()

    # Register the same agents in NPAO
    npao.register_agent(AgentSpec(
        agent_id=research_agent.agent_id,
        name=research_agent.name,
        agent_type=research_agent.agent_type,
        capabilities=research_agent.capabilities,
        tools=research_agent.tools,
        phases=[PhaseType.PRED, PhaseType.DESIGN],
    ))
    npao.register_agent(AgentSpec(
        agent_id=builder_agent.agent_id,
        name=builder_agent.name,
        agent_type=builder_agent.agent_type,
        capabilities=builder_agent.capabilities,
        tools=builder_agent.tools,
        phases=[PhaseType.DEVELOPMENT, PhaseType.DEBUGGING],
    ))

    result = npao.process(
        task_description=user_input,
        domain="research",
        revenue_impact=True,
        estimated_hours=2.0,
    )

    print(f"\n   Navigate — Phase: {result['phase']} (index {result['phase_index']})")
    print(f"   Prioritize — Score: {result['priority']['composite']:.1f} → {result['priority']['status'].upper()}")
    print(f"     • Phase Urgency: {result['priority']['breakdown']['phase_urgency']:.1f} × 0.35")
    print(f"     • Dependency Impact: {result['priority']['breakdown']['dependency_impact']:.1f} × 0.30")
    print(f"     • Business Impact: {result['priority']['breakdown']['business_impact']:.1f} × 0.25")
    print(f"     • Resource Efficiency: {result['priority']['breakdown']['resource_efficiency']:.1f} × 0.10")
    print(f"   Allocate — Agent: {result['allocation']['agent_name']}")
    print(f"   Orchestrate — Pattern: {result['orchestration']}")
    print(f"\n   Phase Completion Criteria:")
    for c in result['criteria']:
        print(f"     [ ] {c}")

    # ── RAG DAL: Knowledge Retrieval ─────────────────────────
    print("\n" + "─" * 70)
    print("  RAG DAL Knowledge Engine")
    print("─" * 70)

    ragdal = RAGDAL(confidence_threshold=0.8, max_passes=3)

    # Simulate ingesting knowledge
    entry = ragdal.ingest(KnowledgeEntry(
        query_origin=user_input,
        content="GTM automation platforms include HubSpot Operations Hub, Outreach, Salesloft, and Clay. Clay leads in AI-powered data enrichment.",
        summary="Clay is recommended for B2B SaaS GTM automation due to AI enrichment, waterfall enrichment, and 50+ data providers.",
        source_url="https://www.clay.com",
        source_title="Clay — GTM Automation Platform",
        source_tier=SourceTier.TIER_2,
        credibility_score=0.75,
        topics=["gtm", "automation", "b2b-saas", "clay"],
        entities=["Clay", "HubSpot", "Outreach", "Salesloft"],
        data_type=DataType.FACTUAL,
    ))

    entry2 = ragdal.ingest(KnowledgeEntry(
        query_origin=user_input,
        content="For B2B SaaS under $10M ARR, Clay + Smartlead + HubSpot is the recommended stack based on cost, flexibility, and data quality.",
        summary="Clay + Smartlead + HubSpot is the top GTM stack for B2B SaaS.",
        source_url="https://www.gartner.com/reviews/market/sales-engagement",
        source_title="Gartner — Sales Engagement Market Guide",
        source_tier=SourceTier.TIER_1,
        credibility_score=1.0,
        topics=["gtm", "b2b-saas", "tech-stack"],
        entities=["Clay", "Smartlead", "HubSpot"],
        data_type=DataType.STATISTICAL,
    ))

    print(f"\n   Knowledge Base: {len(ragdal.knowledge_base)} entries ingested")
    for e in ragdal.knowledge_base:
        print(f"     • [{e.source_tier.name}] {e.source_title}")
        print(f"       Summary: {e.summary[:80]}...")
        print(f"       Confidence: {e.confidence}")

    # Execute multi-pass retrieval
    report = ragdal.multi_pass_retrieve("GTM automation platforms B2B SaaS")
    print(f"\n   Multi-Pass Retrieval Report:")
    print(f"     Passes: {report.passes_completed}")
    print(f"     Sources: {report.sources_used}")
    print(f"     Complete: {report.is_complete}")
    print(f"     Gaps: {report.gaps or 'None'}")

    # ── Hub: Persist Everything ──────────────────────────────
    print("\n" + "─" * 70)
    print("  Rostr Hub — State Persistence")
    print("─" * 70)

    # Log decisions
    hub.log_decision(
        context=user_input,
        decision="Selected Clay as primary GTM automation platform for B2B SaaS",
        rationale="Best-in-class AI enrichment, 50+ data providers, waterfall enrichment, cost-effective for sub-$10M ARR",
        alternatives=["HubSpot Operations Hub", "Outreach", "Salesloft"],
        namespace="projects/gtm-research",
    )

    # Log learnings
    hub.log_learning(
        context=user_input,
        insight="Clay + Smartlead + HubSpot is the recommended B2B SaaS GTM stack for companies under $10M ARR",
        outcome="success",
        source=research_agent.agent_id,
        tags=["gtm", "b2b-saas", "tech-stack", "clay"],
    )

    hub.log_learning(
        context=user_input,
        insight="RAG DAL Tier 1 (Gartner) and Tier 2 (vendor sites) were sufficient; Tier 3 community sources added noise",
        outcome="observation",
        source=research_agent.agent_id,
        tags=["ragdal", "best-practices"],
    )

    # Set session state
    hub.set_state(StateLevel.SESSION, "last_task", "gtm_research")
    hub.set_state(StateLevel.SESSION, "recommended_platform", "Clay")

    print(f"\n   Decisions logged: {len(hub.decisions)}")
    print(f"   Learnings logged: {len(hub.learnings)}")

    print(f"\n   Recent Decisions:")
    for d in hub.get_decisions(limit=3):
        print(f"     • {d.decision}")

    print(f"\n   Recent Learnings:")
    for l in hub.get_learnings(limit=3):
        print(f"     • [{l.outcome}] {l.insight[:80]}...")

    # Compound report
    compound = hub.compound()
    print(f"\n   ⚡ Knowledge Compounding Report:")
    print(f"     Total decisions: {compound['total_decisions']}")
    print(f"     Total learnings: {compound['total_learnings']}")
    print(f"     Total agents: {compound['total_agents']}")

    # ── Summary ───────────────────────────────────────────────
    print("\n" + "=" * 70)
    print("  ✅ ROSTR Pipeline Complete")
    print("=" * 70)
    print(f"""
   PAL  → Compiled intent: {intent.primary_intent}
        → Routed to phase: {phase}
        → Agent: {manifest.agent_type.value}
        → Model: {manifest.model}

   NPAO → Phase: {result['phase']}
        → Priority: {result['priority']['composite']:.1f} ({result['priority']['status']})
        → Allocated: {result['allocation']['agent_name']}

  RAG DAL → {len(ragdal.knowledge_base)} entries ingested
          → Multi-pass complete: {report.is_complete}

   Hub  → {len(hub.decisions)} decisions · {len(hub.learnings)} learnings · {len(hub.agents)} agents
        → Knowledge compounding active
""")


if __name__ == "__main__":
    main()
