"use client";

import React, { useState } from "react";
import { Download, FileJson, FileText, Code2, Check, X, Sparkles } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";
import { ResumeData, ResumeAnalysisResult } from "@/lib/types";
import { ApiService } from "@/lib/api";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  analysisResult: ResumeAnalysisResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  analysisResult,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async (format: "json" | "markdown" | "html", filename: string) => {
    setDownloadingFormat(format);
    try {
      const blob = await ApiService.exportReport(format, resumeData, analysisResult);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const candidateName = resumeData.contact_info.full_name?.replace(/\s+/g, "_") || "Candidate";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-lg">
        <GlassCard className="p-6 border-violet-500/30 bg-[#0d0f1a] shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-outfit">
                  Export Career Intelligence Report
                </h3>
                <p className="text-xs text-slate-400">Download formatted findings & structured data</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Export Options */}
          <div className="space-y-3 mb-6">
            {/* JSON Export */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileJson className="w-5 h-5 text-violet-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Structured JSON Dataset</h4>
                  <p className="text-[11px] text-slate-400">Complete raw schema with scores, AST, and logs</p>
                </div>
              </div>
              <GlassButton
                variant="secondary"
                size="sm"
                loading={downloadingFormat === "json"}
                onClick={() => handleDownload("json", `resumeiq_${candidateName}.json`)}
              >
                .JSON
              </GlassButton>
            </div>

            {/* Markdown Export */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Markdown Intelligence Report</h4>
                  <p className="text-[11px] text-slate-400">Ideal for Notion, GitHub, and email briefings</p>
                </div>
              </div>
              <GlassButton
                variant="secondary"
                size="sm"
                loading={downloadingFormat === "markdown"}
                onClick={() => handleDownload("markdown", `resumeiq_${candidateName}.md`)}
              >
                .MD
              </GlassButton>
            </div>

            {/* Styled HTML Report */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Formatted Web / PDF Report</h4>
                  <p className="text-[11px] text-slate-400">Standalone styled HTML with gauges and before/after diffs</p>
                </div>
              </div>
              <GlassButton
                variant="emerald"
                size="sm"
                loading={downloadingFormat === "html"}
                onClick={() => handleDownload("html", `resumeiq_${candidateName}.html`)}
              >
                .HTML
              </GlassButton>
            </div>
          </div>

          <div className="flex justify-end">
            <GlassButton variant="ghost" size="md" onClick={onClose}>
              Close
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
