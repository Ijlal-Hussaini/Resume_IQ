import logging
from fastapi import APIRouter, HTTPException, Response
from ..models.api import ApiResponse, ExportReportRequest
from ..services.report_generator import report_generator

router = APIRouter(prefix="/export", tags=["Export & Reporting"])
logger = logging.getLogger("resumeiq.routers.export")


@router.post("")
async def export_report(request: ExportReportRequest):
    """
    Exports structured career intelligence results into JSON, Markdown, or HTML format.
    """
    fmt = request.format.lower()
    resume = request.resume_data
    analysis = request.analysis_result

    if fmt == "json":
        json_content = report_generator.generate_json_report(resume, analysis)
        return Response(
            content=json_content,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=resumeiq_report.json"}
        )
    elif fmt in ["md", "markdown"]:
        md_content = report_generator.generate_markdown_report(resume, analysis)
        return Response(
            content=md_content,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename=resumeiq_report.md"}
        )
    elif fmt in ["html", "pdf"]:
        html_content = report_generator.generate_html_report(resume, analysis)
        return Response(
            content=html_content,
            media_type="text/html",
            headers={"Content-Disposition": f"attachment; filename=resumeiq_report.html"}
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported export format: {fmt}")
