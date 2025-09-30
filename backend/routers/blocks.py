"""
Router for block operations
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from db.database import get_db
from controllers.block_controller import BlockController
from schemas.block import (
    BlockCreate, BlockUpdate, BlockResponse, BlockListResponse, BlockStatusUpdate
)

router = APIRouter(prefix="/blocks", tags=["blocks"])


@router.post("/", response_model=BlockResponse, status_code=status.HTTP_201_CREATED)
def create_block(
    block_data: BlockCreate,
    db: Session = Depends(get_db)
):
    """Create a new block"""
    return BlockController.create_block(db, block_data)


@router.get("/", response_model=BlockListResponse)
def get_blocks(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    workflow_id: Optional[int] = Query(None, description="Filter by workflow ID"),
    block_type_id: Optional[int] = Query(None, description="Filter by block type ID"),
    enabled_only: bool = Query(False, description="Only return enabled blocks"),
    db: Session = Depends(get_db)
):
    """Get multiple blocks with optional filtering"""
    if workflow_id:
        blocks = BlockController.get_blocks_by_workflow(
            db, workflow_id=workflow_id, skip=skip, limit=limit, enabled_only=enabled_only
        )
        total = BlockController.count_blocks_by_workflow(db, workflow_id)
    elif block_type_id:
        blocks = BlockController.get_blocks_by_type(
            db, block_type_id=block_type_id, skip=skip, limit=limit
        )
        total = len(blocks)  # Simple count for now
    else:
        # Get all blocks (implement this in controller if needed)
        blocks = []
        total = 0
    
    return BlockListResponse(
        blocks=blocks,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/{block_id}", response_model=BlockResponse)
def get_block(
    block_id: int,
    db: Session = Depends(get_db)
):
    """Get block by ID"""
    return BlockController.get_block(db, block_id)


@router.get("/{block_id}/with-relations", response_model=BlockResponse)
def get_block_with_relations(
    block_id: int,
    db: Session = Depends(get_db)
):
    """Get block with all relations"""
    return BlockController.get_block_with_relations(db, block_id)


@router.put("/{block_id}", response_model=BlockResponse)
def update_block(
    block_id: int,
    block_data: BlockUpdate,
    db: Session = Depends(get_db)
):
    """Update block"""
    return BlockController.update_block(db, block_id, block_data)


@router.patch("/{block_id}/status", response_model=BlockResponse)
def update_block_status(
    block_id: int,
    status_data: BlockStatusUpdate,
    db: Session = Depends(get_db)
):
    """Update block execution status"""
    return BlockController.update_block_execution_status(
        db, block_id, status_data.status, status_data.log
    )


@router.delete("/{block_id}")
def delete_block(
    block_id: int,
    db: Session = Depends(get_db)
):
    """Delete block"""
    return BlockController.delete_block(db, block_id)


@router.get("/workflow/{workflow_id}/count")
def count_blocks_by_workflow(
    workflow_id: int,
    db: Session = Depends(get_db)
):
    """Count blocks for a workflow"""
    return {"count": BlockController.count_blocks_by_workflow(db, workflow_id)}
