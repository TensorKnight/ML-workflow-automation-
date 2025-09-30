# Project Integration Test Guide

## Backend Integration Test

This document outlines how to test the project creation and display integration between the frontend and backend.

### Prerequisites

1. **Backend Server Running**: Ensure the backend is running on `http://localhost:8000`
2. **Frontend Server Running**: Ensure the frontend is running (typically on `http://localhost:5173` or similar)

### Test Steps

#### 1. Test Project Creation

1. **Navigate to Projects Page**: Go to `/` or `/projects` in the frontend
2. **Click "New Project"**: Click the "New Project" button
3. **Fill Project Form**:
   - Project Name: "Test Project"
   - Description: "This is a test project"
   - Problem Type: Select "Classification"
4. **Create Project**: Click "Create Project"
5. **Verify**: The project should appear in the projects list immediately

#### 2. Test Project Display

1. **Check Project Card**: The newly created project should appear as a card
2. **Verify Project Details**:
   - Project name should be displayed
   - Description should be shown
   - Problem type should be correct
   - Created date should be shown
   - Unique ID should be displayed

#### 3. Test Project Navigation

1. **Click Project Card**: Click on the project card
2. **Verify Navigation**: Should navigate to `/workflow/{project_id}`

#### 4. Test Error Handling

1. **Test Network Error**: 
   - Stop the backend server
   - Try to create a new project
   - Should show error message
2. **Test Validation**:
   - Try to create project without name
   - Create button should be disabled

### Expected API Calls

The integration should make these API calls:

1. **GET /workflows/** - Load existing projects
2. **POST /workflows/** - Create new project
3. **GET /workflows/{id}** - Get specific project (when navigating)

### API Request/Response Examples

#### Create Project Request
```json
POST /workflows/
{
  "name": "Test Project",
  "description": "This is a test project",
  "problem_type": "classification"
}
```

#### Create Project Response
```json
{
  "id": 1,
  "unique_id": "uuid-string",
  "name": "Test Project",
  "description": "This is a test project",
  "problem_type": "classification",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Get Projects Response
```json
{
  "workflows": [
    {
      "id": 1,
      "unique_id": "uuid-string",
      "name": "Test Project",
      "description": "This is a test project",
      "problem_type": "classification",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 100
}
```

### Troubleshooting

1. **CORS Issues**: If you see CORS errors, ensure the backend has CORS configured for the frontend URL
2. **Network Errors**: Check that the backend is running and accessible
3. **Data Not Loading**: Check browser console for API errors
4. **Projects Not Creating**: Verify the API endpoint is correct and the request format matches the backend schema

### Success Criteria

✅ Projects load from backend API  
✅ New projects can be created via API  
✅ Project cards display correct information  
✅ Navigation to project workflow works  
✅ Error handling works for network issues  
✅ Loading states are shown during API calls  
✅ Form validation prevents invalid submissions  
