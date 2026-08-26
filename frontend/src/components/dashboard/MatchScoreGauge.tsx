"use client";

import React, { useEffect, useState } from "react";
import { Award, Zap, BookOpen, Briefcase, Compass } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { MatchDimensionScores } from "@/lib/types";

interface MatchScoreGaugeProps {
  scores: MatchDimensionScores;
}

export const MatchScoreGauge: React.FC<MatchScoreGaugeProps> = ({ scores }) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  useEffect(() => {
    let current = 0;
    const target = scores.overall_score;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [scores.overall_score]);

  // SVG circular gauge math
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getVerdictBadgeVariant = (score: number) => {
    if (score >= 85) return "emerald";
    if (score >= 70) return "cyan";
    if (score >= 50) return "amber";
    return "rose";
  };

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-between border-b border-[var(--glass-border)] pb-6 mb-6">
        {/* Animated Circular Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0 animate-pulse-glow">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-200 dark:text-white/[0.06]"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Foreground Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="url(#gauge-gradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Score Display */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[var(--card-title)] font-outfit tracking-tight">
                {animatedScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                Overall Match
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-bold text-[var(--card-title)] font-outfit">
                Job Alignment Verdict
              </h3>
              <Badge variant={getVerdictBadgeVariant(scores.overall_score)} size="sm">
                {scores.verdict}
              </Badge>
            </div>
            <p className="text-xs text-[var(--card-subtitle)] max-w-sm leading-relaxed">
              Composite index weighted across direct skill overlap, seniority tenure, domain terminology depth, and educational credentials.
            </p>
          </div>
        </div>

        {/* Quick Highlights Pill */}
        <div className="hidden lg:flex flex-col items-end gap-1 text-right">
          <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">RAG-Evaluated</span>
          <span className="text-[11px] text-[var(--text-muted)]">Grounded against Target JD</span>
        </div>
      </div>

      {/* Sub-Dimension Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Skills Match */}
        <div className="glass-card-subtle p-3.5 bg-[var(--pill-bg)] border border-[var(--glass-border)]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
              <Zap className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              Skills Match
            </span>
            <span className="font-mono font-bold text-violet-700 dark:text-violet-300">{scores.skills_match_score}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-400 transition-all duration-1000"
              style={{ width: `${scores.skills_match_score}%` }}
            />
          </div>
        </div>

        {/* Experience Match */}
        <div className="glass-card-subtle p-3.5 bg-[var(--pill-bg)] border border-[var(--glass-border)]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Seniority & Scope
            </span>
            <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">{scores.experience_match_score}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-teal-400 transition-all duration-1000"
              style={{ width: `${scores.experience_match_score}%` }}
            />
          </div>
        </div>

        {/* Domain Depth */}
        <div className="glass-card-subtle p-3.5 bg-[var(--pill-bg)] border border-[var(--glass-border)]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Domain Terminology
            </span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{scores.domain_depth_score}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-1000"
              style={{ width: `${scores.domain_depth_score}%` }}
            />
          </div>
        </div>

        {/* Education & Credentials */}
        <div className="glass-card-subtle p-3.5 bg-[var(--pill-bg)] border border-[var(--glass-border)]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Education & Licensure
            </span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{scores.education_cert_score}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-1000"
              style={{ width: `${scores.education_cert_score}%` }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
