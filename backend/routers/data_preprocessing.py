"""
Router for data preprocessing configuration operations
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from db.database import get_db
from controllers.data_preprocessing_controller import DataPreprocessingController
from schemas.data_preprocessing import (
    DataPreprocessingCreate, DataPreprocessingUpdate, DataPreprocessingResponse, DataPreprocessingListResponse
)

router = APIRouter(prefix="/data-preprocessing", tags=["data-preprocessing"])


@router.post("/configs", response_model=DataPreprocessingResponse, status_code=status.HTTP_201_CREATED)
def create_data_preprocessing_config(
    config_data: DataPreprocessingCreate,
    db: Session = Depends(get_db)
):
    """Create a new data preprocessing configuration"""
    return DataPreprocessingController.create_config(db, config_data)


@router.get("/configs", response_model=DataPreprocessingListResponse)
def get_data_preprocessing_configs(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    auto_clean: Optional[bool] = Query(None, description="Filter by auto_clean setting"),
    db: Session = Depends(get_db)
):
    """Get multiple data preprocessing configurations with optional filtering"""
    configs = DataPreprocessingController.get_configs(db, skip=skip, limit=limit, auto_clean=auto_clean)
    total = DataPreprocessingController.count_configs(db, auto_clean=auto_clean)
    
    return DataPreprocessingListResponse(
        configs=configs,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/configs/{config_id}", response_model=DataPreprocessingResponse)
def get_data_preprocessing_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """Get data preprocessing configuration by ID"""
    return DataPreprocessingController.get_config(db, config_id)


@router.get("/configs/name/{name}", response_model=DataPreprocessingResponse)
def get_data_preprocessing_config_by_name(
    name: str,
    db: Session = Depends(get_db)
):
    """Get data preprocessing configuration by name"""
    return DataPreprocessingController.get_config_by_name(db, name)


@router.put("/configs/{config_id}", response_model=DataPreprocessingResponse)
def update_data_preprocessing_config(
    config_id: int,
    config_data: DataPreprocessingUpdate,
    db: Session = Depends(get_db)
):
    """Update data preprocessing configuration"""
    return DataPreprocessingController.update_config(db, config_id, config_data)


@router.delete("/configs/{config_id}")
def delete_data_preprocessing_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """Delete data preprocessing configuration"""
    return DataPreprocessingController.delete_config(db, config_id)


@router.get("/configs/count/total")
def count_data_preprocessing_configs(
    auto_clean: Optional[bool] = Query(None, description="Filter by auto_clean setting"),
    db: Session = Depends(get_db)
):
    """Count total data preprocessing configurations"""
    return {"count": DataPreprocessingController.count_configs(db, auto_clean=auto_clean)}
