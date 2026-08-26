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

        # Domain heuristic detection
        lower_raw = raw_text.lower()
        domain = "General"
        if any(w in lower_raw for w in ["patient", "nurse", "clinical", "hospital", "physician", "ehr", "triage", "medical"]):
            domain = "Healthcare & Nursing"
        elif any(w in lower_raw for w in ["react", "python", "aws", "docker", "kubernetes", "backend", "frontend", "software", "api", "database"]):
            domain = "Software & AI Engineering"
        elif any(w in lower_raw for w in ["seo", "campaign", "cac", "roas", "content", "growth", "brand", "marketing", "funnel"]):
            domain = "Growth & Marketing"
        elif any(w in lower_raw for w in ["accounting", "audit", "gaap", "financial modeling", "portfolio", "banking", "tax"]):
            domain = "Finance & Accounting"

        return ResumeData(
            contact_info=contact,
            professional_summary=" ".join(sections["summary"][:3]) if sections["summary"] else "Accomplished professional with proven track record of domain excellence.",
            domain_industry=domain,
            estimated_years_experience=len(work_exps) * 2.5 if work_exps else 3.0,
            work_experience=work_exps,
            education=educations,
            skill_categories=skill_cats,
            all_skills_flat=flat_skills,
            raw_text=raw_text
        )


resume_extractor = ResumeExtractorService()
