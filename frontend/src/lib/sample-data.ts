import { ResumeData, JobDescriptionInput } from "./types";

export interface SampleProfile {
  id: string;
  name: string;
  role: string;
  industry: string;
  badge: string;
  icon: string;
  resumeData: ResumeData;
  rawResumeText: string;
  jobDescription: JobDescriptionInput;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: "ai-engineer",
    name: "Alex Chen",
    role: "Senior AI / Full-Stack Systems Engineer",
    industry: "AI & Distributed Systems",
    badge: "Tech / AI Engineering",
    icon: "Cpu",
    resumeData: {
      contact_info: {
        full_name: "Alex Chen",
        email: "alex.chen@ai-systems.dev",
        phone: "+1 (415) 555-0142",
        location: "San Francisco, CA (Open to Remote)",
        linkedin: "https://linkedin.com/in/alexchen-ai",
        github: "https://github.com/alexchen-ai",
        portfolio_website: "https://alexchen.dev",
        professional_title: "Senior AI & Distributed Systems Engineer"
      },
      professional_summary: "Senior AI/ML Systems Engineer with 6+ years of experience architecting low-latency LLM agent workflows, high-throughput RAG retrieval pipelines, and distributed Kubernetes microservices. Experienced in production fine-tuning, vector database optimization (Chroma, Pinecone), and async FastAPI backend development.",
      domain_industry: "Artificial Intelligence & Distributed Systems",
      estimated_years_experience: 6.5,
      work_experience: [
        {
          job_title: "Staff AI Application Engineer",
          company: "NexusAI Labs",
          location: "San Francisco, CA",
          start_date: "2023",
          end_date: "Present",
          is_current: true,
          description_bullets: [
            "Architected multi-agent LangGraph workflow orchestration engine processing 1.4M daily enterprise queries with 99.95% uptime.",
            "Engineered hybrid sparse/dense vector search using local Sentence-Transformers and Qdrant, improving retrieval recall @10 by 34%.",
            "Implemented streaming LLM token generation middleware with token-bucket rate limiting and async Redis caching, dropping p99 response time from 3.2s to 420ms.",
            "Mentored 8 engineers across prompt engineering best practices, evaluation benchmarks, and LangSmith observability integration."
          ],
          tools_and_methods: ["LangGraph", "Python", "FastAPI", "ChromaDB", "Groq API", "Docker", "Redis", "TypeScript"],
          quantified_impact: ["1.4M daily queries", "99.95% uptime", "34% recall improvement", "420ms p99 latency"]
        },
        {
          job_title: "Senior Backend & ML Engineer",
          company: "Stripe / HyperScale",
          location: "San Francisco, CA",
          start_date: "2020",
          end_date: "2023",
          is_current: false,
          description_bullets: [
            "Designed high-throughput webhook ingest engine handling 25,000 requests/sec with zero packet loss during peak transaction periods.",
            "Deployed production PyTorch anomaly detection model into asynchronous Celery/FastAPI pipeline, preventing $4.2M in fraudulent chargebacks.",
            "Spearheaded database partitioning and read-replica routing in PostgreSQL, lowering query contention by 48%."
          ],
          tools_and_methods: ["Python", "PostgreSQL", "FastAPI", "PyTorch", "Kubernetes", "Kafka", "AWS"],
          quantified_impact: ["25,000 req/sec", "$4.2M fraud savings", "48% contention reduction"]
        }
      ],
      education: [
        {
          degree: "B.S. in Computer Science & Applied Mathematics",
          institution: "University of California, Berkeley",
          location: "Berkeley, CA",
          graduation_year: "2020",
          gpa_or_honors: "3.91 GPA, Honors Thesis"
        }
      ],
      skill_categories: [
        {
          category_name: "Agentic AI & LLMs",
          skills: ["LangGraph", "LangChain", "RAG Pipelines", "Groq / Llama-3", "Prompt Engineering", "Vector Search", "ChromaDB", "Evaluation Frameworks"]
        },
        {
          category_name: "Backend Architecture",
          skills: ["Python", "FastAPI", "AsyncIO", "PostgreSQL", "Redis", "Docker", "Kubernetes", "REST / GraphQL", "Microservices"]
        },
        {
          category_name: "Frontend & Full-Stack",
          skills: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "React Query", "Framer Motion"]
        }
      ],
      all_skills_flat: [
        "LangGraph", "LangChain", "RAG Pipelines", "Groq / Llama-3", "FastAPI", "Python", "TypeScript", "Next.js", "ChromaDB", "PostgreSQL", "Redis", "Docker", "Kubernetes", "Vector Search", "PyTorch", "Evaluation Benchmarks"
      ],
      projects: [
        {
          title: "Autonomous RAG Synthesizer",
          description: "Multi-agent research engine that aggregates live financial filings, computes grounded similarity, and streams cited reports.",
          role: "Creator & Lead Architect",
          tools_technologies: ["LangGraph", "FastAPI", "Next.js", "ChromaDB"],
          url: "https://github.com/alexchen-ai/rag-synthesizer"
        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect - Professional",
          issuing_organization: "Amazon Web Services",
          issue_date: "2023"
        }
      ],
      languages: ["English (Native)", "Mandarin (Professional)"]
    },
    rawResumeText: `Alex Chen
Email: alex.chen@ai-systems.dev | Phone: +1 (415) 555-0142 | San Francisco, CA
GitHub: github.com/alexchen-ai | Portfolio: alexchen.dev

Professional Summary:
Senior AI/ML Systems Engineer with 6+ years of experience architecting low-latency LLM agent workflows, high-throughput RAG retrieval pipelines, and distributed Kubernetes microservices.

Work Experience:
NexusAI Labs — Staff AI Application Engineer (2023 - Present)
* Architected multi-agent LangGraph workflow orchestration engine processing 1.4M daily enterprise queries with 99.95% uptime.
* Engineered hybrid sparse/dense vector search using local Sentence-Transformers and Qdrant, improving retrieval recall @10 by 34%.
* Implemented streaming LLM token generation middleware with token-bucket rate limiting and async Redis caching, dropping p99 response time from 3.2s to 420ms.
* Mentored 8 engineers across prompt engineering best practices, evaluation benchmarks, and LangSmith observability.

Stripe / HyperScale — Senior Backend & ML Engineer (2020 - 2023)
* Designed high-throughput webhook ingest engine handling 25,000 requests/sec with zero packet loss during peak transaction periods.
* Deployed production PyTorch anomaly detection model into asynchronous Celery/FastAPI pipeline, preventing $4.2M in fraudulent chargebacks.
* Spearheaded database partitioning and read-replica routing in PostgreSQL, lowering query contention by 48%.

Education:
B.S. in Computer Science & Applied Mathematics — UC Berkeley (2020) | 3.91 GPA

Skills:
LangGraph, LangChain, RAG Pipelines, Groq / Llama-3, FastAPI, Python, TypeScript, Next.js, ChromaDB, PostgreSQL, Redis, Docker, Kubernetes`,
    jobDescription: {
      job_title: "Principal AI Systems Architect",
      company_name: "Frontier Intelligence",
      raw_text: `Role: Principal AI Systems Architect
Company: Frontier Intelligence
Location: Remote / San Francisco, CA

About the Role:
We are seeking a Principal AI Systems Architect to lead the design and production deployment of our next-generation Agentic AI reasoning platform. You will be responsible for end-to-end multi-agent orchestration, high-scale RAG retrieval, vector database architecture, and sub-second inference pipelines.

Key Responsibilities:
- Design and scale complex multi-step agentic workflows using LangGraph, stateful graph compilation, and tool calling.
- Architect real-time RAG systems incorporating grounded semantic citations, reranking, and low-latency chunk retrieval.
- Build production-grade, typed FastAPI backends with robust rate limiting, observability (LangSmith/OpenTelemetry), and async execution.
- Collaborate with frontend engineers to build responsive, streaming UX interfaces in Next.js and TypeScript.
- Drive engineering excellence, automated evaluation benchmarks, and failover redundancy across multiple LLM providers (Groq, Anthropic, Google Gemini).

Required Qualifications:
- 5+ years of production experience in Python, FastAPI, and asynchronous backend systems.
- Deep expertise with LangChain, LangGraph, and RAG architectures.
- Experience with vector stores (ChromaDB, Qdrant, Pinecone) and embedding fine-tuning.
- Proven experience deploying Docker containers and Kubernetes clusters in high-traffic environments.
- Exceptional communication skills and ability to mentor engineering teams.`
    }
  },
  {
    id: "healthcare-nurse",
    name: "Sarah Jenkins, BSN, RN",
    role: "Lead Trauma & Emergency Care Specialist",
    industry: "Healthcare & Clinical Nursing",
    badge: "Healthcare / Clinical",
    icon: "HeartPulse",
    resumeData: {
      contact_info: {
        full_name: "Sarah Jenkins, BSN, RN",
        email: "sarah.jenkins@nursing-specialists.org",
        phone: "+1 (312) 555-0199",
        location: "Chicago, IL",
        linkedin: "https://linkedin.com/in/sarahjenkins-rn",
        professional_title: "Lead Trauma & Emergency Department Registered Nurse"
      },
      professional_summary: "Dedicated, board-certified Emergency & Trauma Registered Nurse (BSN, RN) with 7+ years of acute critical care leadership across Level 1 Trauma Centers. Recognized for rapid patient triage, clinical EHR implementation, crisis de-escalation, and maintaining 100% compliance with Joint Commission and HIPAA protocols.",
      domain_industry: "Healthcare & Emergency Clinical Nursing",
      estimated_years_experience: 7.0,
      work_experience: [
        {
          job_title: "Charge Nurse / Lead Emergency Trauma Specialist",
          company: "Northwestern Memorial Hospital (Level 1 Trauma Center)",
          location: "Chicago, IL",
          start_date: "2021",
          end_date: "Present",
          is_current: true,
          description_bullets: [
            "Orchestrated clinical workflow and triage prioritization for a 48-bed Emergency Department managing 180+ acute patient admissions per 12-hour shift.",
            "Spearheaded hospital-wide Epic EHR clinical documentation overhaul, eliminating charting bottlenecks and reducing medication turnaround time by 28%.",
            "Supervised and trained a multidisciplinary team of 24 staff RNs, EMTs, and nursing residents in advanced cardiac life support and rapid trauma response.",
            "Maintained 0% medication dispensing errors over 3 consecutive quarters through rigorous barcode-assisted administration verification."
          ],
          tools_and_methods: ["Epic EHR", "Patient Triage (ESI)", "IV Cannulation", "Defibrillation / ACLS", "Telemetry Monitoring", "HIPAA Compliance"],
          quantified_impact: ["180+ daily admissions", "28% charting reduction", "24 staff supervised", "0% medication errors"]
        },
        {
          job_title: "Staff Critical Care Nurse (ICU)",
          company: "Rush University Medical Center",
          location: "Chicago, IL",
          start_date: "2018",
          end_date: "2021",
          is_current: false,
          description_bullets: [
            "Delivered comprehensive hemodynamic monitoring and ventilator management for critically ill medical-surgical ICU patients.",
            "Collaborated with attending intensivists and respiratory therapists to formulate personalized acute care weaning protocols.",
            "Educated patients and family members on discharge recovery plans, achieving a 96% patient satisfaction rating."
          ],
          tools_and_methods: ["Ventilator Management", "Central Line Dressing", "Arterial Lines", "Cerner EHR", "Infection Control"],
          quantified_impact: ["96% satisfaction rating", "32-bed ICU oversight"]
        }
      ],
      education: [
        {
          degree: "Bachelor of Science in Nursing (BSN)",
          institution: "University of Illinois at Chicago - College of Nursing",
          location: "Chicago, IL",
          graduation_year: "2018",
          gpa_or_honors: "Magna Cum Laude (3.88 GPA)"
        }
      ],
      skill_categories: [
        {
          category_name: "Emergency & Trauma Competencies",
          skills: ["Acute Trauma Triage (ESI)", "Advanced Cardiac Life Support (ACLS)", "Rapid Sequence Intubation Assist", "Central Venous Access", "Hemodynamic Monitoring"]
        },
        {
          category_name: "Clinical Systems & Compliance",
          skills: ["Epic Systems (Superuser)", "Cerner EHR", "Pyxis MedStation", "Joint Commission Standards", "HIPAA Regulatory Compliance"]
        },
        {
          category_name: "Leadership & Patient Care",
          skills: ["Charge Nurse Floor Leadership", "Cross-Functional Triage Coordination", "Crisis Intervention", "Preceptorship & Staff Training"]
        }
      ],
      all_skills_flat: [
        "Emergency Triage", "ACLS", "BLS", "PALS", "Epic EHR", "Trauma Resuscitation", "Hemodynamic Monitoring", "IV Insertion", "Medication Administration", "HIPAA", "Crisis De-escalation", "Staff Mentorship"
      ],
      projects: [],
      certifications: [
        {
          name: "Registered Nurse (RN) - State of Illinois License #RN-894120",
          issuing_organization: "Illinois Department of Financial and Professional Regulation",
          issue_date: "2018"
        },
        {
          name: "Certified Emergency Nurse (CEN)",
          issuing_organization: "Board of Certification for Emergency Nursing (BCEN)",
          issue_date: "2021"
        },
        {
          name: "ACLS, BLS, and PALS Provider",
          issuing_organization: "American Heart Association",
          issue_date: "2023"
        }
      ],
      languages: ["English (Native)", "Spanish (Medical Conversational)"]
    },
    rawResumeText: `Sarah Jenkins, BSN, RN, CEN
Email: sarah.jenkins@nursing-specialists.org | Phone: +1 (312) 555-0199 | Chicago, IL
LinkedIn: linkedin.com/in/sarahjenkins-rn

Professional Summary:
Dedicated, board-certified Emergency & Trauma Registered Nurse (BSN, RN) with 7+ years of acute critical care leadership across Level 1 Trauma Centers. Recognized for rapid patient triage, clinical EHR implementation, crisis de-escalation, and Joint Commission compliance.

Work Experience:
Northwestern Memorial Hospital — Charge Nurse / Lead Trauma Specialist (2021 - Present)
* Orchestrated clinical workflow and triage prioritization for a 48-bed Emergency Department managing 180+ acute patient admissions per 12-hour shift.
* Spearheaded hospital-wide Epic EHR clinical documentation overhaul, eliminating charting bottlenecks and reducing medication turnaround time by 28%.
* Supervised and trained a multidisciplinary team of 24 staff RNs, EMTs, and nursing residents in advanced cardiac life support and rapid trauma response.
* Maintained 0% medication dispensing errors over 3 consecutive quarters through rigorous barcode-assisted administration verification.

Rush University Medical Center — Staff Critical Care Nurse (ICU) (2018 - 2021)
* Delivered comprehensive hemodynamic monitoring and ventilator management for critically ill medical-surgical ICU patients.
* Collaborated with attending intensivists to formulate acute care weaning protocols, achieving 96% patient satisfaction.

Education:
Bachelor of Science in Nursing (BSN) — University of Illinois at Chicago (2018) | Magna Cum Laude

Certifications:
* Registered Nurse (RN) — Illinois State Board
* Certified Emergency Nurse (CEN) — BCEN
* ACLS, BLS, PALS — American Heart Association`,
    jobDescription: {
      job_title: "Clinical Nurse Supervisor - Emergency Department",
      company_name: "MetroHealth Regional Medical Center",
      raw_text: `Position: Clinical Nurse Supervisor - Emergency Department
Hospital: MetroHealth Regional Medical Center (Level 1 Adult & Pediatric Trauma Center)
Location: Chicago, IL

Position Overview:
We are seeking an experienced and compassionate Clinical Nurse Supervisor to lead day-to-day clinical operations within our high-volume Emergency Department. The Supervisor will ensure exceptional standards of patient care, oversee nurse staffing schedules, audit EHR documentation quality, and maintain strict compliance with Joint Commission and IDPH standards.

Key Duties:
- Direct nursing practice, bed coordination, and acuity-based triage assignment across 50+ ED treatment bays.
- Mentor, onboard, and evaluate performance for 30+ RNs, patient care techs, and clinical support staff.
- Champion quality improvement initiatives to reduce ED door-to-provider wait times and enhance patient safety benchmarks.
- Oversee electronic medical records (Epic) compliance, medication reconciliation, and narcotics chain-of-custody audits.
- Act as incident commander liaison during mass-casualty or code red trauma activations.

Qualifications & Requirements:
- Active, unencumbered Registered Nurse (RN) license in the State of Illinois (BSN required, MSN preferred).
- Minimum 5 years of clinical Emergency or Trauma nursing experience with at least 2 years in a Charge Nurse or Supervisory role.
- Current ACLS, BLS, and PALS certifications from AHA (TNCC or CEN strongly preferred).
- Demonstrated mastery of Epic EHR clinical workflows.
- Strong conflict resolution, crisis de-escalation, and empathetic communication skills.`
    }
  },
  {
    id: "growth-marketer",
    name: "Morgan Taylor",
    role: "VP of Growth & Demand Generation",
    industry: "B2B SaaS & Growth Marketing",
    badge: "Marketing / Commercial",
    icon: "TrendingUp",
    resumeData: {
      contact_info: {
        full_name: "Morgan Taylor",
        email: "morgan.taylor@growthlead.io",
        phone: "+1 (212) 555-9012",
        location: "New York, NY",
        linkedin: "https://linkedin.com/in/morgantaylor-growth",
        portfolio_website: "https://morgantaylor.marketing",
        professional_title: "VP of Growth & Demand Generation"
      },
      professional_summary: "Data-driven Growth Marketing Leader with 8+ years scaling B2B SaaS ARR from $5M to $45M+. Proven track record in multi-channel paid acquisition (LinkedIn, Google Search/YouTube), full-funnel marketing automation (HubSpot/Marketo), product-led growth (PLG) conversion loops, and building high-performance marketing teams.",
      domain_industry: "B2B SaaS & Digital Growth Marketing",
      estimated_years_experience: 8.0,
      work_experience: [
        {
          job_title: "Head of Growth & Demand Generation",
          company: "CloudScale Technologies",
          location: "New York, NY",
          start_date: "2021",
          end_date: "Present",
          is_current: true,
          description_bullets: [
            "Scaled Annual Recurring Revenue (ARR) from $12M to $38M in 28 months by building a predictable, multi-channel inbound and outbound pipeline.",
            "Managed $3.4M annual performance ad budget across LinkedIn Ads and Google Search, achieving an average Customer Acquisition Cost (CAC) payback period of 7.2 months with 4.1x blended ROAS.",
            "Revamped HubSpot lifecycle nurturing workflows and lead-scoring algorithms, increasing marketing-qualified lead (MQL) to sales-qualified opportunity (SQO) conversion from 14% to 31%.",
            "Recruited and managed a high-performing 9-person growth team spanning paid media, content strategy, marketing operations, and conversion rate optimization (CRO)."
          ],
          tools_and_methods: ["HubSpot", "Google Ads", "LinkedIn Campaign Manager", "Mixpanel", "Segment", "Salesforce CRM", "A/B Testing", "SQL"],
          quantified_impact: ["$12M to $38M ARR", "$3.4M budget", "7.2 mo CAC payback", "31% MQL->SQO conversion", "9-person team"]
        },
        {
          job_title: "Senior Growth Marketing Manager",
          company: "SaaSFlow Inc.",
          location: "New York, NY",
          start_date: "2018",
          end_date: "2021",
          is_current: false,
          description_bullets: [
            "Architected organic SEO content cluster strategy generating 450,000 monthly unique visitors and 2,800 monthly organic trial signups.",
            "Conducted 60+ multivariate landing page experiments using Webflow and Optimizely, improving overall homepage signup conversion rate by 44%."
          ],
          tools_and_methods: ["SEO", "Ahrefs", "Optimizely", "Google Analytics 4", "Webflow", "Stripe Billing"],
          quantified_impact: ["450K monthly visitors", "2,800 trial signups", "44% conversion lift"]
        }
      ],
      education: [
        {
          degree: "B.S. in Marketing & Data Analytics",
          institution: "New York University (NYU) - Stern School of Business",
          location: "New York, NY",
          graduation_year: "2018",
          gpa_or_honors: "Dean's Honor List"
        }
      ],
      skill_categories: [
        {
          category_name: "Growth Strategy & Acquisition",
          skills: ["B2B Demand Generation", "Paid Search & Social (Google, LinkedIn)", "SEO & Content Clustering", "Product-Led Growth (PLG)", "Pipeline Attribution"]
        },
        {
          category_name: "MarTech & Analytics",
          skills: ["HubSpot Marketing Hub", "Salesforce CRM", "Google Analytics 4", "Mixpanel", "Segment CDP", "SQL / BigQuery", "Optimizely (CRO)"]
        },
        {
          category_name: "Leadership & Commercial Operations",
          skills: ["Budget Allocation ($3M+)", "P&L Management", "Team Leadership & Hiring", "Sales & Marketing Alignment", "Executive Reporting"]
        }
      ],
      all_skills_flat: [
        "B2B Demand Gen", "Paid Acquisition", "SEO", "HubSpot", "Salesforce", "Google Ads", "LinkedIn Ads", "CAC / LTV Optimization", "Conversion Rate Optimization", "SQL", "Mixpanel", "P&L Management"
      ],
      projects: [],
      certifications: [
        {
          name: "HubSpot Certified Inbound & Revenue Operations Professional",
          issuing_organization: "HubSpot Academy",
          issue_date: "2023"
        },
        {
          name: "Reforge Growth Series Graduate",
          issuing_organization: "Reforge",
          issue_date: "2022"
        }
      ],
      languages: ["English (Native)"]
    },
    rawResumeText: `Morgan Taylor
Email: morgan.taylor@growthlead.io | Phone: +1 (212) 555-9012 | New York, NY
LinkedIn: linkedin.com/in/morgantaylor-growth | Portfolio: morgantaylor.marketing

Professional Summary:
Data-driven Growth Marketing Leader with 8+ years scaling B2B SaaS ARR from $5M to $45M+. Proven track record in multi-channel paid acquisition (LinkedIn, Google Search), full-funnel marketing automation (HubSpot), product-led growth (PLG), and team leadership.

Work Experience:
CloudScale Technologies — Head of Growth & Demand Generation (2021 - Present)
* Scaled Annual Recurring Revenue (ARR) from $12M to $38M in 28 months by building a predictable, multi-channel inbound and outbound pipeline.
* Managed $3.4M annual performance ad budget across LinkedIn Ads and Google Search, achieving 7.2 mo CAC payback with 4.1x blended ROAS.
* Revamped HubSpot lifecycle nurturing workflows and lead scoring, increasing MQL to SQO conversion from 14% to 31%.
* Recruited and managed a high-performing 9-person growth team.

SaaSFlow Inc. — Senior Growth Marketing Manager (2018 - 2021)
* Architected organic SEO content cluster strategy generating 450,000 monthly unique visitors and 2,800 monthly organic trial signups.
* Conducted 60+ multivariate landing page experiments, improving homepage signup conversion rate by 44%.

Education:
B.S. in Marketing & Data Analytics — NYU Stern School of Business (2018)

Skills:
B2B Demand Gen, Paid Acquisition, SEO, HubSpot, Salesforce, Google Ads, LinkedIn Ads, CAC / LTV Optimization, SQL, Mixpanel`,
    jobDescription: {
      job_title: "Vice President of Marketing & Growth",
      company_name: "HyperScale Cloud Enterprise",
      raw_text: `Job Title: Vice President of Marketing & Growth
Company: HyperScale Cloud Enterprise
Location: New York, NY / Hybrid

Role Summary:
HyperScale Cloud is seeking a visionary Vice President of Marketing & Growth to own our global demand engine and brand positioning. As VP of Marketing, you will own the entire marketing P&L, direct our performance acquisition channels, orchestrate enterprise product launches, and partner closely with the CRO to drive $50M+ in net new pipeline.

Key Responsibilities:
- Own the global pipeline generation target, managing a $5M+ digital marketing and field events budget.
- Lead and scale a world-class 15+ person marketing organization across Product Marketing, Demand Gen, Content, and MarTech operations.
- Deeply optimize customer acquisition cost (CAC), lifetime value (LTV), and pipeline velocity across enterprise and mid-market accounts.
- Oversee the complete modern MarTech stack (HubSpot, Salesforce, 6sense/Demandbase, Segment, Snowflake).
- Present regular growth forecasting and attribution metrics to the Board of Directors and Executive leadership.

Candidate Requirements:
- 8+ years of high-growth B2B SaaS marketing experience, with 3+ years in a Director or VP-level capacity.
- Demonstrated success scaling B2B SaaS companies past $30M+ ARR.
- Mastery of modern digital acquisition channels, account-based marketing (ABM), and SEO growth loops.
- Strong analytical and quantitative orientation (deep familiarity with SQL, Cohort LTV modeling, and multi-touch attribution).
- Exceptional executive presence, storytelling, and talent mentorship capabilities.`
    }
  }
];
