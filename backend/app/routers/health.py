import logging
from fastapi import APIRouter
from ..core.config import settings
from ..core.llm import llm_service
from ..agents.graph import pipeline_runner
from ..models.api import ApiResponse, HealthResponse

router = APIRouter(prefix="/health", tags=["Health & Architecture"])
logger = logging.getLogger("resumeiq.routers.health")


@router.get("", response_model=ApiResponse)
async def get_health_status():
    """Returns application health, active LLM provider, and subsystem readiness."""
    health_data = HealthResponse(
        status="operational",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        active_llm_provider=llm_service.active_provider_name,
        available_providers=llm_service.available_providers,
        embeddings_ready=True
    )
    return ApiResponse(
        success=True,
        message="ResumeIQ backend services are healthy.",
        data=health_data.model_dump()
    )


@router.get("/graph", response_model=ApiResponse)
async def get_langgraph_mermaid():
    """Returns the Mermaid diagram source code of the LangGraph agent workflow."""
    mermaid_code = pipeline_runner.get_mermaid_diagram()
    return ApiResponse(
        success=True,
        message="LangGraph architecture definition retrieved.",
        data={"mermaid": mermaid_code}
    )
