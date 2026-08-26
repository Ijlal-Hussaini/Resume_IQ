from typing import List, Optional
from pydantic import BaseModel, Field


class ContactInfo(BaseModel):
    full_name: Optional[str] = Field(default=None, description="Full candidate name")
    email: Optional[str] = Field(default=None, description="Candidate email address")
    phone: Optional[str] = Field(default=None, description="Phone number")
    location: Optional[str] = Field(default=None, description="City, State/Country or remote status")
    linkedin: Optional[str] = Field(default=None, description="LinkedIn profile URL or handle")
    github: Optional[str] = Field(default=None, description="GitHub profile URL or handle if applicable")
    portfolio_website: Optional[str] = Field(default=None, description="Portfolio website or personal site")
    professional_title: Optional[str] = Field(default=None, description="Current or target professional headline")


class WorkExperience(BaseModel):
    job_title: str = Field(description="Designation / Job Title")
    company: str = Field(description="Company or Organization name")
    location: Optional[str] = Field(default=None, description="Location of work (e.g., Chicago, IL / Remote)")
    start_date: Optional[str] = Field(default=None, description="Start date (e.g., Jan 2021)")
    end_date: Optional[str] = Field(default=None, description="End date or 'Present'")
    is_current: bool = Field(default=False, description="Whether this is the current role")
    description_bullets: List[str] = Field(default_factory=list, description="Key duties, achievements, and impact bullets")
    tools_and_methods: List[str] = Field(default_factory=list, description="Domain tools, skills, or methodologies used in this role")
    quantified_impact: List[str] = Field(default_factory=list, description="Extracted metrics, KPIs, revenue, scale, or patient outcomes")


class Education(BaseModel):
    degree: str = Field(description="Degree or credential (e.g., B.S., M.S., High School, MD, RN, MBA)")
    field_of_study: Optional[str] = Field(default=None, description="Major, focus, or specialization")
    institution: str = Field(description="University, College, or Institution name")
    location: Optional[str] = Field(default=None, description="Institution location")
    graduation_year: Optional[str] = Field(default=None, description="Graduation year or date range")
    gpa_or_honors: Optional[str] = Field(default=None, description="GPA, Magna Cum Laude, Dean's List, etc.")


class SkillCategory(BaseModel):
    category_name: str = Field(description="Dynamic category name (e.g., 'Clinical Operations', 'Digital Marketing', 'Cloud Infrastructure', 'Regulatory Compliance')")
    skills: List[str] = Field(default_factory=list, description="List of specific skills under this category")


class Project(BaseModel):
    title: str = Field(description="Project or initiative name")
    description: Optional[str] = Field(default=None, description="Summary of project objective and outcome")
    role: Optional[str] = Field(default=None, description="Candidate's specific contribution")
    tools_technologies: List[str] = Field(default_factory=list, description="Tools, frameworks, or methodologies used")
    url: Optional[str] = Field(default=None, description="Link or repository URL if provided")


class Certification(BaseModel):
    name: str = Field(description="Certification or license name (e.g. 'PMP', 'Registered Nurse (RN)', 'AWS Solutions Architect', 'CPA')")
    issuing_organization: Optional[str] = Field(default=None, description="Issuing body or authority")
    issue_date: Optional[str] = Field(default=None, description="Date issued")
    credential_id: Optional[str] = Field(default=None, description="License or credential number")


class ResumeData(BaseModel):
    """Complete domain-agnostic structured resume entity."""
    contact_info: ContactInfo = Field(default_factory=ContactInfo)
    professional_summary: Optional[str] = Field(default=None, description="Extracted executive summary or bio")
    domain_industry: str = Field(default="General", description="Identified industry/domain (e.g., Healthcare, Software, Marketing, Finance, Education, Hospitality, Engineering, Trades)")
    estimated_years_experience: Optional[float] = Field(default=None, description="Total estimated professional years of experience")
    work_experience: List[WorkExperience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    skill_categories: List[SkillCategory] = Field(default_factory=list)
    all_skills_flat: List[str] = Field(default_factory=list, description="Flat deduplicated list of all extracted skills")
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    raw_text: Optional[str] = Field(default=None, description="Underlying normalized text extracted from document")
