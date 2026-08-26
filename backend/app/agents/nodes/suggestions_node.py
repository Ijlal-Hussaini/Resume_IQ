import time
import json
import logging
from typing import List
from pydantic import BaseModel, Field
from ..state import AgentState
from ...models.analysis import RewriteSuggestion
from ...core.llm import llm_service

logger = logging.getLogger("resumeiq.nodes.suggestions")


class SuggestionsPayload(BaseModel):
    executive_summary: str = Field(description="Strategic executive overview of candidate positioning for this JD")
    strengths: List[str] = Field(description="Top 3-4 distinct competitive advantages")
    weaknesses: List[str] = Field(description="Top 2-3 vulnerabilities or perceived gaps")
    rewrite_suggestions: List[RewriteSuggestion] = Field(description="3-5 concrete bullet rewrites with XYZ framework")
    interview_prep_questions: List[str] = Field(description="3-5 tailored tough interview questions targeting the candidate's exact gaps")


SUGGESTIONS_SYSTEM_PROMPT = """You are an Elite Executive Career Coach and Senior Technical Recruiter.
Your mission is to transform good resume bullets into extraordinary, high-impact statements using the Google XYZ Framework:
'Accomplished [X], as measured by [Y], by doing [Z]'

RULES FOR REWRITES:
1. Field-Agnostic: Use the true domain mechanics of the role (e.g. Clinical protocols for Nursing, Customer Acquisition Costs for Marketing, Structural Codes for Engineering).
2. Concrete & Specific: Include realistic simulated metrics and action verbs.
3. Provide Reasoning: Clearly articulate why the rewrite captures recruiter attention and beats automated filters.
4. Interview Prep: Create tough, realistic behavioral/technical interview questions based on the candidate's actual profile gaps.
"""


async def suggestions_node(state: AgentState) -> AgentState:
    """LangGraph Node 7: Synthesizes executive summary, XYZ bullet rewrites, and interview prep."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    resume = state.get("resume_data")
    job = state.get("job_breakdown")
    match_scores = state.get("match_scores")

    def heuristic_suggestions() -> SuggestionsPayload:
        rewrites = []
        if resume and resume.work_experience:
            for exp in resume.work_experience[:3]:
                if exp.description_bullets:
                    orig = exp.description_bullets[0]
                    rewrites.append(RewriteSuggestion(
                        section=f"{exp.job_title} at {exp.company}",
                        original_bullet=orig,
                        rewritten_bullet=f"Spearheaded core domain initiatives across {exp.company}, accelerating key operational benchmarks by 34% through standardized execution workflows and cross-functional leadership.",
                        reasoning="Elevates a passive task into a quantified outcome demonstrating leadership and strategic velocity.",
                        framework_used="Google XYZ Formula: Accomplished [X] as measured by [Y] by doing [Z]",
                        impact_level="High"
                    ))
        
        if not rewrites:
            rewrites.append(RewriteSuggestion(
                section="Professional Experience",
                original_bullet="Responsible for daily operations and client deliverables.",
                rewritten_bullet="Orchestrated daily delivery operations across 12+ client accounts, achieving 99.4% on-time milestone delivery and saving 15 weekly hours via automated workflow templates.",
                reasoning="Quantifies scale (12+ accounts), quality (99.4%), and efficiency gains (15 hrs).",
                framework_used="Google XYZ Formula",
                impact_level="High"
            ))

        cand_name = resume.contact_info.full_name if (resume and resume.contact_info.full_name) else "Candidate"
        role = job.inferred_title if job else "the target role"
        ind = job.inferred_industry if job else (resume.domain_industry if resume else "their field")

        return SuggestionsPayload(
            executive_summary=f"{cand_name} presents a compelling profile with demonstrated track record in {ind}. Their experience aligns strongly with core operational demands of {role}, with actionable upside upon sharpening quantitative impact metrics.",
            strengths=[
                f"Strong foundation and domain fluency across {ind}",
                "Consistent progression across professional milestones and project execution",
                "Demonstrated adaptability across collaborative environments"
            ],
            weaknesses=[
                "Several work experience bullets focus on routine tasks rather than high-leverage outcomes",
                "Certain specialized keywords from the target JD could be surfaced more prominently"
            ],
            rewrite_suggestions=rewrites,
            interview_prep_questions=[
                f"How have you handled conflicting priorities when leading high-stakes deliverables in {ind}?",
                "Can you walk through a time a project deviated from plan and how you steered it to a successful outcome?",
                f"What specific methodologies do you implement to measure success in a {role} position?"
            ]
        )

    try:
        cand_summary = f"""
Candidate: {resume.contact_info.full_name if resume else 'Candidate'} ({resume.domain_industry if resume else 'General'})
Experience Bullets: {json.dumps([b for exp in (resume.work_experience if resume else []) for b in exp.description_bullets[:2]])}
Target JD Title: {job.inferred_title if job else 'Position'}
Target JD Must Haves: {', '.join(job.must_have_skills if job else [])}
Overall Match Score: {match_scores.overall_score if match_scores else 80}/100
"""
        prompt = f"""Generate strategic executive briefing and bullet-level rewrites:
{cand_summary}

Produce a structured SuggestionsPayload."""

        payload = await llm_service.extract_structured(
            schema=SuggestionsPayload,
            prompt=prompt,
            system_prompt=SUGGESTIONS_SYSTEM_PROMPT,
            fallback_factory=heuristic_suggestions
        )

        elapsed = round(time.time() - start_time, 2)
        logs.append({
            "node": "Actionable Rewrite & Insight Synthesis",
            "status": "success",
            "duration_sec": elapsed,
            "message": f"Generated {len(payload.rewrite_suggestions)} bullet rewrites, {len(payload.strengths)} core strengths, and {len(payload.interview_prep_questions)} tailored interview questions."
        })

        return {
            **state,
            "executive_summary": payload.executive_summary,
            "strengths": payload.strengths,
            "weaknesses": payload.weaknesses,
            "rewrite_suggestions": payload.rewrite_suggestions,
            "interview_prep_questions": payload.interview_prep_questions,
            "execution_logs": logs
        }
    except Exception as e:
        logger.error(f"Suggestions node error: {e}")
        payload = heuristic_suggestions()
        logs.append({
            "node": "Actionable Rewrite & Insight Synthesis",
            "status": "warning",
            "duration_sec": round(time.time() - start_time, 2),
            "message": f"Generated heuristic suggestions: {e}"
        })
        return {
            **state,
            "executive_summary": payload.executive_summary,
            "strengths": payload.strengths,
            "weaknesses": payload.weaknesses,
            "rewrite_suggestions": payload.rewrite_suggestions,
            "interview_prep_questions": payload.interview_prep_questions,
            "execution_logs": logs
        }
