"use client";

import React from "react";
import { Briefcase, Play, Sparkles, Building2, AlignLeft } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";
import { JobDescriptionInput } from "@/lib/types";

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
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Target Job Description & Role Criteria
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste target role requirements for deep LangGraph semantic matching & gap critique.
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
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Target Job Title (Optional)
            </label>
            <input
              type="text"
              value={jobDescription.job_title || ""}
              onChange={(e) =>
                onChange({ ...jobDescription, job_title: e.target.value })
              }
              placeholder="e.g. Lead Nurse Practitioner or Staff AI Architect"
              className="glass-input w-full px-3.5 py-2 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Company / Institution (Optional)
            </label>
            <input
              type="text"
              value={jobDescription.company_name || ""}
              onChange={(e) =>
                onChange({ ...jobDescription, company_name: e.target.value })
              }
              placeholder="e.g. St. Jude Children's or Anthropic"
              className="glass-input w-full px-3.5 py-2 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Job Description Textarea */}
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Job Description Text & Requirements *
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {jobDescription.raw_text.length} chars
            </span>
          </label>
          <textarea
            value={jobDescription.raw_text}
            onChange={(e) =>
              onChange({ ...jobDescription, raw_text: e.target.value })
            }
            placeholder="Paste complete job description, required qualifications, years of experience, methodologies, and responsibilities..."
            rows={8}
            className="glass-input w-full p-4 text-xs sm:text-sm leading-relaxed font-sans resize-y"
          />
        </div>

        {/* Action Trigger Row */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
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
