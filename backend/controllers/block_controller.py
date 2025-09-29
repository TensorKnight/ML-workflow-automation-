"""
Controllers for block management
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import block
from db.schema import Block
from schemas.block import BlockCreate, BlockUpdate, BlockResponse


class BlockController:
    """Controller for block operations"""
    
    @staticmethod
    def create_block(db: Session, block_data: BlockCreate) -> BlockResponse:
        """Create a new block"""
        try:
            # Validate workflow exists
            from db.models import workflow
            workflow_obj = workflow.get(db, id=block_data.workflow_id)
            if not workflow_obj:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Workflow not found"
                )
            
            # Validate block type exists
            from db.models import block_type
            block_type_obj = block_type.get(db, id=block_data.block_type_id)
            if not block_type_obj:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Block type not found"
                )
            
            # Create block
            block_dict = block_data.dict()
            db_block = block.create(db, obj_in=block_dict)
            return BlockResponse.from_orm(db_block)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating block: {str(e)}"
            )
    
    @staticmethod
    def get_block(db: Session, block_id: int) -> BlockResponse:
        """Get block by ID"""
        db_block = block.get(db, id=block_id)
        if not db_block:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Block not found"
            )
        return BlockResponse.from_orm(db_block)
    
    @staticmethod
    def get_block_with_relations(db: Session, block_id: int) -> BlockResponse:
        """Get block with all relations"""
        db_block = block.get_with_full_relations(db, id=block_id)
        if not db_block:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Block not found"
            )
        return BlockResponse.from_orm(db_block)
    
    @staticmethod
    def get_blocks_by_workflow(
        db: Session, 
        workflow_id: int,
        skip: int = 0, 
        limit: int = 100,
        enabled_only: bool = False
    ) -> List[BlockResponse]:
        """Get blocks by workflow ID"""
        try:
            if enabled_only:
                db_blocks = block.get_enabled_blocks(
                    db, workflow_id=workflow_id, skip=skip, limit=limit
                )
            else:
                db_blocks = block.get_by_workflow(
                    db, workflow_id=workflow_id, skip=skip, limit=limit
                )
            
            return [BlockResponse.from_orm(b) for b in db_blocks]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting blocks: {str(e)}"
            )
    
    @staticmethod
    def get_blocks_by_type(
        db: Session, 
        block_type_id: int,
        skip: int = 0, 
        limit: int = 100
    ) -> List[BlockResponse]:
        """Get blocks by block type ID"""
        try:
            db_blocks = block.get_by_block_type(
                db, block_type_id=block_type_id, skip=skip, limit=limit
            )
            return [BlockResponse.from_orm(b) for b in db_blocks]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting blocks: {str(e)}"
            )
    
    @staticmethod
    def update_block(
        db: Session, 
        block_id: int, 
        block_data: BlockUpdate
    ) -> BlockResponse:
        """Update block"""
        db_block = block.get(db, id=block_id)
        if not db_block:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Block not found"
            )
        
        try:
            update_data = block_data.dict(exclude_unset=True)
            db_block = block.update(db, db_obj=db_block, obj_in=update_data)
            return BlockResponse.from_orm(db_block)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating block: {str(e)}"
            )
    
    @staticmethod
    def update_block_execution_status(
        db: Session, 
        block_id: int, 
        status: str, 
        log: Optional[str] = None
    ) -> BlockResponse:
        """Update block execution status"""
        db_block = block.get(db, id=block_id)
        if not db_block:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Block not found"
            )
        
        try:
            db_block = block.update_execution_status(db, id=block_id, status=status, log=log)
            return BlockResponse.from_orm(db_block)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating block status: {str(e)}"
            )
    
    @staticmethod
    def delete_block(db: Session, block_id: int) -> Dict[str, str]:
        """Delete block"""
        db_block = block.get(db, id=block_id)
        if not db_block:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Block not found"
            )
        
        try:
            block.delete(db, id=block_id)
            return {"message": "Block deleted successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting block: {str(e)}"
            )
    
    @staticmethod
    def count_blocks_by_workflow(db: Session, workflow_id: int) -> int:
        """Count blocks for a workflow"""
        try:
            return block.count(db, filters={"workflow_id": workflow_id})
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error counting blocks: {str(e)}"
            )
