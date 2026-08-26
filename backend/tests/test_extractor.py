import pytest
from app.services.extractor import resume_extractor


@pytest.mark.asyncio
async def test_extract_nurse_resume_field_agnostic():
    nurse_resume_text = """Sarah Jenkins, BSN, RN
Email: sarah.jenkins@nursing.org | Phone: (312) 555-0199 | Chicago, IL
LinkedIn: linkedin.com/in/sarahjenkins-rn

Professional Summary:
Compassionate and board-certified Emergency Room Registered Nurse with 6+ years of acute trauma care experience.

Clinical Experience:
Northwestern Memorial Hospital - Lead Trauma Nurse (2021 - Present)
* Directed rapid triage and immediate resuscitation for 40+ acute trauma patients per shift.
* Spearheaded hospital-wide EHR Epic migration, reducing charting errors by 22%.
* Administered IV medication, cardiac monitoring, and endotracheal intubation assistance.

St. Joseph Hospital - Staff Registered Nurse (2018 - 2021)
* Delivered direct patient care in 32-bed Intensive Care Unit (ICU).

Education:
Bachelor of Science in Nursing (BSN) - University of Illinois (2018)

Certifications:
* Registered Nurse (RN) - Illinois Board of Nursing (License #RN-99281)
* ACLS & BLS Certified - American Heart Association

Skills:
Patient Triage, Trauma Resuscitation, Epic EHR, IV Therapy, Cardiac Telemetry, HIPAA Compliance, Crisis Management
"""
    resume_data = await resume_extractor.extract_resume(nurse_resume_text)
    
    assert resume_data.contact_info.email == "sarah.jenkins@nursing.org"
    assert "Sarah Jenkins" in (resume_data.contact_info.full_name or "")
    assert len(resume_data.work_experience) >= 1
    assert any("Triage" in s or "Epic" in s or "IV" in s for s in resume_data.all_skills_flat)
    assert "Health" in resume_data.domain_industry or "Nurse" in resume_data.domain_industry or resume_data.domain_industry != "Technology"


@pytest.mark.asyncio
async def test_extract_software_resume():
    tech_resume_text = """Alex Chen
Email: alex.chen@dev.io | Phone: 415-555-0142 | San Francisco, CA
GitHub: github.com/alexchen-dev

Experience:
Stripe - Senior Full-Stack Engineer (2022 - Present)
* Architected distributed payment webhook engine processing $50M+ daily volume.
* Optimized Redis caching layer, dropping p99 latency from 450ms to 42ms.

Education:
B.S. in Computer Science - UC Berkeley (2022)

Skills:
Python, FastAPI, TypeScript, React, Next.js, Docker, Kubernetes, PostgreSQL, Redis, LangChain
"""
    resume_data = await resume_extractor.extract_resume(tech_resume_text)
    assert resume_data.contact_info.email == "alex.chen@dev.io"
    assert len(resume_data.work_experience) >= 1
    assert any("Python" in s or "FastAPI" in s or "React" in s for s in resume_data.all_skills_flat)
