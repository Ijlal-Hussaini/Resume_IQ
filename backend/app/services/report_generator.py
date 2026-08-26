import json
import logging
from typing import Dict, Any
from ..models.resume import ResumeData
from ..models.analysis import ResumeAnalysisResult

logger = logging.getLogger("resumeiq.report_generator")


class ReportGeneratorService:
    """Exports structured resume analyses to JSON, Markdown, and formatted HTML/PDF."""

    @staticmethod
    def generate_json_report(resume_data: ResumeData, analysis: ResumeAnalysisResult) -> str:
        payload = {
            "resume": resume_data.model_dump(),
            "analysis": analysis.model_dump()
        }
        return json.dumps(payload, indent=2, ensure_ascii=False)

    @staticmethod
    def generate_markdown_report(resume_data: ResumeData, analysis: ResumeAnalysisResult) -> str:
        name = resume_data.contact_info.full_name or "Candidate"
        scores = analysis.match_scores
        jd = analysis.job_breakdown

        lines = [
            f"# ResumeIQ Career Intelligence Report",
            f"**Candidate:** {name} | **Target Role:** {jd.inferred_title} ({jd.inferred_industry})",
            f"**Overall Match Score:** {scores.overall_score}/100 — *{scores.verdict}*",
            f"",
            f"## Executive Summary",
            f"{analysis.executive_summary}",
            f"",
            f"## Match Dimension Breakdown",
            f"- **Skills Overlap:** {scores.skills_match_score}/100",
            f"- **Experience & Seniority:** {scores.experience_match_score}/100",
            f"- **Domain Terminology Depth:** {scores.domain_depth_score}/100",
            f"- **Education & Certifications:** {scores.education_cert_score}/100",
            f"- **ATS Readability Score:** {analysis.ats_report.ats_score}/100",
            f"",
            f"## Standout Strengths",
        ]
        for s in analysis.strengths:
            lines.append(f"- [x] {s}")

        lines.extend([
            f"",
            f"## Critical Skill & Experience Gaps",
        ])
        for g in analysis.skill_gaps.missing_critical_skills:
            lines.append(f"- [ ] **{g.skill_name}** ({g.importance.upper()}): {g.evidence_or_notes}")

        if analysis.skill_gaps.missing_secondary_skills:
            lines.append(f"### Secondary / Preferred Gaps")
            for g in analysis.skill_gaps.missing_secondary_skills:
                lines.append(f"- [ ] {g.skill_name}: {g.evidence_or_notes}")

        lines.extend([
            f"",
            f"## Bullet-Level Rewrite Recommendations",
        ])
        for idx, r in enumerate(analysis.rewrite_suggestions, 1):
            lines.extend([
                f"### Suggestion #{idx}: {r.section}",
                f"**Original:** `{r.original_bullet}`",
                f"",
                f"**AI-Optimized (XYZ / STAR Framework):**",
                f"> **{r.rewritten_bullet}**",
                f"",
                f"*Impact Analysis:* {r.reasoning}",
                f"",
            ])

        lines.extend([
            f"## Tailored Interview Prep Questions",
        ])
        for q in analysis.interview_prep_questions:
            lines.append(f"- ❓ {q}")

        return "\n".join(lines)

    @staticmethod
    def generate_html_report(resume_data: ResumeData, analysis: ResumeAnalysisResult) -> str:
        name = resume_data.contact_info.full_name or "Candidate"
        scores = analysis.match_scores
        jd = analysis.job_breakdown

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ResumeIQ Report - {name}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0c0d14; color: #f0f0f5; padding: 40px; margin: 0; }}
        .card {{ background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 24px; margin-bottom: 24px; }}
        h1, h2, h3 {{ color: #ffffff; font-weight: 700; }}
        .score {{ font-size: 48px; font-weight: 800; color: #8b5cf6; }}
        .tag {{ display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 4px; background: rgba(139,92,246,0.2); color: #c4b5fd; }}
        .diff-orig {{ background: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444; padding: 10px; margin: 6px 0; font-size: 14px; color: #fca5a5; }}
        .diff-new {{ background: rgba(34, 197, 94, 0.15); border-left: 4px solid #22c55e; padding: 10px; margin: 6px 0; font-size: 14px; color: #86efac; }}
    </style>
</head>
<body>
    <div class="card">
        <h1>ResumeIQ Career Intelligence Report</h1>
        <p><strong>Candidate:</strong> {name} | <strong>Target Role:</strong> {jd.inferred_title} ({jd.inferred_industry})</p>
        <div style="display: flex; gap: 30px; align-items: center; margin-top: 20px;">
            <div class="score">{scores.overall_score}<span style="font-size: 20px; color: #94a3b8;">/100</span></div>
            <div>
                <h3 style="margin: 0;">Verdict: {scores.verdict}</h3>
                <p style="color: #94a3b8; margin: 5px 0 0 0;">ATS Health: {analysis.ats_report.ats_score}/100 | Skills Match: {scores.skills_match_score}%</p>
            </div>
        </div>
    </div>

    <div class="card">
        <h2>Executive Briefing</h2>
        <p style="line-height: 1.6; color: #cbd5e1;">{analysis.executive_summary}</p>
    </div>

    <div class="card">
        <h2>Bullet-Level Rewrite Recommendations</h2>
        {"".join([f'''<div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 6px;">{r.section}</h4>
            <div class="diff-orig"><strong>Original:</strong> {r.original_bullet}</div>
            <div class="diff-new"><strong>Optimized:</strong> {r.rewritten_bullet}</div>
            <p style="font-size: 13px; color: #94a3b8; margin-top: 4px;"><em>Why this works:</em> {r.reasoning}</p>
        </div>''' for r in analysis.rewrite_suggestions])}
    </div>
</body>
</html>"""
        return html


report_generator = ReportGeneratorService()
