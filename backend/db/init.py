"""
Database initialization and migration utilities
"""
from sqlalchemy import text
from db.database import engine, create_tables
from core.config import settings


def init_database():
    """
    Initialize database and create tables
    """
    try:
        # Test database connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful")
        
        # Create tables
        create_tables()
        print("✅ Database tables created successfully")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise


def check_database_connection():
    """
    Check if database is accessible
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
