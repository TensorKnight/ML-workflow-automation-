import { useQuery, useMutation, useQueryClient } from 'react-query'
import { projectApi, Project } from '../services/api'

export const useProjects = () => {
  return useQuery('projects', projectApi.getProjects)
}

export const useProject = (id: string) => {
  return useQuery(['project', id], () => projectApi.getProject(id), {
    enabled: !!id,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation(projectApi.createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectApi.updateProject(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries('projects')
        queryClient.invalidateQueries(['project', id])
      },
    }
  )
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation(projectApi.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
    },
  })
}

