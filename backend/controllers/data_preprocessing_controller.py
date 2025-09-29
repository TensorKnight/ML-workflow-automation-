"""
Controllers for data preprocessing configuration management
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import data_preprocessing
from db.schema import DataPreprocessingConfig
from schemas.data_preprocessing import DataPreprocessingCreate, DataPreprocessingUpdate, DataPreprocessingResponse


class DataPreprocessingController:
    """Controller for data preprocessing configuration operations"""
    
    @staticmethod
    def create_config(db: Session, config_data: DataPreprocessingCreate) -> DataPreprocessingResponse:
        """Create a new data preprocessing configuration"""
        try:
            # Check if name already exists
            existing = data_preprocessing.get_by_name(db, name=config_data.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Data preprocessing config with name '{config_data.name}' already exists"
                )
            
            # Create config
            config_dict = config_data.dict()
            db_config = data_preprocessing.create(db, obj_in=config_dict)
            return DataPreprocessingResponse.from_orm(db_config)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating data preprocessing config: {str(e)}"
            )
    
    @staticmethod
    def get_config(db: Session, config_id: int) -> DataPreprocessingResponse:
        """Get data preprocessing config by ID"""
        db_config = data_preprocessing.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data preprocessing config not found"
            )
        return DataPreprocessingResponse.from_orm(db_config)
    
    @staticmethod
    def get_config_by_name(db: Session, name: str) -> DataPreprocessingResponse:
        """Get data preprocessing config by name"""
        db_config = data_preprocessing.get_by_name(db, name=name)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data preprocessing config not found"
            )
        return DataPreprocessingResponse.from_orm(db_config)
    
    @staticmethod
    def get_configs(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        auto_clean: Optional[bool] = None
    ) -> List[DataPreprocessingResponse]:
        """Get multiple data preprocessing configs"""
        try:
            if auto_clean is not None:
                db_configs = data_preprocessing.get_auto_clean_configs(
                    db, auto_clean=auto_clean, skip=skip, limit=limit
                )
            else:
                db_configs = data_preprocessing.get_multi(db, skip=skip, limit=limit)
            
            return [DataPreprocessingResponse.from_orm(c) for c in db_configs]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting data preprocessing configs: {str(e)}"
            )
    
    @staticmethod
    def update_config(
        db: Session, 
        config_id: int, 
        config_data: DataPreprocessingUpdate
    ) -> DataPreprocessingResponse:
        """Update data preprocessing config"""
        db_config = data_preprocessing.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data preprocessing config not found"
            )
        
        try:
            update_data = config_data.dict(exclude_unset=True)
            db_config = data_preprocessing.update(db, db_obj=db_config, obj_in=update_data)
            return DataPreprocessingResponse.from_orm(db_config)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating data preprocessing config: {str(e)}"
            )
    
    @staticmethod
    def delete_config(db: Session, config_id: int) -> Dict[str, str]:
        """Delete data preprocessing config"""
        db_config = data_preprocessing.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data preprocessing config not found"
            )
        
        try:
            data_preprocessing.delete(db, id=config_id)
            return {"message": "Data preprocessing config deleted successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting data preprocessing config: {str(e)}"
            )
    
    @staticmethod
    def count_configs(db: Session, auto_clean: Optional[bool] = None) -> int:
        """Count data preprocessing configs"""
        try:
            filters = {"auto_clean": auto_clean} if auto_clean is not None else None
            return data_preprocessing.count(db, filters=filters)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error counting data preprocessing configs: {str(e)}"
            )
