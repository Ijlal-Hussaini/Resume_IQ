import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .core.config import settings
from .routers import parse, analyze, chat, export, health

# Configure Logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("resumeiq")

app = FastAPI(
    title="ResumeIQ API",
    description="""
    Production-grade AI Career Intelligence System powered by LangGraph, RAG with grounded citations,
    and multi-provider LLM orchestration (Groq & Gemini).
    
    ### Key Endpoints:
    * `/parse` - Ingest & extract structured resume entities from PDF, DOCX, TXT, OCR
    * `/analyze` - Run 7-node LangGraph Career Intelligence workflow against Job Descriptions
    * `/chat` - Grounded RAG conversational Q&A with section citations
    * `/export` - Download structured JSON, Markdown, and formatted HTML reports
    * `/health` - Service status and LangGraph architecture diagrams
    """,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local development and Vercel preview environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected internal server error occurred.",
            "error": str(exc)
        }
    )

# Include Routers
app.include_router(health.router)
app.include_router(parse.router)
app.include_router(analyze.router)
app.include_router(chat.router)
app.include_router(export.router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs",
        "description": "ResumeIQ Agentic AI Career Intelligence API"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
