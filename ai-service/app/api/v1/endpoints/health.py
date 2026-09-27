from fastapi import APIRouter
from datetime import datetime
from app.models.schemas import HealthCheckResponse
from app.core.config import settings

router = APIRouter()

@router.get("", response_model=HealthCheckResponse)
def get_health():
    return HealthCheckResponse(
        status="UP",
        service=settings.PROJECT_NAME,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.utcnow()
    )
