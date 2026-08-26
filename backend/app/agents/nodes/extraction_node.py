import time
import logging
from ..state import AgentState
from ...services.extractor import resume_extractor
from ...core.vector_store import vector_store_manager

logger = logging.getLogger("resumeiq.nodes.extraction")


async def extraction_node(state: AgentState) -> AgentState:
    """LangGraph Node 1: Extracts structured ResumeData and indexes chunks for RAG."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    try:
        resume_data = state.get("resume_data")
        raw_text = state.get("raw_text", "")

        if not resume_data:
            resume_data = await resume_extractor.extract_resume(raw_text)

        # Index into vector store for grounded RAG matching and chat
        session_id = state.get("session_id", "default_session")
        vector_store_manager.index_resume(session_id, resume_data, raw_text)

        elapsed = round(time.time() - start_time, 2)
        logs.append({
            "node": "Structured Extraction",
            "status": "success",
            "duration_sec": elapsed,
            "message": f"Successfully extracted {len(resume_data.all_skills_flat)} skills across {len(resume_data.work_experience)} positions in domain: {resume_data.domain_industry}"
        })

        return {
            **state,
            "resume_data": resume_data,
            "execution_logs": logs
        }
    except Exception as e:
        logger.error(f"Extraction node failed: {e}")
        logs.append({
            "node": "Structured Extraction",
            "status": "error",
            "duration_sec": round(time.time() - start_time, 2),
            "message": str(e)
        })
        return {
            **state,
            "error": f"Extraction failed: {str(e)}",
            "execution_logs": logs
        }
