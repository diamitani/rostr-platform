---
name: rostr-agent-builder
description: Complete ROSTR agent builder — 7-phase build pipeline from PAL intent compilation through JTBD system instructions, NPAO orchestration, state/context engineering, RAG DAL knowledge config, to multi-platform export and deployment. Covers Claude, Codex, OpenClaw, Hermes, and standalone exports.
version: 1.0.0
author: Patrick Diamitani
tags: [rostr, agent-builder, multi-platform, export, deployment, jtbd, system-instructions, agent-engineering]
dependencies:
  - rostr-core>=0.1.0
trigger_conditions:
  - user requests building a new agent
  - user wants to export a ROSTR pipeline as a standalone agent
  - deploying ROSTR configurations to target platforms
  - creating custom agents from ROSTR building blocks
  - multi-platform agent distribution
---

# ROSTR Agent Builder — 7-Phase Build Pipeline

## Overview

The ROSTR Agent Builder is the culmination of the ROSTR framework — a complete, production-ready agent construction system that takes a high-level intent and produces a fully functional, deployable agent for any supported platform. It implements a rigorous 7-phase build pipeline that leverages every ROSTR component (PAL, NPAO, RAG DAL, Hub) to engineer agents that are purposeful, well-architected, knowledge-grounded, and deployment-ready.

Unlike simple prompt templates or "agent wrappers," the ROSTR Agent Builder produces agents with:
- **Clear JTBD (Jobs To Be Done)** system instructions derived from compiled PAL intents
- **Orchestration-aware design** that knows how to coordinate with other agents
- **Managed state and context** with Hub integration
- **Configured knowledge retrieval** via RAG DAL
- **Multi-platform export** to Claude, Codex, OpenClaw, Hermes, and standalone formats
- **Automated deployment** with validation and monitoring setup

### Why the Agent Builder Exists

Building effective AI agents is hard. Most agent-building approaches fail because they:

1. **Start from prompts, not intents** — losing the user's original purpose
2. **Ignore orchestration** — agents are built in isolation, not as part of a system
3. **Skip knowledge configuration** — agents rely on training data alone
4. **Lock into one platform** — no portability across Claude, Codex, Hermes, etc.
5. **Manual deployment** — no automated setup or validation

The ROSTR Agent Builder solves all five through its systematic, pipeline-driven approach.

## The 7-Phase Build Pipeline

```
User Intent → [Phase 1: PAL Intent Compilation] → [Phase 2: JTBD System Instructions] → [Phase 3: NPAO Orchestration Design] → [Phase 4: State/Context Engineering] → [Phase 5: RAG DAL Knowledge Config] → [Phase 6: Multi-Platform Export] → [Phase 7: Setup & Deployment] → Deployed Agent
```

### Phase 1: PAL Intent Compilation

The first phase uses PAL to compile the user's raw intent into a structured, enriched specification that becomes the foundation for the entire agent build.

**Input**: Natural language description of the desired agent (e.g., "Build me a code review agent that checks for security vulnerabilities, performance issues, and style violations in Python and TypeScript codebases.")

**Process:**

1. **Intent Extraction**: PAL extracts the core intent — what should this agent DO?
   - Primary intent: `ANALYZE` (code review)
   - Domains: `python`, `typescript`, `security`, `performance`, `style`
   - Constraints: Must produce actionable reports, not just flag issues

2. **Context Injection**: PAL enriches with context
   - User's existing tools and workflows
   - Team conventions and standards
   - Similar existing agents for reference

3. **Semantic Enhancement**: PAL disambiguates and specifies
   - "Security vulnerabilities" → OWASP Top 10, CWE, SANS 25
   - "Performance issues" → Complexity analysis, memory patterns, I/O bottlenecks
   - "Style violations" → PEP 8, ESLint rules, Prettier config

4. **Output**: A comprehensive `AgentSpec` object

```json
{
  "agent_id": "code-reviewer-security-v1",
  "agent_name": "Code Security Reviewer",
  "primary_jtbd": "Review code for security vulnerabilities, performance issues, and style violations",
  "domains": ["python", "typescript", "security", "performance", "code_quality"],
  "phase_fit": ["DEVELOPMENT", "DEBUGGING"],
  "persona": "thorough, constructive, security-focused",
  "constraints": {
    "must_produce_actionable_reports": true,
    "max_false_positive_rate": 0.10,
    "respect_gitignore": true,
    "support_suppression_comments": true
  },
  "success_criteria": {
    "detects_owasp_top_10": true,
    "detects_n_plus_1_queries": true,
    "enforces_pep8_and_eslint": true,
    "report_readable_by_junior_devs": true
  }
}
```

