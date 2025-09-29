"""
Pydantic schemas for block operations
"""
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime


class BlockBase(BaseModel):
    """Base block schema"""
    workflow_id: int = Field(..., description="ID of the workflow this block belongs to")
    block_type_id: int = Field(..., description="ID of the block type")
    name: str = Field(..., description="Block name")
    description: Optional[str] = Field(None, description="Block description")
    position_x: float = Field(0.0, description="X position for UI")
    position_y: float = Field(0.0, description="Y position for UI")
    data_ingestion_config_id: Optional[int] = Field(None, description="Data ingestion config ID")
    data_preprocessing_config_id: Optional[int] = Field(None, description="Data preprocessing config ID")
    feature_engineering_config_id: Optional[int] = Field(None, description="Feature engineering config ID")
    custom_config: Optional[Dict[str, Any]] = Field(None, description="Custom configuration overrides")
    enabled: bool = Field(True, description="Whether the block is enabled")
    execution_order: int = Field(0, description="Execution order")


class BlockCreate(BlockBase):
    """Schema for creating a block"""
    pass


class BlockUpdate(BaseModel):
    """Schema for updating a block"""
    name: Optional[str] = Field(None, description="Block name")
    description: Optional[str] = Field(None, description="Block description")
    position_x: Optional[float] = Field(None, description="X position for UI")
    position_y: Optional[float] = Field(None, description="Y position for UI")
    data_ingestion_config_id: Optional[int] = Field(None, description="Data ingestion config ID")
    data_preprocessing_config_id: Optional[int] = Field(None, description="Data preprocessing config ID")
    feature_engineering_config_id: Optional[int] = Field(None, description="Feature engineering config ID")
    custom_config: Optional[Dict[str, Any]] = Field(None, description="Custom configuration overrides")
    enabled: Optional[bool] = Field(None, description="Whether the block is enabled")
    execution_order: Optional[int] = Field(None, description="Execution order")


class BlockResponse(BlockBase):
    """Schema for block response"""
    id: int
    last_executed_at: Optional[datetime]
    execution_status: Optional[str]
    execution_log: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class BlockStatusUpdate(BaseModel):
    """Schema for updating block execution status"""
    status: str = Field(..., description="Execution status")
    log: Optional[str] = Field(None, description="Execution log")


class BlockListResponse(BaseModel):
    """Schema for block list response"""
    blocks: List[BlockResponse]
    total: int
    skip: int
    limit: int
