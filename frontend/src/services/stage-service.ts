import { api } from '@/lib/api'
import type { ConstructionStage, StageUpdate, StageStatus } from '@/lib/types'

export const stageService = {
  create: (projectId: string, name: string) =>
    api.post<ConstructionStage>(`/projects/${projectId}/stages`, { name }),

  update: (projectId: string, stageId: string, data: { name?: string; status?: StageStatus }) =>
    api.patch<ConstructionStage>(`/projects/${projectId}/stages/${stageId}`, data),

  delete: (projectId: string, stageId: string) =>
    api.delete(`/projects/${projectId}/stages/${stageId}`),

  reorder: (projectId: string, stageIds: string[]) =>
    api.put(`/projects/${projectId}/stages/reorder`, { stageIds }),

  addUpdate: (projectId: string, stageId: string, description: string, image?: File) => {
    const formData = new FormData()
    formData.append('description', description)
    if (image) {
      formData.append('image', image)
    }
    return api.post<StageUpdate>(
      `/projects/${projectId}/stages/${stageId}/updates`,
      formData
    )
  },
}
