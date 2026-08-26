"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Bot, Layers, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ResumeUploader } from "@/components/upload/ResumeUploader";
import { JobDescriptionInputComponent } from "@/components/job/JobDescriptionInput";
import { PipelineVisualizer } from "@/components/pipeline/PipelineVisualizer";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";
import { ArchitectureModal } from "@/components/layout/ArchitectureModal";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Badge } from "@/components/ui/Badge";
import { ApiService } from "@/lib/api";
import { SAMPLE_PROFILES, SampleProfile } from "@/lib/sample-data";
import {
  ResumeData,
  JobDescriptionInput,
  ResumeAnalysisResult,
  HealthInfo,
  PipelineExecutionLog,
} from "@/lib/types";

export default function Home() {
  // Session State
  const [sessionId, setSessionId] = useState<string>(() => `sess_${Date.now()}`);
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [showArchModal, setShowArchModal] = useState<boolean>(false);

  // Resume Data State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawResumeText, setRawResumeText] = useState<string>("");
  const [parsedResume, setParsedResume] = useState<ResumeData | null>(null);

  // Job Description State
  const [jobDescription, setJobDescription] = useState<JobDescriptionInput>({
    job_title: "",
    company_name: "",
    raw_text: "",
  });

  // Pipeline Execution State
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<PipelineExecutionLog[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);

  // Fetch Health on Mount
  useEffect(() => {
    ApiService.getHealth().then(setHealthInfo).catch(console.error);
  }, []);

  // 1-Click Preset Profile Handler
  const handleSelectSample = (sample: SampleProfile) => {
    setSelectedFile(null);
    setRawResumeText(sample.rawResumeText);
    setParsedResume(sample.resumeData);
    setJobDescription(sample.jobDescription);
    setAnalysisResult(null);
    setPipelineLogs([]);
  };

  // Upload File Handler
  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setIsExtracting(true);
    try {
      const result = await ApiService.parseResumeFile(file, sessionId);
      setSessionId(result.sessionId);
      setParsedResume(result.resumeData);
      setRawResumeText(result.resumeData.raw_text || "");
    } catch (err: any) {
      console.error("File upload error:", err);
      throw err;
    } finally {
      setIsExtracting(false);
    }
  };

  // Raw Text Submit Handler
  const handleRawTextSubmitted = async (text: string) => {
    setSelectedFile(null);
    setRawResumeText(text);
    setIsExtracting(true);
    try {
      const result = await ApiService.parseRawText(text, sessionId);
      setSessionId(result.sessionId);
      setParsedResume(result.resumeData);
    } catch (err: any) {
      console.error("Raw text extraction error:", err);
      throw err;
    } finally {
      setIsExtracting(false);
    }
  };

  // Run LangGraph Agent Pipeline Handler
  const handleRunAnalysis = async () => {
    if (!parsedResume) return;

    setIsAnalyzing(true);
    setPipelineLogs([]);

    let effectiveJD = { ...jobDescription };
    if (!effectiveJD.raw_text || effectiveJD.raw_text.trim().length < 15) {
      if (effectiveJD.job_title) {
        try {
          const genRes = await ApiService.generateJobDescription(
            effectiveJD.job_title,
            effectiveJD.company_name || undefined
          );
          effectiveJD.raw_text = genRes.raw_text;
          setJobDescription(effectiveJD);
        } catch {
          effectiveJD.raw_text = `Target Role: ${effectiveJD.job_title}${effectiveJD.company_name ? ` at ${effectiveJD.company_name}` : ""}\nSeeking candidates with expertise in ${effectiveJD.job_title} duties, technical execution, and industry competencies.`;
        }
      } else {
        effectiveJD.raw_text = "General professional role and core competency evaluation.";
      }
    }


    try {
      const result = await ApiService.analyzeJob(
        sessionId,
        parsedResume,
        rawResumeText,
        effectiveJD
      );


      // Trigger Confetti on high match score
      if (result.match_scores.overall_score >= 70) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#8b5cf6", "#06b6d4", "#10b981"],
          });
        } catch {}
      }

      setAnalysisResult(result);
      setPipelineLogs(result.pipeline_execution_logs || []);
    } catch (err: any) {
      console.error("LangGraph execution error:", err);
      alert("Pipeline Execution Notice: " + (err.message || "Execution error"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset Session
  const handleReset = () => {
    setSessionId(`sess_${Date.now()}`);
    setSelectedFile(null);
    setRawResumeText("");
    setParsedResume(null);
    setJobDescription({ job_title: "", company_name: "", raw_text: "" });
    setAnalysisResult(null);
    setPipelineLogs([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        healthInfo={healthInfo}
        onReset={handleReset}
        hasActiveSession={Boolean(parsedResume || analysisResult)}
        onOpenArchitecture={() => setShowArchModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Pitch (Only if no analysis result yet) */}
        {!analysisResult && (
          <div className="text-center space-y-4 max-w-3xl mx-auto py-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-violet-950 border border-violet-300 dark:bg-violet-500/10 dark:border-violet-500/25 dark:text-violet-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-700 dark:text-violet-400" />
              <span>Multi-Agent LangGraph Career Intelligence Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--card-title)] font-outfit leading-tight">
              Transform Any Resume Into{" "}
              <span className="text-gradient-accent">Grounded Intelligence</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Field-agnostic structured extraction, 7-node LangGraph job description matching,
              bullet-level Google XYZ rewrites, and zero-hallucination RAG chat with section citations.
            </p>


            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Badge variant="violet" size="sm" icon={<Zap className="w-3 h-3" />}>
                Groq & Gemini Dual-Core
              </Badge>
              <Badge variant="cyan" size="sm" icon={<Layers className="w-3 h-3" />}>
                7-Node StateGraph
              </Badge>
              <Badge variant="emerald" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                Field & Industry Agnostic
              </Badge>
              <Badge variant="amber" size="sm" icon={<Bot className="w-3 h-3" />}>
                Grounded Citations
              </Badge>
            </div>
          </div>
        )}

        {/* Ingestion & Job Input Layout (shown before analysis or as collapsible) */}
        {!analysisResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Step 1: Resume Ingest */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 font-mono">
                <span>Phase 01</span>
                <span>•</span>
                <span>Document Ingestion</span>
              </div>
              <ResumeUploader
                onFileSelected={handleFileSelected}
                onRawTextSubmitted={handleRawTextSubmitted}
                onSampleProfileSelected={handleSelectSample}
                isLoading={isExtracting}
                selectedFile={selectedFile}
                parsedResume={parsedResume}
              />
            </div>

            {/* Step 2: Target Job Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 font-mono">
                <span>Phase 02</span>
                <span>•</span>
                <span>Target Role & Criteria</span>
              </div>
              <JobDescriptionInputComponent
                jobDescription={jobDescription}
                onChange={setJobDescription}
                onRunAnalysis={handleRunAnalysis}
                isLoading={isAnalyzing}
                canRun={Boolean(parsedResume && (jobDescription.raw_text.trim().length >= 10 || (jobDescription.job_title && jobDescription.job_title.trim().length >= 2)))}

              />
            </div>
          </div>
        ) : null}

        {/* Live LangGraph Pipeline Execution Visualizer */}
        {isAnalyzing && (
          <div className="max-w-3xl mx-auto py-4">
            <PipelineVisualizer isRunning={isAnalyzing} completedLogs={pipelineLogs} />
          </div>
        )}

        {/* Completed Career Intelligence Results Dashboard */}
        {analysisResult && parsedResume && !isAnalyzing && (
          <ResultsDashboard
            resumeData={parsedResume}
            analysisResult={analysisResult}
            sessionId={sessionId}
            onNewAnalysis={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#05060a]/90 dark:bg-[#05060a]/90 light:bg-slate-50/90 backdrop-blur-2xl py-8 px-4 sm:px-8 mt-12 text-center text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white dark:text-white light:text-slate-900 font-outfit">ResumeIQ</span>
            <span>• AI Career Intelligence Platform © 2026. All rights reserved.</span>
          </div>


          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowArchModal(true)}
              className="hover:text-violet-300 transition-colors"
            >
              LangGraph Architecture
            </button>
            <span>•</span>
            <span className="text-slate-500 cursor-default">
              Enterprise Grade
            </span>
          </div>
        </div>
      </footer>

      {/* Architecture Modal */}
      <ArchitectureModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />
    </div>
  );
}
