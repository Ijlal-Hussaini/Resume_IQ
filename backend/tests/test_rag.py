import pytest
from app.services.extractor import resume_extractor
from app.core.vector_store import vector_store_manager
from app.services.rag_service import rag_chat_service


@pytest.mark.asyncio
async def test_rag_chunking_and_grounded_citations():
    text = """David Miller, Civil Engineer
Email: david.miller@engineers.org | Location: Denver, CO

Professional Experience:
Apex Structural Engineering - Senior Project Engineer (2019 - Present)
* Directed $14M bridge rehabilitation project over Colorado River, finishing 3 weeks ahead of schedule.
* Performed finite element structural analysis using AutoCAD and SAP2000.
* Managed on-site OSHA safety compliance for 45 construction tradesmen with zero lost-time incidents.

Education:
B.S. in Civil Engineering - Colorado School of Mines (2019)
"""
    resume_data = await resume_extractor.extract_resume(text)
    session_id = "test_rag_session_civil"
    vector_store_manager.index_resume(session_id, resume_data, text)

    citations = vector_store_manager.retrieve_citations(session_id, "bridge rehabilitation Colorado River", top_k=2)
    assert len(citations) >= 1
    assert "Apex Structural Engineering" in citations[0].section_name or "bridge" in citations[0].exact_text.lower()

    # Test Grounded RAG Chat
    response = await rag_chat_service.answer_query(
        query="What large-scale infrastructure projects has David managed?",
        session_id=session_id,
        resume_data=resume_data
    )
    assert len(response.answer) > 20
    assert len(response.citations) >= 1
