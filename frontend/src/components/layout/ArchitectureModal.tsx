"use client";

import React from "react";
import { Layers, X, Cpu, GitBranch, Database, ShieldCheck } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl">
        <GlassCard className="p-6 border-violet-500/30 bg-[#0d0f1a] shadow-[0_25px_60px_rgba(0,0,0,0.8)] max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-outfit">
                  LangGraph Agentic Architecture & RAG Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Stateful multi-node graph reasoning, local embeddings, and provider abstraction
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Architecture Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-300 mb-1">
                <GitBranch className="w-4 h-4" />
                LangGraph State Machine
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                7 distinct execution nodes with typed Pydantic state transitions: Extraction ➔ Validation ➔ Decomposition ➔ RAG Matching ➔ Gap Analysis ➔ ATS Audit ➔ XYZ Rewrites.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
                <Database className="w-4 h-4" />
                Local Vector RAG & Citations
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sentence-Transformers embeddings with granular section chunking, cosine retrieval, and grounded citation mapping with zero hallucination.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                <Cpu className="w-4 h-4" />
                Multi-Provider LLM Abstraction
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Groq (Llama-3.3-70b) as sub-second primary provider with Google Gemini 2.0 Flash automatic failover and deterministic local fallback.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                <ShieldCheck className="w-4 h-4" />
                Field-Agnostic Extraction
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                No hardcoded tech taxonomies. Dynamically parses clinical skills, marketing KPIs, legal statutes, or engineering tolerances with equal precision.
              </p>
            </div>
          </div>

          {/* Graph Diagram Codeblock */}
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Compiled StateGraph Flow:
            </h4>
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="text-violet-300">
{`START
  │
  ▼
[ 1. Structured Extraction Node ]  (Pydantic ResumeData Schema)
  │
  ▼
[ 2. Data Validation Node ]        (Sanity & Timeline Verification)
  │
  ▼
[ 3. JD Decomposition Node ]       (Criteria, Depth & Must-Haves)
  │
  ▼
[ 4. RAG Matching Node ]           (Cosine Similarity & Dimension Scoring)
  │
  ▼
[ 5. Skill Gap Analysis Node ]     (Critical vs Secondary Matrix)
  │
  ▼
[ 6. ATS Compliance Auditor Node ] (Metrics Density & Power Verbs)
  │
  ▼
[ 7. XYZ Rewrites & Insights Node] (STAR Bullet Rewrites & Interview Prep)
  │
  ▼
END`}
              </pre>
            </div>
          </div>

          <div className="flex justify-end">
            <GlassButton variant="primary" size="md" onClick={onClose}>
              Got It
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
