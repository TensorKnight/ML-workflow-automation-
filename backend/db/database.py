"""
Database connection and session management with singleton pattern
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Generator
import threading
from core.config import settings


class DatabaseSingleton:
    """Singleton class for database connection"""
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self.engine = None
            self.SessionLocal = None
            self.Base = declarative_base()
            self._initialized = True
    
    def initialize(self):
        """Initialize database connection"""
        if self.engine is None:
            self.engine = create_engine(
                settings.database_url,
                echo=settings.debug,  # Log SQL queries in debug mode
                pool_pre_ping=True,  # Verify connections before use
                pool_recycle=300,    # Recycle connections every 5 minutes
            )
            self.SessionLocal = sessionmaker(
                autocommit=False, 
                autoflush=False, 
                bind=self.engine
            )
    
    def get_session(self) -> Generator:
        """Get database session"""
        if self.SessionLocal is None:
            raise RuntimeError("Database not initialized. Call initialize() first.")
        
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    def create_tables(self):
        """Create all database tables"""
        if self.engine is None:
            raise RuntimeError("Database not initialized. Call initialize() first.")
        self.Base.metadata.create_all(bind=self.engine)


# Global singleton instance
db_singleton = DatabaseSingleton()

# Convenience functions
def get_db() -> Generator:
    """Dependency to get database session"""
    return db_singleton.get_session()


def create_tables():
    """Create all database tables"""
    db_singleton.create_tables()


def initialize_database():
    """Initialize database connection"""
    db_singleton.initialize()


# Export commonly used items
Base = db_singleton.Base
