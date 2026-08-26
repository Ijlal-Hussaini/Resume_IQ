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
        <GlassCard className="p-6 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--card-title)]">Demonstrated Qualifications</h3>
                <p className="text-xs text-[var(--card-subtitle)]">Found in resume and matched with target JD</p>
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
                  className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--glass-border)] flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--card-title)]">{item.skill_name}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.evidence_or_notes}</p>
                    </div>
                  </div>
                  <Badge variant="emerald" size="sm">
                    Verified
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic">No direct keyword matches detected.</p>
            )}
          </div>
        </GlassCard>

        {/* Missing Critical Skills */}
        <GlassCard className="p-6 border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-500">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--card-title)]">Missing Critical Requirements</h3>
                <p className="text-xs text-[var(--card-subtitle)]">Mandatory criteria absent or weakly evidenced</p>
              </div>
            </div>
            <Badge variant="rose" size="sm">
              {gapAnalysis.missing_critical_skills.length} Critical Gaps
            </Badge>
          </div>

          <div className="space-y-2.5">
            {gapAnalysis.missing_critical_skills.length > 0 ? (
              gapAnalysis.missing_critical_skills.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--glass-border)] flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--card-title)]">{item.skill_name}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.evidence_or_notes}</p>
                    </div>
                  </div>
                  <Badge variant="rose" size="sm">
                    Required
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ No critical core requirements missing!</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Secondary Missing & Upskilling Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Secondary Preferred Gaps */}
        <GlassCard className="p-5 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 font-outfit">
              Preferred / Secondary Gaps ({gapAnalysis.missing_secondary_skills.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {gapAnalysis.missing_secondary_skills.length > 0 ? (
              gapAnalysis.missing_secondary_skills.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[var(--pill-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-secondary)]"
                >
                  {item.skill_name}
                </span>
              ))
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic">No secondary gaps noted.</p>
            )}
          </div>
        </GlassCard>

        {/* Actionable Upskilling Roadmap */}
        <GlassCard className="p-5 border-violet-500/20 bg-violet-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-violet-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 font-outfit">
              Actionable Bridge Recommendations
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            {gapAnalysis.bridge_recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>

        </GlassCard>
      </div>
    </div>
  );
};
