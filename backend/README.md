# Database Setup for ML Workflow System

This directory contains the database schema and setup scripts for the ML workflow system.

## Files

- `backend/db/schema.py` - SQLAlchemy models for all database tables
- `backend/setup_database.py` - Database setup and initialization script

## Database Schema

The database consists of 5 main tables:

### 1. Workflow Config (`workflow_configs`)
Stores basic workflow information:
- `unique_id` - Unique identifier for the workflow
- `name` - Workflow name
- `description` - Workflow description
- `problem_type` - Type of ML problem (classification, regression, clustering)

### 2. Block Config Tables
Three separate tables for different block types:

#### Data Ingestion Config (`data_ingestion_configs`)
- File path and type configuration
- Schema validation settings
- Merge configuration for multiple datasets
- Quality check settings

#### Data Preprocessing Config (`data_preprocessing_configs`)
- Imputation strategies (mean, median, mode, KNN, iterative)
- Outlier handling (zscore, IQR, isolation forest, LOF)
- Encoding methods (onehot, ordinal, frequency, target, binary)
- Scaling methods (standard, minmax, robust, maxabs, quantile)
- Rare category handling
- Skewness transformation
- Class imbalance handling

#### Feature Engineering Config (`feature_engineering_configs`)
- Feature generation type (auto, manual, both)
- Manual feature definitions
- Target configuration
- Feature selection methods (univariate, RFE, variance)
- Dimensionality reduction settings

### 3. Block Types (`block_types`)
Defines available block types and their configurations:
- Data Ingestion
- Data Preprocessing  
- Feature Engineering

### 4. Blocks (`blocks`)
Individual block instances within workflows:
- Links to workflow and block type
- References to specific configurations
- Custom configuration overrides
- Execution settings and status tracking

### 5. Block Connections (`block_connections`)
Defines connections between blocks:
- Source and target block references
- Connection metadata
- Data flow configuration
- Optional transformations

## Usage

### Setup Database

```bash
# Create database and tables
python setup_database.py --action create

# Initialize with default data
python setup_database.py --action init

# Reset entire database
python setup_database.py --action reset

# Check database status
python setup_database.py --action status
```

### Database Configuration

The setup script uses SQLite by default, creating `ml_workflow.db` in the backend directory. You can specify a custom database URL:

```bash
python setup_database.py --action create --database-url "postgresql://user:pass@localhost/ml_workflow"
```

## Configuration Alignment

The database schemas are designed to work seamlessly with the existing configuration structures from:

- `src/preprocess/data_preprocess.py` - DataPreprocessor configurations
- `src/ingestion/data_ingestion.py` - DataIngestion configurations  
- `src/feature/feature_engineering.py` - FeatureEngineer configurations

All configuration fields are stored as JSON to maintain flexibility while ensuring type safety through the schema definitions.