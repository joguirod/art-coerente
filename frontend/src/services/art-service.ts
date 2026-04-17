import { api } from '@/lib/api'
import type { Art, CoherenceAnalysis, CreateArtRequest, PdfExtractionResult } from '@/lib/types'

export const artService = {
  getAll: () => api.get<Art[]>('/arts'),

  getById: (id: string) => api.get<Art>(`/arts/${id}`),

  create: (data: CreateArtRequest) => api.post<Art>('/arts', data),

  delete: (id: string) => api.delete(`/arts/${id}`),

  analyze: (id: string) => api.post<CoherenceAnalysis>(`/arts/${id}/analyze`),

  getAnalysis: (id: string) => api.get<CoherenceAnalysis>(`/arts/${id}/analysis`),

  extractPdf: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<PdfExtractionResult>('/arts/extract-pdf', formData)
  },
}
