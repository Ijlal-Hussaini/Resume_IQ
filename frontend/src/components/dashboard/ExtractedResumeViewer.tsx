"use client";

import React, { useState } from "react";
import { User, Briefcase, GraduationCap, Wrench, Award, FileText, Mail, Phone, MapPin, Link, Code2, Globe } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { ResumeData } from "@/lib/types";

interface ExtractedResumeViewerProps {
  resumeData: ResumeData;
}

export const ExtractedResumeViewer: React.FC<ExtractedResumeViewerProps> = ({ resumeData }) => {
  const [activeTab, setActiveTab] = useState<"experience" | "skills" | "education" | "projects" | "raw">("experience");

  const contact = resumeData.contact_info;

  return (
    <div className="space-y-6">
      {/* Contact & Bio Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-5 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px]">
              <div className="w-full h-full bg-[#0d0f1a] rounded-2xl flex items-center justify-center text-xl font-bold text-white">
                {contact.full_name ? contact.full_name.charAt(0) : "C"}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[var(--card-title)] font-outfit">
                  {contact.full_name || "Candidate"}
                </h3>
                <Badge variant="violet" size="sm">
                  {resumeData.domain_industry}
                </Badge>
              </div>
              <p className="text-xs text-[var(--card-subtitle)] mt-0.5">
                {contact.professional_title || `Domain Specialist (${resumeData.estimated_years_experience || 3}+ years)`}
              </p>
            </div>
          </div>

          {/* Social Links & Contact Details */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {contact.email}
              </a>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {contact.phone}
              </span>
            )}
            {contact.location && (
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {contact.location}
              </span>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-300">
                <Link className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                LinkedIn
              </a>
            )}
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[var(--text-primary)]">
                <Code2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Executive Summary if present */}
        {resumeData.professional_summary && (
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--pill-bg)] p-4 rounded-xl border border-[var(--glass-border)]">
            {resumeData.professional_summary}
          </p>
        )}
      </GlassCard>

      {/* Tabs */}
      <div className="flex bg-[var(--pill-bg)] p-1.5 rounded-2xl border border-[var(--glass-border)] overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "experience" ? "bg-violet-600 text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Work Experience ({resumeData.work_experience.length})
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "skills" ? "bg-violet-600 text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Skills & Taxonomy ({resumeData.all_skills_flat.length})
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "education" ? "bg-violet-600 text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Education ({resumeData.education.length})
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "projects" ? "bg-violet-600 text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Projects & Certs ({resumeData.projects.length + resumeData.certifications.length})
        </button>

        <button
          onClick={() => setActiveTab("raw")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "raw" ? "bg-violet-600 text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Raw Parsed Text
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {resumeData.work_experience.map((exp, idx) => (
            <GlassCard key={idx} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h4 className="text-sm font-bold text-[var(--card-title)]">{exp.job_title}</h4>
                <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">
                  {exp.start_date || ""} — {exp.end_date || "Present"}
                </span>
              </div>
              <p className="text-xs text-violet-700 dark:text-violet-300 font-semibold mb-3">
                {exp.company} {exp.location ? `• ${exp.location}` : ""}
              </p>

              <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                {exp.description_bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <span className="text-violet-600 dark:text-violet-400">▪</span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>

              {exp.tools_and_methods && exp.tools_and_methods.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex flex-wrap gap-1.5">
                  {exp.tools_and_methods.map((t, tIdx) => (
                    <Badge key={tIdx} variant="slate" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-4">
          {resumeData.skill_categories.map((cat, idx) => (
            <GlassCard key={idx} className="p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--card-title)] font-outfit mb-3">
                {cat.category_name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, sIdx) => (
                  <Badge key={sIdx} variant="violet" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          ))}

          {/* Flat List */}
          <GlassCard className="p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--card-title)] font-outfit mb-3">
              All Extracted Entities (Flat Index)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {resumeData.all_skills_flat.map((skill, sIdx) => (
                <Badge key={sIdx} variant="slate" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === "education" && (
        <div className="space-y-4">
          {resumeData.education.map((edu, idx) => (
            <GlassCard key={idx} className="p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[var(--card-title)]">{edu.degree}</h4>
                {edu.graduation_year && (
                  <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">{edu.graduation_year}</span>
                )}
              </div>
              <p className="text-xs text-violet-700 dark:text-violet-400 font-semibold mt-1">
                {edu.institution} {edu.location ? `• ${edu.location}` : ""}
              </p>
              {edu.field_of_study && !["Specialization", "Domain Specialization"].includes(edu.field_of_study) && (
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Field: {edu.field_of_study}</p>
              )}
              {edu.gpa_or_honors && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <span>🏆</span>
                  <span>{edu.gpa_or_honors}</span>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="space-y-4">
          {resumeData.certifications.length > 0 && (
            <GlassCard className="p-5 border-amber-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 font-outfit mb-3">
                Certifications & Licensure
              </h4>
              <div className="space-y-2.5">
                {resumeData.certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--glass-border)] text-xs">
                    <p className="font-semibold text-[var(--card-title)]">{cert.name}</p>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      {cert.issuing_organization || ""} {cert.issue_date ? `(${cert.issue_date})` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {resumeData.projects.length > 0 && (
            <div className="space-y-3">
              {resumeData.projects.map((proj, idx) => (
                <GlassCard key={idx} className="p-5">
                  <h4 className="text-sm font-bold text-[var(--card-title)]">{proj.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{proj.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.tools_technologies.map((tool, tIdx) => (
                      <Badge key={tIdx} variant="cyan" size="sm">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "raw" && (
        <GlassCard className="p-5">
          <pre className="p-4 rounded-xl bg-slate-900 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {resumeData.raw_text || "No raw text recorded."}
          </pre>
        </GlassCard>
      )}
    </div>
  );
};
