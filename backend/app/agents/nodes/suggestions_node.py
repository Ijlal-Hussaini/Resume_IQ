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
    strengths: List[str] = Field(description="Top 3-5 distinct competitive advantages")
    weaknesses: List[str] = Field(description="Top 2-4 vulnerabilities or perceived gaps")
    rewrite_suggestions: List[RewriteSuggestion] = Field(description="Comprehensive bullet rewrites with Google XYZ framework across all roles and projects")
    interview_prep_questions: List[str] = Field(description="4-6 tailored tough interview questions targeting the candidate's profile gaps")


SUGGESTIONS_SYSTEM_PROMPT = """You are an Elite Executive Career Strategist and Principal Technical Recruiter.
Your mission is to perform a comprehensive, bullet-by-bullet transformation of the candidate's entire resume to align with the Target Job Description using the Google XYZ Formula:
'Accomplished [X], as measured by [Y], by doing [Z]'

CRITICAL RULES:
1. Cover ALL Roles & Projects: Do NOT limit rewrites to just 1 position. Generate rewrites across the candidate's work experiences AND projects.
2. Infuse Target JD Keywords: Naturally integrate the must-have technical skills, methodologies, and terminology from the Target Job Description.
3. Quantify Impact: Include realistic, industry-credible metrics (e.g., latency reduction %, daily active users, uptime %, performance gains, cost savings, test coverage).
4. Provide Actionable Rationale: In 'reasoning', explain exactly how the rewrite captures recruiter attention and satisfies automated ATS ranking filters.
5. Tough Interview Questions: Formulate deep, role-specific behavioral and technical interview questions based on the candidate's exact experience and potential gap areas.
"""


async def suggestions_node(state: AgentState) -> AgentState:
    """LangGraph Node 7: Synthesizes executive summary, holistic XYZ bullet rewrites, and interview prep."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    resume = state.get("resume_data")
    job = state.get("job_breakdown")
    match_scores = state.get("match_scores")

    def heuristic_suggestions() -> SuggestionsPayload:
        rewrites = []
        if resume:
            # Experience rewrites
            for exp in resume.work_experience:
                for bullet in exp.description_bullets[:2]:
                    rewrites.append(RewriteSuggestion(
                        section=f"{exp.job_title} at {exp.company}",
                        original_bullet=bullet,
                        rewritten_bullet=f"Architected scalable application modules and automated data pipelines at {exp.company}, boosting operational throughput by 38% and reducing response latency by 220ms through optimized API microservices and containerized workflows.",
                        reasoning="Transforms a routine task description into an executive-level impact metric showcasing speed, reliability, and technical ownership.",
                        framework_used="Google XYZ Formula (Accomplished [X] as measured by [Y] by doing [Z])",
                        impact_level="High"
                    ))
            
            # Project rewrites
            for proj in resume.projects[:2]:
                rewrites.append(RewriteSuggestion(
                    section=f"Project: {proj.title}",
                    original_bullet=proj.description or f"Built {proj.title} application using modern software stack.",
                    rewritten_bullet=f"Engineered full-stack {proj.title} system utilizing {', '.join(proj.tools_technologies[:3]) if proj.tools_technologies else 'modern frameworks'}, handling 1,000+ simulated requests/sec with 99.9% uptime and zero packet loss.",
                    reasoning="Quantifies throughput and uptime, converting an academic or personal project into production-grade engineering proof.",
                    framework_used="Google XYZ Formula (Accomplished [X] as measured by [Y] by doing [Z])",
                    impact_level="High"
                ))

        if not rewrites:
            rewrites.append(RewriteSuggestion(
                section="Professional Experience",
                original_bullet="Responsible for daily development tasks and team collaboration.",
                rewritten_bullet="Engineered mission-critical microservices and automated CI/CD pipelines, accelerating sprint delivery velocity by 30% while maintaining 99.95% system availability.",
                reasoning="Demonstrates high-leverage business value, delivery velocity, and operational excellence.",
                framework_used="Google XYZ Formula",
                impact_level="High"
            ))

        cand_name = resume.contact_info.full_name if (resume and resume.contact_info.full_name) else "Candidate"
        role = job.inferred_title if job else "the target role"
        ind = job.inferred_industry if job else (resume.domain_industry if resume else "Software Engineering")

        return SuggestionsPayload(
            executive_summary=f"{cand_name} presents a strong, competitive profile in {ind}. The candidate's background demonstrates solid foundational competencies for {role}. By sharpening bullet metrics to highlight quantifiable business velocity and embedding specific target stack keywords, candidate interview conversion will significantly increase.",
            strengths=[
                f"Demonstrated domain proficiency and hands-on track record in {ind}",
                "Practical experience building and deploying scalable, modern application architectures",
                "Strong academic background with high GPA and foundational software competencies",
                "Proven ability to deliver end-to-end technical solutions in collaborative environments"
            ],
            weaknesses=[
                "Several resume bullets describe task responsibilities rather than quantified business outcomes",
                "Target job stack keywords could be highlighted more prominently across work experience summaries",
                "Cloud infrastructure, CI/CD automation, and testing metrics could be further emphasized"
            ],
            rewrite_suggestions=rewrites,
            interview_prep_questions=[
                f"How did you design and optimize database queries or API endpoints in your work at {resume.work_experience[0].company if (resume and resume.work_experience) else 'your recent role'}?",
                f"Can you explain the trade-offs you considered when choosing your technical stack for {role} deliverables?",
                "Describe a situation where a service under your supervision experienced high latency or failure, and how you diagnosed and resolved the root cause.",
                f"How do you ensure code maintainability, automated testing, and CI/CD reliability across distributed microservices in {ind}?"
            ]
        )

    try:
        # Collect all work experience & projects context
        all_roles_context = []
        if resume:
            for exp in resume.work_experience:
                all_roles_context.append({
                    "role": f"{exp.job_title} at {exp.company} ({exp.start_date or ''} - {exp.end_date or ''})",
                    "original_bullets": exp.description_bullets,
                    "tools": exp.tools_and_methods
                })
            for proj in resume.projects:
                all_roles_context.append({
                    "project": proj.title,
                    "description": proj.description,
                    "technologies": proj.tools_technologies
                })

        cand_summary = f"""
Candidate Name: {resume.contact_info.full_name if resume else 'Candidate'}
Domain / Industry: {resume.domain_industry if resume else 'Software Engineering'}
All Roles & Projects on Resume:
{json.dumps(all_roles_context, indent=2)}

Candidate Skills: {', '.join(resume.all_skills_flat if resume else [])}
Target Job Title: {job.inferred_title if job else 'Position'}
Target Job Must-Haves: {', '.join(job.must_have_skills if job else [])}
Target Job Nice-To-Haves: {', '.join(job.nice_to_have_skills if job else [])}
Overall Match Score: {match_scores.overall_score if match_scores else 80}/100
"""
        prompt = f"""Generate a comprehensive strategic executive briefing and Google XYZ bullet-by-bullet rewrites across ALL candidate roles and projects:
{cand_summary}

Requirements:
- Provide 4 to 7 concrete bullet rewrites covering each role and project.
- Rewrite using Google's XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]' with realistic metrics.
- Produce a structured SuggestionsPayload."""

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
            "message": f"Generated {len(payload.rewrite_suggestions)} bullet rewrites across all CV sections, {len(payload.strengths)} strengths, and {len(payload.interview_prep_questions)} tailored interview questions."
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
