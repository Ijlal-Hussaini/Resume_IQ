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
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer" onClick={onReset}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[var(--bg-surface)] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-base)] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[var(--card-title)] font-outfit">
                Resume<span className="text-gradient-accent font-extrabold">IQ</span>
              </h1>
              <Badge variant="violet" size="sm">
                Production AI
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] hidden sm:block">
              AI Career Intelligence & Field-Agnostic CV Parser
            </p>
          </div>
        </div>

        {/* Status Indicators & Navigation Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Provider Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-[var(--pill-bg)] border border-slate-300 dark:border-[var(--glass-border)] text-xs shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
            <span className="text-slate-800 dark:text-[var(--text-muted)] font-bold">LLM Core:</span>
            <span className="font-bold text-slate-950 dark:text-slate-100 truncate max-w-[140px]">
              {healthInfo?.active_llm_provider || "Groq (qwen/qwen3.8-27b)"}
            </span>
          </div>


          {/* Theme Toggle Button */}
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            icon={theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-700" />}
            title="Toggle Light/Dark Theme"
          >
            <span className="hidden sm:inline font-semibold text-slate-800 dark:text-slate-200">{theme === "dark" ? "Light" : "Dark"}</span>
          </GlassButton>

          {/* Architecture Graph Modal Trigger */}
          {onOpenArchitecture && (
            <GlassButton
              variant="ghost"
              size="sm"
              icon={<Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
              onClick={onOpenArchitecture}
              className="hidden lg:inline-flex text-slate-800 dark:text-slate-200 font-semibold"
            >
              Graph Architecture
            </GlassButton>
          )}

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

          {/* Source Code placeholder — add your repo URL here */}
        </div>
      </div>
    </header>
  );
};
