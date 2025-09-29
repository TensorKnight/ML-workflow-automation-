"""
Router for feature engineering configuration operations
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from db.database import get_db
from controllers.feature_engineering_controller import FeatureEngineeringController
from schemas.feature_engineering import (
    FeatureEngineeringCreate, FeatureEngineeringUpdate, FeatureEngineeringResponse, FeatureEngineeringListResponse
)

router = APIRouter(prefix="/feature-engineering", tags=["feature-engineering"])


@router.post("/configs", response_model=FeatureEngineeringResponse, status_code=status.HTTP_201_CREATED)
def create_feature_engineering_config(
    config_data: FeatureEngineeringCreate,
    db: Session = Depends(get_db)
):
    """Create a new feature engineering configuration"""
    return FeatureEngineeringController.create_config(db, config_data)


@router.get("/configs", response_model=FeatureEngineeringListResponse)
def get_feature_engineering_configs(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    feature_type: Optional[str] = Query(None, description="Filter by feature type"),
    target_type: Optional[str] = Query(None, description="Filter by target type"),
    db: Session = Depends(get_db)
):
    """Get multiple feature engineering configurations with optional filtering"""
    configs = FeatureEngineeringController.get_configs(
        db, skip=skip, limit=limit, feature_type=feature_type, target_type=target_type
    )
    total = FeatureEngineeringController.count_configs(db, feature_type=feature_type, target_type=target_type)
    
    return FeatureEngineeringListResponse(
        configs=configs,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/configs/{config_id}", response_model=FeatureEngineeringResponse)
def get_feature_engineering_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """Get feature engineering configuration by ID"""
    return FeatureEngineeringController.get_config(db, config_id)


@router.get("/configs/name/{name}", response_model=FeatureEngineeringResponse)
def get_feature_engineering_config_by_name(
    name: str,
    db: Session = Depends(get_db)
):
    """Get feature engineering configuration by name"""
    return FeatureEngineeringController.get_config_by_name(db, name)


@router.put("/configs/{config_id}", response_model=FeatureEngineeringResponse)
def update_feature_engineering_config(
    config_id: int,
    config_data: FeatureEngineeringUpdate,
    db: Session = Depends(get_db)
):
    """Update feature engineering configuration"""
    return FeatureEngineeringController.update_config(db, config_id, config_data)


@router.delete("/configs/{config_id}")
def delete_feature_engineering_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """Delete feature engineering configuration"""
    return FeatureEngineeringController.delete_config(db, config_id)


@router.get("/configs/count/total")
def count_feature_engineering_configs(
    feature_type: Optional[str] = Query(None, description="Filter by feature type"),
    target_type: Optional[str] = Query(None, description="Filter by target type"),
    db: Session = Depends(get_db)
):
    """Count total feature engineering configurations"""
    return {"count": FeatureEngineeringController.count_configs(db, feature_type=feature_type, target_type=target_type)}
