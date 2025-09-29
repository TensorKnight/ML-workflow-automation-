"""
Common dependencies used across the application
"""
from fastapi import Depends, Request
from sqlalchemy.orm import Session
from db.database import get_db
from core.config import settings


def get_settings():
    """
    Get application settings
    """
    return settings


def get_request_info(request: Request):
    """
    Get request information
    """
    return {
        "method": request.method,
        "url": str(request.url),
        "headers": dict(request.headers),
        "client_ip": request.client.host if request.client else None
    }


def get_db_dependency() -> Session:
    """
    Database dependency wrapper
    """
    return Depends(get_db)
