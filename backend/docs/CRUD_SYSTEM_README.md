# Generic CRUD System for OctoML Backend

This document describes the comprehensive CRUD (Create, Read, Update, Delete) system implemented for the OctoML ML workflow management backend.

## Architecture Overview

The CRUD system is organized into several layers:

```
┌─────────────────┐
│     Routers     │  ← API endpoints and request handling
├─────────────────┤
│   Controllers   │  ← Business logic and validation
├─────────────────┤
│    Services     │  ← Complex business operations
├─────────────────┤
│     Models      │  ← Database CRUD operations
├─────────────────┤
│   Database      │  ← SQLAlchemy models and schema
└─────────────────┘
```

## Components

### 1. Generic CRUD Base Classes (`utils/crud_base.py`)

- **CRUDBase**: Generic CRUD operations for any SQLAlchemy model
- **CRUDWithUnique**: Extends CRUDBase with unique field support
- **CRUDWithRelationships**: Extends CRUDBase with relationship loading

### 2. Database Models (`db/models.py`)

Specialized CRUD classes for each entity:
- `CRUDWorkflow`: Workflow operations with unique_id support
- `CRUDBlock`: Block operations with relationship loading
- `CRUDBlockConnection`: Connection operations with workflow filtering
- `CRUDDataIngestion`: Data ingestion configuration operations
- `CRUDDataPreprocessing`: Data preprocessing configuration operations
- `CRUDFeatureEngineering`: Feature engineering configuration operations
- `CRUDBlockType`: Block type operations

### 3. Controllers (`controllers/`)

Business logic and validation layer:
- `workflow_controller.py`: Workflow management
- `block_controller.py`: Block management
- `connection_controller.py`: Block connection management
- `data_ingestion_controller.py`: Data ingestion config management
- `data_preprocessing_controller.py`: Data preprocessing config management
- `feature_engineering_controller.py`: Feature engineering config management

### 4. Services (`services/`)

Complex business operations:
- `workflow_service.py`: Workflow duplication, validation, execution order

### 5. Schemas (`schemas/`)

Pydantic models for request/response validation:
- `workflow.py`: Workflow schemas
- `block.py`: Block schemas
- `connection.py`: Connection schemas
- `data_ingestion.py`: Data ingestion config schemas
- `data_preprocessing.py`: Data preprocessing config schemas
- `feature_engineering.py`: Feature engineering config schemas

### 6. Routers (`routers/`)

FastAPI route definitions:
- `workflows.py`: Workflow endpoints
- `blocks.py`: Block endpoints
- `connections.py`: Connection endpoints
- `data_ingestion.py`: Data ingestion config endpoints
- `data_preprocessing.py`: Data preprocessing config endpoints
- `feature_engineering.py`: Feature engineering config endpoints

## API Endpoints

### Workflows (`/workflows`)

- `POST /workflows/` - Create workflow
- `GET /workflows/` - List workflows (with filtering)
- `GET /workflows/{id}` - Get workflow by ID
- `GET /workflows/unique/{unique_id}` - Get workflow by unique ID
- `GET /workflows/{id}/with-blocks` - Get workflow with blocks
- `PUT /workflows/{id}` - Update workflow
- `DELETE /workflows/{id}` - Delete workflow
- `GET /workflows/count/total` - Count workflows

### Blocks (`/blocks`)

- `POST /blocks/` - Create block
- `GET /blocks/` - List blocks (with filtering)
- `GET /blocks/{id}` - Get block by ID
- `GET /blocks/{id}/with-relations` - Get block with relations
- `PUT /blocks/{id}` - Update block
- `PATCH /blocks/{id}/status` - Update block execution status
- `DELETE /blocks/{id}` - Delete block
- `GET /blocks/workflow/{workflow_id}/count` - Count blocks by workflow

### Connections (`/connections`)

- `POST /connections/` - Create connection
- `GET /connections/` - List connections (with filtering)
- `GET /connections/{id}` - Get connection by ID
- `GET /connections/{id}/with-relations` - Get connection with relations
- `PUT /connections/{id}` - Update connection
- `DELETE /connections/{id}` - Delete connection
- `GET /connections/workflow/{workflow_id}/count` - Count connections by workflow

