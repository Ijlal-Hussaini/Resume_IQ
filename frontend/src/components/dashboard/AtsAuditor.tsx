"use client";

import React from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, ArrowUpRight, Cpu } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { ATSReport } from "@/lib/types";

interface AtsAuditorProps {
  atsReport: ATSReport;
}

export const AtsAuditor: React.FC<AtsAuditorProps> = ({ atsReport }) => {
  const getStatusIcon = (status: "pass" | "warning" | "fail") => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
    }
  };

  const getStatusBadge = (status: "pass" | "warning" | "fail") => {
    switch (status) {
      case "pass":
        return <Badge variant="emerald" size="sm">Pass</Badge>;
      case "warning":
        return <Badge variant="amber" size="sm">Warning</Badge>;
      case "fail":
        return <Badge variant="rose" size="sm">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ATS Header & Score */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[var(--glass-border)] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 border border-[var(--glass-border)] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-cyan-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-[var(--card-title)] font-outfit">
                  ATS Readability & Parseability Audit
                </h3>
                <Badge variant={atsReport.ats_score >= 80 ? "emerald" : "amber"} size="sm">
                  {atsReport.ats_score >= 80 ? "ATS Optimized" : "Optimization Recommended"}
                </Badge>
              </div>
              <p className="text-xs text-[var(--card-subtitle)] max-w-lg leading-relaxed">
                {atsReport.overall_readability}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--pill-bg)] border border-[var(--glass-border)] min-w-[130px]">
            <span className="text-3xl font-extrabold text-cyan-500 font-outfit">
              {atsReport.ats_score}<span className="text-xs text-[var(--text-muted)]">/100</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mt-0.5">
              ATS Score
            </span>
          </div>
        </div>

        {/* Detailed Checks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {atsReport.checks.map((check, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--glass-border)] hover:border-violet-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    <h4 className="text-xs font-bold text-[var(--card-title)]">{check.title}</h4>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-2 leading-relaxed">{check.detail}</p>
              </div>

              <div className="pt-2 border-t border-[var(--glass-border)] flex items-start gap-1.5 text-[11px] text-violet-500">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong className="text-[var(--card-title)]">Action:</strong> {check.fix_action}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Top ATS Improvements Checklist */}
      {atsReport.top_ats_improvements.length > 0 && (
        <GlassCard className="p-5 border-cyan-500/20 bg-cyan-500/5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-outfit mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Top ATS Machine-Parsing Recommendations
          </h4>
          <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
            {atsReport.top_ats_improvements.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-500 font-mono">▸</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

    </div>
  );
};
