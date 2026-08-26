"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Sparkles, BookOpen, Quote, ShieldCheck, ChevronRight, CornerDownLeft } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { Badge } from "../ui/Badge";
import { ChatMessage, CitationSource } from "@/lib/types";
import { ApiService } from "@/lib/api";

interface ResumeChatPanelProps {
  sessionId: string;
  candidateName?: string;
  domainIndustry?: string;
}

export const ResumeChatPanel: React.FC<ResumeChatPanelProps> = ({
  sessionId,
  candidateName = "Candidate",
  domainIndustry = "their domain",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hello! I have indexed **${candidateName}'s** complete resume into a local vector store. Ask me any question about their work experience, key metrics, technical competencies, or leadership scope. All answers include grounded citations back to specific resume sections.`,
      suggested_followups: [
        "What is their strongest area of expertise?",
        "Do they have demonstrated leadership experience?",
        "What quantified metrics or KPIs do they highlight?"
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<CitationSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await ApiService.chatWithResume(text, sessionId, messages);
      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        citations: response.citations,
        suggested_followups: response.suggested_followups,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Apologies, I encountered an issue retrieving grounded context from the vector store. Please ensure the resume is parsed.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultPrompts = [
    `What is their strongest qualification in ${domainIndustry}?`,
    "What scale, team size, or revenue have they managed?",
    "Summarize their most recent job responsibilities",
    "Are there any gaps in their documented experience?"
  ];

  return (
    <GlassCard className="p-6 flex flex-col h-[700px] border-violet-500/25 shadow-2xl relative">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px]">
            <div className="w-full h-full bg-[#0d0f1a] rounded-2xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
              Chat with this Resume
              <Badge variant="cyan" size="sm">
                RAG Citations
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Grounded Question & Answer directly backed by vector index chunks.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Hallucination Mode</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-start gap-2.5 max-w-[88%]">
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white rounded-br-none shadow-md"
                    : "bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--glass-border)] rounded-bl-none shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans space-y-1.5 leading-relaxed">
                  {msg.content.split("\n").map((line, lIdx) => {
                    const trimmed = line.trim();
                    const isQuote = trimmed.startsWith(">");
                    const cleanLine = isQuote ? line.replace(/^>\s*/, "").replace(/^"/, "").replace(/"$/, "") : line;
                    return (
                      <p
                        key={lIdx}
                        className={isQuote ? "pl-3 py-1 border-l-2 border-cyan-500/50 bg-cyan-500/5 rounded-r-lg text-[var(--text-secondary)] my-1.5" : ""}
                      >
                        {cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, pIdx) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={pIdx} className="font-bold text-[var(--card-title)]">{part.slice(2, -2)}</strong>;
                          }
                          if (part.startsWith("*") && part.endsWith("*")) {
                            return <em key={pIdx}>{part.slice(1, -1)}</em>;
                          }
                          return <span key={pIdx}>{part}</span>;
                        })}
                      </p>
                    );
                  })}
                </div>

                {/* Grounded Citation Chips */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-[var(--glass-border)]">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider flex items-center gap-1 mb-1.5">
                      <BookOpen className="w-3 h-3 text-cyan-500" />
                      Grounded Citations ({msg.citations.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cit, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => setActiveCitation(cit)}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-[11px] text-sky-700 dark:text-sky-300 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Quote className="w-2.5 h-2.5 text-cyan-500" />
                          <span className="truncate max-w-[180px]">{cit.section_name}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">({Math.round(cit.relevance_score * 100)}%)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-xl bg-[var(--pill-bg)] border border-[var(--glass-border)] flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </div>
              )}
            </div>

            {/* Suggested Followups */}
            {msg.suggested_followups && msg.suggested_followups.length > 0 && idx === messages.length - 1 && (
              <div className="mt-2.5 pl-10 flex flex-wrap gap-1.5">
                {msg.suggested_followups.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSendMessage(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--pill-bg)] hover:bg-violet-500/15 border border-[var(--glass-border)] hover:border-violet-500/40 text-[var(--text-secondary)] hover:text-violet-600 dark:hover:text-violet-300 transition-all text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>{sug}</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 pl-2">
            <div className="w-7 h-7 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-violet-300 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
              <span>Retrieving vector chunks & formulating citation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (if few messages) */}
      {messages.length <= 2 && (
        <div className="mb-3 shrink-0">
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-1.5">
            Recruiter Prompt Ideas:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {defaultPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--pill-bg)] hover:bg-violet-500/15 border border-[var(--glass-border)] hover:border-violet-500/30 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Citation Popover Modal/Card if user clicks a citation */}
      {activeCitation && (
        <div className="absolute bottom-20 left-6 right-6 p-4 rounded-2xl bg-[#0e111d] border border-cyan-500/40 shadow-2xl z-20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">{activeCitation.section_name}</span>
            </div>
            <button
              onClick={() => setActiveCitation(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
            >
              ✕ Close
            </button>
          </div>
          <p className="text-xs font-mono text-cyan-200/90 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/[0.06]">
            "{activeCitation.exact_text}"
          </p>
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputQuery);
        }}
        className="shrink-0 flex items-center gap-2 pt-2 border-t border-white/[0.08]"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask about ${candidateName}'s experience, metrics, or domain skills...`}
          disabled={isLoading}
          className="glass-input flex-1 px-4 py-2.5 text-xs sm:text-sm"
        />
        <GlassButton
          type="submit"
          variant="primary"
          size="md"
          disabled={!inputQuery.trim() || isLoading}
          icon={<Send className="w-3.5 h-3.5" />}
        >
          Send
        </GlassButton>
      </form>
    </GlassCard>
  );
};
