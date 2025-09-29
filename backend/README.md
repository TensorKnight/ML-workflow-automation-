# OctoML Backend API

A FastAPI backend server for the OctoML project with hot reloading support.

## Setup

1. **Create and activate virtual environment:**
   ```powershell
   cd backend
   uv venv
   .venv\Scripts\Activate.ps1
   ```

2. **Install dependencies:**
   ```powershell
   uv pip install -r requirements.txt
   ```

## Development

### Quick Start
Run the development server with hot reloading:
```powershell
.\start-dev.ps1
```

### Manual Start
```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info
```

## API Endpoints

- **Root:** `GET /` - Welcome message
- **Health Check:** `GET /health` - Server health status
- **List Models:** `GET /api/v1/models` - Available ML models
- **Predict:** `POST /api/v1/predict` - Make predictions

## Documentation

- **Interactive API Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Features

- ✅ FastAPI framework
- ✅ Hot reloading with uvicorn
- ✅ CORS middleware
- ✅ Pydantic models for request/response validation
- ✅ Automatic API documentation
- ✅ Health check endpoint
- ✅ Ready for ML model integration
