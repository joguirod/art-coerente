'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Zap } from 'lucide-react'
import type { DashboardSummary } from '@/lib/types'
import { dashboardService } from '@/services/dashboard-service'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { RecentArtsList } from '@/components/dashboard/recent-arts-list'
import { ActiveProjectsList } from '@/components/dashboard/active-projects-list'
import { StatsSkeleton, ListSkeleton } from '@/components/shared/loading-skeleton'
import { ErrorState } from '@/components/shared/error-state'

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const summary = await dashboardService.getSummary()
      setData(summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (error) return <ErrorState message={error} onRetry={fetchData} />

  if (isLoading) {
    return (
      <div className="animate-slide-up">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <div className="h-9 w-64 bg-[#e3e2e0] rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-80 bg-[#e3e2e0] rounded animate-pulse" />
          </div>
        </div>
        <StatsSkeleton />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><ListSkeleton count={3} /></div>
          <ListSkeleton count={2} />
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="animate-slide-up">
      {/* Page header */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter text-[#1a1c1a] mb-1">
            Painel de Engenharia
          </h2>
          <p className="text-[#3d4943] font-medium text-sm">
            Análise de conformidade técnica e monitoramento de obras em tempo real.
          </p>
        </div>
        <button
          onClick={() => router.push('/arts/new?type=PRE')}
          className="flex items-center gap-2 bg-[#00694c] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nova ART
        </button>
      </header>

      {/* Stats */}
      <StatsGrid data={data} />

      {/* Content grid: 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentArtsList arts={data.recentArts} />
        </div>
        <ActiveProjectsList projects={data.activeProjects} />
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push('/arts/new?type=PRE')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#00694c] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 group"
        title="Análise Rápida"
      >
        <Zap className="h-6 w-6" strokeWidth={2} />
        <div className="absolute right-full mr-4 bg-[#1a1c1a] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
          Análise Rápida
        </div>
      </button>
    </div>
  )
}
