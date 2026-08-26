import re
import logging
from typing import Optional
from ..models.resume import (
    ResumeData, ContactInfo, WorkExperience, Education,
    SkillCategory, Project, Certification
)
from ..core.llm import llm_service

logger = logging.getLogger("resumeiq.extractor")


EXTRACTION_SYSTEM_PROMPT = """You are an expert AI Resume Parser and Career Intelligence Architect.
Your task is to analyze raw resume text from ANY profession (Software Engineering, Nursing & Healthcare, Digital Marketing, Corporate Finance, Civil Engineering, High School Teaching, Culinary/Hospitality, Construction Management, Legal, etc.) and extract comprehensive, structured data.

CRITICAL RULES:
1. Field-Agnostic: DO NOT assume a software or technology background. If the resume is for a Nurse, extract clinical skills (e.g., Triage, IV Therapy, EHR, HIPAA). If it is for a Marketer, extract marketing competencies (e.g., SEO, Demand Gen, HubSpot, ROAS).
2. Faithfulness: Only extract information present in the text. Do not hallucinate credentials, dates, or contact info.
3. Bullets & Metrics: Preserve quantified impact metrics, percentages, revenue, patient numbers, team sizes, and scale.
4. Categorize Skills: Group skills into meaningful dynamic categories tailored to this specific candidate's industry (e.g., 'Clinical Operations', 'Digital Acquisition', 'Core Methodologies', 'Tools & Technologies', 'Leadership & Strategy').
5. Estimate Years of Experience: Sum total non-overlapping professional tenure.
"""


