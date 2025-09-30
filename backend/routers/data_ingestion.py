"""
Router for data ingestion configuration operations
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from db.database import get_db
from controllers.data_ingestion_controller import DataIngestionController
from schemas.data_ingestion import (
    DataIngestionCreate, DataIngestionUpdate, DataIngestionResponse, DataIngestionListResponse
)

router = APIRouter(prefix="/data-ingestion", tags=["data-ingestion"])


@router.post("/configs", response_model=DataIngestionResponse, status_code=status.HTTP_201_CREATED)
def create_data_ingestion_config(
    config_data: DataIngestionCreate,
    db: Session = Depends(get_db)
):
    """Create a new data ingestion configuration"""
    return DataIngestionController.create_config(db, config_data)


@router.get("/configs", response_model=DataIngestionListResponse)
def get_data_ingestion_configs(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    file_type: Optional[str] = Query(None, description="Filter by file type"),
    db: Session = Depends(get_db)
):
    """Get multiple data ingestion configurations with optional filtering"""
    configs = DataIngestionController.get_configs(db, skip=skip, limit=limit, file_type=file_type)
    total = DataIngestionController.count_configs(db, file_type=file_type)
    
    return DataIngestionListResponse(
        configs=configs,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/configs/{config_id}", response_model=DataIngestionResponse)
def get_data_ingestion_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """Get data ingestion configuration by ID"""
    return DataIngestionController.get_config(db, config_id)


@router.get("/configs/name/{name}", response_model=DataIngestionResponse)
def get_data_ingestion_config_by_name(
    name: str,
    db: Session = Depends(get_db)
):
    """Get data ingestion configuration by name"""
    return DataIngestionController.get_config_by_name(db, name)


@router.put("/configs/{config_id}", response_model=DataIngestionResponse)
def update_data_ingestion_config(
    config_id: int,
    config_data: DataIngestionUpdate,
    db: Session = Depends(get_db)
):
    """Update data ingestion configuration"""
    return DataIngestionController.update_config(db, config_id, config_data)


@router.delete("/configs/{config_id}")
def delete_data_ingestion_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """Delete data ingestion configuration"""
    return DataIngestionController.delete_config(db, config_id)


@router.get("/configs/count/total")
def count_data_ingestion_configs(
    file_type: Optional[str] = Query(None, description="Filter by file type"),
    db: Session = Depends(get_db)
):
    """Count total data ingestion configurations"""
    return {"count": DataIngestionController.count_configs(db, file_type=file_type)}
