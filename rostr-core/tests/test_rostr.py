"""Tests for ROSTR Core Framework."""

import pytest
from rostr.pal import PALCompiler, Intent, AgentManifest, Domain, Urgency, AgentType
from rostr.npao import NPAO, PhaseType, PriorityScore, AgentSpec
from rostr.ragdal import RAGDAL, SourceTier, KnowledgeEntry, DataType
from rostr.hub import RostrHub, AgentRegistration, StateLevel, Namespace


# ── PAL Tests ──────────────────────────────────────────────────

class TestPALCompiler:
    def setup_method(self):
        self.pal = PALCompiler()

    def test_extract_intent_basic(self):
        intent = self.pal.extract_intent("Build a pricing page for our SaaS product")
        assert isinstance(intent, Intent)
        assert intent.primary_intent is not None
        assert len(intent.primary_intent) > 0

    def test_classify_domain_code(self):
        intent = self.pal.extract_intent("Build a REST API with Python")
        assert intent.domain == Domain.CODE

    def test_classify_domain_research(self):
        intent = self.pal.extract_intent("Research competitor pricing models")
        assert intent.domain == Domain.RESEARCH

    def test_classify_domain_debug(self):
        intent = self.pal.extract_intent("Fix the authentication bug in production")
        assert intent.domain == Domain.DEBUG

    def test_classify_urgency_immediate(self):
        intent = self.pal.extract_intent("Fix this NOW it's critical")
        assert intent.urgency == Urgency.IMMEDIATE

    def test_ambiguity_score_detailed(self):
        intent = self.pal.extract_intent("Build a Python CLI tool for data processing")
        assert intent.ambiguity_score < 0.8  # More specific = lower ambiguity

    def test_full_pipeline(self):
        intent, enhanced, manifest, phase = self.pal.compile_intent(
            "Build a Python REST API for user management"
        )
        assert intent.domain == Domain.CODE
        assert manifest.agent_type == AgentType.BUILDER
        assert phase in ["PreD", "Design", "Development", "Deployment", "Debugging"]
        assert len(enhanced) > 0

    def test_compile_intent_research(self):
        intent, enhanced, manifest, phase = self.pal.compile_intent(
            "Research the best CRM for small business"
        )
        assert intent.domain == Domain.RESEARCH
        assert manifest.agent_type == AgentType.RESEARCHER
        assert phase == "PreD"

    def test_compile_intent_debug(self):
        intent, enhanced, manifest, phase = self.pal.compile_intent(
            "Fix the payment processing error"
        )
        assert intent.domain == Domain.DEBUG
        assert manifest.agent_type == AgentType.DEBUGGER
        assert phase == "Debugging"

    def test_intent_to_dict(self):
        intent = self.pal.extract_intent("Build a tool")
        d = intent.to_dict()
        assert "primary_intent" in d
        assert "domain" in d
        assert "ambiguity_score" in d

    def test_manifest_to_dict(self):
        _, _, manifest, _ = self.pal.compile_intent("Build an app")
        d = manifest.to_dict()
        assert "runtime" in d
        assert "instructions" in d
        assert "tools_enabled" in d

    def test_manifest_to_yaml(self):
        _, _, manifest, _ = self.pal.compile_intent("Build an app")
        yaml_str = manifest.to_yaml()
        assert "runtime:" in yaml_str
        assert "agent_type:" in yaml_str


# ── NPAO Tests ─────────────────────────────────────────────────

