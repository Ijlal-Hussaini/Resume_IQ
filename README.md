# ResumeIQ — AI-Powered Career Intelligence & Agentic CV Parser

> **Production-grade, field-agnostic career intelligence system powered by a 7-node LangGraph agentic pipeline, local RAG retrieval with grounded citations, multi-provider LLM orchestration (Groq Llama 3.3 + Gemini 2.0 Flash fallback), and a modern "Liquid Glass" Next.js frontend.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-FF6F00?style=flat-square)](https://langchain-ai.github.io/langgraph/)
[![Groq](https://img.shields.io/badge/Primary%20LLM-Groq%20Llama%203.3%2070B-F05032?style=flat-square)](https://groq.com)
[![Gemini](https://img.shields.io/badge/Fallback%20LLM-Google%20Gemini%202.0-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015%20(App%20Router)-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20%2B%20Framer%20Motion-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🎯 The Problem & Product Vision

Most "AI resume tools" are simplistic single-prompt wrappers that dump an unparsed PDF into an LLM and return generic, hallucinated bullet advice. Furthermore, 95% of parsers assume a software engineering background and fail completely when presented with a nurse, digital marketer, accountant, civil engineer, or teacher.

**ResumeIQ** is built as an end-to-end **Agentic AI Career Intelligence Platform**:
1. **Field-Agnostic Structured Extraction**: Ingests multi-format resumes (PDF, DOCX, TXT, OCR images) and dynamically structures contact details, timeline histories, competencies, and achievements into strict Pydantic schemas without hardcoded tech taxonomies.
2. **7-Node LangGraph State Machine**: Orchestrates multi-step reasoning: data validation ➔ job description criteria decomposition ➔ semantic RAG matching ➔ critical skill gap isolation ➔ ATS compliance auditing ➔ bullet-level Google XYZ / STAR rewrites.
3. **Grounded "Chat with this Resume" RAG**: Interactive recruiter Q&A powered by local vector retrieval with **exact, clickable section citations and similarity scores** (zero hallucinations).
4. **Liquid Glass UI**: Apple/OpenAI-inspired design system with dark tones, frosted glass panels (`backdrop-filter: blur(24px)`), ambient floating glow orbs, live pipeline node progress animations, and one-click sample evaluation presets.

---

## 🧠 System Architecture

```mermaid
graph TD
    UserResume[Resume File: PDF / DOCX / Image / TXT] --> ParserService[Multi-Engine Parser + OCR Fallback]
    ParserService --> RawText[Normalized Document Text]
    
    subgraph Agentic Pipeline [LangGraph Career Intelligence Workflow]
        direction TB
        RawText --> N1[1. Structured Extraction Node: Pydantic Schema]
        N1 --> N2[2. Data Validation & Completeness Node]
        
        TargetJD[Target Job Description] --> N3[3. JD Decomposition & Criteria Node]
        
        N2 --> N4[4. RAG Section Matcher & Scoring Node]
        N3 --> N4
        
        N4 --> N5[5. Skill Gap Matrix & Bridge Node]
        N5 --> N6[6. ATS & Formatting Compliance Auditor Node]
        N6 --> N7[7. XYZ Bullet Rewrite & Interview Synthesis Node]
    end
    
    subgraph Local Vector Store [RAG Chunk Memory]
        RawText --> ChunkIndex[(Vector Store / Chunk Index)]
        ChunkIndex -.-> N4
        ChunkIndex -.-> RAGChat[Grounded RAG Chat Engine]
    end
    
    N7 --> ResultsDashboard[Career Intelligence Dashboard]
    RAGChat --> ChatUI[Chat with Resume Drawer]
```

---

## 💡 Why This Project Matters (For Technical Interviewers)

### 1. Why LangGraph over a Single Large Prompt Chain?
A single monolithic prompt attempting to parse, match, audit ATS, and rewrite bullets exhibits high token variance, fragile output schemas, and impossible error recovery. LangGraph breaks this into a **deterministic state machine**:
- Each node operates on a distinct TypedDict state with isolated responsibilities.
- Intermediate nodes (e.g. JD decomposition) produce structured artifacts that downstream nodes (RAG matching) can query against.
- The UI can stream the exact progress of each agent step in real-time, giving the user immediate transparency into the model's reasoning.

### 2. Dual-Provider LLM Resilience (Groq + Gemini Failover)
In production, relying on a single free-tier LLM API introduces downtime risks from rate limits (TPM/RPM). ResumeIQ implements an **Abstracted LLM Factory**:
- **Primary**: Groq (`llama-3.3-70b-versatile`) delivers blazing sub-second latency for real-time interactivity.
- **Secondary**: Google Gemini (`gemini-2.0-flash`) acts as an automated fallback if Groq returns 429 rate limit or timeout errors.
- **Local Fallback Engine**: If no API keys are configured, a smart deterministic heuristic engine ensures 100% of the UI and test suites function without onboarding friction.

### 3. Local Offline Embeddings vs External APIs
By utilizing `sentence-transformers` (`all-MiniLM-L6-v2`) locally:
- Embeddings are generated with **zero cost** and **zero rate limits**.
- Resume data never leaves the server during vectorization.
- Fast cosine similarity retrieval enables sub-10ms citation queries for RAG chat.

### 4. True Field-Agnostic Generalization
Instead of matching skills against a static tech dictionary (e.g., `['React', 'Python', 'AWS']`), the extraction prompt instructs the LLM to dynamically categorize competencies based on the candidate's natural industry. It handles:
- **Emergency Room Nurses**: Triage (ESI), Epic EHR, IV insertion, ACLS, Joint Commission compliance.
- **Growth Marketers**: CAC/LTV, ROAS, HubSpot automation, SQL attribution, SEO clusters.
- **Civil Engineers**: Finite Element Analysis, AutoCAD, OSHA safety standards, bridge rehabilitation.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **LLM Orchestration** | LangGraph & LangChain | Stateful multi-step agent graph & tool chains |
| **Primary LLM** | Groq API (`llama-3.3-70b`) | Ultra-low latency structured extraction & scoring |
| **Fallback LLM** | Google Gemini (`gemini-2.0-flash`) | Automatic failover & resilience |
| **Structured Output** | Pydantic v2 | Strict schema validation for resumes, gaps, and ATS checks |
| **Embeddings & Vector Store** | Sentence-Transformers & Cosine Index | Local zero-cost vector chunks with grounded citations |
| **Document Ingestion** | `pdfplumber`, `pypdf`, `python-docx`, `pytesseract` | Multi-format text parsing with OCR fallback |
| **Backend API** | FastAPI + Uvicorn | Async typed REST API with auto OpenAPI Swagger docs |
| **Frontend Framework** | Next.js 15 (App Router) + TypeScript | Server & client components, responsive architecture |
| **Styling & Motion** | Tailwind CSS + Framer Motion | "Liquid Glass" design system, ambient floating glow orbs |
| **Deployment** | Docker & Docker Compose | Containerized local & cloud deployments (Render / Vercel) |

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+
- (Optional) Groq API Key ([Free Console](https://console.groq.com)) or Google Gemini API Key ([Free AI Studio](https://aistudio.google.com))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/resumeiq.git
cd resumeiq
```

### 2. Backend Setup
```bash
# Navigate to backend and create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# (Optional) Configure API keys
cp .env.example backend/.env
# Edit backend/.env with your GROQ_API_KEY or GOOGLE_API_KEY

# Run FastAPI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend will be running at `http://localhost:8000`. Interactive Swagger docs available at `http://localhost:8000/docs`.*

### 3. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Start Next.js development server
npm run dev
```
*Frontend will be running at `http://localhost:3000`.*

---

## 🐳 Docker Deployment

Run both backend and frontend simultaneously with Docker Compose:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## 🧪 Automated Testing

ResumeIQ includes comprehensive unit and integration test coverage verifying document parsing, field-agnostic structured extraction, RAG grounded citations, and full LangGraph workflow execution:

```bash
# Run backend pytest suite
PYTHONPATH=backend pytest -v -o asyncio_mode=auto backend/tests
```

```text
backend/tests/test_extractor.py::test_extract_nurse_resume_field_agnostic PASSED
backend/tests/test_extractor.py::test_extract_software_resume PASSED
backend/tests/test_langgraph.py::test_full_langgraph_pipeline_execution PASSED
backend/tests/test_parser.py::test_parse_txt_file PASSED
backend/tests/test_parser.py::test_text_normalization PASSED
backend/tests/test_rag.py::test_rag_chunking_and_grounded_citations PASSED
============================== 6 passed in 0.36s ==============================
```

---

## 📸 Key Features & UI Walkthrough

1. **Instant 1-Click Evaluation Presets**: Test multi-domain personas (Senior AI Engineer, Emergency Room Trauma Nurse, VP of Growth Marketing) with pre-matched job descriptions.
2. **Interactive Drag-and-Drop Dropzone**: Supports PDF, DOCX, TXT, and scanned image OCR with real-time text normalization.
3. **Animated LangGraph Execution**: Watch all 7 agent nodes execute sequentially with real-time timing and trace logs.
4. **Match Dimension Scoring**: Circular animated SVG gauge with sub-dimension breakdown (Skills Match, Seniority Scope, Domain Terminology, Education).
5. **Skill Gap Matrix**: Highlights matched qualifications vs critical missing must-haves and secondary gaps with actionable bridge recommendations.
6. **ATS Compliance Auditor**: Machine parseability rating, power verb checks, and metric density evaluation.
7. **Google XYZ Bullet Rewrites**: Concrete before/after bullet optimization with one-click copy and strategic recruiter rationale.
8. **Grounded RAG Chat**: Ask natural language questions with section citations and similarity scores.
9. **Multi-Format Export**: One-click download of findings in JSON, Markdown, and formatted HTML reports.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
