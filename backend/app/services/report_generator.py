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

        # Build dynamic sections
        strengths_html = "".join([f'<li class="strength-item">✓ {s}</li>' for s in analysis.strengths])
        weaknesses_html = "".join([f'<li class="weakness-item">⚠ {w}</li>' for w in analysis.weaknesses])

        missing_skills_html = "".join([
            f'<div class="gap-item"><span class="gap-name">{g.skill_name}</span>'
            f'<span class="gap-badge {g.importance}">{g.importance.upper()}</span>'
            f'<p class="gap-note">{g.evidence_or_notes}</p></div>'
            for g in analysis.skill_gaps.missing_critical_skills
        ])

        matched_skills_html = "".join([
            f'<span class="tag matched">{s.skill_name}</span>'
            for s in analysis.skill_gaps.matched_skills
        ])

        rewrites_html = "".join([f'''<div class="rewrite-card">
            <h4 style="margin-bottom: 6px;">{r.section} <span class="impact-badge">{r.impact_level} Impact</span></h4>
            <div class="diff-orig"><strong>Original:</strong> {r.original_bullet}</div>
            <div class="diff-new"><strong>Optimized:</strong> {r.rewritten_bullet}</div>
            <p style="font-size: 13px; color: #94a3b8; margin-top: 4px;"><em>Why this works:</em> {r.reasoning}</p>
        </div>''' for r in analysis.rewrite_suggestions])

        ats_checks_html = "".join([
            f'<tr><td class="ats-status-{c.status}">{c.status.upper()}</td>'
            f'<td><strong>{c.title}</strong><br><span style="color:#94a3b8;font-size:12px">{c.detail}</span></td>'
            f'<td style="font-size:12px;color:#a78bfa">{c.fix_action}</td></tr>'
            for c in analysis.ats_report.checks
        ])

        interview_html = "".join([
            f'<li class="interview-q"><span class="q-num">Q{i+1}.</span> {q}</li>'
            for i, q in enumerate(analysis.interview_prep_questions)
        ])

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ResumeIQ Report - {name}</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0c0d14; color: #f0f0f5; padding: 40px; }}
        .card {{ background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 24px; margin-bottom: 24px; }}
        h1, h2, h3 {{ color: #ffffff; font-weight: 700; }}
        h1 {{ font-size: 28px; margin-bottom: 8px; }}
        h2 {{ font-size: 20px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08); }}
        h3 {{ font-size: 16px; }}
        p {{ line-height: 1.6; }}
        .score {{ font-size: 48px; font-weight: 800; color: #8b5cf6; }}
        .tag {{ display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 4px; background: rgba(139,92,246,0.2); color: #c4b5fd; }}
        .tag.matched {{ background: rgba(16,185,129,0.2); color: #6ee7b7; }}
        .diff-orig {{ background: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444; padding: 10px; margin: 6px 0; font-size: 14px; color: #fca5a5; }}
        .diff-new {{ background: rgba(34, 197, 94, 0.15); border-left: 4px solid #22c55e; padding: 10px; margin: 6px 0; font-size: 14px; color: #86efac; }}
        .rewrite-card {{ background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin-bottom: 16px; }}
        .impact-badge {{ font-size: 11px; padding: 2px 8px; border-radius: 6px; background: rgba(139,92,246,0.2); color: #a78bfa; margin-left: 8px; }}
        .gap-item {{ padding: 10px; margin-bottom: 8px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; }}
        .gap-name {{ font-weight: 700; font-size: 14px; }}
        .gap-badge {{ font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 8px; }}
        .gap-badge.critical {{ background: rgba(239,68,68,0.3); color: #fca5a5; }}
        .gap-badge.important {{ background: rgba(245,158,11,0.3); color: #fcd34d; }}
        .gap-badge.bonus {{ background: rgba(139,92,246,0.3); color: #c4b5fd; }}
        .gap-note {{ font-size: 12px; color: #94a3b8; margin-top: 4px; }}
        .strength-item {{ color: #6ee7b7; padding: 4px 0; list-style: none; }}
        .weakness-item {{ color: #fcd34d; padding: 4px 0; list-style: none; }}
        .dimension-bar {{ height: 8px; border-radius: 4px; background: rgba(255,255,255,0.06); overflow: hidden; margin-top: 4px; }}
        .dimension-fill {{ height: 100%; border-radius: 4px; }}
        table {{ width: 100%; border-collapse: collapse; font-size: 13px; }}
        td {{ padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: top; }}
        .ats-status-pass {{ color: #6ee7b7; font-weight: 700; font-size: 11px; width: 60px; }}
        .ats-status-warning {{ color: #fcd34d; font-weight: 700; font-size: 11px; width: 60px; }}
        .ats-status-fail {{ color: #fca5a5; font-weight: 700; font-size: 11px; width: 60px; }}
        .interview-q {{ padding: 8px 0; list-style: none; font-size: 14px; color: #e2e8f0; }}
        .q-num {{ color: #06b6d4; font-weight: 700; font-family: monospace; margin-right: 8px; }}
        @media print {{
            body {{ background: #ffffff; color: #1e293b; padding: 20px; }}
            .card {{ background: #f8fafc; border: 1px solid #e2e8f0; box-shadow: none; }}
            h1, h2, h3 {{ color: #0f172a; }}
            .score {{ color: #7c3aed; }}
            .diff-orig {{ background: #fef2f2; color: #991b1b; border-left-color: #ef4444; }}
            .diff-new {{ background: #f0fdf4; color: #166534; border-left-color: #22c55e; }}
            .tag {{ background: #ede9fe; color: #5b21b6; }}
            .tag.matched {{ background: #d1fae5; color: #065f46; }}
        }}
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
        <h2>Match Dimension Breakdown</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div><span style="color:#a78bfa">Skills Match</span><span style="float:right;font-weight:700;color:#a78bfa">{scores.skills_match_score}%</span><div class="dimension-bar"><div class="dimension-fill" style="width:{scores.skills_match_score}%;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></div></div></div>
            <div><span style="color:#22d3ee">Experience & Seniority</span><span style="float:right;font-weight:700;color:#22d3ee">{scores.experience_match_score}%</span><div class="dimension-bar"><div class="dimension-fill" style="width:{scores.experience_match_score}%;background:linear-gradient(90deg,#0891b2,#22d3ee)"></div></div></div>
            <div><span style="color:#34d399">Domain Depth</span><span style="float:right;font-weight:700;color:#34d399">{scores.domain_depth_score}%</span><div class="dimension-bar"><div class="dimension-fill" style="width:{scores.domain_depth_score}%;background:linear-gradient(90deg,#059669,#34d399)"></div></div></div>
            <div><span style="color:#fbbf24">Education & Certs</span><span style="float:right;font-weight:700;color:#fbbf24">{scores.education_cert_score}%</span><div class="dimension-bar"><div class="dimension-fill" style="width:{scores.education_cert_score}%;background:linear-gradient(90deg,#d97706,#fbbf24)"></div></div></div>
        </div>
    </div>

    <div class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
        <div>
            <h3 style="color:#6ee7b7;margin-bottom:8px;">✓ Core Competitive Strengths</h3>
            <ul>{strengths_html}</ul>
        </div>
        <div>
            <h3 style="color:#fcd34d;margin-bottom:8px;">⚠ Perceived Vulnerabilities</h3>
            <ul>{weaknesses_html}</ul>
        </div>
    </div>

    <div class="card">
        <h2>Skill Gap Analysis</h2>
        <h3 style="margin-bottom:8px;">Matched Qualifications</h3>
        <div style="margin-bottom:16px;">{matched_skills_html if matched_skills_html else '<p style="color:#94a3b8;font-size:13px;">No direct matches detected.</p>'}</div>
        <h3 style="color:#fca5a5;margin-bottom:8px;">Missing Critical Requirements</h3>
        {missing_skills_html if missing_skills_html else '<p style="color:#6ee7b7;font-size:13px;">✓ No critical requirements missing!</p>'}
    </div>

    <div class="card">
        <h2>Bullet-Level Rewrite Recommendations</h2>
        {rewrites_html}
    </div>

    <div class="card">
        <h2>ATS Compliance Audit — Score: {analysis.ats_report.ats_score}/100</h2>
        <p style="color:#94a3b8;font-size:13px;margin-bottom:12px;">{analysis.ats_report.overall_readability}</p>
        <table>{ats_checks_html}</table>
    </div>

    <div class="card">
        <h2>Tailored Interview Prep Questions</h2>
        <ul>{interview_html}</ul>
    </div>

    <div style="text-align:center;padding:20px;font-size:12px;color:#64748b;">
        Generated by ResumeIQ Career Intelligence Engine • {name} • {jd.inferred_title}
    </div>
</body>
</html>"""
        return html


report_generator = ReportGeneratorService()
