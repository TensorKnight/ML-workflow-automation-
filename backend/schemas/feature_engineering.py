"""
Pydantic schemas for feature engineering configuration operations
"""
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime


class FeatureEngineeringBase(BaseModel):
    """Base feature engineering config schema"""
    name: str = Field(..., description="Configuration name")
    description: Optional[str] = Field(None, description="Configuration description")
    feature_type: str = Field("both", description="Feature type (auto, manual, both)")
    manual_config: Optional[Dict[str, Any]] = Field(None, description="Manual feature configuration")
    target_type: str = Field("classification", description="Target type")
    target_col: Optional[str] = Field(None, description="Target column name")
    selection_method: str = Field("univariate", description="Feature selection method")
    k_features: int = Field(20, description="Number of features to select")
    apply_dimensionality_reduction: bool = Field(False, description="Apply dimensionality reduction")
    n_components: int = Field(10, description="Number of components for dimensionality reduction")
    auto_generation_config: Optional[Dict[str, Any]] = Field(None, description="Auto feature generation configuration")


class FeatureEngineeringCreate(FeatureEngineeringBase):
    """Schema for creating a feature engineering config"""
    pass


class FeatureEngineeringUpdate(BaseModel):
    """Schema for updating a feature engineering config"""
    name: Optional[str] = Field(None, description="Configuration name")
    description: Optional[str] = Field(None, description="Configuration description")
    feature_type: Optional[str] = Field(None, description="Feature type")
    manual_config: Optional[Dict[str, Any]] = Field(None, description="Manual feature configuration")
    target_type: Optional[str] = Field(None, description="Target type")
    target_col: Optional[str] = Field(None, description="Target column name")
    selection_method: Optional[str] = Field(None, description="Feature selection method")
    k_features: Optional[int] = Field(None, description="Number of features to select")
    apply_dimensionality_reduction: Optional[bool] = Field(None, description="Apply dimensionality reduction")
    n_components: Optional[int] = Field(None, description="Number of components for dimensionality reduction")
    auto_generation_config: Optional[Dict[str, Any]] = Field(None, description="Auto feature generation configuration")


class FeatureEngineeringResponse(FeatureEngineeringBase):
    """Schema for feature engineering config response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class FeatureEngineeringListResponse(BaseModel):
    """Schema for feature engineering config list response"""
    configs: List[FeatureEngineeringResponse]
    total: int
    skip: int
    limit: int
