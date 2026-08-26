"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { SkillGapAnalysis } from "@/lib/types";

interface SkillGapMatrixProps {
  gapAnalysis: SkillGapAnalysis;
}

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({ gapAnalysis }) => {
  return (
    <div className="space-y-6">
      {/* 2-Column Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Capabilities */}
        <GlassCard className="p-6 border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Demonstrated Qualifications</h3>
                <p className="text-xs text-slate-400">Found in resume and matched with target JD</p>
              </div>
            </div>
            <Badge variant="emerald" size="sm">
              {gapAnalysis.matched_skills.length} Matched
            </Badge>
          </div>

          <div className="space-y-2.5">
            {gapAnalysis.matched_skills.length > 0 ? (
              gapAnalysis.matched_skills.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">{item.skill_name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.evidence_or_notes}</p>
                    </div>
                  </div>
                  <Badge variant="emerald" size="sm">
                    Verified
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No direct keyword matches detected.</p>
            )}
          </div>
        </GlassCard>

        {/* Missing Critical Skills */}
        <GlassCard className="p-6 border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Critical Missing Competencies</h3>
                <p className="text-xs text-slate-400">Mandatory criteria missing in resume text</p>
              </div>
            </div>
            <Badge variant="rose" size="sm">
              {gapAnalysis.missing_critical_skills.length} Critical
            </Badge>
          </div>

          <div className="space-y-2.5">
            {gapAnalysis.missing_critical_skills.length > 0 ? (
              gapAnalysis.missing_critical_skills.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-rose-200">{item.skill_name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.evidence_or_notes}</p>
                    </div>
                  </div>
                  <Badge variant="rose" size="sm">
                    Must-Have
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All core must-have requirements are satisfied!
              </p>
            )}

            {/* Secondary Gaps */}
            {gapAnalysis.missing_secondary_skills.length > 0 && (
              <div className="pt-3 mt-3 border-t border-white/[0.06]">
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Secondary / Preferred Gaps
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {gapAnalysis.missing_secondary_skills.map((item, i) => (
                    <Badge key={i} variant="amber" size="sm">
                      {item.skill_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Strategic Bridge Recommendations */}
      {gapAnalysis.bridge_recommendations.length > 0 && (
        <GlassCard className="p-5 border-violet-500/20 bg-gradient-to-r from-violet-950/20 via-purple-950/10 to-slate-900/30">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-outfit">
              Agentic Bridge Recommendations
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {gapAnalysis.bridge_recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 leading-relaxed flex items-start gap-2"
              >
                <span className="font-mono font-bold text-violet-400 shrink-0">#{idx + 1}</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
