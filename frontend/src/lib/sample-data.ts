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
    name: "Ali Tariq",
    role: "Lead AI & Full-Stack Systems Engineer",
    industry: "AI & Enterprise Systems",
    badge: "Tech / AI Engineering",
    icon: "Cpu",
    resumeData: {
      contact_info: {
        full_name: "Ali Tariq",
        email: "ali.tariq@systems.com",
        phone: "+92 300 5550192",
        location: "Lahore, Pakistan (Open to Hybrid / Remote)",
        linkedin: "https://linkedin.com/in/alitariq-ai",
        github: "https://github.com/alitariq-ai",
        portfolio_website: "https://alitariq.dev",
        professional_title: "Lead AI & Distributed Systems Engineer"
      },
      professional_summary: "Senior AI/ML Systems Engineer with 6+ years of experience architecting low-latency LLM agent workflows, high-throughput RAG retrieval pipelines, and distributed microservices across Systems Limited and 10Pearls. Experienced in LangGraph orchestration, vector database optimization (Chroma, Qdrant), and asynchronous FastAPI backends.",
      domain_industry: "Artificial Intelligence & Distributed Systems",
      estimated_years_experience: 6.5,
      work_experience: [
        {
          job_title: "Lead AI Systems Architect",
          company: "Systems Limited",
          location: "Lahore, Pakistan",
          start_date: "2022",
          end_date: "Present",
          is_current: true,
          description_bullets: [
            "Architected enterprise multi-agent LangGraph workflow orchestration engine processing 1.2M daily transactions for international clients with 99.95% uptime.",
            "Engineered hybrid sparse/dense vector search using Sentence-Transformers and Qdrant, improving retrieval recall @10 by 36% across 500k technical documents.",
            "Implemented streaming LLM token generation middleware with token-bucket rate limiting and async Redis caching, dropping p99 response latency from 3.4s to 410ms.",
            "Mentored team of 10 software engineers across prompt engineering best practices, evaluation benchmarks, and LangSmith observability integration."
          ],
          tools_and_methods: ["LangGraph", "Python", "FastAPI", "Qdrant", "Groq API", "Docker", "Redis", "TypeScript"],
          quantified_impact: ["1.2M daily transactions", "99.95% uptime", "36% recall improvement", "410ms p99 latency"]
        },
        {
          job_title: "Senior Backend & ML Engineer",
          company: "10Pearls",
          location: "Islamabad, Pakistan",
          start_date: "2019",
          end_date: "2022",
          is_current: false,
          description_bullets: [
            "Designed high-throughput payment webhook ingest engine handling 20,000 requests/sec with zero packet loss during peak campaign periods.",
            "Deployed production PyTorch anomaly detection model into asynchronous Celery/FastAPI pipeline, preventing PKR 85M in fraudulent transactions.",
            "Spearheaded database partitioning and read-replica routing in PostgreSQL, lowering query contention by 45%."
          ],
          tools_and_methods: ["Python", "PostgreSQL", "FastAPI", "PyTorch", "Kubernetes", "Kafka", "AWS"],
          quantified_impact: ["20,000 req/sec", "PKR 85M fraud savings", "45% contention reduction"]
        }
      ],
      education: [
        {
          degree: "B.S. in Computer Science",
          institution: "FAST-NUCES (National University of Computer and Emerging Sciences)",
          location: "Islamabad, Pakistan",
          graduation_year: "2019",
          gpa_or_honors: "3.84 CGPA, Dean's Honor Roll"
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
          description: "Multi-agent research engine that aggregates financial documents, computes grounded similarity, and streams cited reports.",
          role: "Creator & Lead Architect",
          tools_technologies: ["LangGraph", "FastAPI", "Next.js 15", "Qdrant", "Tailwind CSS"],
          url: "https://github.com/alitariq-ai/rag-synthesizer"

        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect – Associate",
          issuing_organization: "Amazon Web Services",
          issue_date: "2023"
        }
      ],
      languages: ["English (Fluent / Professional)", "Urdu (Native)"],
      raw_text: `Ali Tariq
Email: ali.tariq@systems.com | Phone: +92 300 5550192 | Lahore, Pakistan
LinkedIn: linkedin.com/in/alitariq-ai | GitHub: github.com/alitariq-ai

Professional Summary:
Senior AI/ML Systems Engineer with 6+ years of experience architecting low-latency LLM agent workflows, high-throughput RAG retrieval pipelines, and distributed microservices across Systems Limited and 10Pearls. Experienced in LangGraph orchestration, vector database optimization (Chroma, Qdrant), and asynchronous FastAPI backends.

Work Experience:
Lead AI Systems Architect — Systems Limited (2022 - Present) | Lahore, Pakistan
* Architected enterprise multi-agent LangGraph workflow orchestration engine processing 1.2M daily transactions for international clients with 99.95% uptime.
* Engineered hybrid sparse/dense vector search using Sentence-Transformers and Qdrant, improving retrieval recall @10 by 36% across 500k technical documents.
* Implemented streaming LLM token generation middleware with token-bucket rate limiting and async Redis caching, dropping p99 response latency from 3.4s to 410ms.
* Mentored team of 10 software engineers across prompt engineering best practices, evaluation benchmarks, and LangSmith observability integration.

Senior Backend & ML Engineer — 10Pearls (2019 - 2022) | Islamabad, Pakistan
* Designed high-throughput payment webhook ingest engine handling 20,000 requests/sec with zero packet loss during peak campaign periods.
* Deployed production PyTorch anomaly detection model into asynchronous Celery/FastAPI pipeline, preventing PKR 85M in fraudulent transactions.
* Spearheaded database partitioning and read-replica routing in PostgreSQL, lowering query contention by 45%.

Education:
Bachelor of Science in Computer Science (BSCS) — FAST-NUCES (2019) | Islamabad | 3.84 CGPA

Technical Skills:
LangGraph, LangChain, RAG, Python, FastAPI, Docker, Kubernetes, Next.js, TypeScript, PostgreSQL, Redis, Qdrant, PyTorch`
    },
    rawResumeText: "",
    jobDescription: {
      job_title: "Staff AI Engineer (Agentic Workflows & Distributed Systems)",
      company_name: "Arbisoft / Careem Pakistan",
      raw_text: `Position: Staff AI Engineer — Agentic Systems & Platform
Location: Lahore / Islamabad, Pakistan (Hybrid)
Company: Arbisoft

Role Overview:
We are looking for an exceptional Staff AI Engineer to spearhead our agentic AI application architecture. You will design, build, and deploy production-grade multi-agent reasoning workflows, robust retrieval-augmented generation (RAG) engines, and ultra-low-latency LLM inference pipelines.

Key Responsibilities:
* Design stateful, multi-step LLM workflows utilizing LangGraph or equivalent graph-based agent frameworks with cycle detection and human-in-the-loop controls.
* Build high-precision RAG systems combining semantic vector search (Chroma, Qdrant) with hybrid BM25 lexical reranking and exact chunk citations.
* Develop resilient, asynchronous microservices using Python (FastAPI), Redis, Docker, and Kubernetes.
* Implement structured JSON/Pydantic validation schemas with graceful dual-provider fallback mechanisms (e.g. Groq, Google Gemini, OpenAI).
* Benchmark model latency, token budgets, and cost efficiency across edge and cloud LLM providers.

Required Qualifications:
* 5+ years of production experience in software engineering, with at least 3 years building AI/ML or LLM-powered applications.
* Proven mastery of LangChain, LangGraph, Python (FastAPI / AsyncIO), and vector databases.
* Strong background in Next.js, TypeScript, and modern API architecture.
* Excellent communication and technical leadership skills.`
    }
  },

  {
    id: "healthcare-nurse",
    name: "Dr. Ayesha Malik",
    role: "Lead Clinical Operations Specialist & Trauma Lead",
    industry: "Healthcare & Clinical Operations",
    badge: "Healthcare / Clinical",
    icon: "HeartPulse",
    resumeData: {
      contact_info: {
        full_name: "Dr. Ayesha Malik",
        email: "ayesha.malik@akuh.edu.pk",
        phone: "+92 321 5550183",
        location: "Karachi, Pakistan",
        linkedin: "https://linkedin.com/in/ayeshamalik-md",
        professional_title: "Lead Clinical Specialist & Emergency Department Coordinator"
      },
      professional_summary: "Board-certified Emergency & Trauma Clinical Specialist with 7+ years of acute critical care leadership across Aga Khan University Hospital and Shaukat Khanum Memorial. Recognized for rapid patient triage protocols, EHR optimization, JCIA quality compliance, and multidisciplinary medical team leadership.",
      domain_industry: "Healthcare & Emergency Clinical Practice",
      estimated_years_experience: 7.2,
      work_experience: [
        {
          job_title: "Lead Trauma Specialist & Clinical Coordinator",
          company: "Aga Khan University Hospital (AKUH)",
          location: "Karachi, Pakistan",
          start_date: "2021",
          end_date: "Present",
          is_current: true,
          description_bullets: [
            "Directed clinical workflow and triage prioritization for a 60-bed Emergency & Trauma Department managing 200+ acute admissions per 12-hour shift.",
            "Spearheaded hospital-wide EHR clinical documentation overhaul, eliminating charting bottlenecks and reducing medication turnaround time by 32%.",
            "Supervised and trained a multidisciplinary team of 30 staff nurses, residents, and EMTs in advanced cardiac life support (ACLS) and disaster response.",
            "Maintained 100% JCIA hospital accreditation audit compliance over 4 consecutive quarters through standardized clinical protocols."
          ],
          tools_and_methods: ["Epic EHR", "JCIA Protocols", "ACLS", "BLS", "Trauma Triage (ESI)", "Clinical Governance"],
          quantified_impact: ["200+ admissions/shift", "32% faster turnaround", "30 clinical staff trained", "100% audit compliance"]
        },
        {
          job_title: "Emergency Care Specialist",
          company: "Shaukat Khanum Memorial Cancer Hospital",
          location: "Lahore, Pakistan",
          start_date: "2018",
          end_date: "2021",
          is_current: false,
          description_bullets: [
            "Provided acute emergency resuscitation and critical care for oncological inpatients experiencing acute sepsis and cardiopulmonary distress.",
            "Formulated nursing protocol for central line-associated bloodstream infection (CLABSI) reduction, lowering infection incidents by 44% in ICU.",
            "Conducted weekly clinical morbidity & mortality reviews, presenting actionable root-cause analyses to chief medical officers."
          ],
          tools_and_methods: ["Critical Care", "Hemodynamic Monitoring", "IV Therapy", "Clinical Audits"],
          quantified_impact: ["44% CLABSI reduction", "100+ critical resuscitations"]
        }
      ],
      education: [
        {
          degree: "MBBS / Post-Grad Clinical Fellowship",
          institution: "King Edward Medical University / AKU",
          location: "Pakistan",
          graduation_year: "2017",
          gpa_or_honors: "Honors in Surgery & Medicine"
        }
      ],
      skill_categories: [
        {
          category_name: "Emergency & Critical Care",
          skills: ["Acute Trauma Triage (ESI)", "ACLS / BLS / PALS", "Hemodynamic Monitoring", "Disaster Management", "Crisis De-escalation"]
        },
        {
          category_name: "Healthcare Systems & Quality",
          skills: ["Epic EHR Documentation", "JCIA Accreditation", "HIPAA Compliance", "Clinical Governance", "Staff Mentorship"]
        }
      ],
      all_skills_flat: [
        "Trauma Triage", "Epic EHR", "JCIA Compliance", "ACLS", "BLS", "PALS", "Critical Care", "Clinical Audits", "Staff Leadership", "Infection Control"
      ],
      projects: [],
      certifications: [
        {
          name: "ACLS & BLS Instructor Certification",
          issuing_organization: "American Heart Association",
          issue_date: "2023"
        }
      ],
      languages: ["English (Fluent)", "Urdu (Native)"],
      raw_text: `Dr. Ayesha Malik
Email: ayesha.malik@akuh.edu.pk | Phone: +92 321 5550183 | Karachi, Pakistan
LinkedIn: linkedin.com/in/ayeshamalik-md

Professional Summary:
Board-certified Emergency & Trauma Clinical Specialist with 7+ years of acute critical care leadership across Aga Khan University Hospital and Shaukat Khanum Memorial. Recognized for rapid patient triage protocols, EHR optimization, JCIA quality compliance, and multidisciplinary medical team leadership.

Work Experience:
Lead Trauma Specialist & Clinical Coordinator — Aga Khan University Hospital (2021 - Present) | Karachi
* Directed clinical workflow and triage prioritization for a 60-bed Emergency & Trauma Department managing 200+ acute admissions per shift.
* Spearheaded hospital-wide EHR clinical documentation overhaul, eliminating charting bottlenecks and reducing medication turnaround time by 32%.
* Supervised and trained a multidisciplinary team of 30 staff nurses, residents, and EMTs in ACLS and disaster response.
* Maintained 100% JCIA hospital accreditation audit compliance over 4 consecutive quarters.

Emergency Care Specialist — Shaukat Khanum Memorial Cancer Hospital (2018 - 2021) | Lahore
* Provided acute emergency resuscitation and critical care for oncological inpatients experiencing acute sepsis.
* Formulated protocol for infection reduction, lowering CLABSI incidents by 44% in ICU.

Education:
MBBS / Fellowship — King Edward Medical University / AKU (2017)

Skills:
Trauma Triage (ESI), Epic EHR, JCIA Compliance, ACLS, BLS, PALS, Clinical Governance, Staff Leadership`
    },
    rawResumeText: "",
    jobDescription: {
      job_title: "Clinical Department Supervisor — Emergency & Critical Care",
      company_name: "Shifa International Hospital",
      raw_text: `Position: Clinical Department Supervisor — Emergency Medicine & Critical Care
Institution: Shifa International Hospital
Location: Islamabad, Pakistan

Overview:
We are seeking an experienced Clinical Supervisor to oversee day-to-day operations across our high-volume Emergency Department.

Key Responsibilities:
* Supervise clinical staff, bed allocations, and acuity-based triage workflows across 50+ ED bays.
* Drive clinical excellence, JCIA accreditation adherence, and patient safety indicators.
* Lead disaster preparedness, trauma surge protocols, and code blue response teams.
* Oversee electronic medical record documentation accuracy and staff training.

Requirements:
* Recognized medical/clinical degree with 5+ years of high-volume Emergency or Trauma clinical leadership.
* Current ACLS, BLS, and PALS certifications.
* Demonstrated mastery of modern hospital EHR documentation systems.
* Proven track record in clinical team supervision, conflict resolution, and quality audits.`
    }
  },

  {
    id: "growth-marketer",
    name: "Zainab Ahmed",
    role: "VP of Growth & Digital Commerce",
    industry: "E-Commerce & Digital Growth",
    badge: "Marketing / Commercial",
    icon: "TrendingUp",
    resumeData: {
      contact_info: {
        full_name: "Zainab Ahmed",
        email: "zainab.ahmed@growthlab.pk",
        phone: "+92 333 5550174",
        location: "Karachi / Islamabad, Pakistan",
        linkedin: "https://linkedin.com/in/zainabahmed-growth",
        professional_title: "VP of Growth & Performance Marketing"
      },
      professional_summary: "Performance-driven Growth & Marketing Executive with 8+ years scaling consumer tech, e-commerce, and fintech platforms across Daraz (Alibaba Group) and Jazz (VEON). Expert in full-funnel acquisition, paid media ROI, customer retention, and multi-touch attribution modeling.",
      domain_industry: "Digital Growth & E-Commerce Marketing",
      estimated_years_experience: 8.0,
      work_experience: [
        {
          job_title: "Head of Growth & Performance Marketing",
          company: "Daraz (Alibaba Group)",
          location: "Karachi, Pakistan",
          start_date: "2021",
          end_date: "Present",
          is_current: true,
          description_bullets: [
            "Managed PKR 450M annual marketing budget across Meta, Google Ads, TikTok, and programmatic networks, scaling GMV by 115% YoY.",
            "Reduced blended Customer Acquisition Cost (CAC) by 28% through algorithmic bid optimization and high-velocity creative testing (50+ weekly ad variants).",
            "Built automated lifecycle reactivation loops with Braze and Mixpanel, uplifting 90-day buyer retention rate by 22%."
          ],
          tools_and_methods: ["Meta Ads Manager", "Google Ads", "TikTok Ads", "Mixpanel", "Braze", "SQL", "Tableau", "Attribution Modeling"],
          quantified_impact: ["PKR 450M budget managed", "115% YoY GMV growth", "28% CAC reduction", "22% retention uplift"]
        },
        {
          job_title: "Digital Growth Lead",
          company: "Jazz (VEON)",
          location: "Islamabad, Pakistan",
          start_date: "2018",
          end_date: "2021",
          is_current: false,
          description_bullets: [
            "Scaled digital app monthly active users (MAU) from 1.5M to 8.2M through programmatic ASO, referral loops, and gamified promotions.",
            "Designed cohort-based churn prediction model in SQL and Python, enabling proactive retention offers that retained 380,000 at-risk subscribers."
          ],
          tools_and_methods: ["Python", "SQL", "Amplitude", "Google Analytics 4", "AppsFlyer"],
          quantified_impact: ["1.5M to 8.2M MAU growth", "380k subscribers retained"]
        }
      ],
      education: [
        {
          degree: "B.Sc. (Honours) in Economics & Management",
          institution: "Lahore University of Management Sciences (LUMS)",
          location: "Lahore, Pakistan",
          graduation_year: "2016",
          gpa_or_honors: "Dean's Honor List"
        }
      ],
      skill_categories: [
        {
          category_name: "Acquisition & Performance",
          skills: ["Paid Search (SEM)", "Paid Social (Meta/TikTok)", "App Store Optimization (ASO)", "Programmatic Media", "CAC Optimization"]
        },
        {
          category_name: "Retention & Product Analytics",
          skills: ["Lifecycle Marketing (Braze)", "Cohort Analysis", "Mixpanel / Amplitude", "SQL / BI Dashboards", "A/B Testing"]
        }
      ],
      all_skills_flat: [
        "Performance Marketing", "Meta Ads", "Google Ads", "SQL", "Mixpanel", "Braze", "CAC Optimization", "Retention Modeling", "Growth Hacking", "E-Commerce Strategy"
      ],
      projects: [],
      certifications: [
        {
          name: "Meta Certified Media Buying Professional",
          issuing_organization: "Meta Blueprint",
          issue_date: "2022"
        }
      ],
      languages: ["English (Fluent)", "Urdu (Native)"],
      raw_text: `Zainab Ahmed
Email: zainab.ahmed@growthlab.pk | Phone: +92 333 5550174 | Karachi, Pakistan
LinkedIn: linkedin.com/in/zainabahmed-growth

Professional Summary:
Performance-driven Growth & Marketing Executive with 8+ years scaling consumer tech, e-commerce, and fintech platforms across Daraz (Alibaba Group) and Jazz (VEON). Expert in full-funnel acquisition, paid media ROI, customer retention, and multi-touch attribution modeling.

Work Experience:
Head of Growth & Performance Marketing — Daraz (Alibaba Group) (2021 - Present) | Karachi
* Managed PKR 450M annual marketing budget, scaling GMV by 115% YoY.
* Reduced blended CAC by 28% through algorithmic bidding and creative testing.
* Uplifted 90-day retention by 22% using Braze lifecycle marketing.

Digital Growth Lead — Jazz (VEON) (2018 - 2021) | Islamabad
* Scaled digital app MAU from 1.5M to 8.2M through referral loops and ASO.
* Retained 380,000 at-risk subscribers using cohort analysis in SQL.

Education:
B.Sc. (Honours) — Lahore University of Management Sciences (LUMS) (2016)

Skills:
Performance Marketing, Meta Ads, Google Ads, SQL, Mixpanel, Braze, CAC Optimization, Retention Modeling`
    },
    rawResumeText: "",
    jobDescription: {
      job_title: "Head of Growth & Digital Strategy",
      company_name: "Foodpanda Pakistan",
      raw_text: `Position: Head of Growth & Digital Strategy
Company: Foodpanda Pakistan (Delivery Hero)
Location: Karachi / Lahore, Pakistan

Role Overview:
We are looking for a visionary Head of Growth to lead user acquisition, retention, and digital marketing strategy across our nationwide delivery network.

Key Responsibilities:
* Own high-scale multi-million dollar annual performance marketing budget across paid channels, direct response, and programmatic campaigns.
* Optimize full-funnel unit economics (CAC, LTV, payback period, and conversion rate).
* Partner with Product and Data teams to build rigorous A/B experiment roadmaps and user segmentation models.
* Lead and mentor a team of performance marketers, copywriters, and lifecycle managers.

Requirements:
* 6+ years in growth marketing or performance acquisition within high-growth tech / e-commerce companies.
* Deep mastery of digital ad platforms, attribution modeling, SQL, and cohort analytics.
* Proven track record scaling revenue, managing large marketing budgets, and leading cross-functional teams.`
    }
  }
];
