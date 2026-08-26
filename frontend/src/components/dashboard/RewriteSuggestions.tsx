"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";
import { RewriteSuggestion } from "@/lib/types";

interface RewriteSuggestionsProps {
  suggestions: RewriteSuggestion[];
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  interviewQuestions: string[];
}

export const RewriteSuggestions: React.FC<RewriteSuggestionsProps> = ({
  suggestions,
  executiveSummary,
  strengths,
  weaknesses,
  interviewQuestions,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Briefing Callout */}
      <GlassCard className="p-6 border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-slate-900/5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <h3 className="text-base font-bold text-[var(--card-title)] font-outfit">
            Strategic Executive Briefing
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          {executiveSummary}
        </p>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-[var(--glass-border)]">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-outfit mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Core Competitive Strengths
            </h4>
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              {strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-outfit mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Perceived Vulnerabilities to Position
            </h4>
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              {weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500">⚠️</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Bullet-Level Rewrites Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-[var(--card-title)] font-outfit flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              Bullet-Level High-Impact Rewrites
            </h3>
            <p className="text-xs text-[var(--card-subtitle)]">
              Optimized via the Google XYZ Framework: Accomplished [X], as measured by [Y], by doing [Z].
            </p>
          </div>
          <Badge variant="violet" size="sm">
            {suggestions.length} High-Impact Rewrites
          </Badge>
        </div>

        {/* Rewrites Cards */}
        <div className="space-y-4">
          {suggestions.map((sug, idx) => (
            <GlassCard key={idx} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-300 font-mono">
                  {sug.section}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={sug.impact_level === "High" ? "violet" : "slate"} size="sm">
                    {sug.impact_level} Impact
                  </Badge>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    icon={copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    onClick={() => handleCopy(sug.rewritten_bullet, idx)}
                  >
                    {copiedIndex === idx ? "Copied!" : "Copy Bullet"}
                  </GlassButton>
                </div>
              </div>

              {/* Before / After Diff */}
              <div className="space-y-2.5">
                {/* Original */}
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                    Original Bullet:
                  </span>
                  <p className="text-[var(--text-secondary)] font-mono text-[11px] leading-relaxed">
                    {sug.original_bullet}
                  </p>
                </div>

                {/* AI Optimized */}
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                    ✨ AI-Optimized (XYZ Formula):
                  </span>
                  <p className="text-[var(--card-title)] font-medium leading-relaxed">
                    {sug.rewritten_bullet}
                  </p>
                </div>
              </div>

              {/* Reasoning */}
              <p className="text-[11px] text-[var(--card-subtitle)] mt-3 pt-2 border-t border-[var(--glass-border)] italic">
                <strong className="text-[var(--card-title)] not-italic">Recruiter Impact:</strong> {sug.reasoning}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Tailored Interview Preparation */}
      {interviewQuestions.length > 0 && (
        <GlassCard className="p-6 border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-cyan-500" />
            <h3 className="text-sm font-bold text-[var(--card-title)] font-outfit">
              Tailored Mock Interview Prep (Based on Candidate Gaps)
            </h3>
          </div>
          <p className="text-xs text-[var(--card-subtitle)] mb-4">
            Practice answering these tough behavioral and technical questions tailored to this role:
          </p>

          <div className="space-y-2.5">
            {interviewQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] flex items-start gap-3"
              >
                <span className="font-mono font-bold text-cyan-500 shrink-0">Q{idx + 1}.</span>
                <span className="leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