### Phase 2: JTBD System Instructions

This phase transforms the AgentSpec into Jobs-To-Be-Done (JTBD) based system instructions — the "constitution" that governs agent behavior. Unlike traditional system prompts that are monolithic and fragile, JTBD instructions are structured as discrete, testable jobs.

**JTBD Instruction Structure:**

```yaml
agent:
  id: code-reviewer-security-v1
  name: Code Security Reviewer
  version: 1.0.0
  
identity:
  role: "Senior Security-Focused Code Reviewer"
  expertise: 
    - "Application security (OWASP Top 10, CWE Top 25)"
    - "Python and TypeScript secure coding practices"
    - "Performance optimization and anti-pattern detection"
    - "Code style enforcement (PEP 8, ESLint, Prettier)"
  tone: "Professional, constructive, educational"
  constraints:
    - "Never suggest changes without explaining the WHY"
    - "Always provide fix examples for every finding"
    - "Respect inline suppression comments (# nosec, // eslint-disable)"
    - "Differentiate between CRITICAL, HIGH, MEDIUM, LOW severity"

jobs:
  - id: JOB-SEC-001
    name: "Detect injection vulnerabilities"
    description: "Identify SQL injection, command injection, XSS, and path traversal vulnerabilities"
    trigger: "Code contains user input that reaches a sink (query, exec, eval, file operations)"
    procedure:
      - "Trace data flow from input sources to dangerous sinks"
      - "Check for parameterization, escaping, or sanitization"
      - "Flag unsanitized input reaching sinks as CRITICAL"
      - "Provide fix using parameterized queries or proper escaping"
    output: "Security finding with severity, location, CWE reference, and fix example"
    test_case: "Detect unsanitized f-string in SQL query: f'SELECT * FROM users WHERE id={user_input}'"
    
  - id: JOB-SEC-002
    name: "Detect authentication and authorization flaws"
    description: "Find missing auth checks, weak password handling, improper session management"
    trigger: "Code containing authentication logic, session management, or authorization checks"
    procedure:
      - "Verify all protected routes have auth middleware"
      - "Check for hardcoded credentials or secrets"
      - "Validate password hashing (bcrypt, argon2, NOT md5/sha1)"
      - "Check for proper JWT validation and expiration"
      - "Look for missing role/permission checks"
    output: "Auth finding with severity, vulnerable code, and secure implementation example"
    
  - id: JOB-PERF-001
    name: "Detect N+1 query patterns"
    description: "Find ORM or database code that triggers N+1 query problems"
    trigger: "Loop containing database queries or ORM access"
    procedure:
      - "Identify loops that make individual database calls"
      - "Suggest eager loading, batch queries, or data loader patterns"
      - "Flag as HIGH if data volume is potentially large"
    output: "Performance finding with query count estimate and optimization suggestion"
    
  - id: JOB-PERF-002
    name: "Detect memory and compute inefficiencies"
    description: "Find code patterns that waste memory or CPU"
    trigger: "Large list comprehensions, repeated computation, unnecessary copies"
    procedure:
      - "Flag list comprehensions that create large intermediate lists"
      - "Suggest generators (yield) for streaming data"
      - "Identify repeated computation in loops (hoist invariants)"
      - "Detect unnecessary deep copies or data duplication"
    output: "Performance finding with before/after code and complexity improvement"
    
  - id: JOB-STYLE-001
    name: "Enforce Python style (PEP 8)"
    description: "Check Python code against PEP 8 style guide"
    trigger: "Any Python file in the review scope"
    procedure:
      - "Check line length (79 chars, 72 for docstrings)"
      - "Verify import ordering (stdlib → third-party → local)"
      - "Check naming conventions (snake_case for functions/vars, PascalCase for classes)"
      - "Verify whitespace around operators and after commas"
    output: "Style violation with location, rule reference, and auto-fix suggestion"
    
  - id: JOB-STYLE-002
    name: "Enforce TypeScript style (ESLint)"
    description: "Check TypeScript code against standard ESLint rules"
    trigger: "Any TypeScript/TSX file in the review scope"
    procedure:
      - "Check for explicit return types on exported functions"
      - "Verify no `any` type usage without justification"
      - "Check import ordering and unused imports"
      - "Verify consistent code formatting"
    output: "Style violation with ESLint rule reference and fix"

operating_principles:
  - "NEVER approve code with CRITICAL security findings"
  - "ALWAYS explain the risk, not just the fix"
  - "Provide CWE/OWASP references for security findings"
  - "Suggest performance improvements with complexity analysis"
  - "Style violations are suggestions, not blockers (unless in style guide)"
  - "When uncertain, flag as NEEDS HUMAN REVIEW rather than guessing"

fallback_behaviors:
  - "If file is too large for single review, process in chunks and merge findings"
  - "If language is not Python or TypeScript, note limitation and skip review"
  - "If code appears auto-generated, note and review with lower strictness"
```

