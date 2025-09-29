"""
Router for block connection operations
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from db.database import get_db
from controllers.connection_controller import ConnectionController
from schemas.connection import (
    ConnectionCreate, ConnectionUpdate, ConnectionResponse, ConnectionListResponse
)

router = APIRouter(prefix="/connections", tags=["connections"])


@router.post("/", response_model=ConnectionResponse, status_code=status.HTTP_201_CREATED)
def create_connection(
    connection_data: ConnectionCreate,
    db: Session = Depends(get_db)
):
    """Create a new block connection"""
    return ConnectionController.create_connection(db, connection_data)


@router.get("/", response_model=ConnectionListResponse)
def get_connections(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    workflow_id: Optional[int] = Query(None, description="Filter by workflow ID"),
    source_block_id: Optional[int] = Query(None, description="Filter by source block ID"),
    target_block_id: Optional[int] = Query(None, description="Filter by target block ID"),
    enabled_only: bool = Query(False, description="Only return enabled connections"),
    db: Session = Depends(get_db)
):
    """Get multiple connections with optional filtering"""
    if workflow_id:
        connections = ConnectionController.get_connections_by_workflow(
            db, workflow_id=workflow_id, skip=skip, limit=limit, enabled_only=enabled_only
        )
        total = ConnectionController.count_connections_by_workflow(db, workflow_id)
    elif source_block_id:
        connections = ConnectionController.get_connections_by_source_block(
            db, source_block_id=source_block_id, skip=skip, limit=limit
        )
        total = len(connections)  # Simple count for now
    elif target_block_id:
        connections = ConnectionController.get_connections_by_target_block(
            db, target_block_id=target_block_id, skip=skip, limit=limit
        )
        total = len(connections)  # Simple count for now
    else:
        # Get all connections (implement this in controller if needed)
        connections = []
        total = 0
    
    return ConnectionListResponse(
        connections=connections,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/{connection_id}", response_model=ConnectionResponse)
def get_connection(
    connection_id: int,
    db: Session = Depends(get_db)
):
    """Get connection by ID"""
    return ConnectionController.get_connection(db, connection_id)


@router.get("/{connection_id}/with-relations", response_model=ConnectionResponse)
def get_connection_with_relations(
    connection_id: int,
    db: Session = Depends(get_db)
):
    """Get connection with source and target blocks"""
    return ConnectionController.get_connection_with_relations(db, connection_id)


@router.put("/{connection_id}", response_model=ConnectionResponse)
def update_connection(
    connection_id: int,
    connection_data: ConnectionUpdate,
    db: Session = Depends(get_db)
):
    """Update connection"""
    return ConnectionController.update_connection(db, connection_id, connection_data)


@router.delete("/{connection_id}")
def delete_connection(
    connection_id: int,
    db: Session = Depends(get_db)
):
    """Delete connection"""
    return ConnectionController.delete_connection(db, connection_id)


@router.get("/workflow/{workflow_id}/count")
def count_connections_by_workflow(
    workflow_id: int,
    db: Session = Depends(get_db)
):
    """Count connections for a workflow"""
    return {"count": ConnectionController.count_connections_by_workflow(db, workflow_id)}
