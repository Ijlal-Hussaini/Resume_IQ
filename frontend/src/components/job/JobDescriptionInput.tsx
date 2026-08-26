"use client";

import React, { useState } from "react";
import { Briefcase, Play, Sparkles, Building2, AlignLeft, Wand2, Loader2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";
import { JobDescriptionInput } from "@/lib/types";
import { ApiService } from "@/lib/api";

interface JobDescriptionInputComponentProps {
  jobDescription: JobDescriptionInput;
  onChange: (updated: JobDescriptionInput) => void;
  onRunAnalysis: () => void;
  isLoading: boolean;
  canRun: boolean;
}

export const JobDescriptionInputComponent: React.FC<JobDescriptionInputComponentProps> = ({
  jobDescription,
  onChange,
  onRunAnalysis,
  isLoading,
  canRun,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const handleAutoGenerateJD = async () => {
    const title = jobDescription.job_title?.trim();
    if (!title) {
      setGenError("Please enter a Target Job Title first to auto-generate requirements.");
      return;
    }

    setGenError(null);
    setIsGenerating(true);

    try {
      const res = await ApiService.generateJobDescription(
        title,
        jobDescription.company_name || undefined
      );
      onChange({
        ...jobDescription,
        raw_text: res.raw_text,
      });
    } catch (err: any) {
      setGenError(err.message || "Failed to auto-draft job criteria.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--glass-border)] pb-4 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-[var(--card-title)] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-500" />
            Target Job Description & Role Criteria
          </h2>
          <p className="text-xs text-[var(--card-subtitle)] mt-0.5">
            Input target role requirements for deep LangGraph semantic matching & gap critique.
          </p>
        </div>
        <Badge variant="cyan" size="sm">
          RAG-Powered Matching
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Title & Company Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Target Job Title *
              </span>
            </label>
            <input
              type="text"
              value={jobDescription.job_title || ""}
              onChange={(e) =>
                onChange({ ...jobDescription, job_title: e.target.value })
              }
              placeholder="e.g. Senior AI Engineer, Full-Stack Developer, or Clinical Lead"
              className="glass-input w-full px-3.5 py-2 text-xs sm:text-sm font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Company / Institution (Optional)
            </label>
            <input
              type="text"
              value={jobDescription.company_name || ""}
              onChange={(e) =>
                onChange({ ...jobDescription, company_name: e.target.value })
              }
              placeholder="e.g. Systems Limited, Jazz, 10Pearls, Arbisoft, or AKUH"
              className="glass-input w-full px-3.5 py-2 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Auto-Draft Criteria Magic Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-violet-500/10 border border-violet-500/25">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <p className="text-xs text-[var(--text-secondary)]">
              Have a job title in mind? Let AI automatically synthesize realistic requirements & qualifications.
            </p>
          </div>

          <GlassButton
            variant="secondary"
            size="sm"
            onClick={handleAutoGenerateJD}
            loading={isGenerating}
            disabled={isGenerating || !jobDescription.job_title?.trim()}
            icon={<Wand2 className="w-3.5 h-3.5 text-violet-400" />}
            className="shrink-0 text-xs py-1.5"
          >
            Auto-Draft Criteria
          </GlassButton>
        </div>

        {genError && (
          <p className="text-xs text-rose-500">{genError}</p>
        )}

        {/* Job Description Textarea */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Job Description Text & Requirements
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              {jobDescription.raw_text.length} chars
            </span>
          </label>
          <textarea
            value={jobDescription.raw_text}
            onChange={(e) =>
              onChange({ ...jobDescription, raw_text: e.target.value })
            }
            placeholder="Paste complete job description, required qualifications, years of experience, methodologies, and responsibilities (or click 'Auto-Draft Criteria' above)..."
            rows={8}
            className="glass-input w-full p-4 text-xs sm:text-sm leading-relaxed font-sans resize-y"
          />
        </div>

        {/* Action Trigger Row */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--glass-border)]">
          <p className="text-[11px] text-[var(--text-muted)]">
            {canRun
              ? "✓ Ready to launch multi-agent LangGraph analysis."
              : "⚠️ Enter a job title or paste the job description to run analysis."}
          </p>

          <GlassButton
            variant="primary"
            size="lg"
            onClick={onRunAnalysis}
            loading={isLoading}
            disabled={!canRun}
            icon={<Play className="w-4 h-4 fill-white text-white" />}
            className="w-full sm:w-auto shadow-[0_4px_25px_rgba(139,92,246,0.4)]"
          >
            Launch LangGraph Agent Pipeline
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  );
};
