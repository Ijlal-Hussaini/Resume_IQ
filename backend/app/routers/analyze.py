import logging
from fastapi import APIRouter, HTTPException
from ..models.api import ApiResponse, AnalyzeJobRequest, GenerateJDRequest
from ..agents.graph import pipeline_runner
from ..core.vector_store import vector_store_manager

router = APIRouter(prefix="/analyze", tags=["LangGraph Career Intelligence"])
logger = logging.getLogger("resumeiq.routers.analyze")


@router.post("", response_model=ApiResponse)
async def analyze_against_job_description(request: AnalyzeJobRequest):
    """
    Executes the multi-step LangGraph Agentic Pipeline:
    1. Extraction & Chunking
    2. Data Integrity Validation
    3. Job Description Criteria Decomposition
    4. RAG Semantic Match & Multi-Dimensional Scoring
    5. Skill & Competency Gap Analysis
    6. ATS Compliance & Readability Audit
    7. XYZ Bullet Rewrites & Interview Question Synthesis
    """
    if not request.job_description or not request.job_description.raw_text:
        raise HTTPException(status_code=400, detail="Target Job Description is required for match analysis.")

    try:
        # If resume data was provided, ensure vector store is indexed
        session_id = request.session_id or "session_default"
        if request.resume_data:
            vector_store_manager.index_resume(
                session_id=session_id,
                resume_data=request.resume_data,
                raw_text=request.resume_raw_text
            )

        analysis_result = await pipeline_runner.run(
            session_id=session_id,
            raw_text=request.resume_raw_text,
            resume_data=request.resume_data,
            job_description=request.job_description
        )

        return ApiResponse(
            success=True,
            message="LangGraph Career Intelligence workflow completed successfully.",
            data=analysis_result.model_dump()
        )
    except Exception as e:
        logger.error(f"Error running LangGraph analysis pipeline: {e}")
        raise HTTPException(status_code=500, detail=f"Pipeline execution error: {str(e)}")


def clean_jd_text(text: str) -> str:
    """Sanitizes raw LLM output into clean, professional recruiter text."""
    import re
    # Remove markdown header hashes (# Title -> Title)
    cleaned = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)
    # Remove bold/italic markdown (**text** -> text, *text* -> text)
    cleaned = re.sub(r"\*\*([^*]+)\*\*", r"\1", cleaned)
    cleaned = re.sub(r"\*([^*]+)\*", r"\1", cleaned)
    # Remove horizontal rules (--- or ===)
    cleaned = re.sub(r"^[-\=_]{3,}\s*$", "", cleaned, flags=re.MULTILINE)
    # Replace markdown table rows with clean bullets
    cleaned = re.sub(r"^\|(?:\s*[-:]+\s*\|)+$", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"^\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|", r"• \1: \2", cleaned, flags=re.MULTILINE)
    # Standardize bullet markers to clean bullet (•)
    cleaned = re.sub(r"^\s*[-*]\s+", "• ", cleaned, flags=re.MULTILINE)
    # Remove excessive blank lines
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


@router.post("/generate-jd", response_model=ApiResponse)
async def generate_job_description(request: GenerateJDRequest):
    """
    Auto-generates a comprehensive, industry-aligned Job Description in clean professional text.
    """
    if not request.job_title or len(request.job_title.strip()) < 2:
        raise HTTPException(status_code=400, detail="A valid job title is required to generate criteria.")

    company_clause = f" at {request.company_name}" if request.company_name else ""
    prompt = f"""Write a professional, realistic Job Description for the position: "{request.job_title}"{company_clause}.

CRITICAL FORMATTING INSTRUCTIONS:
- Do NOT use markdown symbols: NO hashtags (no # or ##), NO bold asterisks (no **text**), NO horizontal lines (no ---), and NO pipe tables.
- Use plain uppercase for Section Headings (e.g. POSITION OVERVIEW, CORE RESPONSIBILITIES, REQUIRED QUALIFICATIONS, PREFERRED SKILLS, TOOLS & TECHNOLOGIES).
- Use standard bullet points (• ) for lists.
- Write in clean, professional, corporate HR English.

Include:
1. POSITION OVERVIEW & CONTEXT
2. KEY RESPONSIBILITIES (5-6 detailed bullet points)
3. REQUIRED QUALIFICATIONS & SKILLS (5-6 specific bullet points)
4. PREFERRED QUALIFICATIONS (3-4 bullet points)
5. TOOLS & TECHNOLOGIES (bullet points)"""

    system_prompt = "You are a Principal Technical Recruiter and Job Architecture Specialist. You write clean, polished job postings in professional text format."

    try:
        from ..core.llm import llm_service
        generated_jd = await llm_service.invoke(prompt, system_prompt)
        
        # If LLM returned fallback notification or failed, use rich template
        if not generated_jd or "System running in fallback mode" in generated_jd or len(generated_jd.strip()) < 50:
            raise ValueError("LLM invocation returned empty or fallback message.")

        cleaned_jd = clean_jd_text(generated_jd)

        return ApiResponse(
            success=True,
            message="Job description criteria synthesized successfully in professional format.",
            data={
                "job_title": request.job_title,
                "company_name": request.company_name or "",
                "raw_text": cleaned_jd
            }
        )
    except Exception as e:
        logger.info(f"Auto-drafting using rich template: {e}")
        fallback_jd = f"""POSITION: {request.job_title.upper()}{company_clause.upper()}

POSITION OVERVIEW:
We are seeking a talented and driven {request.job_title} to join our team{company_clause}. In this role, you will take ownership of key deliverables, collaborate cross-functionally, and drive tangible impact.

KEY RESPONSIBILITIES:
• Lead and execute core technical deliverables aligned with business requirements and engineering milestones.
• Design, build, and optimize scalable systems, resilient architectures, and automated pipelines.
• Collaborate closely with cross-functional product, design, and engineering partners.
• Implement industry best practices in code quality, security standards, and maintainability.
• Troubleshoot, analyze, and resolve complex issues across development and production environments.

REQUIRED QUALIFICATIONS & SKILLS:
• Bachelor's degree in Computer Science, Engineering, or equivalent practical experience.
• 3+ years of professional hands-on experience in modern technology stacks and frameworks.
• Strong foundation in system design, data structures, and REST/gRPC API architectures.
• Proven problem-solving capabilities with a high bar for code quality and reliability.
• Excellent written and verbal communication skills with cross-functional teams.

PREFERRED QUALIFICATIONS:
• Experience with cloud native ecosystems (AWS / GCP / Azure), Docker, and Kubernetes.
• Familiarity with CI/CD automation, unit testing methodologies, and performance profiling.
• Contributions to open-source software or engineering leadership experience.

TOOLS & TECHNOLOGIES:
• Python, TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, Git version control."""

        return ApiResponse(
            success=True,
            message="Job description criteria generated successfully.",
            data={
                "job_title": request.job_title,
                "company_name": request.company_name or "",
                "raw_text": fallback_jd
            }
        )


