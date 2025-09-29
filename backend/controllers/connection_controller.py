"""
Controllers for block connection management
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import block_connection, block
from db.schema import BlockConnection
from schemas.connection import ConnectionCreate, ConnectionUpdate, ConnectionResponse


class ConnectionController:
    """Controller for block connection operations"""
    
    @staticmethod
    def create_connection(db: Session, connection_data: ConnectionCreate) -> ConnectionResponse:
        """Create a new block connection"""
        try:
            # Validate source block exists
            source_block = block.get(db, id=connection_data.source_block_id)
            if not source_block:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Source block not found"
                )
            
            # Validate target block exists
            target_block = block.get(db, id=connection_data.target_block_id)
            if not target_block:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Target block not found"
                )
            
            # Check if blocks are in the same workflow
            if source_block.workflow_id != target_block.workflow_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Source and target blocks must be in the same workflow"
                )
            
            # Check for circular connections
            if connection_data.source_block_id == connection_data.target_block_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot connect block to itself"
                )
            
            # Create connection
            connection_dict = connection_data.dict()
            db_connection = block_connection.create(db, obj_in=connection_dict)
            return ConnectionResponse.from_orm(db_connection)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating connection: {str(e)}"
            )
    
    @staticmethod
    def get_connection(db: Session, connection_id: int) -> ConnectionResponse:
        """Get connection by ID"""
        db_connection = block_connection.get(db, id=connection_id)
        if not db_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Connection not found"
            )
        return ConnectionResponse.from_orm(db_connection)
    
    @staticmethod
    def get_connection_with_relations(db: Session, connection_id: int) -> ConnectionResponse:
        """Get connection with source and target blocks"""
        db_connection = block_connection.get_with_relations(db, id=connection_id)
        if not db_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Connection not found"
            )
        return ConnectionResponse.from_orm(db_connection)
    
    @staticmethod
    def get_connections_by_workflow(
        db: Session, 
        workflow_id: int,
        skip: int = 0, 
        limit: int = 100,
        enabled_only: bool = False
    ) -> List[ConnectionResponse]:
        """Get connections by workflow ID"""
        try:
            if enabled_only:
                db_connections = block_connection.get_enabled_connections(
                    db, workflow_id=workflow_id, skip=skip, limit=limit
                )
            else:
                db_connections = block_connection.get_by_workflow(
                    db, workflow_id=workflow_id, skip=skip, limit=limit
                )
            
            return [ConnectionResponse.from_orm(c) for c in db_connections]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting connections: {str(e)}"
            )
    
    @staticmethod
    def get_connections_by_source_block(
        db: Session, 
        source_block_id: int,
        skip: int = 0, 
        limit: int = 100
    ) -> List[ConnectionResponse]:
        """Get connections by source block ID"""
        try:
            db_connections = block_connection.get_by_source_block(
                db, source_block_id=source_block_id, skip=skip, limit=limit
            )
            return [ConnectionResponse.from_orm(c) for c in db_connections]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting connections: {str(e)}"
            )
    
    @staticmethod
    def get_connections_by_target_block(
        db: Session, 
        target_block_id: int,
        skip: int = 0, 
        limit: int = 100
    ) -> List[ConnectionResponse]:
        """Get connections by target block ID"""
        try:
            db_connections = block_connection.get_by_target_block(
                db, target_block_id=target_block_id, skip=skip, limit=limit
            )
            return [ConnectionResponse.from_orm(c) for c in db_connections]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting connections: {str(e)}"
            )
    
    @staticmethod
    def update_connection(
        db: Session, 
        connection_id: int, 
        connection_data: ConnectionUpdate
    ) -> ConnectionResponse:
        """Update connection"""
        db_connection = block_connection.get(db, id=connection_id)
        if not db_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Connection not found"
            )
        
        try:
            update_data = connection_data.dict(exclude_unset=True)
            db_connection = block_connection.update(db, db_obj=db_connection, obj_in=update_data)
            return ConnectionResponse.from_orm(db_connection)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating connection: {str(e)}"
            )
    
    @staticmethod
    def delete_connection(db: Session, connection_id: int) -> Dict[str, str]:
        """Delete connection"""
        db_connection = block_connection.get(db, id=connection_id)
        if not db_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Connection not found"
            )
        
        try:
            block_connection.delete(db, id=connection_id)
            return {"message": "Connection deleted successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting connection: {str(e)}"
            )
    
    @staticmethod
    def count_connections_by_workflow(db: Session, workflow_id: int) -> int:
        """Count connections for a workflow"""
        try:
            return len(block_connection.get_by_workflow(db, workflow_id=workflow_id, skip=0, limit=1000))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error counting connections: {str(e)}"
            )