class TestNPAO:
    def setup_method(self):
        self.npao = NPAO()

    def test_classify_phase_pred(self):
        phase = self.npao.classify_phase("Research top 3 GTM platforms")
        assert phase == PhaseType.PRED

    def test_classify_phase_development(self):
        phase = self.npao.classify_phase("Build a REST API")
        assert phase == PhaseType.DEVELOPMENT

    def test_classify_phase_debugging(self):
        phase = self.npao.classify_phase("Fix the crash bug")
        assert phase == PhaseType.DEBUGGING

    def test_classify_phase_deployment(self):
        phase = self.npao.classify_phase("Deploy to production")
        assert phase == PhaseType.DEPLOYMENT

    def test_classify_phase_design(self):
        phase = self.npao.classify_phase("Design the new landing page UI")
        assert phase == PhaseType.DESIGN

    def test_score_priority_debugging(self):
        score = self.npao.score_priority(
            PhaseType.DEBUGGING, blocked_tasks=6, revenue_impact=True, estimated_hours=0.5
        )
        assert score.composite >= 7.0  # Should be immediate
        assert score.status.value == "immediate"

    def test_score_priority_pred(self):
        score = self.npao.score_priority(
            PhaseType.PRED, blocked_tasks=0, estimated_hours=4.0
        )
        assert score.composite < 7.0  # Should not be immediate

    def test_priority_score_thresholds(self):
        # Debug + revenue + 6 blocked + < 1hr should be ≥ 7.0
        high = self.npao.score_priority(
            PhaseType.DEBUGGING, blocked_tasks=6, revenue_impact=True, estimated_hours=0.5
        )
        assert high.composite >= 7.0

        # PreD with nothing should be < 4.0
        low = self.npao.score_priority(
            PhaseType.PRED, blocked_tasks=0, estimated_hours=16
        )
        assert low.composite < 5.0

    def test_register_and_allocate(self):
        agent = AgentSpec(
            agent_id="test-1",
            name="Test Researcher",
            agent_type="researcher",
            capabilities=["web_search"],
            tools=["web_search"],
            phases=[PhaseType.PRED, PhaseType.DESIGN],
        )
        self.npao.register_agent(agent)

        allocated = self.npao.allocate(PhaseType.PRED, ["web_search"])
        assert allocated is not None
        assert allocated.agent_id == "test-1"

    def test_allocate_no_match(self):
        agent = AgentSpec(
            agent_id="test-2",
            name="Test Builder",
            agent_type="builder",
            capabilities=["code_execution"],
            tools=["code_execution"],
            phases=[PhaseType.DEVELOPMENT],
        )
        self.npao.register_agent(agent)

        # Asking for a researcher in PreD phase should not match the builder
        allocated = self.npao.allocate(PhaseType.PRED, ["web_search"])
        assert allocated is None

    def test_select_pattern_sequential(self):
        pattern = self.npao.select_pattern(task_count=1, has_dependencies=True, needs_aggregation=False, has_conditionals=False)
        assert pattern.value == "sequential"

    def test_select_pattern_parallel(self):
        pattern = self.npao.select_pattern(task_count=4, has_dependencies=False, needs_aggregation=False, has_conditionals=False)
        assert pattern.value == "parallel"

    def test_full_process(self):
        agent = AgentSpec(
            agent_id="test-3",
            name="Test Researcher",
            agent_type="researcher",
            capabilities=["web_search"],
            tools=["web_search", "file_system:read"],
            phases=[PhaseType.PRED],
        )
        self.npao.register_agent(agent)

        result = self.npao.process(
            task_description="Research competitor pricing",
            domain="research",
            revenue_impact=True,
            estimated_hours=2,
        )
        assert "phase" in result
        assert "priority" in result
        assert "allocation" in result
        assert "orchestration" in result
        assert result["phase"] == "PRED"


# ── RAG DAL Tests ──────────────────────────────────────────────

class TestRAGDAL:
    def setup_method(self):
        self.ragdal = RAGDAL()

    def test_classify_tier_1(self):
        tier = self.ragdal.classify_tier("https://arxiv.org/abs/2401.00001")
        assert tier == SourceTier.TIER_1

    def test_classify_tier_2(self):
        tier = self.ragdal.classify_tier("https://reuters.com/article/ai-agents")
        assert tier == SourceTier.TIER_2

    def test_classify_tier_3(self):
        tier = self.ragdal.classify_tier("https://medium.com/blog/ai-thoughts")
        assert tier == SourceTier.TIER_3

    def test_compute_confidence(self):
        conf = self.ragdal.compute_confidence(
            source_count=8, consistency=0.9, tier_distribution=0.8, recency=0.95
        )
        assert 0.4 <= conf <= 1.0

    def test_ingest_knowledge(self):
        entry = KnowledgeEntry(
            query_origin="What is the best GTM platform?",
            content="Clay is the top GTM platform for B2B SaaS",
            summary="Clay recommended",
            source_url="https://clay.com",
            source_title="Clay GTM",
            source_tier=SourceTier.TIER_2,
            credibility_score=0.75,
            topics=["gtm", "b2b-saas"],
        )
        result = self.ragdal.ingest(entry)
        assert result.confidence > 0
        assert len(self.ragdal.knowledge_base) == 1

    def test_multi_pass_retrieve(self):
        report = self.ragdal.multi_pass_retrieve("GTM automation platforms")
        assert report.passes_completed <= 4
        assert report.sources_used > 0
        assert isinstance(report.is_complete, bool)
        assert len(report.sub_topics) > 0

    def test_knowledge_entry_to_dict(self):
        entry = KnowledgeEntry(
            query_origin="test query",
            content="test content",
            summary="test summary",
            source_tier=SourceTier.TIER_1,
        )
        d = entry.to_dict()
        assert d["source"]["tier"] == 1.0
        assert d["metadata"]["data_type"] == "factual"


# ── Rostr Hub Tests ────────────────────────────────────────────

