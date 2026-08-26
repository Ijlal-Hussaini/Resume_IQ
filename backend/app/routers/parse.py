import uuid
import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from ..services.parser import document_parser
from ..services.extractor import resume_extractor
from ..core.vector_store import vector_store_manager
from ..models.api import ApiResponse, ParseResumeResponse
from ..models.resume import ResumeData
from ..core.config import settings

router = APIRouter(prefix="/parse", tags=["Resume Parsing"])
logger = logging.getLogger("resumeiq.routers.parse")


@router.post("", response_model=ApiResponse)
async def parse_resume_file(
    file: UploadFile = File(...),
    session_id: str = Form(None)
):
    """
    Ingests a Resume (PDF, DOCX, TXT, or Image), parses layout text,
    executes structured field-agnostic extraction via LLM, and indexes into the RAG vector store.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file has no filename")

    # Validate file extension first (fail fast before reading content)
    file_ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if file_ext not in [e.lower() for e in settings.ALLOWED_EXTENSIONS]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file_ext}'. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Validate file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum size of {settings.MAX_FILE_SIZE_MB}MB."
        )

    # 1. Parse document text
    try:
        raw_text, file_type = document_parser.parse_file(file.filename, content)
    except Exception as e:
        logger.error(f"Error parsing file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(e)}")

    if not raw_text or len(raw_text.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from document. Please ensure the document is not an empty or password-protected file."
        )

    # 2. Extract structured data
    try:
        resume_data = await resume_extractor.extract_resume(raw_text)
    except Exception as e:
        logger.error(f"Error extracting resume: {e}")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

    # 3. Create session & index for RAG
    sid = session_id or str(uuid.uuid4())
    vector_store_manager.index_resume(sid, resume_data, raw_text)

    response_data = ParseResumeResponse(
        session_id=sid,
        filename=file.filename,
        file_type=file_type,
        character_count=len(raw_text),
        resume_data=resume_data
    )

    return ApiResponse(
        success=True,
        message="Resume successfully parsed and indexed into RAG store.",
        data=response_data.model_dump()
    )


@router.post("/raw-text", response_model=ApiResponse)
async def parse_raw_text(
    payload: dict
):
    """Parses raw text directly without file upload."""
    raw_text = payload.get("text", "")
    session_id = payload.get("session_id") or str(uuid.uuid4())
    
    if not raw_text or len(raw_text.strip()) < 15:
        raise HTTPException(status_code=400, detail="Text is too short to parse.")

    resume_data = await resume_extractor.extract_resume(raw_text)
    vector_store_manager.index_resume(session_id, resume_data, raw_text)

    response_data = ParseResumeResponse(
        session_id=session_id,
        filename="manual_input.txt",
        file_type="raw_text",
        character_count=len(raw_text),
        resume_data=resume_data
    )

    return ApiResponse(
        success=True,
        message="Text successfully parsed.",
        data=response_data.model_dump()
    )
