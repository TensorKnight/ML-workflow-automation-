"""
Controllers for data ingestion configuration management
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import data_ingestion
from db.schema import DataIngestionConfig
from schemas.data_ingestion import DataIngestionCreate, DataIngestionUpdate, DataIngestionResponse


class DataIngestionController:
    """Controller for data ingestion configuration operations"""
    
    @staticmethod
    def create_config(db: Session, config_data: DataIngestionCreate) -> DataIngestionResponse:
        """Create a new data ingestion configuration"""
        try:
            # Check if name already exists
            existing = data_ingestion.get_by_name(db, name=config_data.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Data ingestion config with name '{config_data.name}' already exists"
                )
            
            # Create config
            config_dict = config_data.dict()
            db_config = data_ingestion.create(db, obj_in=config_dict)
            return DataIngestionResponse.from_orm(db_config)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating data ingestion config: {str(e)}"
            )
    
    @staticmethod
    def get_config(db: Session, config_id: int) -> DataIngestionResponse:
        """Get data ingestion config by ID"""
        db_config = data_ingestion.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data ingestion config not found"
            )
        return DataIngestionResponse.from_orm(db_config)
    
    @staticmethod
    def get_config_by_name(db: Session, name: str) -> DataIngestionResponse:
        """Get data ingestion config by name"""
        db_config = data_ingestion.get_by_name(db, name=name)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data ingestion config not found"
            )
        return DataIngestionResponse.from_orm(db_config)
    
    @staticmethod
    def get_configs(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        file_type: Optional[str] = None
    ) -> List[DataIngestionResponse]:
        """Get multiple data ingestion configs"""
        try:
            if file_type:
                db_configs = data_ingestion.get_by_file_type(
                    db, file_type=file_type, skip=skip, limit=limit
                )
            else:
                db_configs = data_ingestion.get_multi(db, skip=skip, limit=limit)
            
            return [DataIngestionResponse.from_orm(c) for c in db_configs]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting data ingestion configs: {str(e)}"
            )
    
    @staticmethod
    def update_config(
        db: Session, 
        config_id: int, 
        config_data: DataIngestionUpdate
    ) -> DataIngestionResponse:
        """Update data ingestion config"""
        db_config = data_ingestion.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data ingestion config not found"
            )
        
        try:
            update_data = config_data.dict(exclude_unset=True)
            db_config = data_ingestion.update(db, db_obj=db_config, obj_in=update_data)
            return DataIngestionResponse.from_orm(db_config)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating data ingestion config: {str(e)}"
            )
    
    @staticmethod
    def delete_config(db: Session, config_id: int) -> Dict[str, str]:
        """Delete data ingestion config"""
        db_config = data_ingestion.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data ingestion config not found"
            )
        
        try:
            data_ingestion.delete(db, id=config_id)
            return {"message": "Data ingestion config deleted successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting data ingestion config: {str(e)}"
            )
    
    @staticmethod
    def count_configs(db: Session, file_type: Optional[str] = None) -> int:
        """Count data ingestion configs"""
        try:
            filters = {"file_type": file_type} if file_type else None
            return data_ingestion.count(db, filters=filters)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error counting data ingestion configs: {str(e)}"
            )
