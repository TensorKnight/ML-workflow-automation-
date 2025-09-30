"""
Database models with CRUD operations for ML workflow system
"""
from typing import Type, Optional, List, Dict, Any
from sqlalchemy.orm import Session
from utils.crud_base import CRUDBase, CRUDWithUnique, CRUDWithRelationships
from db.schema import (
    WorkflowConfig, DataIngestionConfig, DataPreprocessingConfig, 
    FeatureEngineeringConfig, BlockTypeConfig, Block, BlockConnection
)


# Workflow CRUD operations
class CRUDWorkflow(CRUDWithUnique[WorkflowConfig]):
    """CRUD operations for WorkflowConfig"""
    
    def get_by_unique_id(self, db: Session, *, unique_id: str) -> Optional[WorkflowConfig]:
        """Get workflow by unique_id"""
        return self.get_by_unique(db, unique_field="unique_id", value=unique_id)
    
    def get_with_blocks(self, db: Session, *, id: int) -> Optional[WorkflowConfig]:
        """Get workflow with all its blocks"""
        return self.get_with_relations(db, id=id, relations=["blocks"])
    
    def get_workflows_by_problem_type(
        self, 
        db: Session, 
        *, 
        problem_type: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[WorkflowConfig]:
        """Get workflows by problem type"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"problem_type": problem_type}
        )


# Data Ingestion CRUD operations
class CRUDDataIngestion(CRUDBase[DataIngestionConfig]):
    """CRUD operations for DataIngestionConfig"""
    
    def get_by_name(self, db: Session, *, name: str) -> Optional[DataIngestionConfig]:
        """Get data ingestion config by name"""
        return db.query(DataIngestionConfig).filter(DataIngestionConfig.name == name).first()
    
    def get_by_file_type(
        self, 
        db: Session, 
        *, 
        file_type: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[DataIngestionConfig]:
        """Get data ingestion configs by file type"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"file_type": file_type}
        )


# Data Preprocessing CRUD operations
class CRUDDataPreprocessing(CRUDBase[DataPreprocessingConfig]):
    """CRUD operations for DataPreprocessingConfig"""
    
    def get_by_name(self, db: Session, *, name: str) -> Optional[DataPreprocessingConfig]:
        """Get data preprocessing config by name"""
        return db.query(DataPreprocessingConfig).filter(DataPreprocessingConfig.name == name).first()
    
    def get_auto_clean_configs(
        self, 
        db: Session, 
        *, 
        auto_clean: bool = True,
        skip: int = 0,
        limit: int = 100
    ) -> List[DataPreprocessingConfig]:
        """Get configs with auto_clean setting"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"auto_clean": auto_clean}
        )


# Feature Engineering CRUD operations
class CRUDFeatureEngineering(CRUDBase[FeatureEngineeringConfig]):
    """CRUD operations for FeatureEngineeringConfig"""
    
    def get_by_name(self, db: Session, *, name: str) -> Optional[FeatureEngineeringConfig]:
        """Get feature engineering config by name"""
        return db.query(FeatureEngineeringConfig).filter(FeatureEngineeringConfig.name == name).first()
    
    def get_by_feature_type(
        self, 
        db: Session, 
        *, 
        feature_type: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[FeatureEngineeringConfig]:
        """Get configs by feature type"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"feature_type": feature_type}
        )
    
    def get_by_target_type(
        self, 
        db: Session, 
        *, 
        target_type: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[FeatureEngineeringConfig]:
        """Get configs by target type"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"target_type": target_type}
        )


# Block Type CRUD operations
class CRUDBlockType(CRUDWithUnique[BlockTypeConfig]):
    """CRUD operations for BlockTypeConfig"""
    
    def get_by_name(self, db: Session, *, name: str) -> Optional[BlockTypeConfig]:
        """Get block type by name"""
        return self.get_by_unique(db, unique_field="name", value=name)


# Block CRUD operations
class CRUDBlock(CRUDWithRelationships[Block]):
    """CRUD operations for Block"""
    
    def get_by_workflow(
        self, 
        db: Session, 
        *, 
        workflow_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Block]:
        """Get blocks by workflow ID"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"workflow_id": workflow_id}
        )
    
    def get_by_block_type(
        self, 
        db: Session, 
        *, 
        block_type_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Block]:
        """Get blocks by block type ID"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"block_type_id": block_type_id}
        )
    
    def get_enabled_blocks(
        self, 
        db: Session, 
        *, 
        workflow_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Block]:
        """Get enabled blocks for a workflow"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"workflow_id": workflow_id, "enabled": True}
        )
    
    def get_with_full_relations(self, db: Session, *, id: int) -> Optional[Block]:
        """Get block with all relations loaded"""
        return self.get_with_relations(
            db, 
            id=id, 
            relations=["workflow", "block_type", "data_ingestion_config", 
                      "data_preprocessing_config", "feature_engineering_config",
                      "input_connections", "output_connections"]
        )
    
    def update_execution_status(
        self, 
        db: Session, 
        *, 
        id: int, 
        status: str, 
        log: Optional[str] = None
    ) -> Optional[Block]:
        """Update block execution status"""
        update_data = {
            "execution_status": status,
            "last_executed_at": None if status == "pending" else db.query(Block).filter(Block.id == id).first().last_executed_at
        }
        if log:
            update_data["execution_log"] = log
        
        return self.update(db, db_obj=self.get(db, id=id), obj_in=update_data)


# Block Connection CRUD operations
class CRUDBlockConnection(CRUDBase[BlockConnection]):
    """CRUD operations for BlockConnection"""
    
    def get_by_source_block(
        self, 
        db: Session, 
        *, 
        source_block_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[BlockConnection]:
        """Get connections by source block ID"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"source_block_id": source_block_id}
        )
    
    def get_by_target_block(
        self, 
        db: Session, 
        *, 
        target_block_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[BlockConnection]:
        """Get connections by target block ID"""
        return self.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters={"target_block_id": target_block_id}
        )
    
    def get_by_workflow(
        self, 
        db: Session, 
        *, 
        workflow_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[BlockConnection]:
        """Get all connections for a workflow"""
        # This requires a join with blocks table
        return db.query(BlockConnection).join(
            Block, BlockConnection.source_block_id == Block.id
        ).filter(Block.workflow_id == workflow_id).offset(skip).limit(limit).all()
    
    def get_enabled_connections(
        self, 
        db: Session, 
        *, 
        workflow_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[BlockConnection]:
        """Get enabled connections for a workflow"""
        return db.query(BlockConnection).join(
            Block, BlockConnection.source_block_id == Block.id
        ).filter(
            Block.workflow_id == workflow_id,
            BlockConnection.enabled == True
        ).offset(skip).limit(limit).all()
    
    def get_with_relations(
        self, 
        db: Session, 
        *, 
        id: int
    ) -> Optional[BlockConnection]:
        """Get connection with source and target blocks"""
        return self.get_with_relations(
            db, 
            id=id, 
            relations=["source_block", "target_block"]
        )


# Create instances for use in controllers and services
workflow = CRUDWorkflow(WorkflowConfig)
data_ingestion = CRUDDataIngestion(DataIngestionConfig)
data_preprocessing = CRUDDataPreprocessing(DataPreprocessingConfig)
feature_engineering = CRUDFeatureEngineering(FeatureEngineeringConfig)
block_type = CRUDBlockType(BlockTypeConfig)
block = CRUDBlock(Block)
block_connection = CRUDBlockConnection(BlockConnection)