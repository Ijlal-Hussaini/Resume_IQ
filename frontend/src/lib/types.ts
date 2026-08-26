export interface ContactInfo {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio_website?: string | null;
  professional_title?: string | null;
}

export interface WorkExperience {
  job_title: string;
  company: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  description_bullets: string[];
  tools_and_methods?: string[];
  quantified_impact?: string[];
}

export interface Education {
  degree: string;
  field_of_study?: string | null;
  institution: string;
  location?: string | null;
  graduation_year?: string | null;
  gpa_or_honors?: string | null;
}

export interface SkillCategory {
  category_name: string;
  skills: string[];
}

export interface Project {
  title: string;
  description?: string | null;
  role?: string | null;
  tools_technologies: string[];
  url?: string | null;
}

export interface Certification {
  name: string;
  issuing_organization?: string | null;
  issue_date?: string | null;
  credential_id?: string | null;
}

export interface ResumeData {
  contact_info: ContactInfo;
  professional_summary?: string | null;
  domain_industry: string;
  estimated_years_experience?: number | null;
  work_experience: WorkExperience[];
  education: Education[];
  skill_categories: SkillCategory[];
  all_skills_flat: string[];
  projects: Project[];
  certifications: Certification[];
  languages: string[];
  raw_text?: string | null;
}

export interface JobDescriptionInput {
  job_title?: string | null;
  company_name?: string | null;
  raw_text: string;
}

export interface JobRequirementsDecomposed {
  inferred_title: string;
  inferred_industry: string;
  experience_level: string;
  must_have_skills: string[];
  nice_to_have_skills: string[];
  key_responsibilities: string[];
  cultural_and_soft_skills: string[];
}

export interface MatchDimensionScores {
  overall_score: number;
  skills_match_score: number;
  experience_match_score: number;
  domain_depth_score: number;
  education_cert_score: number;
  verdict: string;
}

export interface SkillMatchItem {
  skill_name: string;
  status: "matched" | "partial" | "missing";
  importance: "critical" | "important" | "bonus";
  evidence_or_notes: string;
}

export interface SkillGapAnalysis {
  matched_skills: SkillMatchItem[];
  missing_critical_skills: SkillMatchItem[];
  missing_secondary_skills: SkillMatchItem[];
  bridge_recommendations: string[];
}

export interface ATSCheckItem {
  category: string;
  status: "pass" | "warning" | "fail";
  title: string;
  detail: string;
  fix_action: string;
}

export interface ATSReport {
  ats_score: number;
  overall_readability: string;
  checks: ATSCheckItem[];
  top_ats_improvements: string[];
}

export interface RewriteSuggestion {
  section: string;
  original_bullet: string;
  rewritten_bullet: string;
  reasoning: string;
  framework_used: string;
  impact_level: "High" | "Medium";
}

export interface PipelineExecutionLog {
  node: string;
  status: "success" | "warning" | "error";
  duration_sec: number;
  message: string;
}

export interface ResumeAnalysisResult {
  session_id?: string | null;
  match_scores: MatchDimensionScores;
  job_breakdown: JobRequirementsDecomposed;
  skill_gaps: SkillGapAnalysis;
  ats_report: ATSReport;
  rewrite_suggestions: RewriteSuggestion[];
  executive_summary: string;
  strengths: string[];
  weaknesses: string[];
  interview_prep_questions: string[];
  pipeline_execution_logs: PipelineExecutionLog[];
}

export interface CitationSource {
  section_name: string;
  exact_text: string;
  bullet_index?: number | null;
  relevance_score: number;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: CitationSource[];
  suggested_followups?: string[];
}

export interface ChatResponse {
  answer: string;
  citations: CitationSource[];
  suggested_followups: string[];
  confidence_verdict: string;
}

export interface HealthInfo {
  status: string;
  app_name: string;
  version: string;
  active_llm_provider: string;
  available_providers: string[];
  embeddings_ready: boolean;
}
