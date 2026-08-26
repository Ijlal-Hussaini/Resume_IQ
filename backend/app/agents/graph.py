import logging
import uuid
from typing import Optional, Callable, Dict, Any
from langgraph.graph import StateGraph, START, END

from .state import AgentState
from .nodes.extraction_node import extraction_node
from .nodes.validation_node import validation_node
from .nodes.jd_analysis_node import jd_analysis_node
from .nodes.matching_node import matching_node
from .nodes.gap_analysis_node import gap_analysis_node
from .nodes.ats_critique_node import ats_critique_node
from .nodes.suggestions_node import suggestions_node

from ..models.resume import ResumeData
from ..models.analysis import JobDescriptionInput, ResumeAnalysisResult

logger = logging.getLogger("resumeiq.graph")


def build_career_intelligence_graph() -> StateGraph:
    """Constructs the LangGraph career intelligence multi-step agentic graph."""
    builder = StateGraph(AgentState)

    # 1. Register distinct graph nodes
    builder.add_node("extraction", extraction_node)
    builder.add_node("validation", validation_node)
    builder.add_node("jd_analysis", jd_analysis_node)
    builder.add_node("matching", matching_node)
    builder.add_node("gap_analysis", gap_analysis_node)
    builder.add_node("ats_critique", ats_critique_node)
    builder.add_node("suggestions", suggestions_node)

    # 2. Wire sequential edges with error short-circuit
    builder.add_edge(START, "extraction")
    builder.add_edge("extraction", "validation")

    # After validation, check if we have usable data — skip expensive nodes if not
    def should_continue(state: AgentState) -> str:
        if state.get("error") or not state.get("resume_data"):
            return "suggestions"  # Skip to heuristic suggestions
        return "jd_analysis"

    builder.add_conditional_edges("validation", should_continue, {
        "jd_analysis": "jd_analysis",
        "suggestions": "suggestions",
    })

    builder.add_edge("jd_analysis", "matching")
    builder.add_edge("matching", "gap_analysis")
    builder.add_edge("gap_analysis", "ats_critique")
    builder.add_edge("ats_critique", "suggestions")
    builder.add_edge("suggestions", END)

    return builder.compile()


# Global compiled workflow instance
career_graph = build_career_intelligence_graph()


class CareerPipelineRunner:
    """Runner to invoke the compiled LangGraph workflow with error handling and result formatting."""

    @staticmethod
    async def run(
        session_id: Optional[str] = None,
        raw_text: Optional[str] = None,
        resume_data: Optional[ResumeData] = None,
        job_description: Optional[JobDescriptionInput] = None,
    ) -> ResumeAnalysisResult:
        sid = session_id or str(uuid.uuid4())
        initial_state: AgentState = {
            "session_id": sid,
            "raw_text": raw_text or (resume_data.raw_text if resume_data else ""),
            "resume_data": resume_data,
            "job_description": job_description or JobDescriptionInput(raw_text="General Domain Position"),
            "execution_logs": []
        }

        logger.info(f"Executing LangGraph pipeline for session {sid}...")
        final_state: AgentState = await career_graph.ainvoke(initial_state)

        # Assemble ResumeAnalysisResult
        result = ResumeAnalysisResult(
            session_id=sid,
            match_scores=final_state.get("match_scores"),
            job_breakdown=final_state.get("job_breakdown"),
            skill_gaps=final_state.get("skill_gaps"),
            ats_report=final_state.get("ats_report"),
            rewrite_suggestions=final_state.get("rewrite_suggestions", []),
            executive_summary=final_state.get("executive_summary", "Evaluation complete."),
            strengths=final_state.get("strengths", []),
            weaknesses=final_state.get("weaknesses", []),
            interview_prep_questions=final_state.get("interview_prep_questions", []),
            pipeline_execution_logs=final_state.get("execution_logs", [])
        )
        return result

    @staticmethod
    def get_mermaid_diagram() -> str:
        """Returns Mermaid diagram string of the LangGraph workflow."""
        try:
            return career_graph.get_graph().draw_mermaid()
        except Exception:
            return """graph TD
    START --> extraction[Structured Extraction Node]
    extraction --> validation[Data Validation Node]
    validation --> jd_analysis[Job Description Decomposition Node]
    jd_analysis --> matching[RAG Matching & Scoring Node]
    matching --> gap_analysis[Skill Gap Analysis Node]
    gap_analysis --> ats_critique[ATS Compliance Node]
    ats_critique --> suggestions[XYZ Bullet Rewrites Node]
    suggestions --> END"""


pipeline_runner = CareerPipelineRunner()
