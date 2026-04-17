import { api } from '@/lib/api'
import type { TosItem } from '@/lib/types'

export const tosService = {
  search: (q: string, limit = 30) =>
    api.get<TosItem[]>(`/tos/search?q=${encodeURIComponent(q)}&limit=${limit}`),

  grupos: () => api.get<string[]>('/tos/grupos'),
}
