import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application Configuration Settings."""
    
    APP_NAME: str = "ResumeIQ Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server configuration
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "https://*.vercel.app",
        "*"
    ]
    
    # LLM Providers
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    GOOGLE_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    
    # Active LLM Provider preference: 'groq' | 'gemini' | 'auto'
    PREFERRED_PROVIDER: str = "auto"
    
    # Vector store & Embedding settings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    VECTOR_CHUNK_SIZE: int = 400
    VECTOR_CHUNK_OVERLAP: int = 80
    
    # File Limits
    MAX_FILE_SIZE_MB: int = 15
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".doc", ".txt", ".png", ".jpg", ".jpeg"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False
    )


settings = Settings()
