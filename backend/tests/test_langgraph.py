import pytest
from app.agents.graph import pipeline_runner
from app.models.analysis import JobDescriptionInput


@pytest.mark.asyncio
async def test_full_langgraph_pipeline_execution():
    resume_sample = """Morgan Taylor, Marketing Lead
Email: morgan.taylor@growth.com | Phone: 212-555-9012 | New York, NY
Summary: Growth marketing lead specializing in B2B demand gen, SEO, and paid acquisition.

Experience:
Acme SaaS - Senior Growth Marketing Manager (2021 - Present)
* Scaled monthly recurring revenue (MRR) from $120K to $850K via performance marketing.
* Managed $1.2M annual ad budget across LinkedIn and Google Ads with 3.8x ROAS.
* Built full-funnel HubSpot lead nurture workflows generating 4,200+ qualified leads.

Skills:
Performance Marketing, Google Ads, LinkedIn Ads, SEO, HubSpot, Mixpanel, SQL, A/B Testing
"""
    jd_sample = JobDescriptionInput(
        job_title="Head of Growth",
        company_name="VentureScale",
        raw_text="""We are looking for a Head of Growth to scale our B2B SaaS platform.
Requirements:
* 5+ years of growth marketing experience in B2B SaaS
* Proven track record scaling paid ads (LinkedIn & Google Ads) with high ROAS
* Deep expertise in HubSpot marketing automation, lead scoring, and pipeline attribution
* Experience with SQL and product analytics (Mixpanel or Amplitude)
* Strong leadership and executive communication skills
"""
    )

    result = await pipeline_runner.run(
        session_id="test_session_1",
        raw_text=resume_sample,
        job_description=jd_sample
    )

    assert result.match_scores.overall_score >= 50
    assert result.job_breakdown.inferred_title != ""
    assert len(result.skill_gaps.matched_skills) >= 1
    assert result.ats_report.ats_score > 0
    assert len(result.rewrite_suggestions) >= 1
    assert len(result.pipeline_execution_logs) == 7  # All 7 LangGraph nodes executed!