**JTBD Principles:**

1. **Atomicity**: Each job does ONE thing well
2. **Testability**: Every job has a test case to verify correct behavior
3. **Triggerability**: Clear conditions for when each job activates
4. **Measurability**: Output format is consistent and machine-parseable
5. **Composability**: Jobs can be enabled/disabled independently

### Phase 3: NPAO Orchestration Design

This phase designs how the agent will participate in NPAO-orchestrated workflows alongside other agents.

**Orchestration Integration:**

```yaml
orchestration:
  phase_assignments:
    - phase: DEVELOPMENT
      role: "Post-implementation reviewer"
      trigger: "After implementation agent completes a module"
      pattern: "pipeline-sequential (after implementation step)"
      
    - phase: DEBUGGING
      role: "Security root-cause analyst"
      trigger: "When bug involves potential security implications"
      pattern: "broadcast-gather (alongside diagnostic agents)"
      
  inter_agent_protocols:
    - partner_agent: "implementation-agent"
      interaction: "Receives completed code, returns review findings"
      handoff_format: "Structured review report with file paths and line numbers"
      
    - partner_agent: "test-generator"
      interaction: "Provides security test cases for findings"
      handoff_format: "List of security scenarios requiring test coverage"
      
  priority_contribution:
    # How this agent influences NPAO priority scoring
    urgency_multiplier_when: 
      condition: "CRITICAL security finding detected"
      multiplier: 2.0  # Double the priority of the fix task
    
    risk_adjustment:
      condition: "Reviewed code handles sensitive data"
      risk_increase: 0.3  # Increase risk score by 0.3
      
  resource_requirements:
    max_concurrent_reviews: 3
    avg_review_duration_ms: 15000
    context_window_required: 64000
    tools_required:
      - "read_file"
      - "search_code"
      - "run_tests"
      - "git_diff"
```

### Phase 4: State & Context Engineering

This phase designs the agent's state management and context engineering strategy using the ROSTR Hub.

**State Design:**

```yaml
state_management:
  hub_integration:
    # Level 1: Ephemeral (in-memory)
    transient_state:
      - "current_review_batch"        # Files currently being reviewed
      - "review_progress_map"         # {file_path: percentage_complete}
      - "finding_accumulator"         # Accumulated findings before report generation
      
    # Level 2: Session-persistent
    session_state:
      - "session://reviews/{session_id}/completed_files"
      - "session://reviews/{session_id}/finding_count"
      - "session://reviews/{session_id}/severity_distribution"
      
    # Level 3: Profile-persistent  
    profile_state:
      - "profile://agents/code-reviewer/config"       # Agent configuration
      - "profile://agents/code-reviewer/ignore_rules" # Custom ignore rules
      - "profile://agents/code-reviewer/performance"  # Historical performance
      - "profile://learning/code_review_patterns"     # Learned review patterns

context_engineering:
  context_window_budget:
    total_tokens: 128000
    allocation:
      system_instructions: 8000     # JTBD instructions
      conversation_history: 16000   # Recent messages
      code_under_review: 64000     # The code being reviewed
      review_state: 8000           # Current review progress
      knowledge_context: 16000     # RAG-retrieved best practices
      output_buffer: 16000         # Space for generating review output
      
  context_optimization:
    # Strategies to stay within budget
    truncation_strategy: "priority_based"
    priority_rules:
      - "Keep all CRITICAL findings context"
      - "Keep current file fully in context"
      - "Summarize previously reviewed files to key findings only"
      - "Drop conversation turns older than review scope"
      
  context_recovery:
    # When context is lost
    state_checkpoint_frequency: "every_5_files"
    checkpoint_data:
      - "review_progress_map"
      - "finding_accumulator"
      - "current_file_and_line"
```

