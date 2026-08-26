import math
import logging
from typing import Dict, List, Optional, Tuple
from ..models.resume import ResumeData
from ..models.chat import CitationSource
from .embeddings import embedding_service

logger = logging.getLogger("resumeiq.vector_store")


class Chunk:
    def __init__(self, chunk_id: str, text: str, section_name: str, bullet_index: Optional[int] = None):
        self.chunk_id = chunk_id
        self.text = text
        self.section_name = section_name
        self.bullet_index = bullet_index
        self.embedding: List[float] = []


class SessionVectorStore:
    """Manages embedded chunks for a specific resume session."""

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.chunks: List[Chunk] = []

    def add_chunks(self, chunks: List[Chunk]):
        if not chunks:
            return
        texts = [c.text for c in chunks]
        embeddings = embedding_service.embed_documents(texts)
        for chunk, emb in zip(chunks, embeddings):
            chunk.embedding = emb
            self.chunks.append(chunk)
        logger.info(f"Indexed {len(chunks)} chunks for session {self.session_id}")

    def similarity_search(self, query: str, top_k: int = 4) -> List[Tuple[Chunk, float]]:
        if not self.chunks:
            return []
        query_emb = embedding_service.embed_query(query)
        scored = []
        for chunk in self.chunks:
            if not chunk.embedding:
                continue
            sim = self._cosine_similarity(query_emb, chunk.embedding)
            scored.append((chunk, sim))

        # Sort descending by similarity
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    @staticmethod
    def _cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        if len(vec_a) != len(vec_b) or not vec_a:
            return 0.0
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)


class VectorStoreManager:
    """Global vector store manager maintaining active sessions."""

    def __init__(self):
        self._stores: Dict[str, SessionVectorStore] = {}

    def get_or_create(self, session_id: str) -> SessionVectorStore:
        if session_id not in self._stores:
            self._stores[session_id] = SessionVectorStore(session_id)
        return self._stores[session_id]

    def index_resume(self, session_id: str, resume_data: ResumeData, raw_text: Optional[str] = None):
        """Builds granular chunks from structured resume data."""
        store = self.get_or_create(session_id)
        store.chunks.clear()  # Refresh session chunks

        chunks_to_add: List[Chunk] = []
        chunk_idx = 0

        # 1. Professional Summary
        if resume_data.professional_summary:
            chunk_idx += 1
            chunks_to_add.append(
                Chunk(
                    chunk_id=f"summary_{chunk_idx}",
                    text=f"Professional Summary: {resume_data.professional_summary}",
                    section_name="Professional Summary",
                )
            )

        # 2. Work Experiences & Individual Bullets
        for exp_idx, exp in enumerate(resume_data.work_experience, start=1):
            header = f"{exp.job_title} at {exp.company} ({exp.start_date or ''} - {exp.end_date or 'Present'})"
            if exp.location:
                header += f" | {exp.location}"

            # Overall role overview chunk
            chunk_idx += 1
            exp_overview = f"Experience: {header}. " + " ".join(exp.description_bullets[:2])
            chunks_to_add.append(
                Chunk(
                    chunk_id=f"exp_{exp_idx}_overview",
                    text=exp_overview,
                    section_name=f"Experience: {exp.job_title} at {exp.company}",
                )
            )

            # Granular bullet chunks for high-precision citations
            for b_idx, bullet in enumerate(exp.description_bullets, start=1):
                chunk_idx += 1
                chunks_to_add.append(
                    Chunk(
                        chunk_id=f"exp_{exp_idx}_bullet_{b_idx}",
                        text=f"{header}: {bullet}",
                        section_name=f"Experience: {exp.job_title} at {exp.company}",
                        bullet_index=b_idx,
                    )
                )

        # 3. Education
        for edu_idx, edu in enumerate(resume_data.education, start=1):
            chunk_idx += 1
            edu_text = f"Education: {edu.degree}"
            if edu.field_of_study:
                edu_text += f" in {edu.field_of_study}"
            edu_text += f", {edu.institution} ({edu.graduation_year or 'N/A'})"
            if edu.gpa_or_honors:
                edu_text += f" - Honors: {edu.gpa_or_honors}"
            chunks_to_add.append(
                Chunk(
                    chunk_id=f"edu_{edu_idx}",
                    text=edu_text,
                    section_name=f"Education: {edu.institution}",
                )
            )

        # 4. Skill Categories
        for cat_idx, cat in enumerate(resume_data.skill_categories, start=1):
            chunk_idx += 1
            cat_text = f"Skills ({cat.category_name}): {', '.join(cat.skills)}"
            chunks_to_add.append(
                Chunk(
                    chunk_id=f"skill_cat_{cat_idx}",
                    text=cat_text,
                    section_name=f"Skills: {cat.category_name}",
                )
            )

        # 5. Projects
        for proj_idx, proj in enumerate(resume_data.projects, start=1):
            chunk_idx += 1
            proj_text = f"Project: {proj.title} - {proj.description or ''}. Technologies/Tools: {', '.join(proj.tools_technologies)}"
            chunks_to_add.append(
                Chunk(
                    chunk_id=f"proj_{proj_idx}",
                    text=proj_text,
                    section_name=f"Project: {proj.title}",
                )
            )

        # 6. Certifications
        for cert_idx, cert in enumerate(resume_data.certifications, start=1):
            chunk_idx += 1
            cert_text = f"Certification: {cert.name} issued by {cert.issuing_organization or 'N/A'} ({cert.issue_date or ''})"
            chunks_to_add.append(
                Chunk(
                    chunk_id=f"cert_{cert_idx}",
                    text=cert_text,
                    section_name="Certifications & Licenses",
                )
            )

        # Fallback raw text chunking if structured data was minimal
        if len(chunks_to_add) < 2 and raw_text:
            lines = [l.strip() for l in raw_text.split("\n\n") if len(l.strip()) > 30]
            for i, line in enumerate(lines[:10]):
                chunks_to_add.append(
                    Chunk(
                        chunk_id=f"raw_{i}",
                        text=line,
                        section_name="Resume Content",
                    )
                )

        store.add_chunks(chunks_to_add)

    def retrieve_citations(self, session_id: str, query: str, top_k: int = 3) -> List[CitationSource]:
        store = self.get_or_create(session_id)
        matches = store.similarity_search(query, top_k=top_k)
        citations: List[CitationSource] = []
        for chunk, score in matches:
            if score > 0.01:  # Positive relevance threshold
                citations.append(
                    CitationSource(
                        section_name=chunk.section_name,
                        exact_text=chunk.text,
                        bullet_index=chunk.bullet_index,
                        relevance_score=round(max(0.2, min(0.99, float(score))), 3),
                    )
                )
        # Fallback to top chunks if query words had subtle semantic spread
        if not citations and store.chunks:
            for c in store.chunks[:2]:
                citations.append(
                    CitationSource(
                        section_name=c.section_name,
                        exact_text=c.text,
                        bullet_index=c.bullet_index,
                        relevance_score=0.75,
                    )
                )
        return citations



vector_store_manager = VectorStoreManager()
