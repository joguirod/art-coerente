import { FileText, Clock, TrendingUp, Building2 } from 'lucide-react'
import { StatCard } from './stat-card'
import type { DashboardSummary } from '@/lib/types'

interface StatsGridProps {
  data: DashboardSummary
}

export function StatsGrid({ data }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard
        label="ARTs Analisadas"
        value={data.analyzedArtsCount}
        icon={FileText}
        color="green"
        badge={
          <span className="text-[#00694c] text-xs font-bold px-2 py-1 bg-[#00694c]/10 rounded-full">
            +12%
          </span>
        }
      />
      <StatCard
        label="ARTs Pendentes"
        value={data.pendingArtsCount}
        icon={Clock}
        color="amber"
        badge={
          data.pendingArtsCount > 0 ? (
            <span className="text-amber-600 text-xs font-bold px-2 py-1 bg-amber-500/10 rounded-full">
              Alerta
            </span>
          ) : undefined
        }
      />
      <StatCard
        label="Score Médio"
        value={data.averageScore != null ? Math.round(data.averageScore) : '--'}
        suffix={data.averageScore != null ? '/100' : undefined}
        icon={TrendingUp}
        color="tertiary"
        badge={
          <div className="flex -space-x-1">
            <div className="w-6 h-6 rounded-full bg-[#e9e8e5] border-2 border-white" />
            <div className="w-6 h-6 rounded-full bg-[#e3e2e0] border-2 border-white" />
          </div>
        }
      />
      <StatCard
        label="Obras Ativas"
        value={data.activeProjectsCount}
        icon={Building2}
        color="secondary"
        badge={
          <span className="text-[#3e6655] text-xs font-bold px-2 py-1 bg-[#3e6655]/10 rounded-full">
            Ativas
          </span>
        }
      />
    </div>
  )
}
