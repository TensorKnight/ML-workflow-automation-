"""
Pydantic schemas for workflow operations
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
import uuid
from db.schema import ProblemType


class WorkflowBase(BaseModel):
    """Base workflow schema"""
    name: str = Field(..., description="Workflow name")
    description: Optional[str] = Field(None, description="Workflow description")
    problem_type: ProblemType = Field(..., description="Type of ML problem")


class WorkflowCreate(WorkflowBase):
    """Schema for creating a workflow"""
    pass


class WorkflowUpdate(BaseModel):
    """Schema for updating a workflow"""
    name: Optional[str] = Field(None, description="Workflow name")
    description: Optional[str] = Field(None, description="Workflow description")
    problem_type: Optional[ProblemType] = Field(None, description="Type of ML problem")


class WorkflowResponse(WorkflowBase):
    """Schema for workflow response"""
    id: int
    unique_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class WorkflowListResponse(BaseModel):
    """Schema for workflow list response"""
    workflows: List[WorkflowResponse]
    total: int
    skip: int
    limit: int
