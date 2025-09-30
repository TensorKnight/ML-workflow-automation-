# OctoML Backend API Documentation

## Overview

The OctoML Backend provides a comprehensive REST API for managing ML workflows, blocks, connections, and configuration templates.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, the API does not require authentication. This will be added in future versions.

## API Endpoints

### Workflows

Manage ML workflows and their configurations.

#### Create Workflow
```http
POST /workflows/
Content-Type: application/json

{
  "name": "Customer Classification",
  "description": "Classify customers based on behavior",
  "problem_type": "classification"
}
```

#### List Workflows
```http
GET /workflows/?skip=0&limit=100&problem_type=classification
```

#### Get Workflow
```http
GET /workflows/{workflow_id}
```

#### Update Workflow
```http
PUT /workflows/{workflow_id}
Content-Type: application/json

{
  "name": "Updated Workflow Name",
  "description": "Updated description"
}
```

#### Delete Workflow
```http
DELETE /workflows/{workflow_id}
```

### Blocks

Manage workflow blocks (data ingestion, preprocessing, feature engineering).

#### Create Block
```http
POST /blocks/
Content-Type: application/json

{
  "workflow_id": 1,
  "block_type_id": 1,
  "name": "Data Loader",
  "description": "Load customer data",
  "data_ingestion_config_id": 1,
  "enabled": true,
  "execution_order": 1
}
```

#### List Blocks
```http
GET /blocks/?workflow_id=1&enabled_only=true
```

#### Get Block
```http
GET /blocks/{block_id}
```

#### Update Block Status
```http
PATCH /blocks/{block_id}/status
Content-Type: application/json

{
  "status": "completed",
  "log": "Block executed successfully"
}
```

### Connections

Manage connections between workflow blocks.

#### Create Connection
```http
POST /connections/
Content-Type: application/json

{
  "source_block_id": 1,
  "target_block_id": 2,
  "connection_name": "data_flow",
  "connection_type": "data",
  "enabled": true
}
```

#### List Connections
```http
GET /connections/?workflow_id=1&enabled_only=true
```

### Data Ingestion Configurations

Manage data ingestion configuration templates.

#### Create Data Ingestion Config
```http
POST /data-ingestion/configs
Content-Type: application/json

{
  "name": "CSV Data Loader",
  "description": "Configuration for loading CSV files",
  "file_type": "csv",
  "file_path": "/data/input.csv",
  "enable_quality_checks": true
}
```

#### List Data Ingestion Configs
```http
GET /data-ingestion/configs/?file_type=csv
```

### Data Preprocessing Configurations

Manage data preprocessing configuration templates.

#### Create Data Preprocessing Config
```http
POST /data-preprocessing/configs
Content-Type: application/json

{
  "name": "Standard Preprocessing",
  "description": "Standard data preprocessing pipeline",
  "auto_clean": true,
  "imputation_config": {
    "strategy": "mean"
  }
}
```

### Feature Engineering Configurations

Manage feature engineering configuration templates.

#### Create Feature Engineering Config
```http
POST /feature-engineering/configs
Content-Type: application/json

{
  "name": "Auto Feature Generation",
  "description": "Automated feature generation",
  "feature_type": "auto",
  "target_type": "classification",
  "selection_method": "univariate",
  "k_features": 20
}
```

## Response Formats

### Success Response
```json
{
  "id": 1,
  "name": "Example",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Error Response
```json
{
  "detail": "Error message describing what went wrong"
}
```

### List Response
```json
{
  "items": [...],
  "total": 100,
  "skip": 0,
  "limit": 100
}
```

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

## Query Parameters

### Pagination
- `skip` (int): Number of records to skip (default: 0)
- `limit` (int): Number of records to return (default: 100, max: 1000)

### Filtering
- `problem_type` (string): Filter workflows by problem type
- `file_type` (string): Filter configs by file type
- `workflow_id` (int): Filter blocks/connections by workflow
- `enabled_only` (bool): Filter for enabled items only

## Data Types

### Problem Types
- `classification`
- `regression`
- `clustering`

### Block Types
- `data_ingestion`
- `data_preprocessing`
- `feature_engineering`

### File Types
- `csv`
- `json`
- `excel`
- `parquet`
- `sql`
- `tsv`

## Examples

### Complete Workflow Creation

1. Create a workflow:
```bash
curl -X POST "http://localhost:8000/workflows/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Analysis Pipeline",
    "description": "Complete customer analysis workflow",
    "problem_type": "classification"
  }'
```

2. Create data ingestion config:
```bash
curl -X POST "http://localhost:8000/data-ingestion/configs" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Data Loader",
    "file_type": "csv",
    "file_path": "/data/customers.csv"
  }'
```

3. Create a data ingestion block:
```bash
curl -X POST "http://localhost:8000/blocks/" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": 1,
    "block_type_id": 1,
    "name": "Load Customer Data",
    "data_ingestion_config_id": 1
  }'
```

4. Create a preprocessing block:
```bash
curl -X POST "http://localhost:8000/blocks/" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": 1,
    "block_type_id": 2,
    "name": "Preprocess Data",
    "data_preprocessing_config_id": 1
  }'
```

5. Connect the blocks:
```bash
curl -X POST "http://localhost:8000/connections/" \
  -H "Content-Type: application/json" \
  -d '{
    "source_block_id": 1,
    "target_block_id": 2,
    "connection_name": "data_flow"
  }'
```

## Rate Limiting

Currently, there are no rate limits. This will be implemented in future versions.

## Versioning

The API is currently at version 1.0. Version information is included in the API responses and can be accessed via the `/health` endpoint.
