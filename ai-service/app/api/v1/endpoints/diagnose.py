from fastapi import APIRouter
from app.models.schemas import ProblemDiagnosisRequest, ProblemDiagnosisResponse
from app.services.diagnosis_engine import DiagnosisEngine

router = APIRouter()

@router.post("", response_model=ProblemDiagnosisResponse)
def diagnose_problem(request: ProblemDiagnosisRequest):
    """
    AI-assisted diagnostic classification and triage.
    Distinguishes potential causes, safety hazards, and resolution routes.
    """
    return DiagnosisEngine.diagnose(request)

