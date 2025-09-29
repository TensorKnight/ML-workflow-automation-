import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface Project {
  id: string
  name: string
  description?: string
  problem_type: 'classification' | 'regression'
  status: 'created' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface Dataset {
  id: string
  project_id: string
  name: string
  file_path: string
  file_size: number
  file_type: string
  rows_count: number
  columns_count: number
  uploaded_at: string
}

export interface QualityReport {
  id: string
  project_id: string
  dataset_id: string
  report_data: any
  issues_count: number
  pros_count: number
  cons_count: number
  created_at: string
}

export interface ModelResult {
  id: string
  project_id: string
  model_name: string
  model_type: string
  metrics: any
  training_time: number
  model_path: string
  is_best_model: boolean
  created_at: string
}

export interface BackgroundJob {
  id: string
  project_id: string
  job_type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  celery_task_id: string
  progress: number
  error_message?: string
  started_at?: string
  completed_at?: string
  created_at: string
}

// Project API
export const projectApi = {
  // Get all projects
  getProjects: () => api.get<Project[]>('/projects/'),
  
  // Get project by ID
  getProject: (id: string) => api.get<Project>(`/projects/${id}`),
  
  // Create new project
  createProject: (data: {
    name: string
    description?: string
    problem_type: 'classification' | 'regression'
  }) => api.post<Project>('/projects/', data),
  
  // Update project
  updateProject: (id: string, data: Partial<Project>) => 
    api.put<Project>(`/projects/${id}`, data),
  
  // Delete project
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
}

// Dataset API
export const datasetApi = {
  // Upload dataset
  uploadDataset: (projectId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<Dataset>(`/projects/${projectId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  // Get datasets for project
  getDatasets: (projectId: string) => api.get<Dataset[]>(`/projects/${projectId}/datasets`),
  
  // Delete dataset
  deleteDataset: (projectId: string, datasetId: string) => 
    api.delete(`/projects/${projectId}/datasets/${datasetId}`),
}

// Data Ingestion API
export const ingestionApi = {
  // Run data ingestion
  runIngestion: (projectId: string, config: any) => 
    api.post(`/projects/${projectId}/ingestion`, config),
  
  // Get quality report
  getQualityReport: (projectId: string) => 
    api.get<QualityReport>(`/projects/${projectId}/quality-report`),
}

// Preprocessing API
export const preprocessingApi = {
  // Run preprocessing
  runPreprocessing: (projectId: string, config: any) => 
    api.post(`/projects/${projectId}/preprocessing`, config),
  
  // Get preprocessing config
  getPreprocessingConfig: (projectId: string) => 
    api.get(`/projects/${projectId}/preprocessing-config`),
}

// Feature Engineering API
export const featureApi = {
  // Run feature engineering
  runFeatureEngineering: (projectId: string, config: any) => 
    api.post(`/projects/${projectId}/feature-engineering`, config),
  
  // Get feature config
  getFeatureConfig: (projectId: string) => 
    api.get(`/projects/${projectId}/feature-config`),
}

// Model Training API
export const trainingApi = {
  // Run model training
  runTraining: (projectId: string, config: any) => 
    api.post(`/projects/${projectId}/training`, config),
  
  // Get model results
  getModelResults: (projectId: string) => 
    api.get<ModelResult[]>(`/projects/${projectId}/results`),
  
  // Get best model
  getBestModel: (projectId: string) => 
    api.get<ModelResult>(`/projects/${projectId}/best-model`),
}

// Background Jobs API
export const jobApi = {
  // Get job status
  getJobStatus: (projectId: string, jobId: string) => 
    api.get<BackgroundJob>(`/projects/${projectId}/jobs/${jobId}`),
  
  // Get all jobs for project
  getJobs: (projectId: string) => 
    api.get<BackgroundJob[]>(`/projects/${projectId}/jobs`),
  
  // Cancel job
  cancelJob: (projectId: string, jobId: string) => 
    api.post(`/projects/${projectId}/jobs/${jobId}/cancel`),
}

export default api

