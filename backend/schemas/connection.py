"""
Pydantic schemas for block connection operations
"""
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime


class ConnectionBase(BaseModel):
    """Base connection schema"""
    source_block_id: int = Field(..., description="ID of the source block")
    target_block_id: int = Field(..., description="ID of the target block")
    connection_name: Optional[str] = Field(None, description="Connection name")
    connection_type: str = Field("data", description="Type of connection")
    source_output: Optional[str] = Field(None, description="Source block output identifier")
    target_input: Optional[str] = Field(None, description="Target block input identifier")
    transformation_config: Optional[Dict[str, Any]] = Field(None, description="Data transformation configuration")
    enabled: bool = Field(True, description="Whether the connection is enabled")


class ConnectionCreate(ConnectionBase):
    """Schema for creating a connection"""
    pass


class ConnectionUpdate(BaseModel):
    """Schema for updating a connection"""
    connection_name: Optional[str] = Field(None, description="Connection name")
    connection_type: Optional[str] = Field(None, description="Type of connection")
    source_output: Optional[str] = Field(None, description="Source block output identifier")
    target_input: Optional[str] = Field(None, description="Target block input identifier")
    transformation_config: Optional[Dict[str, Any]] = Field(None, description="Data transformation configuration")
    enabled: Optional[bool] = Field(None, description="Whether the connection is enabled")


class ConnectionResponse(ConnectionBase):
    """Schema for connection response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ConnectionListResponse(BaseModel):
    """Schema for connection list response"""
    connections: List[ConnectionResponse]
    total: int
    skip: int
    limit: int
