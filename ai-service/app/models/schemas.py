from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class HealthCheckResponse(BaseModel):
    status: str
    service: str
    environment: str
    timestamp: datetime

class ProblemDiagnosisRequest(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=5)
    category: str
    severity: Optional[str] = "MEDIUM"
    asset_info: Optional[str] = None

class ProblemDiagnosisResponse(BaseModel):
    summary: str
    possibleCauses: List[str]
    recommendedActions: List[str]
    severity: str
    diySuitable: bool
    professionalRecommended: bool
    safetyWarnings: List[str]
