"""
Services layer for workflow business logic
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from db.models import workflow, block, block_connection
from db.schema import WorkflowConfig, Block, BlockConnection
from schemas.workflow import WorkflowCreate, WorkflowUpdate
from schemas.block import BlockCreate, BlockUpdate
from schemas.connection import ConnectionCreate


class WorkflowService:
    """Service layer for workflow operations with business logic"""
    
    @staticmethod
    def create_workflow_with_initial_blocks(
        db: Session, 
        workflow_data: WorkflowCreate,
        initial_blocks: Optional[List[Dict[str, Any]]] = None
    ) -> WorkflowConfig:
        """Create a workflow with initial blocks"""
        # Create workflow first
        workflow_dict = workflow_data.dict()
        db_workflow = workflow.create(db, obj_in=workflow_dict)
        
        # Create initial blocks if provided
        if initial_blocks:
            for block_data in initial_blocks:
                block_data["workflow_id"] = db_workflow.id
                block.create(db, obj_in=block_data)
        
        return db_workflow
    
    @staticmethod
    def duplicate_workflow(
        db: Session, 
        source_workflow_id: int, 
        new_name: str,
        new_unique_id: str
    ) -> WorkflowConfig:
        """Duplicate an existing workflow with all its blocks and connections"""
        # Get source workflow
        source_workflow = workflow.get(db, id=source_workflow_id)
        if not source_workflow:
            raise ValueError("Source workflow not found")
        
        # Create new workflow
        new_workflow_data = {
            "unique_id": new_unique_id,
            "name": new_name,
            "description": f"Copy of {source_workflow.name}",
            "problem_type": source_workflow.problem_type
        }
        new_workflow = workflow.create(db, obj_in=new_workflow_data)
        
        # Get all blocks from source workflow
        source_blocks = block.get_by_workflow(db, workflow_id=source_workflow_id, skip=0, limit=1000)
        
        # Create mapping of old block IDs to new block IDs
        block_id_mapping = {}
        
        # Duplicate blocks
        for source_block in source_blocks:
            new_block_data = {
                "workflow_id": new_workflow.id,
                "block_type_id": source_block.block_type_id,
                "name": source_block.name,
                "description": source_block.description,
                "position_x": source_block.position_x,
                "position_y": source_block.position_y,
                "data_ingestion_config_id": source_block.data_ingestion_config_id,
                "data_preprocessing_config_id": source_block.data_preprocessing_config_id,
                "feature_engineering_config_id": source_block.feature_engineering_config_id,
                "custom_config": source_block.custom_config,
                "enabled": source_block.enabled,
                "execution_order": source_block.execution_order
            }
            new_block = block.create(db, obj_in=new_block_data)
            block_id_mapping[source_block.id] = new_block.id
        
        # Get all connections from source workflow
        source_connections = block_connection.get_by_workflow(db, workflow_id=source_workflow_id, skip=0, limit=1000)
        
        # Duplicate connections
        for source_connection in source_connections:
            new_connection_data = {
                "source_block_id": block_id_mapping[source_connection.source_block_id],
                "target_block_id": block_id_mapping[source_connection.target_block_id],
                "connection_name": source_connection.connection_name,
                "connection_type": source_connection.connection_type,
                "source_output": source_connection.source_output,
                "target_input": source_connection.target_input,
                "transformation_config": source_connection.transformation_config,
                "enabled": source_connection.enabled
            }
            block_connection.create(db, obj_in=new_connection_data)
        
        return new_workflow
    
    @staticmethod
    def validate_workflow_structure(db: Session, workflow_id: int) -> Dict[str, Any]:
        """Validate workflow structure and return validation results"""
        # Get workflow
        db_workflow = workflow.get(db, id=workflow_id)
        if not db_workflow:
            return {"valid": False, "errors": ["Workflow not found"]}
        
        # Get all blocks
        blocks = block.get_by_workflow(db, workflow_id=workflow_id, skip=0, limit=1000)
        
        # Get all connections
        connections = block_connection.get_by_workflow(db, workflow_id=workflow_id, skip=0, limit=1000)
        
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "workflow_id": workflow_id,
            "block_count": len(blocks),
            "connection_count": len(connections)
        }
        
        # Check for orphaned blocks (blocks with no connections)
        block_ids = {block.id for block in blocks}
        connected_block_ids = set()
        
        for connection in connections:
            connected_block_ids.add(connection.source_block_id)
            connected_block_ids.add(connection.target_block_id)
        
        orphaned_blocks = block_ids - connected_block_ids
        if orphaned_blocks:
            validation_result["warnings"].append(f"Orphaned blocks found: {orphaned_blocks}")
        
        # Check for circular dependencies
        # Simple check: if there are connections, check for cycles
        if connections:
            # Build adjacency list
            graph = {block_id: [] for block_id in block_ids}
            for connection in connections:
                graph[connection.source_block_id].append(connection.target_block_id)
            
            # Check for cycles using DFS
            visited = set()
            rec_stack = set()
            
            def has_cycle(node):
                visited.add(node)
                rec_stack.add(node)
                
                for neighbor in graph[node]:
                    if neighbor not in visited:
                        if has_cycle(neighbor):
                            return True
                    elif neighbor in rec_stack:
                        return True
                
                rec_stack.remove(node)
                return False
            
            for block_id in block_ids:
                if block_id not in visited:
                    if has_cycle(block_id):
                        validation_result["valid"] = False
                        validation_result["errors"].append("Circular dependency detected")
                        break
        
        return validation_result
    
    @staticmethod
    def get_workflow_execution_order(db: Session, workflow_id: int) -> List[int]:
        """Get the execution order of blocks in a workflow"""
        # Get all blocks with their execution order
        blocks = block.get_by_workflow(db, workflow_id=workflow_id, skip=0, limit=1000)
        
        # Sort by execution_order
        sorted_blocks = sorted(blocks, key=lambda b: b.execution_order)
        
        return [block.id for block in sorted_blocks if block.enabled]
    
    @staticmethod
    def update_workflow_execution_status(
        db: Session, 
        workflow_id: int, 
        status: str
    ) -> Dict[str, Any]:
        """Update execution status for all blocks in a workflow"""
        blocks = block.get_by_workflow(db, workflow_id=workflow_id, skip=0, limit=1000)
        
        updated_count = 0
        for block_obj in blocks:
            if block_obj.enabled:
                block.update_execution_status(db, id=block_obj.id, status=status)
                updated_count += 1
        
        return {
            "workflow_id": workflow_id,
            "status": status,
            "updated_blocks": updated_count
        }
