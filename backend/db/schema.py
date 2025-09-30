"""
Database schema definitions for ML workflow system.
This module contains SQLAlchemy models for all database tables.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()


class ProblemType(enum.Enum):
    """Problem type enumeration"""
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"


class BlockType(enum.Enum):
    """Block type enumeration"""
    DATA_INGESTION = "data_ingestion"
    DATA_PREPROCESSING = "data_preprocessing"
    FEATURE_ENGINEERING = "feature_engineering"


class WorkflowConfig(Base):
    """Workflow configuration table"""
    __tablename__ = "workflow_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    unique_id = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    problem_type = Column(Enum(ProblemType), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    blocks = relationship("Block", back_populates="workflow", cascade="all, delete-orphan")


class DataIngestionConfig(Base):
    """Data ingestion configuration template table"""
    __tablename__ = "data_ingestion_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # File configuration
    file_path = Column(String(500))
    file_type = Column(String(50))  # csv, json, excel, parquet, sql, tsv
    
    # Schema configuration (stored as JSON)
    schema_config = Column(JSON)  # DataSchema structure
    
    # Merge configuration (stored as JSON)
    merge_config = Column(JSON)  # merge_config structure
    
    # Load parameters (stored as JSON)
    load_kwargs = Column(JSON)  # Additional pandas read parameters
    
    # Quality check settings
    enable_quality_checks = Column(Boolean, default=True)
    quality_thresholds = Column(JSON)  # Custom quality thresholds
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DataPreprocessingConfig(Base):
    """Data preprocessing configuration template table"""
    __tablename__ = "data_preprocessing_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Auto clean option
    auto_clean = Column(Boolean, default=False)
    
    # Imputation configuration (stored as JSON)
    imputation_config = Column(JSON)  # MissingValueHandler config
    
    # Outlier handling configuration (stored as JSON)
    outlier_config = Column(JSON)  # OutlierHandler config
    
    # Encoding configuration (stored as JSON)
    encoding_config = Column(JSON)  # CategoricalEncoder config
    
    # Scaling configuration (stored as JSON)
    scaling_config = Column(JSON)  # FeatureScaler config
    
    # Rare category handling (stored as JSON)
    rare_category_config = Column(JSON)  # RareCategoryHandler config
    
    # Skewness handling (stored as JSON)
    skewness_config = Column(JSON)  # SkewnessHandler config
    
    # Class imbalance handling (stored as JSON)
    class_imbalance_config = Column(JSON)  # ClassImbalanceHandler config
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FeatureEngineeringConfig(Base):
    """Feature engineering configuration template table"""
    __tablename__ = "feature_engineering_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Feature generation settings
    feature_type = Column(String(50), default='both')  # auto, manual, both
    
    # Manual feature configuration (stored as JSON)
    manual_config = Column(JSON)  # ManualFeatureGenerator config
    
    # Target configuration
    target_type = Column(String(50), default='classification')
    target_col = Column(String(255))
    
    # Feature selection settings
    selection_method = Column(String(50), default='univariate')  # univariate, rfe, variance
    k_features = Column(Integer, default=20)
    
    # Dimensionality reduction settings
    apply_dimensionality_reduction = Column(Boolean, default=False)
    n_components = Column(Integer, default=10)
    
    # Auto feature generation settings (stored as JSON)
    auto_generation_config = Column(JSON)  # AutoFeatureGenerator settings
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BlockTypeConfig(Base):
    """Block type configuration table"""
    __tablename__ = "block_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Enum(BlockType), unique=True, nullable=False)
    display_name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Configuration schema (stored as JSON)
    config_schema = Column(JSON)  # JSON schema for validation
    
    # Default configuration (stored as JSON)
    default_config = Column(JSON)
    
    # UI configuration (stored as JSON)
    ui_config = Column(JSON)  # Frontend UI configuration
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Block(Base):
    """Block instances table"""
    __tablename__ = "blocks"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflow_configs.id"), nullable=False)
    block_type_id = Column(Integer, ForeignKey("block_types.id"), nullable=False)
    
    # Block identification
    name = Column(String(255), nullable=False)
    description = Column(Text)
    position_x = Column(Float, default=0.0)  # For UI positioning
    position_y = Column(Float, default=0.0)  # For UI positioning
    
    # Configuration references
    data_ingestion_config_id = Column(Integer, ForeignKey("data_ingestion_configs.id"))
    data_preprocessing_config_id = Column(Integer, ForeignKey("data_preprocessing_configs.id"))
    feature_engineering_config_id = Column(Integer, ForeignKey("feature_engineering_configs.id"))
    
    # Custom configuration overrides (stored as JSON)
    custom_config = Column(JSON)  # Override specific config values
    
    # Execution settings
    enabled = Column(Boolean, default=True)
    execution_order = Column(Integer, default=0)
    
    # Status tracking
    last_executed_at = Column(DateTime)
    execution_status = Column(String(50))  # pending, running, completed, failed
    execution_log = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workflow = relationship("WorkflowConfig", back_populates="blocks")
    block_type = relationship("BlockTypeConfig")
    data_ingestion_config = relationship("DataIngestionConfig")
    data_preprocessing_config = relationship("DataPreprocessingConfig")
    feature_engineering_config = relationship("FeatureEngineeringConfig")
    
    # Block connections
    input_connections = relationship("BlockConnection", foreign_keys="BlockConnection.target_block_id", back_populates="target_block")
    output_connections = relationship("BlockConnection", foreign_keys="BlockConnection.source_block_id", back_populates="source_block")


class BlockConnection(Base):
    """Block connections table"""
    __tablename__ = "block_connections"
    
    id = Column(Integer, primary_key=True, index=True)
    source_block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    target_block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    
    # Connection metadata
    connection_name = Column(String(255))
    connection_type = Column(String(50), default='data')  # data, control, etc.
    
    # Data flow configuration
    source_output = Column(String(255))  # Source block output identifier
    target_input = Column(String(255))   # Target block input identifier
    
    # Data transformation (stored as JSON)
    transformation_config = Column(JSON)  # Optional data transformation
    
    # Connection settings
    enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    source_block = relationship("Block", foreign_keys=[source_block_id], back_populates="output_connections")
    target_block = relationship("Block", foreign_keys=[target_block_id], back_populates="input_connections")


# Indexes for better performance
from sqlalchemy import Index

# Add indexes for commonly queried fields
Index('idx_workflow_unique_id', WorkflowConfig.unique_id)
Index('idx_block_workflow_id', Block.workflow_id)
Index('idx_block_type_id', Block.block_type_id)
Index('idx_connection_source', BlockConnection.source_block_id)
Index('idx_connection_target', BlockConnection.target_block_id)
Index('idx_block_execution_status', Block.execution_status)
Index('idx_block_enabled', Block.enabled)