class TestRostrHub:
    def setup_method(self):
        self.hub = RostrHub()

    def test_register_agent(self):
        agent = AgentRegistration(
            name="Test Agent",
            agent_type="researcher",
            capabilities=["web_search"],
        )
        registered = self.hub.register_agent(agent)
        assert registered.agent_id in self.hub.agents

    def test_get_agent(self):
        agent = AgentRegistration(name="Test", agent_type="builder")
        self.hub.register_agent(agent)
        found = self.hub.get_agent(agent.agent_id)
        assert found is not None
        assert found.name == "Test"

    def test_list_agents_by_type(self):
        self.hub.register_agent(AgentRegistration(name="R1", agent_type="researcher"))
        self.hub.register_agent(AgentRegistration(name="B1", agent_type="builder"))
        researchers = self.hub.list_agents_by_type("researcher")
        assert len(researchers) == 1

    def test_log_decision(self):
        d = self.hub.log_decision(
            context="Test context",
            decision="Test decision",
            rationale="Test rationale",
            alternatives=["Alt A", "Alt B"],
            namespace="projects/test",
        )
        assert len(self.hub.decisions) == 1
        assert d.decision == "Test decision"

    def test_get_decisions_by_namespace(self):
        self.hub.log_decision("C1", "D1", "R1", namespace="projects/a")
        self.hub.log_decision("C2", "D2", "R2", namespace="projects/b")
        results = self.hub.get_decisions(namespace="projects/a")
        assert len(results) == 1
        assert results[0].decision == "D1"

    def test_log_learning(self):
        l = self.hub.log_learning(
            context="Test context",
            insight="Test insight",
            outcome="success",
            source="agent-1",
            tags=["test", "demo"],
        )
        assert len(self.hub.learnings) == 1
        assert l.insight == "Test insight"

    def test_search_learnings(self):
        self.hub.log_learning("GTM research session", "Clay is the best GTM platform", tags=["gtm"])
        self.hub.log_learning("Code review session", "Use type hints everywhere", tags=["python"])
        results = self.hub.search_learnings("GTM")
        assert len(results) >= 1
        assert "Clay" in results[0].insight

    def test_state_management(self):
        self.hub.set_state(StateLevel.SESSION, "active_task", "research_gtm")
        val = self.hub.get_state(StateLevel.SESSION, "active_task")
        assert val == "research_gtm"

    def test_compound_report(self):
        self.hub.log_decision("C", "D", "R")
        self.hub.log_learning("C", "I")
        report = self.hub.compound()
        assert report["total_decisions"] == 1
        assert report["total_learnings"] == 1

    def test_ensure_namespace(self):
        ns = self.hub.ensure_namespace(Namespace.PROJECTS, "my-project")
        assert "created_at" in ns
        assert self.hub.get_namespace(Namespace.PROJECTS, "my-project") is not None


# ── Integration Tests ──────────────────────────────────────────

class TestIntegration:
    """End-to-end ROSTR pipeline tests."""

    def test_full_pipeline(self):
        """Test PAL → NPAO → RAG DAL → Hub in sequence."""
        hub = RostrHub()
        pal = PALCompiler()
        npao = NPAO()
        ragdal = RAGDAL()

        # 1. Compile intent
        intent, enhanced, manifest, phase = pal.compile_intent(
            "Research B2B SaaS GTM automation platforms"
        )
        assert intent.domain == Domain.RESEARCH
        assert phase == "PreD"

        # 2. NPAO classification
        agent = AgentSpec(
            agent_id="test-int-1",
            name="Integration Researcher",
            agent_type="researcher",
            capabilities=["web_search"],
            tools=["web_search", "file_system:read"],
            phases=[PhaseType.PRED],
        )
        npao.register_agent(agent)
        result = npao.process(task_description=enhanced, domain="research")
        assert result["allocation"]["agent"] is not None

        # 3. RAG DAL ingestion
        entry = ragdal.ingest(KnowledgeEntry(
            query_origin=enhanced,
            content="GTM platforms: Clay, Outreach, Salesloft",
            summary="Clay recommended for B2B SaaS",
            source_tier=SourceTier.TIER_1,
            credibility_score=1.0,
        ))
        assert entry.confidence > 0

        # 4. Hub persistence
        hub.log_decision(
            context=enhanced,
            decision="Selected Clay as recommended GTM platform",
            rationale="Best data enrichment and 50+ providers",
        )
        hub.log_learning(
            context=enhanced,
            insight="RAG DAL Tier 1 sources provided sufficient coverage",
            outcome="success",
            tags=["ragdal", "gtm"],
        )

        assert len(hub.decisions) == 1
        assert len(hub.learnings) == 1


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
