"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Code2, RefreshCw, Cpu, Layers, Sun, Moon } from "lucide-react";
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("resumeiq-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
      document.documentElement.classList.toggle("light", saved === "light");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("resumeiq-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-2xl px-4 sm:px-8 py-3.5 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="relative group cursor-pointer" onClick={onReset}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[var(--bg-surface)] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--bg-base)] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--card-title)] font-outfit">
                Resume<span className="text-gradient-accent font-extrabold">IQ</span>
              </h1>
              <span className="hidden sm:inline-flex">
                <Badge variant="violet" size="sm">
                  Production AI
                </Badge>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] hidden md:block">
              AI Career Intelligence & Field-Agnostic CV Parser
            </p>
          </div>
        </div>

        {/* Status Indicators & Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Provider Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-[var(--pill-bg)] border border-slate-300 dark:border-[var(--glass-border)] text-xs shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
            <span className="text-slate-800 dark:text-[var(--text-muted)] font-bold">LLM:</span>
            <span className="font-bold text-slate-950 dark:text-slate-100 truncate max-w-[130px]">
              {healthInfo?.active_llm_provider || "Groq (qwen)"}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[var(--glass-border)] bg-[var(--pill-bg)] hover:bg-slate-500/10 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer shrink-0"
            title="Toggle Light/Dark Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-700" />}
            <span className="hidden md:inline">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          {/* Architecture Graph Modal Trigger */}
          {onOpenArchitecture && (
            <button
              onClick={onOpenArchitecture}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[var(--glass-border)] bg-[var(--pill-bg)] hover:bg-slate-500/10 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer shrink-0"
              title="LangGraph Agent Architecture"
            >
              <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="hidden md:inline">Architecture</span>
            </button>
          )}

          {/* Reset / New Session */}
          {hasActiveSession && onReset && (
            <button
              onClick={onReset}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-violet-700 dark:text-violet-300 flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer shrink-0"
              title="Start New Analysis"
            >
              <RefreshCw className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
