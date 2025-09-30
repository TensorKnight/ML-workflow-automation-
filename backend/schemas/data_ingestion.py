"""
Pydantic schemas for data ingestion configuration operations
"""
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime


class DataIngestionBase(BaseModel):
    """Base data ingestion config schema"""
    name: str = Field(..., description="Configuration name")
    description: Optional[str] = Field(None, description="Configuration description")
    file_path: Optional[str] = Field(None, description="File path")
    file_type: Optional[str] = Field(None, description="File type (csv, json, excel, etc.)")
    schema_config: Optional[Dict[str, Any]] = Field(None, description="Schema configuration")
    merge_config: Optional[Dict[str, Any]] = Field(None, description="Merge configuration")
    load_kwargs: Optional[Dict[str, Any]] = Field(None, description="Additional load parameters")
    enable_quality_checks: bool = Field(True, description="Enable quality checks")
    quality_thresholds: Optional[Dict[str, Any]] = Field(None, description="Quality thresholds")


class DataIngestionCreate(DataIngestionBase):
    """Schema for creating a data ingestion config"""
    pass


class DataIngestionUpdate(BaseModel):
    """Schema for updating a data ingestion config"""
    name: Optional[str] = Field(None, description="Configuration name")
    description: Optional[str] = Field(None, description="Configuration description")
    file_path: Optional[str] = Field(None, description="File path")
    file_type: Optional[str] = Field(None, description="File type")
    schema_config: Optional[Dict[str, Any]] = Field(None, description="Schema configuration")
    merge_config: Optional[Dict[str, Any]] = Field(None, description="Merge configuration")
    load_kwargs: Optional[Dict[str, Any]] = Field(None, description="Additional load parameters")
    enable_quality_checks: Optional[bool] = Field(None, description="Enable quality checks")
    quality_thresholds: Optional[Dict[str, Any]] = Field(None, description="Quality thresholds")


class DataIngestionResponse(DataIngestionBase):
    """Schema for data ingestion config response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DataIngestionListResponse(BaseModel):
    """Schema for data ingestion config list response"""
    configs: List[DataIngestionResponse]
    total: int
    skip: int
    limit: int
