'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAnalysis } from '@/hooks/use-arts'
import { DetailSkeleton } from '@/components/shared/loading-skeleton'
import { ErrorState } from '@/components/shared/error-state'
import { ScoreBadge } from '@/components/analysis/score-badge'
import { AlertCard } from '@/components/analysis/alert-card'
import { SuggestionsCard } from '@/components/analysis/suggestions-card'
import { ComplementaryCard } from '@/components/analysis/complementary-card'
import { ChunksCollapsible } from '@/components/analysis/chunks-collapsible'

export default function AnalysisPage() {
  const params = useParams()
  const artId = params.id as string
  const { analysis, isLoading, error, refetch } = useAnalysis(artId)

  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (isLoading) return <DetailSkeleton />
  if (!analysis) return null

  return (
    <div className="max-w-3xl animate-slide-up">
      <Link
        href={`/arts/${artId}`}
        className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar para ART
      </Link>

      {/* Score + summary */}
      <div className="rounded-xl border border-[#eee] bg-white p-6 mb-6">
        <div className="flex items-center gap-5">
          <ScoreBadge score={analysis.score} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              {analysis.coherent ? 'ART coerente' : 'Inconsistencias encontradas'}
            </h2>
            <p className="text-xs text-[#999] mt-0.5">
              Analise realizada em {new Date(analysis.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        {analysis.summary && (
          <p className="text-sm text-[#555] mt-4 leading-relaxed border-t border-[#eee] pt-4">
            {analysis.summary}
          </p>
        )}
      </div>

      {/* Alerts */}
      {analysis.alerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Alertas</h3>
          <div className="space-y-2">
            {analysis.alerts.map((alert, i) => (
              <AlertCard key={i} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="mb-6">
        <SuggestionsCard suggestions={analysis.suggestions} />
      </div>

      {/* Complementary */}
      <div className="mb-6">
        <ComplementaryCard recommendations={analysis.complementaryRecommendations} />
      </div>

      {/* Chunks */}
      <ChunksCollapsible chunks={analysis.chunksUsed} />
    </div>
  )
}
