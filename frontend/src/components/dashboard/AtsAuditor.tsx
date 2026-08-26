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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/[0.08] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white font-outfit">
                  ATS Readability & Parseability Audit
                </h3>
                <Badge variant={atsReport.ats_score >= 80 ? "emerald" : "amber"} size="sm">
                  {atsReport.ats_score >= 80 ? "ATS Optimized" : "Optimization Recommended"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                {atsReport.overall_readability}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] min-w-[130px]">
            <span className="text-3xl font-extrabold text-cyan-400 font-outfit">
              {atsReport.ats_score}<span className="text-xs text-slate-400">/100</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
              ATS Score
            </span>
          </div>
        </div>

        {/* Detailed Checks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {atsReport.checks.map((check, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    <h4 className="text-xs font-bold text-white">{check.title}</h4>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{check.detail}</p>
              </div>

              <div className="pt-2 border-t border-white/[0.04] flex items-start gap-1.5 text-[11px] text-violet-300">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong className="text-slate-300">Action:</strong> {check.fix_action}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Top ATS Improvements Checklist */}
      {atsReport.top_ats_improvements.length > 0 && (
        <GlassCard className="p-5 border-cyan-500/20 bg-cyan-950/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-outfit mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Top ATS Machine-Parsing Recommendations
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {atsReport.top_ats_improvements.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono">▸</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
};
