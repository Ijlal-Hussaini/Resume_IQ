"use client";

import React, { useState } from "react";
import {
  Gauge,
  Sparkles,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Download,
  Layers,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";
import { MatchScoreGauge } from "./MatchScoreGauge";
import { SkillGapMatrix } from "./SkillGapMatrix";
import { AtsAuditor } from "./AtsAuditor";
import { RewriteSuggestions } from "./RewriteSuggestions";
import { ExtractedResumeViewer } from "./ExtractedResumeViewer";
import { ResumeChatPanel } from "../chat/ResumeChatPanel";
import { ExportModal } from "../export/ExportModal";
import { ResumeData, ResumeAnalysisResult } from "@/lib/types";

interface ResultsDashboardProps {
  resumeData: ResumeData;
  analysisResult: ResumeAnalysisResult;
  sessionId: string;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  resumeData,
  analysisResult,
  sessionId,
}) => {
  const [activeTab, setActiveTab] = useState<
    "match" | "rewrites" | "ats" | "profile" | "chat"
  >("match");
  const [showExportModal, setShowExportModal] = useState(false);

  const candName = resumeData.contact_info.full_name || "Candidate";
  const scores = analysisResult.match_scores;
  const jd = analysisResult.job_breakdown;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Hero Banner */}
      <GlassCard className="p-6 border-violet-500/30 bg-gradient-to-r from-violet-950/30 via-slate-900/60 to-cyan-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Badge variant="violet" size="sm">
                Career Intelligence Matrix
              </Badge>
              <Badge variant="cyan" size="sm">
                {jd.inferred_industry}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-outfit">
              {candName}{" "}
              <span className="text-slate-400 font-normal">evaluated for</span>{" "}
              <span className="text-gradient-primary">{jd.inferred_title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Field-agnostic multi-agent synthesis • {scores.overall_score}% Match Alignment • ATS Score {analysisResult.ats_report.ats_score}/100
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <GlassButton
              variant="secondary"
              size="md"
              icon={<MessageSquare className="w-4 h-4 text-cyan-400" />}
              onClick={() => setActiveTab("chat")}
            >
              Chat with Resume
            </GlassButton>

            <GlassButton
              variant="primary"
              size="md"
              icon={<Download className="w-4 h-4" />}
              onClick={() => setShowExportModal(true)}
            >
              Export Report
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Main Tab Navigation */}
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/[0.08] overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab("match")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "match"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Gauge className="w-4 h-4" />
          Match Intelligence & Gaps
        </button>

        <button
          onClick={() => setActiveTab("rewrites")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "rewrites"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          XYZ Bullet Rewrites ({analysisResult.rewrite_suggestions.length})
        </button>

        <button
          onClick={() => setActiveTab("ats")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "ats"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          ATS Compliance Audit
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          Structured Extracted Data
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "chat"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          RAG Chat & Citations
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "match" && (
        <div className="space-y-6">
          <MatchScoreGauge scores={scores} />
          <SkillGapMatrix gapAnalysis={analysisResult.skill_gaps} />
        </div>
      )}

      {activeTab === "rewrites" && (
        <RewriteSuggestions
          suggestions={analysisResult.rewrite_suggestions}
          executiveSummary={analysisResult.executive_summary}
          strengths={analysisResult.strengths}
          weaknesses={analysisResult.weaknesses}
          interviewQuestions={analysisResult.interview_prep_questions}
        />
      )}

      {activeTab === "ats" && (
        <AtsAuditor atsReport={analysisResult.ats_report} />
      )}

      {activeTab === "profile" && (
        <ExtractedResumeViewer resumeData={resumeData} />
      )}

      {activeTab === "chat" && (
        <ResumeChatPanel
          sessionId={sessionId}
          candidateName={candName}
          domainIndustry={resumeData.domain_industry}
        />
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        resumeData={resumeData}
        analysisResult={analysisResult}
      />
    </div>
  );
};
