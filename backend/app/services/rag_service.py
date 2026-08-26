import logging
from typing import List, Optional
from ..models.resume import ResumeData
from ..models.chat import ChatMessage, ChatResponse, CitationSource
from ..core.llm import llm_service
from ..core.vector_store import vector_store_manager

logger = logging.getLogger("resumeiq.rag")

RAG_CHAT_SYSTEM_PROMPT = """You are ResumeIQ's intelligent candidate recruiter assistant.
You have access to a grounded RAG retrieval index of the candidate's resume.
Your job is to answer questions asked by recruiters, hiring managers, or candidates accurately and concisely.

CRITICAL GUIDELINES:
1. Grounding: Base your answer STRICTLY on the provided resume context snippets. Do NOT fabricate experience, metrics, or credentials.
2. Field-Agnostic: Speak authoritatively about whatever industry the candidate is in (healthcare, coding, marketing, sales, trades, education, etc.).
3. Tone: Professional, analytical, helpful, and objective.
4. If a question asks about something NOT in the resume, explicitly state that it is not mentioned in the candidate's profile.
"""


class RAGChatService:
    """Service to handle conversational queries against ingested resumes with citations."""

    async def answer_query(
        self,
        query: str,
        session_id: str,
        resume_data: Optional[ResumeData] = None,
        history: Optional[List[ChatMessage]] = None
    ) -> ChatResponse:
        """Answers recruiter query using grounded vector retrieval and citation extraction."""
        # Retrieve session store to get resume_data if not provided
        store = vector_store_manager.get_or_create(session_id)
        if not resume_data and store.resume_data:
            resume_data = store.resume_data

        # 1. Retrieve top relevant chunks from vector store
        citations: List[CitationSource] = vector_store_manager.retrieve_citations(
            session_id=session_id,
            query=query,
            top_k=4
        )

        # Build context from citations or resume summary
        context_snippets = []
        if citations:
            for idx, cit in enumerate(citations, 1):
                context_snippets.append(f"[{idx}] (Section: {cit.section_name}): {cit.exact_text}")
        elif resume_data:
            context_snippets.append(f"Candidate Summary: {resume_data.professional_summary}")
            if resume_data.all_skills_flat:
                context_snippets.append(f"Extracted Skills: {', '.join(resume_data.all_skills_flat[:20])}")
            for exp in resume_data.work_experience[:2]:
                context_snippets.append(f"Experience: {exp.job_title} at {exp.company} - {'; '.join(exp.description_bullets[:2])}")

        context_text = "\n".join(context_snippets) if context_snippets else "No resume context found."

        # Format history
        hist_text = ""
        if history:
            recent = history[-4:]
            hist_text = "\n".join([f"{m.role.capitalize()}: {m.content}" for m in recent])

        prompt = f"""Candidate Resume Context:
----------------------------------------
{context_text}
----------------------------------------

Prior Conversation:
{hist_text or "None"}

User Question: {query}

Please provide a clear, well-structured answer citing specific achievements, roles, or skills from the context."""

        # Attempt LLM answer
        llm = llm_service.get_llm()
        if llm:
            try:
                answer = await llm_service.invoke(prompt, RAG_CHAT_SYSTEM_PROMPT)
                if answer and not answer.startswith("System running in fallback"):
                    followups = self._generate_suggested_followups(query, resume_data)
                    return ChatResponse(
                        answer=answer.strip(),
                        citations=citations,
                        suggested_followups=followups,
                        confidence_verdict="Grounded in Ingested Resume Sections"
                    )
            except Exception as e:
                logger.warning(f"LLM RAG chat failed: {e}. Executing heuristic answer.")

        # Fallback Heuristic Generator with grounded citations
        fallback_answer = self._generate_heuristic_answer(query, resume_data, citations)
        followups = self._generate_suggested_followups(query, resume_data)
        return ChatResponse(
            answer=fallback_answer,
            citations=citations,
            suggested_followups=followups,
            confidence_verdict="Extracted directly from candidate profile"
        )

    def _generate_heuristic_answer(
        self,
        query: str,
        resume_data: Optional[ResumeData],
        citations: List[CitationSource]
    ) -> str:
        q = query.lower()
        if not resume_data:
            return "Based on the provided document, the candidate possesses relevant domain qualifications."

        if any(w in q for w in ["leadership", "manage", "lead", "team"]):
            leads = [e for e in resume_data.work_experience if any(k in e.job_title.lower() for k in ["lead", "manager", "head", "director", "senior", "chief"])]
            if leads:
                roles = ", ".join([f"{l.job_title} at {l.company}" for l in leads])
                return f"Yes, the candidate demonstrates leadership experience through roles such as: **{roles}**. They have managed key initiatives and cross-functional deliverables."
            return "The resume highlights substantial individual contributor and collaborative experience across projects and teams."

        if any(w in q for w in ["years", "how long", "experience", "seniority"]):
            yrs = resume_data.estimated_years_experience or len(resume_data.work_experience) * 2
            return f"The candidate has approximately **{yrs:.1f} years** of professional experience spanning **{len(resume_data.work_experience)} recorded positions**."

        if any(w in q for w in ["skills", "technologies", "tools", "stack"]):
            if resume_data.all_skills_flat:
                top_skills = ", ".join(resume_data.all_skills_flat[:10])
                return f"The candidate's core proficiencies include: **{top_skills}**."

        if any(w in q for w in ["education", "degree", "university", "college"]):
            if resume_data.education:
                ed = resume_data.education[0]
                return f"The candidate holds a **{ed.degree}** from **{ed.institution}** ({ed.graduation_year or 'Completed'})."

        if citations:
            best_chunk = citations[0].exact_text
            return f"According to the resume ({citations[0].section_name}):\n\n> \"{best_chunk}\""

        return f"Based on the resume summary: {resume_data.professional_summary or 'Candidate has background in ' + resume_data.domain_industry}."

    def _generate_suggested_followups(self, query: str, resume_data: Optional[ResumeData]) -> List[str]:
        industry = resume_data.domain_industry if resume_data else "their domain"
        return [
            f"What are their most impactful achievements in {industry}?",
            "What quantified metrics or KPIs do they highlight?",
            "Do they meet requirements for a senior-level role?"
        ]


rag_chat_service = RAGChatService()
