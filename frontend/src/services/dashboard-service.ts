import { api } from '@/lib/api'
import type { DashboardSummary } from '@/lib/types'

export const dashboardService = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
}
