"""
Controllers for feature engineering configuration management
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import feature_engineering
from db.schema import FeatureEngineeringConfig
from schemas.feature_engineering import FeatureEngineeringCreate, FeatureEngineeringUpdate, FeatureEngineeringResponse


class FeatureEngineeringController:
    """Controller for feature engineering configuration operations"""
    
    @staticmethod
    def create_config(db: Session, config_data: FeatureEngineeringCreate) -> FeatureEngineeringResponse:
        """Create a new feature engineering configuration"""
        try:
            # Check if name already exists
            existing = feature_engineering.get_by_name(db, name=config_data.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Feature engineering config with name '{config_data.name}' already exists"
                )
            
            # Create config
            config_dict = config_data.dict()
            db_config = feature_engineering.create(db, obj_in=config_dict)
            return FeatureEngineeringResponse.from_orm(db_config)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating feature engineering config: {str(e)}"
            )
    
    @staticmethod
    def get_config(db: Session, config_id: int) -> FeatureEngineeringResponse:
        """Get feature engineering config by ID"""
        db_config = feature_engineering.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature engineering config not found"
            )
        return FeatureEngineeringResponse.from_orm(db_config)
    
    @staticmethod
    def get_config_by_name(db: Session, name: str) -> FeatureEngineeringResponse:
        """Get feature engineering config by name"""
        db_config = feature_engineering.get_by_name(db, name=name)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature engineering config not found"
            )
        return FeatureEngineeringResponse.from_orm(db_config)
    
    @staticmethod
    def get_configs(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        feature_type: Optional[str] = None,
        target_type: Optional[str] = None
    ) -> List[FeatureEngineeringResponse]:
        """Get multiple feature engineering configs"""
        try:
            if feature_type:
                db_configs = feature_engineering.get_by_feature_type(
                    db, feature_type=feature_type, skip=skip, limit=limit
                )
            elif target_type:
                db_configs = feature_engineering.get_by_target_type(
                    db, target_type=target_type, skip=skip, limit=limit
                )
            else:
                db_configs = feature_engineering.get_multi(db, skip=skip, limit=limit)
            
            return [FeatureEngineeringResponse.from_orm(c) for c in db_configs]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting feature engineering configs: {str(e)}"
            )
    
    @staticmethod
    def update_config(
        db: Session, 
        config_id: int, 
        config_data: FeatureEngineeringUpdate
    ) -> FeatureEngineeringResponse:
        """Update feature engineering config"""
        db_config = feature_engineering.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature engineering config not found"
            )
        
        try:
            update_data = config_data.dict(exclude_unset=True)
            db_config = feature_engineering.update(db, db_obj=db_config, obj_in=update_data)
            return FeatureEngineeringResponse.from_orm(db_config)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating feature engineering config: {str(e)}"
            )
    
    @staticmethod
    def delete_config(db: Session, config_id: int) -> Dict[str, str]:
        """Delete feature engineering config"""
        db_config = feature_engineering.get(db, id=config_id)
        if not db_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature engineering config not found"
            )
        
        try:
            feature_engineering.delete(db, id=config_id)
            return {"message": "Feature engineering config deleted successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting feature engineering config: {str(e)}"
            )
    
    @staticmethod
    def count_configs(
        db: Session, 
        feature_type: Optional[str] = None,
        target_type: Optional[str] = None
    ) -> int:
        """Count feature engineering configs"""
        try:
            filters = {}
            if feature_type:
                filters["feature_type"] = feature_type
            if target_type:
                filters["target_type"] = target_type
            
            return feature_engineering.count(db, filters=filters if filters else None)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error counting feature engineering configs: {str(e)}"
            )
