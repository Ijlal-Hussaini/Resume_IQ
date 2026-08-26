"use client";

import React from "react";
import { Sparkles, Bot, Code2, FileText, RefreshCw, Cpu, Layers } from "lucide-react";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";
import { HealthInfo } from "@/lib/types";

interface HeaderProps {
  healthInfo?: HealthInfo | null;
  onReset?: () => void;
  hasActiveSession?: boolean;
  onOpenArchitecture?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  healthInfo,
  onReset,
  hasActiveSession,
  onOpenArchitecture,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07080d]/80 backdrop-blur-2xl px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer" onClick={onReset}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0d0f1a] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#07080d] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-outfit">
                Resume<span className="text-gradient-accent font-extrabold">IQ</span>
              </h1>
              <Badge variant="violet" size="sm">
                v1.0 Agentic
              </Badge>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Career Intelligence & Field-Agnostic CV Parser
            </p>
          </div>
        </div>

        {/* Status Indicators & Navigation Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Provider Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">LLM Core:</span>
            <span className="text-slate-200 font-medium truncate max-w-[140px]">
              {healthInfo?.active_llm_provider || "Groq Llama-3.3-70b"}
            </span>
          </div>

          {/* Architecture Graph Modal Trigger */}
          {onOpenArchitecture && (
            <GlassButton
              variant="ghost"
              size="sm"
              icon={<Layers className="w-4 h-4 text-violet-400" />}
              onClick={onOpenArchitecture}
              className="hidden lg:inline-flex"
            >
              Graph Architecture
            </GlassButton>
          )}

          {/* API Documentation */}
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <GlassButton
              variant="ghost"
              size="sm"
              icon={<FileText className="w-4 h-4 text-slate-400" />}
            >
              API Docs
            </GlassButton>
          </a>

          {/* Reset / New Session */}
          {hasActiveSession && onReset && (
            <GlassButton
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5 text-slate-300" />}
              onClick={onReset}
            >
              New Analysis
            </GlassButton>
          )}

          {/* GitHub Source Code */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <GlassButton
              variant="ghost"
              size="sm"
              icon={<Code2 className="w-4 h-4 text-slate-300" />}
            >
              <span className="hidden sm:inline">GitHub</span>

            </GlassButton>
          </a>
        </div>
      </div>
    </header>
  );
};
