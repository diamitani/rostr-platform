# rostr-core — package notes

rostr-core is the Python implementation of the ROSTR agent framework. It has
four components:

1. PAL (Prompt Abstraction Layer) — compiles natural language into a typed
   AgentManifest through five stages: intent extraction, context injection,
   semantic enhancement, runtime compilation, output routing.
2. RAG DAL — multi-pass retrieval over tiered, cited knowledge sources with
   confidence scores.
3. NPAO — the decision engine: 5D phase classification (PreD, Design,
   Development, Deployment, Debugging), 4D priority scoring, agent
   allocation, orchestration pattern selection.
4. Rostr Hub — persistent agent state across session, project, org and agent
   levels, with decision and learning logs.

Ships with pytest suite (50 tests), a phase-classifier benchmark, and
examples. Install: pip install rostr-core.
