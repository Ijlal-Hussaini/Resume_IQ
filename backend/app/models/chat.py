from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class CitationSource(BaseModel):
    section_name: str = Field(description="Resume section name, e.g., 'Work Experience: St. Jude Hospital'")
    exact_text: str = Field(description="Exact snippet extracted from resume that grounds this answer")
    bullet_index: Optional[int] = Field(default=None, description="Index of bullet or item if applicable")
    relevance_score: float = Field(default=0.9, ge=0.0, le=1.0, description="Similarity or grounding confidence")


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    citations: List[CitationSource] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)


class ChatRequest(BaseModel):
    query: str = Field(min_length=2, description="Natural language question about the candidate")
    session_id: Optional[str] = None
    resume_raw_text: Optional[str] = None
    conversation_history: List[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    answer: str
    citations: List[CitationSource] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)
    confidence_verdict: str = Field(default="Fully Grounded in Resume Text")
