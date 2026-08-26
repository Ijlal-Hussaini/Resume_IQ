import time
import json
import logging
from ..state import AgentState
from ...models.analysis import MatchDimensionScores
from ...core.llm import llm_service
from ...core.vector_store import vector_store_manager

logger = logging.getLogger("resumeiq.nodes.matching")

MATCHING_SYSTEM_PROMPT = """You are a Senior Talent Evaluator and Career Intelligence Officer.
Evaluate the candidate's resume against the target job requirements across multiple dimensions.
Be rigorous, objective, and domain-agnostic.

Scoring dimensions (0-100):
- skills_match_score: Concrete overlap of hard skills, domain tools, and methodologies.
- experience_match_score: Alignment of seniority, leadership scale, and demonstrated responsibilities.
- domain_depth_score: Depth of industry-specific vocabulary, nuances, and KPIs.
- education_cert_score: Alignment of required degrees, licenses, or accreditations.
- overall_score: Weighted composite reflecting realistic hiring manager shortlist probability.
- verdict: Clear 3-6 word summary verdict.
"""


async def matching_node(state: AgentState) -> AgentState:
    """LangGraph Node 4: Performs RAG-based semantic matching and multi-dimensional scoring."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    resume = state.get("resume_data")
    job = state.get("job_breakdown")
    session_id = state.get("session_id", "default_session")

    # Retrieve relevant resume evidence for top JD requirements
    evidence_snippets = []
    if job and job.must_have_skills:
        for skill in job.must_have_skills[:4]:
            cits = vector_store_manager.retrieve_citations(session_id, skill, top_k=2)
            for c in cits:
                evidence_snippets.append(f"- Match for '{skill}': {c.exact_text}")

    evidence_text = "\n".join(evidence_snippets) if evidence_snippets else "No direct vector matches."

    def heuristic_match_scores() -> MatchDimensionScores:
        # Heuristic scoring based on overlap
        r_skills = set([s.lower() for s in (resume.all_skills_flat if resume else [])])
        j_skills = set([s.lower() for s in (job.must_have_skills if job else [])])
        
        overlap_count = sum(1 for j in j_skills if any(j in r or r in j for r in r_skills))
        ratio = (overlap_count / max(len(j_skills), 1)) if j_skills else 0.75
        
        skill_score = min(95, max(45, int(ratio * 100)))
        exp_score = 85 if (resume and len(resume.work_experience) >= 2) else 65
        domain_score = 88 if (resume and job and resume.domain_industry.lower() in job.inferred_industry.lower()) else 70
        edu_score = 90 if (resume and resume.education) else 75
        
        overall = int((skill_score * 0.4) + (exp_score * 0.3) + (domain_score * 0.2) + (edu_score * 0.1))
        
        verdict = "Strong Contender" if overall >= 85 else ("High Potential / Minor Gaps" if overall >= 70 else "Needs Targeted Positioning")
        return MatchDimensionScores(
            overall_score=overall,
            skills_match_score=skill_score,
            experience_match_score=exp_score,
            domain_depth_score=domain_score,
            education_cert_score=edu_score,
            verdict=verdict
        )

    try:
        resume_summary = f"""
Candidate: {resume.contact_info.full_name if resume else 'Candidate'} ({resume.domain_industry if resume else 'General'})
Summary: {resume.professional_summary if resume else ''}
Skills: {', '.join(resume.all_skills_flat[:25]) if resume else ''}
Experience Entries: {len(resume.work_experience) if resume else 0}
"""
        jd_summary = f"""
Target Role: {job.inferred_title if job else 'Position'} in {job.inferred_industry if job else 'General'}
Must-Have Requirements: {', '.join(job.must_have_skills) if job else ''}
Nice-to-Haves: {', '.join(job.nice_to_have_skills) if job else ''}
"""
        prompt = f"""Evaluate candidate match:
--- CANDIDATE PROFILE ---
{resume_summary}

--- TARGET JOB REQUIREMENTS ---
{jd_summary}

--- RETRIEVED RESUME EVIDENCE ---
{evidence_text}
--- END ---
"""
        scores = await llm_service.extract_structured(
            schema=MatchDimensionScores,
            prompt=prompt,
            system_prompt=MATCHING_SYSTEM_PROMPT,
            fallback_factory=heuristic_match_scores
        )

        elapsed = round(time.time() - start_time, 2)
        logs.append({
            "node": "RAG Semantic Matching",
            "status": "success",
            "duration_sec": elapsed,
            "message": f"Computed match score: {scores.overall_score}/100 ({scores.verdict}). Skills match: {scores.skills_match_score}%"
        })

        return {
            **state,
            "match_scores": scores,
            "execution_logs": logs
        }
    except Exception as e:
        logger.error(f"Matching node error: {e}")
        scores = heuristic_match_scores()
        logs.append({
            "node": "RAG Semantic Matching",
            "status": "warning",
            "duration_sec": round(time.time() - start_time, 2),
            "message": f"Computed heuristic scores: {scores.overall_score}/100"
        })
        return {
            **state,
            "match_scores": scores,
            "execution_logs": logs
        }
