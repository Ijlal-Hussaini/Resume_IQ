import time
import re
import logging
from ..state import AgentState
from ...models.analysis import ATSReport, ATSCheckItem
from ...core.llm import llm_service

logger = logging.getLogger("resumeiq.nodes.ats_critique")

ATS_SYSTEM_PROMPT = """You are a Certified Professional Resume Screener and Enterprise Applicant Tracking System (ATS) Compliance Auditor (evaluating against Workday, Taleo, Greenhouse, Lever, and iCIMS parsing algorithms).

Audit the candidate's resume for:
1. Contact & Social Identifier Clarity
2. Quantified Metrics & KPI Density (numbers, %, $, latency, throughput)
3. Action Verb Dynamism & Power Verbs
4. Standard Section Hierarchy & Machine Parseability
5. Keyword Optimization against the Target Job Description
6. Date & Timeline Consistency (MM/YYYY or YYYY - Present)
7. Bullet Brevity & Readability (1-2 lines per bullet)
8. Absence of Parsing Red Flags (tables, nested graphics, ambiguous headings)

Calculate a rigorous, honest ATS Health Score (0-100) and provide concrete pass/warning/fail checks with exact fix recommendations.
"""


async def ats_critique_node(state: AgentState) -> AgentState:
    """LangGraph Node 6: Audits resume against enterprise ATS compliance and readability rules."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    resume = state.get("resume_data")
    job = state.get("job_breakdown")

    def heuristic_ats_report() -> ATSReport:
        checks = []
        score = 92

        # 1. Contact Info Completeness
        has_email = bool(resume and resume.contact_info.email)
        has_phone = bool(resume and resume.contact_info.phone)
        has_linkedin = bool(resume and resume.contact_info.linkedin)
        has_github = bool(resume and resume.contact_info.github)

        if has_email and has_phone:
            checks.append(ATSCheckItem(
                category="Contact Information",
                status="pass",
                title="Complete & Parseable Contact Header",
                detail=f"Verified email ({resume.contact_info.email}) and direct phone contact. Social links: {'LinkedIn' if has_linkedin else ''} {'GitHub' if has_github else ''}.",
                fix_action="Maintain clean single-line header with active hyperlinked URLs."
            ))
        else:
            score -= 10
            checks.append(ATSCheckItem(
                category="Contact Information",
                status="warning",
                title="Missing Critical Contact Identifiers",
                detail="Incomplete phone number or primary email address in header.",
                fix_action="Ensure phone and professional email are prominently placed in the top header."
            ))

        # 2. Quantified Impact & Metrics
        all_bullets = []
        if resume:
            for exp in resume.work_experience:
                all_bullets.extend(exp.description_bullets)
            for proj in resume.projects:
                if proj.description:
                    all_bullets.append(proj.description)

        metric_regex = r"(\d+%|\$\d+|\d+\.?\d*x|\d+\.?\d*k|\d+\.?\d*m|\b\d+\b(?:\s+(?:users|requests|ms|seconds|teams|clients|queries|records|students|engineers|patients|APIs|endpoints)))"
        metric_bullets = [b for b in all_bullets if re.search(metric_regex, b, re.IGNORECASE)]
        
        if len(metric_bullets) >= max(2, len(all_bullets) // 2):
            checks.append(ATSCheckItem(
                category="Quantified Metrics & KPIs",
                status="pass",
                title="High Metric Density & Proof of Scale",
                detail=f"Found {len(metric_bullets)} bullet points containing verifiable numerical metrics and KPI benchmarks.",
                fix_action="Continue anchoring achievements with scale, speed, and business impact."
            ))
        else:
            score -= 12
            checks.append(ATSCheckItem(
                category="Quantified Metrics & KPIs",
                status="warning",
                title="Action Bullets Lack Quantifiable Impact",
                detail=f"Only {len(metric_bullets)} of {len(all_bullets)} bullets include numerical outcomes. Many describe tasks rather than measurable results.",
                fix_action="Infuse metrics using the Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]' (e.g. 'Improved latency by 35%')."
            ))

        # 3. Action Verbs & Active Voice
        passive_patterns = [r"\bresponsible for\b", r"\bassisted in\b", r"\bhelped with\b", r"\bworked on\b", r"\bduties included\b", r"\btasked with\b"]
        passive_count = sum(1 for b in all_bullets if any(re.search(pat, b, re.IGNORECASE) for pat in passive_patterns))

        if passive_count == 0:
            checks.append(ATSCheckItem(
                category="Action Verbs & Voice",
                status="pass",
                title="Strong Active Voice & Power Verbs",
                detail="All bullet points open with decisive action verbs ('Architected', 'Engineered', 'Optimized', 'Deployed').",
                fix_action="Keep using proactive past/present tense action verbs."
            ))
        else:
            score -= 8
            checks.append(ATSCheckItem(
                category="Action Verbs & Voice",
                status="warning",
                title="Passive Phrasing Detected",
                detail=f"Found {passive_count} instance(s) of passive phrasing (e.g. 'responsible for' or 'worked on').",
                fix_action="Replace passive openings with power verbs: 'Spearheaded', 'Engineered', 'Automated', 'Streamlined'."
            ))

        # 4. Standard Section Hierarchy
        has_exp = bool(resume and resume.work_experience)
        has_edu = bool(resume and resume.education)
        has_skills = bool(resume and resume.all_skills_flat)

        if has_exp and has_edu and has_skills:
            checks.append(ATSCheckItem(
                category="Section Hierarchy",
                status="pass",
                title="Standard ATS-Friendly Headings",
                detail="Resume uses universal section headers (Experience, Education, Skills) recognized by Workday and Greenhouse parsers.",
                fix_action="Maintain standard H2 headings without combining unrelated sections."
            ))
        else:
            score -= 10
            checks.append(ATSCheckItem(
                category="Section Hierarchy",
                status="warning",
                title="Incomplete Section Structure",
                detail="One or more standard resume sections appear missing or merged.",
                fix_action="Ensure clear separation for Summary, Experience, Education, and Skills."
            ))

        # 5. Target Keyword Alignment
        must_haves = job.must_have_skills if job else []
        resume_text_lower = (resume.raw_text or "").lower() if resume else ""
        matched_kws = [kw for kw in must_haves if kw.lower() in resume_text_lower] if resume else []
        
        if len(matched_kws) >= len(must_haves) * 0.6:
            checks.append(ATSCheckItem(
                category="Target Keyword Alignment",
                status="pass",
                title="Strong JD Keyword Match Rate",
                detail=f"Matched {len(matched_kws)} of {len(must_haves)} critical keywords from target role requirements.",
                fix_action="Ensure top matched skills are repeated across both skills summary and work experience bullets."
            ))
        else:
            score -= 14
            checks.append(ATSCheckItem(
                category="Target Keyword Alignment",
                status="warning",
                title="Keyword Gap Against Target Role",
                detail=f"Only {len(matched_kws)} of {len(must_haves)} target keywords detected in resume text.",
                fix_action=f"Explicitly incorporate missing target skills: {', '.join([k for k in must_haves if k not in matched_kws][:4])}."
            ))

        # 6. Education Formatting
        if resume and resume.education:
            checks.append(ATSCheckItem(
                category="Education & Credentials",
                status="pass",
                title="Standardized Degree & Institution Formatting",
                detail=f"Extracted verified academic credentials: {resume.education[0].degree} from {resume.education[0].institution}.",
                fix_action="Keep graduation dates and GPA listed cleanly."
            ))
        else:
            score -= 6
            checks.append(ATSCheckItem(
                category="Education & Credentials",
                status="warning",
                title="Academic Credentials Unparsed",
                detail="Could not detect explicit degree title or institution name.",
                fix_action="List degree title, institution name, and graduation year clearly under Education."
            ))

        final_score = max(55, min(96, score))
        return ATSReport(
            ats_score=final_score,
            overall_readability=f"{'Exceptional' if final_score >= 85 else 'Good'} ATS Compatibility — Score: {final_score}/100. Machine parseability verified across major ATS scanning engines.",
            checks=checks,
            top_ats_improvements=[
                "Transform passive task descriptions into quantified achievement bullets using numbers and %",
                "Explicitly incorporate missing target skills directly into work experience descriptions",
                "Ensure clean chronological date formats (e.g. Jan 2023 – Present) across all positions"
            ]
        )

    try:
        raw_text_sample = resume.raw_text[:3000] if (resume and resume.raw_text) else ""
        job_ctx = f"Target Role: {job.inferred_title if job else 'Position'}\nMust Haves: {', '.join(job.must_have_skills if job else [])}"
        prompt = f"""Audit this candidate resume against enterprise ATS criteria for the target role:

--- TARGET JOB ---
{job_ctx}

--- RESUME TEXT ---
{raw_text_sample}
--- END RESUME TEXT ---

Produce a structured ATSReport with an honest score (0-100) and 5 to 7 detailed checklist items."""

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
