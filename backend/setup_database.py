"""
Database setup script for ML workflow system.
This script creates the database and initializes it with default data.
"""

import os
import sys
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from db.schema import (
    Base, WorkflowConfig, DataIngestionConfig, DataPreprocessingConfig, 
    FeatureEngineeringConfig, BlockTypeConfig, Block, BlockConnection,
    ProblemType, BlockType
)
from core.config import settings


class DatabaseSetup:
    def __init__(self, database_url: str = None, use_config: bool = True):
        """
        Initialize database setup.
        
        Args:
            database_url: Database connection URL. If None, uses config or SQLite default.
            use_config: Whether to use settings from core.config
        """
        if database_url is None:
            if use_config:
                try:
                    # Try to use PostgreSQL from config
                    database_url = settings.database_url
                    print(f"🔄 Using PostgreSQL database from config: {settings.db_host}:{settings.db_port}/{settings.db_name}")
                except Exception as e:
                    print(f"⚠️  Could not load config, falling back to SQLite: {e}")
                    # Fallback to SQLite database in backend directory
                    db_path = backend_dir / "ml_workflow.db"
                    database_url = f"sqlite:///{db_path}"
                    print(f"🔄 Using SQLite database: {db_path}")
            else:
                # Default to SQLite database in backend directory
                db_path = backend_dir / "ml_workflow.db"
                database_url = f"sqlite:///{db_path}"
                print(f"🔄 Using SQLite database: {db_path}")
        
        self.database_url = database_url
        self.is_postgresql = database_url.startswith("postgresql://")
        
        # Configure engine based on database type
        if self.is_postgresql:
            self.engine = create_engine(database_url, echo=False, pool_pre_ping=True)
        else:
            self.engine = create_engine(database_url, echo=False)
            
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
    
    def create_database(self):
        """Create all database tables."""
        print("🔄 Creating database tables...")
        try:
            Base.metadata.create_all(bind=self.engine)
            print("✅ Database tables created successfully!")
            return True
        except Exception as e:
            print(f"❌ Error creating database tables: {e}")
            return False
    
    def drop_database(self):
        """Drop all database tables."""
        print("🔄 Dropping database tables...")
        try:
            Base.metadata.drop_all(bind=self.engine)
            print("✅ Database tables dropped successfully!")
            return True
        except Exception as e:
            print(f"❌ Error dropping database tables: {e}")
            return False
    
    def initialize_default_data(self):
        """Initialize database with default block types and configurations."""
        print("🔄 Initializing default data...")
        
        session = self.SessionLocal()
        try:
            # Create default block types
            self._create_default_block_types(session)
            
            # Create default configurations
            self._create_default_configurations(session)
            
            session.commit()
            print("✅ Default data initialized successfully!")
            return True
            
        except Exception as e:
            session.rollback()
            print(f"❌ Error initializing default data: {e}")
            return False
        finally:
            session.close()
    
    def _create_default_block_types(self, session):
        """Create default block types."""
        block_types = [
            {
                "name": BlockType.DATA_INGESTION,
                "display_name": "Data Ingestion",
                "description": "Load and validate data from various sources",
                "config_schema": {
                    "type": "object",
                    "properties": {
                        "file_path": {"type": "string"},
                        "file_type": {"type": "string", "enum": ["csv", "json", "excel", "parquet", "sql", "tsv"]},
                        "schema_config": {"type": "object"},
                        "merge_config": {"type": "object"},
                        "load_kwargs": {"type": "object"}
                    }
                },
                "default_config": {
                    "file_type": "csv",
                    "enable_quality_checks": True
                },
                "ui_config": {
                    "icon": "upload",
                    "color": "#4CAF50",
                    "inputs": [],
                    "outputs": ["data"]
                }
            },
            {
                "name": BlockType.DATA_PREPROCESSING,
                "display_name": "Data Preprocessing",
                "description": "Clean, transform, and prepare data for modeling",
                "config_schema": {
                    "type": "object",
                    "properties": {
                        "auto_clean": {"type": "boolean"},
                        "imputation_config": {"type": "object"},
                        "outlier_config": {"type": "object"},
                        "encoding_config": {"type": "object"},
                        "scaling_config": {"type": "object"},
                        "rare_category_config": {"type": "object"},
                        "skewness_config": {"type": "object"},
                        "class_imbalance_config": {"type": "object"}
                    }
                },
                "default_config": {
                    "auto_clean": False
                },
                "ui_config": {
                    "icon": "settings",
                    "color": "#FF9800",
                    "inputs": ["data"],
                    "outputs": ["processed_data"]
                }
            },
            {
                "name": BlockType.FEATURE_ENGINEERING,
                "display_name": "Feature Engineering",
                "description": "Generate, select, and transform features for machine learning",
                "config_schema": {
                    "type": "object",
                    "properties": {
                        "feature_type": {"type": "string", "enum": ["auto", "manual", "both"]},
                        "manual_config": {"type": "object"},
                        "target_type": {"type": "string", "enum": ["classification", "regression", "clustering"]},
                        "target_col": {"type": "string"},
                        "selection_method": {"type": "string", "enum": ["univariate", "rfe", "variance"]},
                        "k_features": {"type": "integer"},
                        "apply_dimensionality_reduction": {"type": "boolean"},
                        "n_components": {"type": "integer"}
                    }
                },
                "default_config": {
                    "feature_type": "both",
                    "target_type": "classification",
                    "selection_method": "univariate",
                    "k_features": 20,
                    "apply_dimensionality_reduction": False,
                    "n_components": 10
                },
                "ui_config": {
                    "icon": "engineering",
                    "color": "#2196F3",
                    "inputs": ["processed_data"],
                    "outputs": ["features"]
                }
            }
        ]
        
        for block_type_data in block_types:
            existing = session.query(BlockTypeConfig).filter_by(name=block_type_data["name"]).first()
            if not existing:
                block_type = BlockTypeConfig(**block_type_data)
                session.add(block_type)
    
    def _create_default_configurations(self, session):
        """Create default configurations for each block type."""
        
        # Default Data Ingestion Configuration
        ingestion_config = DataIngestionConfig(
            name="Default CSV Ingestion",
            description="Default configuration for CSV file ingestion with quality checks",
            file_type="csv",
            schema_config=None,
            merge_config=None,
            load_kwargs={},
            enable_quality_checks=True,
            quality_thresholds={
                "missing_threshold": 0.7,
                "duplicate_threshold": 0.7,
                "skewness_threshold": 2.0
            }
        )
        session.add(ingestion_config)
        
        # Default Data Preprocessing Configuration
        preprocessing_config = DataPreprocessingConfig(
            name="Default Preprocessing",
            description="Default preprocessing configuration with common transformations",
            auto_clean=False,
            imputation_config={
                "mean": [],
                "median": [],
                "mode": [],
                "knn": [],
                "n_neighbors": 5,
                "fill_value": 0
            },
            outlier_config={
                "method": "zscore",
                "threshold": 3,
                "action": "cap",
                "columns": None,
                "percentile_low": 0.05,
                "percentile_high": 0.95
            },
            encoding_config={
                "onehot": [],
                "ordinal": [],
                "frequency": [],
                "target": [],
                "binary": []
            },
            scaling_config={
                "standard": [],
                "minmax": [],
                "robust": [],
                "maxabs": [],
                "quantile": []
            },
            rare_category_config={
                "columns": None,
                "threshold": 0.01,
                "replacement": "Other"
            },
            skewness_config={
                "method": "log",
                "columns": None,
                "threshold": 0.5
            },
            class_imbalance_config={
                "method": "smote",
                "k_neighbors": 5
            }
        )
        session.add(preprocessing_config)
        
        # Default Feature Engineering Configuration
        feature_config = FeatureEngineeringConfig(
            name="Default Feature Engineering",
            description="Default feature engineering configuration with auto and manual features",
            feature_type="both",
            manual_config={
                "manual_features": {}
            },
            target_type="classification",
            target_col=None,
            selection_method="univariate",
            k_features=20,
            apply_dimensionality_reduction=False,
            n_components=10,
            auto_generation_config={
                "polynomial_degree": 2,
                "max_interactions": 20,
                "include_statistical_features": True,
                "include_log_features": True
            }
        )
        session.add(feature_config)
    
    def reset_database(self):
        """Reset the entire database (drop and recreate)."""
        print("🔄 Resetting database...")
        if self.drop_database() and self.create_database() and self.initialize_default_data():
            print("✅ Database reset completed successfully!")
            return True
        else:
            print("❌ Database reset failed!")
            return False
    
    def test_connection(self):
        """Test database connection."""
        try:
            with self.engine.connect() as conn:
                if self.is_postgresql:
                    result = conn.execute(text("SELECT version()"))
                    version = result.fetchone()[0]
                    print(f"✅ PostgreSQL connection successful!")
                    print(f"   Database version: {version}")
                else:
                    result = conn.execute(text("SELECT sqlite_version()"))
                    version = result.fetchone()[0]
                    print(f"✅ SQLite connection successful!")
                    print(f"   SQLite version: {version}")
                return True
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            return False
    
    def check_database_status(self):
        """Check if database exists and has required tables."""
        try:
            with self.engine.connect() as conn:
                if self.is_postgresql:
                    # PostgreSQL query
                    result = conn.execute(text("""
                        SELECT table_name FROM information_schema.tables 
                        WHERE table_schema = 'public' AND table_name IN (
                            'workflow_configs', 'data_ingestion_configs', 
                            'data_preprocessing_configs', 'feature_engineering_configs',
                            'block_types', 'blocks', 'block_connections'
                        )
                    """))
                    tables = [row[0] for row in result.fetchall()]
                else:
                    # SQLite query
                    result = conn.execute(text("""
                        SELECT name FROM sqlite_master 
                        WHERE type='table' AND name IN (
                            'workflow_configs', 'data_ingestion_configs', 
                            'data_preprocessing_configs', 'feature_engineering_configs',
                            'block_types', 'blocks', 'block_connections'
                        )
                    """))
                    tables = [row[0] for row in result.fetchall()]
                
                expected_tables = [
                    'workflow_configs', 'data_ingestion_configs', 
                    'data_preprocessing_configs', 'feature_engineering_configs',
                    'block_types', 'blocks', 'block_connections'
                ]
                
                missing_tables = set(expected_tables) - set(tables)
                
                if not missing_tables:
                    db_type = "PostgreSQL" if self.is_postgresql else "SQLite"
                    print(f"✅ Database ({db_type}) is properly set up with all required tables!")
                    return True
                else:
                    print(f"❌ Missing tables: {missing_tables}")
                    return False
                    
        except Exception as e:
            print(f"❌ Error checking database status: {e}")
            return False


