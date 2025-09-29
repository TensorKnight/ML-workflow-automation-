# Development startup script for OctoML Backend
# This script activates the virtual environment and starts the FastAPI server with hot reloading

Write-Host "Starting OctoML Backend Development Server..." -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "Virtual environment not found. Creating one..." -ForegroundColor Yellow
    uv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Blue
& ".venv\Scripts\Activate.ps1"

# Install dependencies if needed
Write-Host "Installing dependencies..." -ForegroundColor Blue
uv pip install -e .

# Start the FastAPI server with hot reloading
Write-Host "Starting FastAPI server with hot reloading..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API documentation at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info
