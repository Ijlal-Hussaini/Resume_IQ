"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Sparkles, Database, FileCheck, Layers, GitCompare, ShieldCheck, PenTool, ArrowRight } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { PipelineExecutionLog } from "@/lib/types";

interface PipelineVisualizerProps {
  isRunning: boolean;
  completedLogs?: PipelineExecutionLog[];
}

interface StepInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const PIPELINE_STEPS: StepInfo[] = [
  {
    id: "extraction",
    name: "Structured Extraction Node",
    description: "LLM parses text into typed Pydantic entities across arbitrary domains",
    icon: <Database className="w-4 h-4" />,
  },
  {
    id: "validation",
    name: "Data Validation & Sanity Node",
    description: "Validates contact integrity, chronological dates, and bullet density",
    icon: <FileCheck className="w-4 h-4" />,
  },
  {
    id: "jd_analysis",
    name: "JD Criteria Decomposition Node",
    description: "Deconstructs target JD into must-have competencies and industry depth",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: "matching",
    name: "RAG Semantic Matcher Node",
    description: "Retrieves evidence chunks from vector store & computes dimension scores",
    icon: <GitCompare className="w-4 h-4" />,
  },
  {
    id: "gap_analysis",
    name: "Skill & Competency Gap Node",
    description: "Identifies critical vs secondary missing requirements and bridge actions",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: "ats_critique",
    name: "ATS Compliance Auditor Node",
    description: "Audits formatting parseability, active power verbs, and quantified metrics",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    id: "suggestions",
    name: "XYZ Bullet Rewrite & Insight Node",
    description: "Synthesizes Google XYZ / STAR rewrites, executive brief, and interview prep",
    icon: <PenTool className="w-4 h-4" />,
  },
];

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  isRunning,
  completedLogs,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) {
      setActiveStepIndex(PIPELINE_STEPS.length);
      return;
    }

    setActiveStepIndex(0);
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 650);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <GlassCard className="p-6 border-violet-500/30 bg-[#0c0e1a]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-outfit">
              LangGraph Multi-Step Agent Execution
            </h2>
            <Badge variant="violet" size="sm">
              7 Stateful Graph Nodes
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time state machine orchestration: routing context across distinct agentic evaluation nodes.
          </p>
        </div>

        {isRunning && (
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-300 bg-violet-500/15 border border-violet-500/30 px-3 py-1.5 rounded-full animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
            Executing StateGraph...
          </div>
        )}
      </div>

      {/* Steps List / Flow */}
      <div className="space-y-3">
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = isRunning ? idx < activeStepIndex : true;
          const isCurrent = isRunning && idx === activeStepIndex;
          const isPending = isRunning && idx > activeStepIndex;

          const log = completedLogs && completedLogs[idx];

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? "bg-violet-950/40 border-violet-500/60 shadow-[0_0_25px_rgba(139,92,246,0.25)] scale-[1.01]"
                  : isDone
                  ? "bg-white/[0.03] border-white/[0.08]"
                  : "bg-white/[0.01] border-white/[0.04] opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isCurrent
                        ? "bg-violet-600 text-white shadow-lg animate-pulse"
                        : isDone
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      step.icon
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {idx + 1}. {step.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          Active Node
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {log ? log.message : step.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {log && log.duration_sec ? (
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded">
                      {log.duration_sec}s
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[10px] font-mono text-violet-400 animate-pulse">
                      Processing...
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
