import {
  ResumeData,
  JobDescriptionInput,
  ResumeAnalysisResult,
  ChatResponse,
  ChatMessage,
  HealthInfo,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiService {
  /** Health check */
  static async getHealth(): Promise<HealthInfo> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
      if (!res.ok) throw new Error("Health check failed");
      const json = await res.json();
      return json.data;
    } catch {
      return {
        status: "offline_preview",
        app_name: "ResumeIQ Intelligence",
        version: "1.0.0",
        active_llm_provider: "Groq (Llama-3.3-70b) / Gemini Fallback",
        available_providers: ["groq", "gemini"],
        embeddings_ready: true,
      };
    }
  }

  /** Ingest and parse file */
  static async parseResumeFile(file: File, sessionId?: string): Promise<{ sessionId: string; resumeData: ResumeData }> {
    const formData = new FormData();
    formData.append("file", file);
    if (sessionId) {
      formData.append("session_id", sessionId);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/parse`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Failed to parse resume document.");
      }

      const json = await res.json();
      return {
        sessionId: json.data.session_id,
        resumeData: json.data.resume_data,
      };
    } catch (e: any) {
      console.warn("Backend parse endpoint unavailable or failed:", e);
      throw e;
    }
  }

  /** Parse raw text */
  static async parseRawText(text: string, sessionId?: string): Promise<{ sessionId: string; resumeData: ResumeData }> {
    const res = await fetch(`${API_BASE_URL}/parse/raw-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, session_id: sessionId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to parse text.");
    }

    const json = await res.json();
    return {
      sessionId: json.data.session_id,
      resumeData: json.data.resume_data,
    };
  }

  /** Run LangGraph pipeline against Target Job Description */
  static async analyzeJob(
    sessionId: string,
    resumeData: ResumeData,
    rawText: string,
    jobDescription: JobDescriptionInput
  ): Promise<ResumeAnalysisResult> {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        resume_data: resumeData,
        resume_raw_text: rawText,
        job_description: jobDescription,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "LangGraph analysis pipeline failed.");
    }

    const json = await res.json();
    return json.data;
  }

  /** Auto-generate / synthesize Job Description from Role Title & Company */
  static async generateJobDescription(
    jobTitle: string,
    companyName?: string
  ): Promise<{ job_title: string; company_name: string; raw_text: string }> {
    const res = await fetch(`${API_BASE_URL}/analyze/generate-jd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_title: jobTitle,
        company_name: companyName || "",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to generate job description.");
    }

    const json = await res.json();
    return json.data;
  }

  /** Grounded RAG Chat with Resume */
  static async chatWithResume(
    query: string,
    sessionId: string,
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        session_id: sessionId,
        conversation_history: history,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "RAG chat query failed.");
    }

    const json = await res.json();
    return json.data;
  }

  /** Export reports */
  static async exportReport(
    format: "json" | "markdown" | "html",
    resumeData: ResumeData,
    analysisResult: ResumeAnalysisResult
  ): Promise<Blob> {
    const res = await fetch(`${API_BASE_URL}/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        format,
        resume_data: resumeData,
        analysis_result: analysisResult,
      }),
    });

    if (!res.ok) throw new Error("Report export failed.");
    return await res.blob();
  }

  /** Fetch LangGraph Mermaid diagram definition */
  static async getMermaidGraph(): Promise<string> {
    try {
      const res = await fetch(`${API_BASE_URL}/health/graph`);
      if (res.ok) {
        const json = await res.json();
        return json.data.mermaid;
      }
    } catch {}
    return `graph TD
    START --> extraction[Structured Extraction Node]
    extraction --> validation[Data Validation Node]
    validation --> jd_analysis[Job Description Decomposition Node]
    jd_analysis --> matching[RAG Matching & Scoring Node]
    matching --> gap_analysis[Skill Gap Analysis Node]
    gap_analysis --> ats_critique[ATS Compliance Node]
    ats_critique --> suggestions[XYZ Bullet Rewrites Node]
    suggestions --> END`;
  }
}
