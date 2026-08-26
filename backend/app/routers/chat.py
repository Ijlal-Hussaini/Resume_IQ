import logging
from fastapi import APIRouter, HTTPException
from ..models.api import ApiResponse
from ..models.chat import ChatRequest, ChatResponse
from ..services.rag_service import rag_chat_service

router = APIRouter(prefix="/chat", tags=["RAG Resume Chat"])
logger = logging.getLogger("resumeiq.routers.chat")


@router.post("", response_model=ApiResponse)
async def chat_with_resume(request: ChatRequest):
    """
    RAG Conversational Assistant:
    Answers natural language queries about the candidate grounded directly in resume sections
    and returns exact citation sources with snippets and confidence scores.
    """
    if not request.query or len(request.query.strip()) < 2:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    session_id = request.session_id or "session_default"

    try:
        response: ChatResponse = await rag_chat_service.answer_query(
            query=request.query,
            session_id=session_id,
            history=request.conversation_history
        )

        return ApiResponse(
            success=True,
            message="Answer retrieved with grounded citations.",
            data=response.model_dump()
        )
    except Exception as e:
        logger.error(f"Error in RAG chat: {e}")
        raise HTTPException(status_code=500, detail=f"RAG chat failed: {str(e)}")
