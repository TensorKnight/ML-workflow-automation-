import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  datasetApi,
  ingestionApi,
  preprocessingApi,
  featureApi,
  trainingApi,
  jobApi,
  BackgroundJob,
  ModelResult,
} from '../services/api'

export const useUploadDataset = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ projectId, file }: { projectId: string; file: File }) =>
      datasetApi.uploadDataset(projectId, file),
    {
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries(['datasets', projectId])
      },
    }
  )
}

export const useRunIngestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ projectId, config }: { projectId: string; config: any }) =>
      ingestionApi.runIngestion(projectId, config),
    {
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries(['quality-report', projectId])
      },
    }
  )
}

export const useRunPreprocessing = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ projectId, config }: { projectId: string; config: any }) =>
      preprocessingApi.runPreprocessing(projectId, config),
    {
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries(['preprocessing-config', projectId])
      },
    }
  )
}

export const useRunFeatureEngineering = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ projectId, config }: { projectId: string; config: any }) =>
      featureApi.runFeatureEngineering(projectId, config),
    {
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries(['feature-config', projectId])
      },
    }
  )
}

export const useRunTraining = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ projectId, config }: { projectId: string; config: any }) =>
      trainingApi.runTraining(projectId, config),
    {
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries(['model-results', projectId])
        queryClient.invalidateQueries(['best-model', projectId])
      },
    }
  )
}

export const useModelResults = (projectId: string) => {
  return useQuery(
    ['model-results', projectId],
    () => trainingApi.getModelResults(projectId),
    {
      enabled: !!projectId,
    }
  )
}

export const useBestModel = (projectId: string) => {
  return useQuery(
    ['best-model', projectId],
    () => trainingApi.getBestModel(projectId),
    {
      enabled: !!projectId,
    }
  )
}

export const useJobStatus = (projectId: string, jobId: string) => {
  return useQuery(
    ['job-status', projectId, jobId],
    () => jobApi.getJobStatus(projectId, jobId),
    {
      enabled: !!projectId && !!jobId,
      refetchInterval: 2000, // Poll every 2 seconds
    }
  )
}

export const useJobs = (projectId: string) => {
  return useQuery(
    ['jobs', projectId],
    () => jobApi.getJobs(projectId),
    {
      enabled: !!projectId,
    }
  )
}