### Phase 5: RAG DAL Knowledge Configuration

This phase configures RAG DAL for the agent's knowledge needs — what knowledge sources to use, how to retrieve, and how to apply.

**Knowledge Configuration:**

```yaml
knowledge_config:
  default_sources:
    tier1:
      - name: "OWASP Top 10"
        url: "https://owasp.org/www-project-top-ten/"
        freshness_horizon_days: 365
        domains: ["security", "web"]
        
      - name: "CWE Top 25"
        url: "https://cwe.mitre.org/top25/"
        freshness_horizon_days: 365
        domains: ["security"]
        
      - name: "Python Security Best Practices"
        url: "https://docs.python.org/3/library/security.html"
        freshness_horizon_days: 730
        domains: ["python", "security"]
        
      - name: "TypeScript ESLint Rules"
        url: "https://typescript-eslint.io/rules/"
        freshness_horizon_days: 180
        domains: ["typescript", "style"]
        
    tier2:
      - name: "Real Python Security Tutorials"
        url: "https://realpython.com/tutorials/security/"
        freshness_horizon_days: 365
        domains: ["python", "security"]
        
      - name: "OWASP Cheat Sheet Series"
        url: "https://cheatsheetseries.owasp.org/"
        freshness_horizon_days: 365
        domains: ["security"]
        
    tier3:
      - name: "Stack Overflow [python] [security]"
        url: "https://stackoverflow.com/questions/tagged/python+security"
        freshness_horizon_days: 90
        domains: ["python", "security"]
        needs_verification: true
        
  retrieval_triggers:
    - trigger: "Encountering unfamiliar vulnerability pattern"
      action: "retrieve_from_tier1('vulnerability', pattern_name)"
      
    - trigger: "Code uses framework with known security caveats"
      action: "retrieve_from_all_tiers(framework_name + ' security best practices')"
      
    - trigger: "Style violation close to a known exception"
      action: "retrieve_from_tier2(style_rule + ' exceptions and rationale')"
      
  confidence_thresholds:
    knowledge_min_confidence: 0.7
    security_finding_min_confidence: 0.85  # Higher bar for security
    style_violation_min_confidence: 0.6
    performance_issue_min_confidence: 0.7
    
  knowledge_application:
    # How knowledge is used in review
    cite_sources: true  # Always cite OWASP/CWE references
    explain_rationale: true  # Explain WHY a pattern is dangerous
    provide_fix_with_knowledge: true  # Use best practices in fix examples
```

### Phase 6: Multi-Platform Export

This phase exports the built agent to the target platform(s). The export system handles platform-specific formatting, limitations, and optimizations.

#### Platform: Claude (Anthropic)

```python
class ClaudeExporter:
    """
    Export agent as a Claude-compatible system prompt.
    """
    def export(self, agent: BuiltAgent) -> ClaudeExport:
        system_prompt = self._build_system_prompt(agent)
        tools = self._build_tool_definitions(agent)
        context_config = self._build_context_config(agent)
        
        return ClaudeExport(
            system_prompt=system_prompt,
            tools=tools,
            model="claude-sonnet-4-20250514",  # Recommended model
            max_tokens=agent.context_engineering.context_window_budget.output_buffer,
            temperature=0.3,  # Lower temperature for review tasks
            metadata={
                "agent_id": agent.id,
                "agent_version": agent.version,
                "built_by": "ROSTR Agent Builder v1.0.0",
                "built_at": datetime.utcnow().isoformat()
            }
        )
    
    def _build_system_prompt(self, agent: BuiltAgent) -> str:
        sections = []
        
        # Identity
        sections.append(f"You are {agent.identity.role}.")
        sections.append(f"Expertise: {', '.join(agent.identity.expertise)}")
        sections.append(f"Tone: {agent.identity.tone}")
        
        # JTBD Instructions
        sections.append("\n## Your Jobs\n")
        for job in agent.jobs:
            sections.append(f"### {job.id}: {job.name}")
            sections.append(f"**When**: {job.trigger}")
            sections.append(f"**What to do**:")
            for step in job.procedure:
                sections.append(f"- {step}")
            sections.append(f"**Output**: {job.output}\n")
        
        # Constraints
        sections.append("\n## Constraints\n")
        for constraint in agent.identity.constraints:
            sections.append(f"- {constraint}")
        
        # Operating Principles
        sections.append("\n## Operating Principles\n")
        for principle in agent.operating_principles:
            sections.append(f"- {principle}")
        
        # Fallback
        sections.append("\n## Fallback Behaviors\n")
        for fallback in agent.fallback_behaviors:
            sections.append(f"- {fallback}")
        
        return "\n".join(sections)
```

