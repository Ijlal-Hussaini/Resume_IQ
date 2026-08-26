import logging
from fastapi import APIRouter, HTTPException
from ..models.api import ApiResponse
from ..models.chat import ChatRequest, ChatResponse
from ..services.rag_service import rag_chat_service
from ..core.vector_store import vector_store_manager
from ..services.extractor import resume_extractor

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

    # If raw resume text is provided but no vector store exists, index it on the fly
    resume_data = None
    if request.resume_raw_text:
        store = vector_store_manager.get_or_create(session_id)
        if not store.chunks:
            resume_data = await resume_extractor.extract_resume(request.resume_raw_text)
            vector_store_manager.index_resume(session_id, resume_data, request.resume_raw_text)

    try:
        response: ChatResponse = await rag_chat_service.answer_query(
            query=request.query,
            session_id=session_id,
            resume_data=resume_data,
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
