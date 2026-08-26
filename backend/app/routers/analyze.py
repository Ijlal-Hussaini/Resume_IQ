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


@router.post("/generate-jd", response_model=ApiResponse)
async def generate_job_description(request: GenerateJDRequest):
    """
    Auto-generates / retrieves a comprehensive, industry-aligned Job Description
    based on the target job title and company name.
    """
    if not request.job_title or len(request.job_title.strip()) < 2:
        raise HTTPException(status_code=400, detail="A valid job title is required to generate criteria.")

    company_clause = f" at {request.company_name}" if request.company_name else ""
    prompt = f"""Generate a comprehensive, realistic, and industry-standard Job Description for the role: "{request.job_title}"{company_clause}.

Include the following sections clearly formatted in markdown:
1. Position Overview & Company Context
2. Key Responsibilities & Core Deliverables (5-6 detailed bullet points)
3. Must-Have Qualifications & Technical Skills (5-6 specific items)
4. Preferred Experience & Nice-to-Have Competencies
5. Tools, Frameworks, and Methodologies

Format as clean, professional text suitable for direct evaluation against a candidate's resume."""

    system_prompt = "You are an expert Executive Technical Recruiter and Job Architecture Specialist."

    try:
        from ..core.llm import llm_service
        generated_jd = await llm_service.invoke(prompt, system_prompt)

        return ApiResponse(
            success=True,
            message="Job description criteria synthesized successfully.",
            data={
                "job_title": request.job_title,
                "company_name": request.company_name or "",
                "raw_text": generated_jd
            }
        )
    except Exception as e:
        logger.error(f"Error generating job description: {e}")
        # Fallback template
        fallback_jd = f"""Position: {request.job_title}{company_clause}

Role Overview:
We are seeking a talented and driven {request.job_title} to join our team{company_clause}. You will take ownership of key deliverables, collaborate cross-functionally, and drive domain impact.

Key Responsibilities:
* Design, implement, and maintain scalable solutions and workflows.
* Collaborate with stakeholders to deliver high-quality business and technical results.
* Ensure best practices in execution, quality assurance, and system reliability.
* Continuously improve processes, documentation, and team standards.

Required Qualifications:
* Demonstrated hands-on experience in {request.job_title} domain.
* Strong problem-solving, communication, and project delivery skills.
* Proficiency with modern industry tools, methodologies, and frameworks.
* Bachelor's degree or equivalent practical industry experience."""

        return ApiResponse(
            success=True,
            message="Job description criteria generated via fallback template.",
            data={
                "job_title": request.job_title,
                "company_name": request.company_name or "",
                "raw_text": fallback_jd
            }
        )