**Claude-Specific Optimizations:**
- Use Claude's extended thinking for complex security analysis
- Leverage tool-use for file reading and code search
- Use structured output (JSON) for review findings
- Split large reviews across multiple Claude messages within token limits

#### Platform: Codex (OpenAI)

```python
class CodexExporter:
    """
    Export agent as a Codex-compatible assistant configuration.
    """
    def export(self, agent: BuiltAgent) -> CodexExport:
        return CodexExport(
            instructions=self._build_instructions(agent),
            tools=self._build_tools(agent),
            model="codex-2025-06-01",
            reasoning_effort="high",  # For security analysis
            metadata={
                "agent_id": agent.id,
                "version": agent.version,
                "builder": "ROSTR"
            }
        )
    
    def _build_instructions(self, agent: BuiltAgent) -> str:
        """
        Codex uses a different instruction format — more concise,
        action-oriented, and code-first.
        """
        sections = []
        sections.append(f"# Role: {agent.identity.role}")
        sections.append(f"\nExpert in: {', '.join(agent.identity.expertise)}")
        
        sections.append("\n# Review Process")
        for job in agent.jobs:
            # Codex prefers shorter, more direct job descriptions
            sections.append(f"\n## {job.name}")
            sections.append(f"Check: {job.trigger}")
            sections.append("Steps:")
            for i, step in enumerate(job.procedure, 1):
                sections.append(f"{i}. {step}")
        
        sections.append("\n# Output Format")
        sections.append("```json")
        sections.append(json.dumps({
            "findings": [{
                "severity": "CRITICAL|HIGH|MEDIUM|LOW",
                "type": "security|performance|style",
                "file": "path/to/file",
                "line": 42,
                "cwe": "CWE-89",
                "description": "What's wrong",
                "risk": "Why it matters",
                "fix": "How to fix it",
                "reference": "Link to best practice"
            }]
        }, indent=2))
        sections.append("```")
        
        return "\n".join(sections)
```

**Codex-Specific Optimizations:**
- Use Codex's reasoning capability for multi-step vulnerability analysis
- Leverage structured JSON output for machine-parseable findings
- Optimize for Codex's code-first interaction style
- Use tool calling for repository exploration

#### Platform: OpenClaw

```python
class OpenClawExporter:
    """
    Export agent for the OpenClaw platform.
    OpenClaw supports custom agent definitions with skills and tools.
    """
    def export(self, agent: BuiltAgent) -> OpenClawExport:
        return OpenClawExport(
            agent_config={
                "name": agent.id,
                "display_name": agent.agent_name,
                "version": agent.version,
                "description": agent.primary_jtbd,
                "system_prompt": self._build_openclaw_system_prompt(agent),
                "skills": self._build_openclaw_skills(agent),
                "tools": self._build_openclaw_tools(agent),
                "context_config": {
                    "max_tokens": agent.context_engineering.context_window_budget.total_tokens,
                    "temperature": 0.3
                }
            },
            deployment_manifest={
                "platform": "openclaw",
                "min_version": "1.0.0",
                "required_skills": [
                    "code-review",
                    "security-analysis",
                    "file-operations"
                ]
            }
        )
    
    def _build_openclaw_skills(self, agent: BuiltAgent) -> list:
        """
        Convert JTBD jobs to OpenClaw skill definitions.
        """
        skills = []
        for job in agent.jobs:
            skill = {
                "name": job.id.lower().replace("-", "_"),
                "description": job.description,
                "trigger_keywords": self._extract_keywords(job.trigger),
                "procedure": job.procedure,
                "output_schema": {
                    "type": "object",
                    "properties": {
                        "severity": {"type": "string", "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW"]},
                        "type": {"type": "string", "enum": ["security", "performance", "style"]},
                        "file": {"type": "string"},
                        "line": {"type": "integer"},
                        "description": {"type": "string"},
                        "fix": {"type": "string"}
                    }
                }
            }
            skills.append(skill)
        return skills
