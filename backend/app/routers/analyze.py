import logging
from fastapi import APIRouter, HTTPException
from ..models.api import ApiResponse, AnalyzeJobRequest
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
