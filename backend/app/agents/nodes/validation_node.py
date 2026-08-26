import time
import logging
from ..state import AgentState

logger = logging.getLogger("resumeiq.nodes.validation")


async def validation_node(state: AgentState) -> AgentState:
    """LangGraph Node 2: Validates extracted data integrity and flags missing core elements."""
    start_time = time.time()
    logs = list(state.get("execution_logs", []))

    resume_data = state.get("resume_data")
    if not resume_data:
        logs.append({
            "node": "Data Validation",
            "status": "error",
            "duration_sec": round(time.time() - start_time, 2),
            "message": "No structured resume data found to validate."
        })
        return {**state, "error": "Validation failed: Empty resume data", "execution_logs": logs}

    # Completeness checks
    flags = []
    if not resume_data.contact_info.email:
        flags.append("Missing email address")
    if not resume_data.work_experience:
        flags.append("No work experience entries detected")
    if not resume_data.all_skills_flat:
        flags.append("No explicit skills section extracted")

    elapsed = round(time.time() - start_time, 2)
    summary = f"Validated resume profile. {len(flags)} integrity warnings flagged." if flags else "Validation passed cleanly with high structural fidelity."
    
    logs.append({
        "node": "Data Validation",
        "status": "success",
        "duration_sec": elapsed,
        "message": summary
    })

    return {
        **state,
        "execution_logs": logs
    }
