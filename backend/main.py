from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn
from core.config import settings
from db.database import initialize_database, create_tables

# Import routers
from routers import workflows, blocks, connections, data_ingestion, data_preprocessing, feature_engineering
from routers.health import router as health_router

# Create FastAPI instance
app = FastAPI(
    title=settings.app_name,
    description="Backend API for OctoML project",
    version=settings.app_version
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class HealthResponse(BaseModel):
    status: str
    message: str

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        print("🚀 Starting OctoML Backend...")
        print("📊 Initializing database connection...")
        initialize_database()
        create_tables()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise

# Routes
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {"message": f"Welcome to {settings.app_name}"}

# Include routers
app.include_router(health_router)
app.include_router(workflows.router)
app.include_router(blocks.router)
app.include_router(connections.router)
app.include_router(data_ingestion.router)
app.include_router(data_preprocessing.router)
app.include_router(feature_engineering.router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )