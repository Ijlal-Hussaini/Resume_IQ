import time
import logging
from ..state import AgentState
from ...models.analysis import SkillGapAnalysis, SkillMatchItem
from ...core.llm import llm_service

logger = logging.getLogger("resumeiq.nodes.gap_analysis")

GAP_ANALYSIS_SYSTEM_PROMPT = """You are a Career Strategist and Competency Analyst.
Perform a rigorous gap analysis comparing the candidate's extracted skills against the target job requirements.

CATEGORIES TO PRODUCE:
1. matched_skills: Skills clearly demonstrated in resume with specific evidence.
2. missing_critical_skills: Required core qualifications from the JD absent in the resume.
3. missing_secondary_skills: Preferred or bonus qualifications missing.
4. bridge_recommendations: Concrete actionable steps for the candidate to address these gaps.
"""


async def gap_analysis_node(state: AgentState) -> AgentState:
    """LangGraph Node 5: Identifies critical skill & competency gaps and bridge strategies."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    resume = state.get("resume_data")
    job = state.get("job_breakdown")

    def heuristic_gap_analysis() -> SkillGapAnalysis:
        r_skills = [s.lower() for s in (resume.all_skills_flat if resume else [])]
        matched = []
        missing_crit = []
        missing_sec = []

        if job:
            for s in job.must_have_skills:
                if any(s.lower() in r or r in s.lower() for r in r_skills):
                    matched.append(SkillMatchItem(
                        skill_name=s,
                        status="matched",
                        importance="critical",
                        evidence_or_notes="Demonstrated in resume profile"
                    ))
                else:
                    missing_crit.append(SkillMatchItem(
                        skill_name=s,
                        status="missing",
                        importance="critical",
                        evidence_or_notes="Not explicitly mentioned in current resume text"
                    ))

            for s in job.nice_to_have_skills:
                if any(s.lower() in r or r in s.lower() for r in r_skills):
                    matched.append(SkillMatchItem(
                        skill_name=s,
                        status="matched",
                        importance="bonus",
                        evidence_or_notes="Present in secondary competencies"
                    ))
                else:
                    missing_sec.append(SkillMatchItem(
                        skill_name=s,
                        status="missing",
                        importance="bonus",
                        evidence_or_notes="Preferred qualification not explicitly documented"
                    ))
        
        if not matched and r_skills:
            for s in r_skills[:4]:
                matched.append(SkillMatchItem(skill_name=s.title(), status="matched", importance="important", evidence_or_notes="Extracted from candidate profile"))

        return SkillGapAnalysis(
            matched_skills=matched,
            missing_critical_skills=missing_crit,
            missing_secondary_skills=missing_sec,
            bridge_recommendations=[
                "Explicitly incorporate missing domain keywords into recent project bullets",
                "Highlight transferable methodologies from existing roles",
                "Add relevant ongoing certifications or self-directed coursework"
            ]
        )

    try:
        resume_skills_str = ", ".join(resume.all_skills_flat) if resume else "None"
        jd_must_str = ", ".join(job.must_have_skills) if job else "None"
        jd_nice_str = ", ".join(job.nice_to_have_skills) if job else "None"

        prompt = f"""Compare Candidate Skills with Target Job Requirements:
Candidate Skills: {resume_skills_str}
Candidate Domain: {resume.domain_industry if resume else 'General'}

Target JD Must-Haves: {jd_must_str}
Target JD Nice-to-Haves: {jd_nice_str}

Produce a structured SkillGapAnalysis object."""

        gap_analysis = await llm_service.extract_structured(
            schema=SkillGapAnalysis,
            prompt=prompt,
            system_prompt=GAP_ANALYSIS_SYSTEM_PROMPT,
            fallback_factory=heuristic_gap_analysis
        )

        elapsed = round(time.time() - start_time, 2)
        logs.append({
            "node": "Skill Gap Analysis",
            "status": "success",
            "duration_sec": elapsed,
            "message": f"Identified {len(gap_analysis.matched_skills)} matched competencies and {len(gap_analysis.missing_critical_skills)} critical skill gaps."
        })

        return {
            **state,
            "skill_gaps": gap_analysis,
            "execution_logs": logs
        }
    except Exception as e:
        logger.error(f"Gap analysis node error: {e}")
        gaps = heuristic_gap_analysis()
        logs.append({
            "node": "Skill Gap Analysis",
            "status": "warning",
            "duration_sec": round(time.time() - start_time, 2),
            "message": f"Generated heuristic gap analysis: {e}"
        })
        return {
            **state,
            "skill_gaps": gaps,
            "execution_logs": logs
        }