class ResumeExtractorService:
    """Service to parse raw text into structured ResumeData."""

    async def extract_resume(self, raw_text: str) -> ResumeData:
        """Extracts structured resume entity via LLM with heuristic fallback."""
        if not raw_text or len(raw_text.strip()) < 10:
            return ResumeData(
                professional_summary="No readable text found in document.",
                raw_text=raw_text
            )

        prompt = f"""Please extract all information from this resume into the structured schema:

--- RESUME TEXT ---
{raw_text}
--- END RESUME TEXT ---
"""
        def heuristic_fallback() -> ResumeData:
            return self._heuristic_extraction(raw_text)

        try:
            resume_data = await llm_service.extract_structured(
                schema=ResumeData,
                prompt=prompt,
                system_prompt=EXTRACTION_SYSTEM_PROMPT,
                fallback_factory=heuristic_fallback
            )
            resume_data.raw_text = raw_text
            
            # Populate flat skills if empty
            if not resume_data.all_skills_flat and resume_data.skill_categories:
                flat = []
                for cat in resume_data.skill_categories:
                    flat.extend(cat.skills)
                resume_data.all_skills_flat = list(dict.fromkeys(flat))

            return resume_data
        except Exception as e:
            logger.warning(f"LLM extraction failed or timed out: {e}. Executing heuristic fallback.")
            return self._heuristic_extraction(raw_text)

    def _heuristic_extraction(self, raw_text: str) -> ResumeData:
        """Smart regex/heuristic parser when running offline or without API keys."""
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        
        # 1. Contact info
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", raw_text)
        phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", raw_text)
        linkedin_match = re.search(r"linkedin\.com/in/[\w\-]+", raw_text, re.IGNORECASE)
        github_match = re.search(r"github\.com/[\w\-]+", raw_text, re.IGNORECASE)
        
        full_name = lines[0] if lines and len(lines[0].split()) <= 4 and not "@" in lines[0] else "Candidate"
        
        contact = ContactInfo(
            full_name=full_name,
            email=email_match.group(0) if email_match else None,
            phone=phone_match.group(0) if phone_match else None,
            linkedin=f"https://{linkedin_match.group(0)}" if linkedin_match else None,
            github=f"https://{github_match.group(0)}" if github_match else None,
            location="Location on file" if "remote" in raw_text.lower() or "city" in raw_text.lower() else None
        )

        # 2. Identify sections
        sections = {"summary": [], "experience": [], "education": [], "skills": [], "certifications": [], "projects": []}
        current_section = "summary"

        for line in lines[1:]:
            lower = line.lower()
            if any(h in lower for h in ["experience", "work history", "employment", "professional background"]) and len(line) < 40:
                current_section = "experience"
                continue
            elif any(h in lower for h in ["education", "academic", "degrees"]) and len(line) < 40:
                current_section = "education"
                continue
            elif any(h in lower for h in ["skills", "competencies", "technical proficiencies", "areas of expertise"]) and len(line) < 40:
                current_section = "skills"
                continue
            elif any(h in lower for h in ["certifications", "licenses", "credentials"]) and len(line) < 40:
                current_section = "certifications"
                continue
            elif any(h in lower for h in ["projects", "key initiatives"]) and len(line) < 40:
                current_section = "projects"
                continue

            sections[current_section].append(line)

        # Build Experiences
        work_exps = []
        exp_lines = sections["experience"]
        if exp_lines:
            current_bullets = []
            curr_title = "Professional Experience"
            curr_company = "Organization"
            
            for line in exp_lines:
                if line.startswith(("*", "-", "•", "–")) or len(current_bullets) > 0 and len(line) > 60:
                    clean_bullet = re.sub(r"^[\*\-•–\s]+", "", line)
                    current_bullets.append(clean_bullet)
                elif len(line) < 60 and ("20" in line or "19" in line or "present" in line.lower()):
                    if current_bullets:
                        work_exps.append(WorkExperience(
                            job_title=curr_title,
                            company=curr_company,
                            description_bullets=current_bullets
                        ))
                        current_bullets = []
                    curr_title = line
                else:
                    if not current_bullets:
                        curr_company = line

            if current_bullets or curr_title != "Professional Experience":
                work_exps.append(WorkExperience(
                    job_title=curr_title,
                    company=curr_company,
                    description_bullets=current_bullets or ["Executed core responsibilities and delivered domain objectives."]
                ))

        # Build Education
        educations = []
        edu_lines = sections["education"]
        if edu_lines:
            for el in edu_lines[:3]:
                educations.append(Education(
                    degree="Degree / Credential",
                    institution=el,
                    field_of_study="Specialization"
                ))

        # Build Skills
        skills_lines = sections["skills"]
        flat_skills = []
        for sl in skills_lines:
            items = re.split(r"[,\|•;\t]+", sl)
            for item in items:
                cleaned = item.strip().strip("*•-")
                if 2 <= len(cleaned) <= 35:
                    flat_skills.append(cleaned)
        
        flat_skills = list(dict.fromkeys(flat_skills))
        skill_cats = []
        if flat_skills:
            skill_cats.append(SkillCategory(
                category_name="Core Competencies",
                skills=flat_skills[:12]
            ))
            if len(flat_skills) > 12:
                skill_cats.append(SkillCategory(
                    category_name="Tools & Technologies",
                    skills=flat_skills[12:24]
                ))

        # Weighted Domain Detection with Word Boundary Regex
        lower_raw = raw_text.lower()
        domain_weights = {
            "Software & AI Engineering": 0,
            "Healthcare & Clinical Practice": 0,
            "Growth & Digital Marketing": 0,
            "Finance & Accounting": 0,
            "Operations & Management": 0
        }

        # Software / IT Keywords
        sw_keywords = [
            r"\bpython\b", r"\breact\b", r"\bjavascript\b", r"\btypescript\b", r"\bsoftware\b",
            r"\bdeveloper\b", r"\bengineer\b", r"\bengineering\b", r"\bfull-stack\b", r"\bbackend\b",
            r"\bfrontend\b", r"\bfastapi\b", r"\bnext\.js\b", r"\bnode\b", r"\bdocker\b", r"\bkubernetes\b",
            r"\bapi\b", r"\bapis\b", r"\bdatabase\b", r"\bsql\b", r"\bpostgres\b", r"\bpostgresql\b",
            r"\bgithub\b", r"\bgit\b", r"\bhtml\b", r"\bcss\b", r"\bmachine learning\b", r"\bai\b",
            r"\bllm\b", r"\brag\b", r"\bdata scientist\b", r"\bdevops\b", r"\bci/cd\b", r"\bcloud\b", r"\baws\b"
        ]
        for pat in sw_keywords:
            if re.search(pat, lower_raw):
                domain_weights["Software & AI Engineering"] += 2

        # Healthcare Keywords
        health_keywords = [
            r"\bpatient\b", r"\bpatients\b", r"\bnurse\b", r"\bnursing\b", r"\bclinical\b", r"\bhospital\b",
            r"\bphysician\b", r"\bdoctor\b", r"\btriage\b", r"\bmbbs\b", r"\bbsn\b", r"\brn\b",
            r"\bacls\b", r"\bbls\b", r"\bicu\b", r"\bed\b", r"\bmedication\b", r"\bsurgical\b"
        ]
        for pat in health_keywords:
            if re.search(pat, lower_raw):
                domain_weights["Healthcare & Clinical Practice"] += 2

        # Marketing Keywords
        mkt_keywords = [
            r"\bseo\b", r"\bsem\b", r"\bcampaign\b", r"\bcac\b", r"\broas\b", r"\bcontent marketing\b",
            r"\bgrowth hacking\b", r"\bbrand strategy\b", r"\bfunnel\b", r"\bmeta ads\b", r"\bgoogle ads\b"
        ]
        for pat in mkt_keywords:
            if re.search(pat, lower_raw):
                domain_weights["Growth & Digital Marketing"] += 2

        # Finance Keywords
        fin_keywords = [
            r"\baccounting\b", r"\baudit\b", r"\bgaap\b", r"\bfinancial modeling\b", r"\btaxation\b",
            r"\bbalance sheet\b", r"\bcpa\b", r"\bcfa\b", r"\bgeneral ledger\b"
        ]
        for pat in fin_keywords:
            if re.search(pat, lower_raw):
                domain_weights["Finance & Accounting"] += 2

        # Select highest weighted domain
        best_domain = max(domain_weights, key=domain_weights.get)
        domain = best_domain if domain_weights[best_domain] > 0 else "General Professional"

        return ResumeData(
            contact_info=contact,
            professional_summary=" ".join(sections["summary"][:3]) if sections["summary"] else "Accomplished professional with proven track record of domain excellence.",
            domain_industry=domain,
            estimated_years_experience=max(1.0, len(work_exps) * 1.5) if work_exps else 2.0,
            work_experience=work_exps,
            education=educations,
            skill_categories=skill_cats,
            all_skills_flat=flat_skills,
            raw_text=raw_text
        )


resume_extractor = ResumeExtractorService()