### Data Ingestion (`/data-ingestion`)

- `POST /data-ingestion/configs` - Create config
- `GET /data-ingestion/configs` - List configs (with filtering)
- `GET /data-ingestion/configs/{id}` - Get config by ID
- `GET /data-ingestion/configs/name/{name}` - Get config by name
- `PUT /data-ingestion/configs/{id}` - Update config
- `DELETE /data-ingestion/configs/{id}` - Delete config
- `GET /data-ingestion/configs/count/total` - Count configs

### Data Preprocessing (`/data-preprocessing`)

- `POST /data-preprocessing/configs` - Create config
- `GET /data-preprocessing/configs` - List configs (with filtering)
- `GET /data-preprocessing/configs/{id}` - Get config by ID
- `GET /data-preprocessing/configs/name/{name}` - Get config by name
- `PUT /data-preprocessing/configs/{id}` - Update config
- `DELETE /data-preprocessing/configs/{id}` - Delete config
- `GET /data-preprocessing/configs/count/total` - Count configs

### Feature Engineering (`/feature-engineering`)

- `POST /feature-engineering/configs` - Create config
- `GET /feature-engineering/configs` - List configs (with filtering)
- `GET /feature-engineering/configs/{id}` - Get config by ID
- `GET /feature-engineering/configs/name/{name}` - Get config by name
- `PUT /feature-engineering/configs/{id}` - Update config
- `DELETE /feature-engineering/configs/{id}` - Delete config
- `GET /feature-engineering/configs/count/total` - Count configs

## Features

### Generic CRUD Operations

All entities support standard CRUD operations:
- **Create**: Create new records with validation
- **Read**: Get single records or lists with filtering
- **Update**: Update existing records with partial updates
- **Delete**: Delete records with proper cleanup

### Advanced Features

1. **Filtering**: All list endpoints support filtering by relevant fields
2. **Pagination**: Skip/limit parameters for large datasets
3. **Relationships**: Load related data when needed
4. **Validation**: Comprehensive input validation and error handling
5. **Unique Constraints**: Support for unique field operations
6. **Business Logic**: Complex operations like workflow duplication

### Error Handling

- Consistent HTTP status codes
- Detailed error messages
- Database transaction rollback on errors
- Input validation with Pydantic

### Database Features

- Connection pooling and management
- Transaction support
- Relationship loading
- Index optimization
- Proper foreign key constraints

## Usage Examples

### Creating a Workflow

```python
workflow_data = {
    "name": "Customer Classification",
    "description": "Classify customers based on behavior",
    "problem_type": "classification"
}

response = requests.post("/workflows/", json=workflow_data)
# unique_id is auto-generated and returned in the response
```

### Creating a Block

```python
block_data = {
    "workflow_id": 1,
    "block_type_id": 1,
    "name": "Data Loader",
    "description": "Load customer data",
    "data_ingestion_config_id": 1
}

response = requests.post("/blocks/", json=block_data)
```

### Creating a Connection

```python
connection_data = {
    "source_block_id": 1,
    "target_block_id": 2,
    "connection_name": "data_flow",
    "connection_type": "data"
}

response = requests.post("/connections/", json=connection_data)
```

## Future Enhancements

1. **Caching**: Add Redis caching for frequently accessed data
2. **Audit Logging**: Track all CRUD operations
3. **Soft Deletes**: Implement soft delete functionality
4. **Bulk Operations**: Add bulk create/update/delete endpoints
5. **Search**: Add full-text search capabilities
6. **Export/Import**: Add data export/import functionality

## Testing

The system is designed to be easily testable with:
- Dependency injection for database sessions
- Mockable service layers
- Comprehensive error handling
- Clear separation of concerns

## Performance Considerations

- Database indexes on frequently queried fields
- Pagination for large datasets
- Relationship loading only when needed
- Connection pooling for database efficiency
- Proper SQLAlchemy query optimization
