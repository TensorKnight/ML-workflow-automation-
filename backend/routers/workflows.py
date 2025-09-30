"""
Router for workflow operations
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from db.database import get_db
from controllers.workflow_controller import WorkflowController
from schemas.workflow import (
    WorkflowCreate, WorkflowUpdate, WorkflowResponse, 
    WorkflowListResponse
)

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
def create_workflow(
    workflow_data: WorkflowCreate,
    db: Session = Depends(get_db)
):
    """Create a new workflow"""
    return WorkflowController.create_workflow(db, workflow_data)


@router.get("/", response_model=WorkflowListResponse)
def get_workflows(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    problem_type: Optional[str] = Query(None, description="Filter by problem type"),
    db: Session = Depends(get_db)
):
    """Get multiple workflows with optional filtering"""
    workflows = WorkflowController.get_workflows(db, skip=skip, limit=limit, problem_type=problem_type)
    total = WorkflowController.count_workflows(db, problem_type=problem_type)
    
    return WorkflowListResponse(
        workflows=workflows,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/{workflow_id}", response_model=WorkflowResponse)
def get_workflow(
    workflow_id: int,
    db: Session = Depends(get_db)
):
    """Get workflow by ID"""
    return WorkflowController.get_workflow(db, workflow_id)


@router.get("/unique/{unique_id}", response_model=WorkflowResponse)
def get_workflow_by_unique_id(
    unique_id: str,
    db: Session = Depends(get_db)
):
    """Get workflow by unique ID"""
    return WorkflowController.get_workflow_by_unique_id(db, unique_id)


@router.get("/{workflow_id}/with-blocks", response_model=WorkflowResponse)
def get_workflow_with_blocks(
    workflow_id: int,
    db: Session = Depends(get_db)
):
    """Get workflow with all its blocks"""
    return WorkflowController.get_workflow_with_blocks(db, workflow_id)


@router.put("/{workflow_id}", response_model=WorkflowResponse)
def update_workflow(
    workflow_id: int,
    workflow_data: WorkflowUpdate,
    db: Session = Depends(get_db)
):
    """Update workflow"""
    return WorkflowController.update_workflow(db, workflow_id, workflow_data)


@router.delete("/{workflow_id}")
def delete_workflow(
    workflow_id: int,
    db: Session = Depends(get_db)
):
    """Delete workflow"""
    return WorkflowController.delete_workflow(db, workflow_id)


@router.get("/count/total")
def count_workflows(
    problem_type: Optional[str] = Query(None, description="Filter by problem type"),
    db: Session = Depends(get_db)
):
    """Count total workflows"""
    return {"count": WorkflowController.count_workflows(db, problem_type=problem_type)}