```

**OpenClaw-Specific Optimizations:**
- Convert JTBD jobs to OpenClaw skill definitions
- Leverage OpenClaw's skill orchestration
- Use OpenClaw's native tool definitions
- Optimize context window for OpenClaw's architecture

#### Platform: Hermes (Nous Research)

```python
class HermesExporter:
    """
    Export agent as a Hermes Agent skill.
    Hermes uses SKILL.md files with YAML frontmatter.
    """
    def export(self, agent: BuiltAgent) -> HermesExport:
        skill_md = self._build_skill_md(agent)
        
        return HermesExport(
            skill_file="SKILL.md",
            skill_content=skill_md,
            install_path=f"~/.hermes/profiles/default/skills/{agent.id}/",
            metadata={
                "agent_id": agent.id,
                "version": agent.version,
                "platform": "hermes"
            }
        )
    
    def _build_skill_md(self, agent: BuiltAgent) -> str:
        frontmatter = {
            "name": agent.id,
            "description": agent.primary_jtbd,
            "version": agent.version,
            "author": "ROSTR Agent Builder",
            "tags": agent.domains + ["rostr-built"],
            "trigger_conditions": [
                f"user requests {domain} review" for domain in agent.domains[:3]
            ]
        }
        
        sections = []
        sections.append("---")
        sections.append(yaml.dump(frontmatter, default_flow_style=False).strip())
        sections.append("---")
        sections.append("")
        sections.append(f"# {agent.agent_name}")
        sections.append("")
        sections.append(f"Built by ROSTR Agent Builder v1.0.0")
        sections.append("")
        sections.append(agent.primary_jtbd)
        sections.append("")
        sections.append("## Identity")
        sections.append(f"- **Role**: {agent.identity.role}")
        sections.append(f"- **Expertise**: {', '.join(agent.identity.expertise)}")
        sections.append(f"- **Tone**: {agent.identity.tone}")
        sections.append("")
        sections.append("## Jobs")
        for job in agent.jobs:
            sections.append(f"### {job.name}")
            sections.append(f"**Trigger**: {job.trigger}")
            sections.append("**Procedure**:")
            for step in job.procedure:
                sections.append(f"- {step}")
            sections.append("")
        
        sections.append("## Constraints")
        for constraint in agent.identity.constraints:
            sections.append(f"- {constraint}")
        sections.append("")
        
        sections.append("## Operating Principles")
        for principle in agent.operating_principles:
            sections.append(f"- {principle}")
        
        return "\n".join(sections)
