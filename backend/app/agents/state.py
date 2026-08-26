from typing import TypedDict, Optional, List, Dict, Any
from ..models.resume import ResumeData
from ..models.analysis import (
    JobDescriptionInput, JobRequirementsDecomposed,
    MatchDimensionScores, SkillGapAnalysis, ATSReport,
    RewriteSuggestion
)


class AgentState(TypedDict, total=False):
    """LangGraph agent state object flowing across pipeline nodes."""
    session_id: str
    raw_text: str
    resume_data: Optional[ResumeData]
    job_description: Optional[JobDescriptionInput]
    job_breakdown: Optional[JobRequirementsDecomposed]
    match_scores: Optional[MatchDimensionScores]
    skill_gaps: Optional[SkillGapAnalysis]
    ats_report: Optional[ATSReport]
    rewrite_suggestions: List[RewriteSuggestion]
    executive_summary: str
    strengths: List[str]
    weaknesses: List[str]
    interview_prep_questions: List[str]
    execution_logs: List[Dict[str, Any]]
    error: Optional[str]
