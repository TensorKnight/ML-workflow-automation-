"""
Pydantic schemas for data preprocessing configuration operations
"""
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime


class DataPreprocessingBase(BaseModel):
    """Base data preprocessing config schema"""
    name: str = Field(..., description="Configuration name")
    description: Optional[str] = Field(None, description="Configuration description")
    auto_clean: bool = Field(False, description="Enable auto cleaning")
    imputation_config: Optional[Dict[str, Any]] = Field(None, description="Imputation configuration")
    outlier_config: Optional[Dict[str, Any]] = Field(None, description="Outlier handling configuration")
    encoding_config: Optional[Dict[str, Any]] = Field(None, description="Encoding configuration")
    scaling_config: Optional[Dict[str, Any]] = Field(None, description="Scaling configuration")
    rare_category_config: Optional[Dict[str, Any]] = Field(None, description="Rare category handling configuration")
    skewness_config: Optional[Dict[str, Any]] = Field(None, description="Skewness handling configuration")
    class_imbalance_config: Optional[Dict[str, Any]] = Field(None, description="Class imbalance handling configuration")


class DataPreprocessingCreate(DataPreprocessingBase):
    """Schema for creating a data preprocessing config"""
    pass


class DataPreprocessingUpdate(BaseModel):
    """Schema for updating a data preprocessing config"""
    name: Optional[str] = Field(None, description="Configuration name")
    description: Optional[str] = Field(None, description="Configuration description")
    auto_clean: Optional[bool] = Field(None, description="Enable auto cleaning")
    imputation_config: Optional[Dict[str, Any]] = Field(None, description="Imputation configuration")
    outlier_config: Optional[Dict[str, Any]] = Field(None, description="Outlier handling configuration")
    encoding_config: Optional[Dict[str, Any]] = Field(None, description="Encoding configuration")
    scaling_config: Optional[Dict[str, Any]] = Field(None, description="Scaling configuration")
    rare_category_config: Optional[Dict[str, Any]] = Field(None, description="Rare category handling configuration")
    skewness_config: Optional[Dict[str, Any]] = Field(None, description="Skewness handling configuration")
    class_imbalance_config: Optional[Dict[str, Any]] = Field(None, description="Class imbalance handling configuration")


class DataPreprocessingResponse(DataPreprocessingBase):
    """Schema for data preprocessing config response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DataPreprocessingListResponse(BaseModel):
    """Schema for data preprocessing config list response"""
    configs: List[DataPreprocessingResponse]
    total: int
    skip: int
    limit: int
