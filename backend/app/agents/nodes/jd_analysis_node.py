import time
import re
import logging
from ..state import AgentState
from ...models.analysis import JobRequirementsDecomposed
from ...core.llm import llm_service

logger = logging.getLogger("resumeiq.nodes.jd_analysis")

JD_ANALYSIS_PROMPT = """You are a Principal Talent Acquisition Analyst.
Decompose this Target Job Description into a structured requirements schema for ANY industry.

CRITICAL INSTRUCTIONS:
1. Field-Agnostic: Correctly identify the industry/field (e.g. Healthcare/Nursing, Digital Marketing, Civil Engineering, High School Education, Corporate Finance, Software Architecture).
2. Must-Haves vs Nice-to-Haves: Separate strict non-negotiable requirements (e.g. 'Active RN license', '5+ years B2B SaaS marketing') from optional bonuses.
3. Quantifiable criteria: Capture required years of experience, tooling/methodologies, and scope.
"""


async def jd_analysis_node(state: AgentState) -> AgentState:
    """LangGraph Node 3: Deconstructs Job Description into structured criteria."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    jd_input = state.get("job_description")
    if not jd_input or not jd_input.raw_text:
        # Default fallback JD
        jd_input_text = "Target Role Description"
    else:
        jd_input_text = jd_input.raw_text

    def heuristic_jd_breakdown() -> JobRequirementsDecomposed:
        lines = [l.strip() for l in jd_input_text.split("\n") if l.strip()]
        title = jd_input.job_title if jd_input and jd_input.job_title else (lines[0] if lines else "Target Position")
        
        # Extract skills by bullet markers
        skills = []
        for l in lines:
            if l.startswith(("-", "*", "•")) or any(k in l.lower() for k in ["experience with", "proficiency in", "ability to", "knowledge of"]):
                cleaned = re.sub(r"^[\*\-•\s]+", "", l)
                if 10 < len(cleaned) < 120:
                    skills.append(cleaned)

        must_haves = skills[:6] if skills else ["Strong domain competence and proven track record", "Cross-functional communication", "Execution of core responsibilities"]
        nice_to_haves = skills[6:10] if len(skills) > 6 else ["Advanced domain certifications or specialized tooling"]

        # Infer industry
        low = jd_input_text.lower()
        industry = "Professional Services"
        if any(w in low for w in ["patient", "clinical", "hospital", "nursing", "medical", "physician"]):
            industry = "Healthcare"
        elif any(w in low for w in ["react", "python", "software", "api", "database", "backend", "developer"]):
            industry = "Technology"
        elif any(w in low for w in ["brand", "marketing", "seo", "roas", "campaign", "growth"]):
            industry = "Marketing & Growth"
        elif any(w in low for w in ["accounting", "financial", "audit", "gaap", "banking"]):
            industry = "Finance"

        return JobRequirementsDecomposed(
            inferred_title=title,
            inferred_industry=industry,
            experience_level="Mid-Senior Level",
            must_have_skills=must_haves,
            nice_to_have_skills=nice_to_haves,
            key_responsibilities=lines[1:5] if len(lines) > 4 else ["Deliver high-impact domain objectives"],
            cultural_and_soft_skills=["Leadership", "Stakeholder Communication", "Problem Solving"]
        )

    try:
        prompt = f"""Deconstruct this Job Description:
--- JOB DESCRIPTION ---
{jd_input_text}
--- END ---
"""
        job_breakdown = await llm_service.extract_structured(
            schema=JobRequirementsDecomposed,
            prompt=prompt,
            system_prompt=JD_ANALYSIS_PROMPT,
            fallback_factory=heuristic_jd_breakdown
        )

        elapsed = round(time.time() - start_time, 2)
        logs.append({
            "node": "Job Description Decomposition",
            "status": "success",
            "duration_sec": elapsed,
            "message": f"Deconstructed target role: '{job_breakdown.inferred_title}' ({job_breakdown.inferred_industry}) with {len(job_breakdown.must_have_skills)} must-haves."
        })

        return {
            **state,
            "job_breakdown": job_breakdown,
            "execution_logs": logs
        }
    except Exception as e:
        logger.error(f"JD analysis node failed: {e}")
        breakdown = heuristic_jd_breakdown()
        logs.append({
            "node": "Job Description Decomposition",
            "status": "warning",
            "duration_sec": round(time.time() - start_time, 2),
            "message": f"Used heuristic JD decomposition: {e}"
        })
        return {
            **state,
            "job_breakdown": breakdown,
            "execution_logs": logs
        }
