from fastapi import APIRouter
from app.api.v1.endpoints import health, diagnose

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(diagnose.router, prefix="/diagnose", tags=["diagnose"])
