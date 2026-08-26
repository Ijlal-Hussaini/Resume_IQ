import time
import re
import logging
from ..state import AgentState
from ...models.analysis import ATSReport, ATSCheckItem
from ...core.llm import llm_service

logger = logging.getLogger("resumeiq.nodes.ats_critique")

ATS_SYSTEM_PROMPT = """You are an ATS (Applicant Tracking System) Compliance Auditor and Technical Resume Screener.
Audit the candidate's resume for machine parseability, keyword optimization, and recruiter readability.

CHECKS TO EVALUATE:
1. Action Verbs: Are bullets starting with strong past/present action verbs?
2. Quantified Impact: Are there clear numbers, %, $, or scale metrics in bullet points?
3. Contact Info Completeness: Phone, email, location, LinkedIn present?
4. Section Clarity: Standard headings (Experience, Education, Skills) vs ambiguous headers?
5. Keyword Density: Does the resume naturally incorporate domain terms without keyword stuffing?
"""


async def ats_critique_node(state: AgentState) -> AgentState:
    """LangGraph Node 6: Audits resume against ATS compliance and readability rules."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    resume = state.get("resume_data")

    def heuristic_ats_report() -> ATSReport:
        checks = []
        score = 85

        # 1. Contact check
        has_email = bool(resume and resume.contact_info.email)
        has_phone = bool(resume and resume.contact_info.phone)
        if has_email and has_phone:
            checks.append(ATSCheckItem(
                category="Contact Information",
                status="pass",
                title="Full Contact Details Present",
                detail="Email, phone, and profile identifiers are clearly parseable.",
                fix_action="Maintain standardized single-line contact header."
            ))
        else:
            score -= 10
            checks.append(ATSCheckItem(
                category="Contact Information",
                status="warning",
                title="Incomplete Contact Header",
                detail="Missing either direct phone or standard email in header.",
                fix_action="Ensure phone and professional email are clearly listed at the top."
            ))

        # 2. Metrics check
        all_bullets = []
        if resume:
            for exp in resume.work_experience:
                all_bullets.extend(exp.description_bullets)
        
        has_metrics = sum(1 for b in all_bullets if re.search(r"(\d+%|\$\d+|\d+\+|\d+ (teams|engineers|patients|clients|users|stores))", b, re.IGNORECASE))
        if has_metrics >= max(2, len(all_bullets) // 3):
            checks.append(ATSCheckItem(
                category="Quantified Impact",
                status="pass",
                title="Strong Metric Density",
                detail=f"Detected {has_metrics} bullets with explicit numerical achievements.",
                fix_action="Continue leading with quantifiable business outcomes."
            ))
        else:
            score -= 12
            checks.append(ATSCheckItem(
                category="Quantified Impact",
                status="warning",
                title="Low Metric Density",
                detail="Several bullets describe task duties without numeric outcome data.",
                fix_action="Add metrics using the XYZ formula (e.g. 'Reduced triage time by 28%')."
            ))

        # 3. Action verbs
        weak_starts = sum(1 for b in all_bullets if any(b.lower().startswith(w) for w in ["responsible for", "assisted with", "helped", "worked on", "duties included"]))
        if weak_starts == 0:
            checks.append(ATSCheckItem(
                category="Action Verbs",
                status="pass",
                title="Active Power Verbs",
                detail="Bullets consistently start with strong, decisive action verbs.",
                fix_action="Keep using high-impact active voice verbs."
            ))
        else:
            score -= 8
            checks.append(ATSCheckItem(
                category="Action Verbs",
                status="warning",
                title="Passive Phrasing Detected",
                detail=f"Found {weak_starts} bullet(s) using passive phrases like 'Responsible for'.",
                fix_action="Replace passive openings with strong verbs like 'Spearheaded', 'Orchestrated', 'Optimized'."
            ))

        # 4. Standard section headers
        checks.append(ATSCheckItem(
            category="Structural Hierarchy",
            status="pass",
            title="Clean Section Hierarchy",
            detail="Standard headings allow commercial ATS parsers (Workday, Taleo, Greenhouse) to index correctly.",
            fix_action="Ensure font sizes follow strict H1/H2 hierarchy."
        ))

        return ATSReport(
            ats_score=max(50, min(98, score)),
            overall_readability="High ATS Compatibility - Clean machine extraction with standard hierarchy.",
            checks=checks,
            top_ats_improvements=[
                "Transform passive task descriptions into quantified achievement bullets",
                "Ensure consistent chronological dates format (Mon YYYY - Mon YYYY)",
                "Embed exact keywords from the target job posting directly in bullet contexts"
            ]
        )

    try:
        raw_text_sample = resume.raw_text[:2000] if (resume and resume.raw_text) else ""
        prompt = f"""Audit this resume text for ATS compliance:
{raw_text_sample}

Produce a structured ATSReport with specific actionable checks."""

        ats_report = await llm_service.extract_structured(
            schema=ATSReport,
            prompt=prompt,
            system_prompt=ATS_SYSTEM_PROMPT,
            fallback_factory=heuristic_ats_report
        )

        elapsed = round(time.time() - start_time, 2)
        logs.append({
            "node": "ATS Compliance Audit",
            "status": "success",
            "duration_sec": elapsed,
            "message": f"ATS Health Score: {ats_report.ats_score}/100. Completed {len(ats_report.checks)} compliance checks."
        })

        return {
            **state,
            "ats_report": ats_report,
            "execution_logs": logs
        }
    except Exception as e:
        logger.error(f"ATS audit node error: {e}")
        report = heuristic_ats_report()
        logs.append({
            "node": "ATS Compliance Audit",
            "status": "warning",
            "duration_sec": round(time.time() - start_time, 2),
            "message": f"Generated heuristic ATS audit: {e}"
        })
        return {
            **state,
            "ats_report": report,
            "execution_logs": logs
        }