```

**Hermes-Specific Optimizations:**
- Generate proper SKILL.md with YAML frontmatter
- Register skill in Hermes profile's skills directory
- Use Hermes-compatible trigger conditions
- Include setup instructions for Hermes agent

#### Platform: Standalone Export

```python
class StandaloneExporter:
    """
    Export agent as a fully standalone, self-contained package.
    Includes all dependencies and configuration for running independently.
    """
    def export(self, agent: BuiltAgent) -> StandaloneExport:
        return StandaloneExport(
            files={
                "agent_config.yaml": self._build_standalone_config(agent),
                "system_prompt.txt": self._build_standalone_prompt(agent),
                "tools.json": self._build_standalone_tools(agent),
                "knowledge_base/": self._export_knowledge_base(agent),
                "requirements.txt": self._build_requirements(agent),
                "Dockerfile": self._build_dockerfile(agent),
                "README.md": self._build_readme(agent),
                "run.py": self._build_runner(agent),
                "test_agent.py": self._build_tests(agent)
            },
            package_format="directory",  # or "docker", "pip"
        )
    
    def _build_runner(self, agent: BuiltAgent) -> str:
        return '''#!/usr/bin/env python3
"""
Standalone runner for {agent_name}.
Generated by ROSTR Agent Builder.
"""
import asyncio
import yaml
from pathlib import Path
from rostr_core import ROSTRHub, RAGDAL
from rostr_core.agent import StandaloneAgent

async def main():
    # Load agent configuration
    config_path = Path(__file__).parent / "agent_config.yaml"
    with open(config_path) as f:
        config = yaml.safe_load(f)
    
    # Initialize ROSTR components
    hub = ROSTRHub(profile_path=Path.home() / ".rostr" / "standalone")
    rag = RAGDAL(config=config.get("knowledge_config"))
    
    # Create agent
    agent = StandaloneAgent(
        config=config,
        hub=hub,
        knowledge_retriever=rag
    )
    
    # Run agent
    print(f"Starting {config['agent']['name']} v{config['agent']['version']}...")
    print("Built by ROSTR Agent Builder")
    print("Enter 'quit' to exit, 'help' for commands")
    
    while True:
        try:
            user_input = input("\\n> ")
            if user_input.lower() in ("quit", "exit", "q"):
                break
            if user_input.lower() == "help":
                print("Available commands:")
                print("  review <path>  - Review a file or directory")
                print("  status         - Show agent status")
                print("  config         - Show current configuration")
                continue
            
            result = await agent.process(user_input)
            print(result)
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
'''.format(agent_name=agent.agent_name)
```

**Standalone Export Includes:**
- Full agent configuration
- System prompt (platform-agnostic)
- Tool definitions (platform-agnostic)
- Knowledge base (if included)
- Dockerfile for containerized deployment
- Comprehensive README with setup instructions
- Runner script (Python)
- Test suite for agent validation
- pip requirements.txt

### Phase 7: Setup & Deployment

The final phase handles deployment to the target platform(s) with validation, monitoring, and rollback support.

**Deployment Pipeline:**

```yaml
deployment:
  stages:
    - name: "pre_deployment_validation"
      steps:
        - "Validate agent configuration integrity"
        - "Run agent test suite against known code samples"
        - "Verify knowledge base connectivity"
        - "Check platform compatibility"
        - "Dry-run export without deploying"
        
    - name: "deployment"
      steps:
        - "Export to target platform format"
        - "Upload/install on target platform"
        - "Verify agent is discoverable/runnable"
        - "Run smoke test (simple review task)"
        
    - name: "post_deployment"
      steps:
        - "Register agent with ROSTR Hub agent registry"
        - "Configure monitoring and alerting"
        - "Set up usage analytics"
        - "Create rollback snapshot"
        - "Notify team of deployment"
        
  monitoring:
    metrics:
      - "review_count"          # Number of reviews performed
      - "finding_accuracy"      # User feedback on finding correctness
      - "false_positive_rate"   # Incorrectly flagged issues
      - "review_duration_ms"    # Time per review
      - "user_satisfaction"     # Explicit user ratings
      
    alerts:
      - condition: "false_positive_rate > 0.20"
        severity: "warning"
        action: "Review agent configuration, adjust detection thresholds"
        
      - condition: "review_duration_ms > 30000"
        severity: "warning"
        action: "Check for performance regression, consider optimization"
        
      - condition: "agent_unresponsive_for > 300"
        severity: "critical"
        action: "Restart agent, investigate root cause"
        
  rollback:
    keep_last_n_versions: 3
    rollback_procedure:
      - "Deactivate current agent version"
      - "Activate previous version from snapshot"
      - "Verify previous version is functional"
      - "Log rollback reason and notify team"
```

## Complete Build Example

```python
from rostr_core.builder import AgentBuilder

# Initialize the builder
builder = AgentBuilder()

# Define the agent intent
intent = """
Build me a code review agent that:
- Reviews Python and TypeScript code
- Checks for OWASP Top 10 security vulnerabilities
- Identifies performance anti-patterns (N+1 queries, memory leaks)
- Enforces PEP 8 and ESLint style rules
- Produces structured findings with severity, CWE references, and fix examples
- Works within Git workflows (respects .gitignore, supports PR reviews)
- Can be used in CI/CD pipelines
"""

# Execute the full 7-phase build pipeline
agent = builder.build(intent)

# Export to multiple platforms
exports = builder.export(agent, platforms=[
    "claude",
    "codex", 
    "openclaw",
    "hermes",
    "standalone"
])

# Deploy to selected platforms
deployments = builder.deploy(
    exports,
    platforms=["hermes", "standalone"],  # Deploy to these two
    auto_validate=True,
    notify_on_completion=True
)

# Results
print(f"Agent built: {agent.agent_name} v{agent.version}")
print(f"JTBD jobs defined: {len(agent.jobs)}")
for platform, deploy in deployments.items():
    print(f"Deployed to {platform}: {deploy.status} ({deploy.url or deploy.path})")
