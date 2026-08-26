from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


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
    job_title: str = Field(default="Professional Role", description="Designation / Job Title")
    company: str = Field(default="Company", description="Company or Organization name")
    location: Optional[str] = Field(default=None, description="Location of work")
    start_date: Optional[str] = Field(default=None, description="Start date (e.g., Jan 2021)")
    end_date: Optional[str] = Field(default=None, description="End date or 'Present'")
    is_current: bool = Field(default=False, description="Whether this is the current role")
    description_bullets: Optional[List[str]] = Field(default_factory=list, description="Key duties and achievements")
    tools_and_methods: Optional[List[str]] = Field(default_factory=list, description="Domain tools or skills used")
    quantified_impact: Optional[List[str]] = Field(default_factory=list, description="Extracted metrics or KPIs")

    @field_validator("description_bullets", "tools_and_methods", "quantified_impact", mode="before")
    def ensure_list(cls, v):
        return v if v is not None else []


class Education(BaseModel):
    degree: str = Field(default="Degree", description="Degree or credential (e.g., B.S., M.S., High School, MD, RN, MBA)")
    field_of_study: Optional[str] = Field(default=None, description="Major, focus, or specialization")
    institution: str = Field(default="Institution", description="University, College, or Institution name")
    location: Optional[str] = Field(default=None, description="Institution location")
    graduation_year: Optional[str] = Field(default=None, description="Graduation year or date range")
    gpa_or_honors: Optional[str] = Field(default=None, description="GPA, Magna Cum Laude, Dean's List, etc.")


class SkillCategory(BaseModel):
    category_name: str = Field(description="Dynamic category name")
    skills: Optional[List[str]] = Field(default_factory=list, description="List of specific skills")

    @field_validator("skills", mode="before")
    def ensure_skills_list(cls, v):
        return v if v is not None else []


class Project(BaseModel):
    title: str = Field(description="Project or initiative name")
    description: Optional[str] = Field(default=None, description="Summary of project objective and outcome")
    role: Optional[str] = Field(default=None, description="Candidate's specific contribution")
    tools_technologies: Optional[List[str]] = Field(default_factory=list, description="Tools or technologies used")
    url: Optional[str] = Field(default=None, description="Link or repository URL if provided")

    @field_validator("tools_technologies", mode="before")
    def ensure_tools_list(cls, v):
        return v if v is not None else []


class Certification(BaseModel):
    name: str = Field(description="Certification or license name")
    issuing_organization: Optional[str] = Field(default=None, description="Issuing body or authority")
    issue_date: Optional[str] = Field(default=None, description="Date issued")
    credential_id: Optional[str] = Field(default=None, description="License or credential number")


class ResumeData(BaseModel):
    """Complete domain-agnostic structured resume entity."""
    contact_info: ContactInfo = Field(default_factory=ContactInfo)
    professional_summary: Optional[str] = Field(default=None, description="Extracted executive summary or bio")
    domain_industry: str = Field(default="General", description="Classified primary industry domain")
    estimated_years_experience: Optional[float] = Field(default=0.0, description="Estimated total years of experience")
    work_experience: Optional[List[WorkExperience]] = Field(default_factory=list, description="Extracted roles")
    education: Optional[List[Education]] = Field(default_factory=list, description="Extracted degrees")
    skill_categories: Optional[List[SkillCategory]] = Field(default_factory=list, description="Categorized skills")
    all_skills_flat: Optional[List[str]] = Field(default_factory=list, description="Flat list of unique skills")
    projects: Optional[List[Project]] = Field(default_factory=list, description="Extracted projects")
    certifications: Optional[List[Certification]] = Field(default_factory=list, description="Licenses and certifications")
    languages: Optional[List[str]] = Field(default_factory=list, description="Spoken/written languages")
    raw_text: Optional[str] = Field(default=None, description="Original parsed raw text")

    @field_validator("work_experience", "education", "skill_categories", "all_skills_flat", "projects", "certifications", "languages", mode="before")
    def ensure_lists(cls, v):
        return v if v is not None else []