def main():
    """Main function to run database setup."""
    import argparse
    
    parser = argparse.ArgumentParser(description="ML Workflow Database Setup")
    parser.add_argument("--action", choices=["create", "drop", "reset", "status", "init", "test"], 
                       default="create", help="Action to perform")
    parser.add_argument("--database-url", help="Database connection URL")
    parser.add_argument("--no-config", action="store_true", 
                       help="Don't use configuration from core.config (use SQLite)")
    parser.add_argument("--force-sqlite", action="store_true",
                       help="Force SQLite usage even if config is available")
    
    args = parser.parse_args()
    
    # Determine database URL
    database_url = args.database_url
    use_config = not args.no_config and not args.force_sqlite
    
    if args.force_sqlite:
        print("🔄 Forcing SQLite usage...")
        database_url = None
        use_config = False
    
    # Initialize database setup
    db_setup = DatabaseSetup(database_url, use_config)
    
    if args.action == "create":
        success = db_setup.create_database()
        if success:
            db_setup.initialize_default_data()
    elif args.action == "drop":
        db_setup.drop_database()
    elif args.action == "reset":
        db_setup.reset_database()
    elif args.action == "status":
        db_setup.check_database_status()
    elif args.action == "init":
        db_setup.initialize_default_data()
    elif args.action == "test":
        db_setup.test_connection()


if __name__ == "__main__":
    main()
