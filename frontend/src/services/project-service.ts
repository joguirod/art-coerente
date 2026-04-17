import { api } from '@/lib/api'
import type { CreateProjectRequest, Project, UpdateProjectRequest } from '@/lib/types'

export const projectService = {
  getAll: () => api.get<Project[]>('/projects'),

  getById: (id: string) => api.get<Project>(`/projects/${id}`),

  create: (data: CreateProjectRequest) => api.post<Project>('/projects', data),

  update: (id: string, data: UpdateProjectRequest) => api.put<Project>(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),
}
