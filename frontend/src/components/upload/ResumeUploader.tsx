"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Cpu,
  HeartPulse,
  TrendingUp,
  ArrowRight,
  Loader2,
  Check,
  Zap,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";
import { SAMPLE_PROFILES, SampleProfile } from "@/lib/sample-data";
import { ResumeData } from "@/lib/types";

interface ResumeUploaderProps {
  onFileSelected: (file: File) => Promise<void>;
  onRawTextSubmitted: (text: string) => Promise<void>;
  onSampleProfileSelected: (sample: SampleProfile) => void;
  isLoading: boolean;
  selectedFile: File | null;
  parsedResume: ResumeData | null;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onFileSelected,
  onRawTextSubmitted,
  onSampleProfileSelected,
  isLoading,
  selectedFile,
  parsedResume,
}) => {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [dragOver, setDragOver] = useState(false);
  const [rawText, setRawText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragover" || e.type === "dragenter") {
      setDragOver(true);
    } else if (e.type === "dragleave") {
      setDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    setErrorMessage(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = async (file: File) => {
    const validExtensions = [".pdf", ".docx", ".doc", ".txt", ".png", ".jpg", ".jpeg"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      setErrorMessage(`Unsupported format (${fileExt}). Please upload PDF, DOCX, TXT, or Image.`);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("File exceeds 15MB limit. Please upload a smaller file.");
      return;
    }

    setIsUploadingFile(true);
    setUploadSuccess(false);
    setUploadProgress(15);
    setUploadStage("Uploading document...");

    // Simulated smooth progress interval
    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 45) {
          setUploadStage("Extracting structured candidate data...");
          return prev + 12;
        } else if (prev < 80) {
          setUploadStage("Parsing skills, experience, and education...");
          return prev + 8;
        } else if (prev < 95) {
          setUploadStage("Indexing section chunks into RAG memory...");
          return prev + 3;
        }
        return prev;
      });
    }, 180);

    try {
      await onFileSelected(file);
      clearInterval(progressTimer);
      setUploadProgress(100);
      setUploadStage("Upload & parsing complete!");
      setUploadSuccess(true);
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsUploadingFile(false);
      setUploadProgress(0);
      setErrorMessage(err.message || "Failed to process resume file.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!rawText.trim() || rawText.trim().length < 20) {
      setErrorMessage("Please paste at least 20 characters of resume text.");
      return;
    }
    setErrorMessage(null);
    try {
      await onRawTextSubmitted(rawText);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to parse text.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Multi-Domain Demo Personas */}
      <GlassCard className="border-violet-500/20 bg-gradient-to-r from-violet-950/20 via-purple-950/10 to-slate-900/40 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/30">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--card-title)]">Industry Benchmark Profiles</h3>
              <p className="text-xs text-[var(--card-subtitle)]">
                Explore field-agnostic evaluation across diverse professional sectors:
              </p>
            </div>
          </div>
          <Badge variant="cyan" size="sm">
            Quick Benchmarks
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onSampleProfileSelected(profile)}
              disabled={isLoading || isUploadingFile}
              className="glass-panel-interactive p-3.5 text-left flex flex-col justify-between group cursor-pointer border-white/[0.08] hover:border-violet-500/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={profile.id === "ai-engineer" ? "violet" : profile.id === "healthcare-nurse" ? "emerald" : "amber"} size="sm">
                    {profile.badge}
                  </Badge>
                  {profile.id === "ai-engineer" && <Cpu className="w-4 h-4 text-violet-400" />}
                  {profile.id === "healthcare-nurse" && <HeartPulse className="w-4 h-4 text-emerald-400" />}
                  {profile.id === "growth-marketer" && <TrendingUp className="w-4 h-4 text-amber-400" />}
                </div>
                <h4 className="text-sm font-semibold text-[var(--card-title)] group-hover:text-violet-400 transition-colors">
                  {profile.name}
                </h4>
                <p className="text-xs text-[var(--card-subtitle)] line-clamp-1 mt-0.5">{profile.role}</p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--glass-border)] text-[11px] text-[var(--text-muted)] group-hover:text-violet-400">
                <span>Load Profile + JD</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Main Upload Container */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-[var(--card-title)] flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              Ingest Candidate Resume
            </h2>
            <p className="text-xs text-[var(--card-subtitle)] mt-0.5">
              Upload any PDF, DOCX, TXT, or scan. Works across all professions.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[var(--pill-bg)] p-1 rounded-xl border border-[var(--glass-border)]">
            <button
              onClick={() => setActiveTab("file")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                activeTab === "file" ? "bg-violet-600 text-white shadow" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                activeTab === "text" ? "bg-violet-600 text-white shadow" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* File Dropzone Tab */}
        {activeTab === "file" ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
              className="hidden"
            />

            <div
              onDragOver={handleDrag}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isUploadingFile && fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-10 text-center flex flex-col items-center justify-center ${
                dragOver
                  ? "border-violet-400 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                  : isUploadingFile
                  ? "border-violet-500/50 bg-violet-950/10 cursor-wait"
                  : "border-[var(--glass-border)] bg-[var(--pill-bg)] hover:border-violet-500/40"
              }`}
            >
              {/* Uploading Progress View */}
              {isUploadingFile ? (
                <div className="w-full max-w-md py-4 space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] mb-2">
                      <span className="flex items-center gap-1.5 text-violet-400">
                        <Zap className="w-3.5 h-3.5 animate-pulse" />
                        {uploadStage}
                      </span>
                      <span className="font-mono text-sm font-bold text-violet-400">{uploadProgress}%</span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-3 rounded-full bg-[var(--input-bg)] overflow-hidden border border-[var(--glass-border)] p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)]">
                    Analyzing document structure, extracting career metrics, and indexing embeddings...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 border border-[var(--glass-border)] flex items-center justify-center mb-4 shadow-lg">
                    <UploadCloud className="w-8 h-8 text-violet-400 animate-bounce" />
                  </div>

                  <h3 className="text-base font-semibold text-[var(--card-title)] mb-1">
                    Drop your resume file here, or <span className="text-violet-500 underline font-bold">browse</span>
                  </h3>
                  <p className="text-xs text-[var(--card-subtitle)] max-w-sm mb-4">
                    Supports PDF, DOCX, TXT, or scanned images. Max file size 15MB.
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                    <span className="px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--glass-border)] font-mono">PDF</span>
                    <span className="px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--glass-border)] font-mono">DOCX</span>
                    <span className="px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--glass-border)] font-mono">TXT</span>
                    <span className="px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--glass-border)] font-mono">OCR Fallback</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw resume text here (Contact info, work experience bullets, skills, education)..."
              rows={8}
              className="glass-input w-full p-4 text-xs sm:text-sm font-mono leading-relaxed resize-y mb-3"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[var(--text-muted)]">
                {rawText.length} characters
              </span>
              <GlassButton
                variant="primary"
                size="md"
                onClick={handleTextSubmit}
                loading={isLoading}
                disabled={rawText.trim().length < 20}
              >
                Extract Structured Data
              </GlassButton>
            </div>
          </div>
        )}

        {/* Successful Ingestion & Profile Preview Card */}
        {parsedResume && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {parsedResume.contact_info.full_name || "Candidate Profile"}
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/30">
                    {parsedResume.domain_industry}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  <span className="font-semibold text-emerald-400">100% Ingested:</span> {parsedResume.work_experience?.length || 0} Work Roles • {parsedResume.all_skills_flat?.length || 0} Skills Extracted • {parsedResume.education?.length || 0} Degrees
                </p>
              </div>
            </div>

            <Badge variant="emerald" size="md">
              ✓ Ready for Analysis
            </Badge>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
