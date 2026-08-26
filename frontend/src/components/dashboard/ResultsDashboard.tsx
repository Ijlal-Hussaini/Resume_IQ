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
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
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
  onNewAnalysis?: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  resumeData,
  analysisResult,
  sessionId,
  onNewAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<
    "match" | "rewrites" | "ats" | "profile" | "chat" | "pipeline"
  >("match");
  const [showExportModal, setShowExportModal] = useState(false);

  const candName = resumeData.contact_info.full_name || "Candidate";
  const scores = analysisResult.match_scores;
  const jd = analysisResult.job_breakdown;
  const logs = analysisResult.pipeline_execution_logs || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Hero Banner */}
      <GlassCard className="p-6 border-[var(--glass-border)] bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-cyan-500/10">
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

            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--card-title)] font-outfit">
              {candName}{" "}
              <span className="text-[var(--text-muted)] font-normal">evaluated for</span>{" "}
              <span className="text-gradient-primary">{jd.inferred_title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Field-agnostic multi-agent synthesis • {scores.overall_score}% Match Alignment • ATS Score {analysisResult.ats_report.ats_score}/100
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onNewAnalysis && (
              <GlassButton
                variant="ghost"
                size="md"
                icon={<ArrowLeft className="w-4 h-4 text-slate-400" />}
                onClick={onNewAnalysis}
              >
                New Analysis
              </GlassButton>
            )}

            <GlassButton
              variant="secondary"
              size="md"
              icon={<MessageSquare className="w-4 h-4 text-cyan-500" />}
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
      <div className="flex bg-[var(--pill-bg)] p-1.5 rounded-2xl border border-[var(--glass-border)] overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab("match")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "match"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
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
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          XYZ Bullet Rewrites ({analysisResult.rewrite_suggestions.length})
        </button>

        <button
          onClick={() => setActiveTab("ats")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "ats"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          ATS Compliance Audit
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-500" />
          Parsed Profile
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "chat"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-cyan-500" />
          RAG Chat & Citations
        </button>

        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "pipeline"
              ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
          }`}
        >
          <Activity className="w-4 h-4 text-violet-400" />
          Pipeline Logs ({logs.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "match" && (
        <div className="space-y-6 animate-fadeIn">
          <MatchScoreGauge scores={scores} />
          <SkillGapMatrix gapAnalysis={analysisResult.skill_gaps} />
        </div>
      )}

      {activeTab === "rewrites" && (
        <div className="animate-fadeIn">
          <RewriteSuggestions
            suggestions={analysisResult.rewrite_suggestions}
            executiveSummary={analysisResult.executive_summary}
            strengths={analysisResult.strengths}
            weaknesses={analysisResult.weaknesses}
            interviewQuestions={analysisResult.interview_prep_questions}
          />
        </div>
      )}

      {activeTab === "ats" && (
        <div className="animate-fadeIn">
          <AtsAuditor atsReport={analysisResult.ats_report} />
        </div>
      )}

      {activeTab === "profile" && (
        <div className="animate-fadeIn">
          <ExtractedResumeViewer resumeData={resumeData} />
        </div>
      )}

      {activeTab === "chat" && (
        <div className="animate-fadeIn">
          <ResumeChatPanel
            sessionId={sessionId}
            candidateName={candName}
            domainIndustry={resumeData.domain_industry}
          />
        </div>
      )}

      {activeTab === "pipeline" && (
        <div className="animate-fadeIn">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 border border-[var(--glass-border)] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--card-title)] font-outfit">
                    LangGraph Pipeline Execution Log
                  </h3>
                  <p className="text-xs text-[var(--card-subtitle)]">
                    Status and timing for each agentic node in the pipeline run.
                  </p>
                </div>
              </div>
              <Badge variant="violet" size="sm">
                {logs.length} Nodes Executed
              </Badge>
            </div>

            {logs.length > 0 ? (
              <div className="space-y-3 animate-stagger">
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    className="step-connector p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--glass-border)] hover:border-violet-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          log.status === "success"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : log.status === "warning"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}>
                          {log.status === "success" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : log.status === "warning" ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[var(--card-title)]">
                            {idx + 1}. {log.node}
                          </span>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                            {log.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            log.status === "success" ? "emerald" : log.status === "warning" ? "amber" : "rose"
                          }
                          size="sm"
                        >
                          {log.status}
                        </Badge>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--pill-bg)] px-2 py-1 rounded border border-[var(--glass-border)]">
                          {log.duration_sec}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic text-center py-8">
                No pipeline execution logs recorded for this session.
              </p>
            )}
          </GlassCard>
        </div>
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
