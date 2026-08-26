from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field
from .resume import ResumeData
from .analysis import ResumeAnalysisResult, JobDescriptionInput


class ApiResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None
    error: Optional[str] = None


class ParseResumeResponse(BaseModel):
    session_id: str
    filename: str
    file_type: str
    character_count: int
    resume_data: ResumeData


class AnalyzeJobRequest(BaseModel):
    session_id: Optional[str] = None
    resume_data: Optional[ResumeData] = None
    resume_raw_text: Optional[str] = None
    job_description: JobDescriptionInput


class GenerateJDRequest(BaseModel):
    job_title: str
    company_name: Optional[str] = None



class ExportReportRequest(BaseModel):
    format: str = Field(default="json", description="'json' | 'pdf' | 'markdown'")
    resume_data: ResumeData
    analysis_result: ResumeAnalysisResult


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    active_llm_provider: str
    available_providers: List[str]
    embeddings_ready: bool