```

## Platform Comparison Matrix

| Feature | Claude | Codex | OpenClaw | Hermes | Standalone |
|---------|--------|-------|----------|--------|------------|
| **System Instructions** | Long-form, structured | Concise, code-first | Skill-based | SKILL.md | Platform-agnostic |
| **Tool Support** | Native tool-use | Function calling | Custom tools | Hermes tools | Configurable |
| **Context Window** | 200K tokens | 128K tokens | Variable | Variable | Configurable |
| **Orchestration** | Via prompt chaining | Via function chaining | Native orchestration | Skill chaining | Self-contained |
| **Knowledge Retrieval** | External API needed | External API needed | Plugin system | Skill integration | Built-in RAG DAL |
| **State Management** | Conversation only | Conversation only | Session state | Hub integration | Full ROSTR Hub |
| **Deployment** | API endpoint | API endpoint | Docker/service | Skills directory | Docker/Python pkg |
| **Best For** | Complex reasoning | Code generation | Agent systems | ROSTR ecosystem | Self-contained ops |

## Using the Agent Builder

### CLI Usage

```bash
# Build an agent from an intent file
rostr build --intent intent.yaml --output ./my-agent/

# Build and export to specific platforms
rostr build --intent "Build a security review agent" --platforms claude,hermes,standalone

# Deploy an already-built agent
rostr deploy --agent ./my-agent/ --platform hermes --profile default

# List deployed agents
rostr agents list

# Validate an agent without deploying
rostr validate --agent ./my-agent/
```

### Programmatic Usage

```python
from rostr_core.builder import AgentBuilder, ExportPlatform

builder = AgentBuilder()

# Quick build — uses defaults
agent = builder.quick_build("Build a Python test generator agent")

# Full control — customize every phase
agent = builder.build(
    intent="Build an API documentation generator",
    phase_overrides={
        "jtbd": {"include_test_cases": True},
        "orchestration": {"phase": "DEVELOPMENT"},
        "knowledge": {"domains": ["rest_api", "openapi", "swagger"]},
        "export": {"platforms": [ExportPlatform.CLAUDE, ExportPlatform.STANDALONE]}
    }
)
```

## Quality Checklist

- [ ] Phase 1 produces a complete AgentSpec with all required fields
- [ ] Phase 2 defines at least 5 JTBD jobs with triggers and procedures
- [ ] Phase 3 specifies orchestration roles and inter-agent protocols
- [ ] Phase 4 allocates context budget with explicit priorities
- [ ] Phase 5 configures at least 3 Tier 1 knowledge sources
- [ ] Phase 6 successfully exports to all requested platforms
- [ ] Phase 7 deploys with validation and monitoring
- [ ] Agent passes smoke test on each deployed platform
- [ ] JTBD instructions are platform-appropriately formatted
- [ ] Fallback behaviors are defined for all failure modes
- [ ] Rollback procedure is tested and functional
- [ ] All platform exports are validated for compatibility

## Error Handling

| Error | Phase | Resolution |
|-------|-------|------------|
| `IntentTooVague` | Phase 1 | Prompt user for clarification, re-run PAL with specific questions |
| `JTBDCoverageGap` | Phase 2 | Identify uncovered use cases, generate additional jobs |
| `OrchestrationConflict` | Phase 3 | Detect role conflicts, adjust phase assignments |
| `ContextBudgetExceeded` | Phase 4 | Apply more aggressive truncation, increase budget warning |
| `KnowledgeSourceUnavailable` | Phase 5 | Fall back to cached KB, flag for manual review |
| `PlatformExportFailed` | Phase 6 | Retry with platform-specific adjustments, offer alternative platform |
| `DeploymentValidationFailed` | Phase 7 | Roll back, report validation failures, suggest fixes |
| `SmokeTestFailed` | Phase 7 | Roll back deployment, analyze failure, adjust agent configuration |

## References

- ROSTR Research Paper: arXiv:2604.XXXXX, Patrick Diamitani, April 2026
- rostr-core Python package: `pip install rostr-core`
- PAL Compiler: `pal-compiler` skill (Phase 1: Intent Compilation)
- RAG DAL Knowledge: `ragdal-knowledge` skill (Phase 5: Knowledge Configuration)
- NPAO Orchestrator: `npao-orchestrator` skill (Phase 3: Orchestration Design)
- ROSTR Hub: `rostr-hub` skill (Phase 4: State & Context Engineering, Phase 7: Deployment)
- Agent Builder Specification: Section 3.5 of ROSTR paper
- Claude API Documentation: https://docs.anthropic.com/
- OpenAI Codex Documentation: https://platform.openai.com/docs/guides/codex
- Hermes Agent Documentation: https://hermes-agent.nousresearch.com/docs
