"""
Health check router
"""
from fastapi import APIRouter
from schemas.health import HealthResponse

router = APIRouter()

@router.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Service is running"
    )
