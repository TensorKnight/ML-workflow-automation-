"""
Controllers for workflow management
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import workflow
from db.schema import WorkflowConfig
from schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowResponse


class WorkflowController:
    """Controller for workflow operations"""
    
    @staticmethod
    def create_workflow(db: Session, workflow_data: WorkflowCreate) -> WorkflowResponse:
        """Create a new workflow"""
        try:
            # Generate unique_id
            import uuid
            unique_id = str(uuid.uuid4())
            
            # Create workflow
            workflow_dict = workflow_data.dict()
            workflow_dict['unique_id'] = unique_id
            db_workflow = workflow.create(db, obj_in=workflow_dict)
            return WorkflowResponse.from_orm(db_workflow)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating workflow: {str(e)}"
            )
    
    @staticmethod
    def get_workflow(db: Session, workflow_id: int) -> WorkflowResponse:
        """Get workflow by ID"""
        db_workflow = workflow.get(db, id=workflow_id)
        if not db_workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        return WorkflowResponse.from_orm(db_workflow)
    
    @staticmethod
    def get_workflow_by_unique_id(db: Session, unique_id: str) -> WorkflowResponse:
        """Get workflow by unique ID"""
        db_workflow = workflow.get_by_unique_id(db, unique_id=unique_id)
        if not db_workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        return WorkflowResponse.from_orm(db_workflow)
    
    @staticmethod
    def get_workflows(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        problem_type: Optional[str] = None
    ) -> List[WorkflowResponse]:
        """Get multiple workflows"""
        try:
            if problem_type:
                db_workflows = workflow.get_workflows_by_problem_type(
                    db, problem_type=problem_type, skip=skip, limit=limit
                )
            else:
                db_workflows = workflow.get_multi(db, skip=skip, limit=limit)
            
            return [WorkflowResponse.from_orm(w) for w in db_workflows]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting workflows: {str(e)}"
            )
    
    @staticmethod
    def update_workflow(
        db: Session, 
        workflow_id: int, 
        workflow_data: WorkflowUpdate
    ) -> WorkflowResponse:
        """Update workflow"""
        db_workflow = workflow.get(db, id=workflow_id)
        if not db_workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        
        try:
            update_data = workflow_data.dict(exclude_unset=True)
            db_workflow = workflow.update(db, db_obj=db_workflow, obj_in=update_data)
            return WorkflowResponse.from_orm(db_workflow)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating workflow: {str(e)}"
            )
    
    @staticmethod
    def delete_workflow(db: Session, workflow_id: int) -> Dict[str, str]:
        """Delete workflow"""
        db_workflow = workflow.get(db, id=workflow_id)
        if not db_workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        
        try:
            workflow.delete(db, id=workflow_id)
            return {"message": "Workflow deleted successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting workflow: {str(e)}"
            )
    
    @staticmethod
    def get_workflow_with_blocks(db: Session, workflow_id: int) -> WorkflowResponse:
        """Get workflow with all its blocks"""
        db_workflow = workflow.get_with_blocks(db, id=workflow_id)
        if not db_workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        return WorkflowResponse.from_orm(db_workflow)
    
    @staticmethod
    def count_workflows(db: Session, problem_type: Optional[str] = None) -> int:
        """Count workflows"""
        try:
            filters = {"problem_type": problem_type} if problem_type else None
            return workflow.count(db, filters=filters)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error counting workflows: {str(e)}"
            )
