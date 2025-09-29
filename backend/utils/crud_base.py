"""
Generic CRUD base classes and utilities for database operations
"""
from typing import Type, TypeVar, Generic, List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, or_
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

ModelType = TypeVar("ModelType")


class CRUDBase(Generic[ModelType]):
    """Generic CRUD operations for any SQLAlchemy model"""
    
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    def create(self, db: Session, *, obj_in: Dict[str, Any]) -> ModelType:
        """Create a new record"""
        try:
            db_obj = self.model(**obj_in)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error creating {self.model.__name__}: {str(e)}")
            raise
    
    def get(self, db: Session, id: int) -> Optional[ModelType]:
        """Get a record by ID"""
        try:
            return db.query(self.model).filter(self.model.id == id).first()
        except SQLAlchemyError as e:
            logger.error(f"Error getting {self.model.__name__} with id {id}: {str(e)}")
            raise
    
    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[ModelType]:
        """Get multiple records with optional filtering"""
        try:
            query = db.query(self.model)
            
            if filters:
                for key, value in filters.items():
                    if hasattr(self.model, key):
                        if isinstance(value, list):
                            query = query.filter(getattr(self.model, key).in_(value))
                        else:
                            query = query.filter(getattr(self.model, key) == value)
            
            return query.offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            logger.error(f"Error getting multiple {self.model.__name__}: {str(e)}")
            raise
    
    def update(
        self, 
        db: Session, 
        *, 
        db_obj: ModelType, 
        obj_in: Dict[str, Any]
    ) -> ModelType:
        """Update a record"""
        try:
            for field, value in obj_in.items():
                if hasattr(db_obj, field):
                    setattr(db_obj, field, value)
            
            # Update timestamp
            if hasattr(db_obj, 'updated_at'):
                setattr(db_obj, 'updated_at', datetime.utcnow())
            
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error updating {self.model.__name__}: {str(e)}")
            raise
    
    def delete(self, db: Session, *, id: int) -> Optional[ModelType]:
        """Delete a record by ID"""
        try:
            obj = db.query(self.model).filter(self.model.id == id).first()
            if obj:
                db.delete(obj)
                db.commit()
            return obj
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error deleting {self.model.__name__} with id {id}: {str(e)}")
            raise
    
    def count(self, db: Session, *, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filtering"""
        try:
            query = db.query(self.model)
            
            if filters:
                for key, value in filters.items():
                    if hasattr(self.model, key):
                        if isinstance(value, list):
                            query = query.filter(getattr(self.model, key).in_(value))
                        else:
                            query = query.filter(getattr(self.model, key) == value)
            
            return query.count()
        except SQLAlchemyError as e:
            logger.error(f"Error counting {self.model.__name__}: {str(e)}")
            raise
    
    def exists(self, db: Session, *, id: int) -> bool:
        """Check if a record exists by ID"""
        try:
            return db.query(self.model).filter(self.model.id == id).first() is not None
        except SQLAlchemyError as e:
            logger.error(f"Error checking existence of {self.model.__name__} with id {id}: {str(e)}")
            raise


class CRUDWithUnique(CRUDBase[ModelType]):
    """CRUD operations with unique field support"""
    
    def get_by_unique(self, db: Session, *, unique_field: str, value: Any) -> Optional[ModelType]:
        """Get a record by unique field"""
        try:
            if hasattr(self.model, unique_field):
                return db.query(self.model).filter(getattr(self.model, unique_field) == value).first()
            return None
        except SQLAlchemyError as e:
            logger.error(f"Error getting {self.model.__name__} by {unique_field}={value}: {str(e)}")
            raise
    
    def update_by_unique(
        self, 
        db: Session, 
        *, 
        unique_field: str, 
        value: Any, 
        obj_in: Dict[str, Any]
    ) -> Optional[ModelType]:
        """Update a record by unique field"""
        try:
            db_obj = self.get_by_unique(db, unique_field=unique_field, value=value)
            if db_obj:
                return self.update(db, db_obj=db_obj, obj_in=obj_in)
            return None
        except SQLAlchemyError as e:
            logger.error(f"Error updating {self.model.__name__} by {unique_field}={value}: {str(e)}")
            raise
    
    def delete_by_unique(self, db: Session, *, unique_field: str, value: Any) -> Optional[ModelType]:
        """Delete a record by unique field"""
        try:
            db_obj = self.get_by_unique(db, unique_field=unique_field, value=value)
            if db_obj:
                return self.delete(db, id=db_obj.id)
            return None
        except SQLAlchemyError as e:
            logger.error(f"Error deleting {self.model.__name__} by {unique_field}={value}: {str(e)}")
            raise


class CRUDWithRelationships(CRUDBase[ModelType]):
    """CRUD operations with relationship support"""
    
    def get_with_relations(
        self, 
        db: Session, 
        *, 
        id: int, 
        relations: Optional[List[str]] = None
    ) -> Optional[ModelType]:
        """Get a record with specified relationships loaded"""
        try:
            query = db.query(self.model).filter(self.model.id == id)
            
            if relations:
                for relation in relations:
                    if hasattr(self.model, relation):
                        query = query.options(db.joinedload(getattr(self.model, relation)))
            
            return query.first()
        except SQLAlchemyError as e:
            logger.error(f"Error getting {self.model.__name__} with relations: {str(e)}")
            raise
    
    def get_multi_with_relations(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        relations: Optional[List[str]] = None
    ) -> List[ModelType]:
        """Get multiple records with specified relationships loaded"""
        try:
            query = db.query(self.model)
            
            if relations:
                for relation in relations:
                    if hasattr(self.model, relation):
                        query = query.options(db.joinedload(getattr(self.model, relation)))
            
            if filters:
                for key, value in filters.items():
                    if hasattr(self.model, key):
                        if isinstance(value, list):
                            query = query.filter(getattr(self.model, key).in_(value))
                        else:
                            query = query.filter(getattr(self.model, key) == value)
            
            return query.offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            logger.error(f"Error getting multiple {self.model.__name__} with relations: {str(e)}")
            raise
