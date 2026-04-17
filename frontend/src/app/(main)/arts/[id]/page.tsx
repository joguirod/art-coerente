'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Trash2, MapPin, Calendar, User, FileText, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { useArt } from '@/hooks/use-arts'
import { artService } from '@/services/art-service'
import { ApiException } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { DetailSkeleton } from '@/components/shared/loading-skeleton'
import { ErrorState } from '@/components/shared/error-state'
import { ArtTypeBadge } from '@/components/arts/art-type-badge'
import { ScoreBadge } from '@/components/analysis/score-badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'

export default function ArtDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { art, isLoading, error, refetch } = useArt(id)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      await artService.analyze(id)
      router.push(`/arts/${id}/analysis`)
    } catch (err) {
      if (err instanceof ApiException) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao analisar ART.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await artService.delete(id)
      toast.success('ART excluida com sucesso')
      router.push('/arts')
    } catch (err) {
      if (err instanceof ApiException) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao excluir ART.')
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (isLoading) return <DetailSkeleton />
  if (!art) return null

  const hasProject = !!art.pdfPath // The backend ArtResponse doesn't have projectId directly; we check via other means
  // Actually checking projectId: it's not in ArtResponse. We'll use the 409 error on delete to handle this.

  return (
    <div className="max-w-3xl animate-slide-up">
      <Link
        href="/arts"
        className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar
      </Link>

      <PageHeader
        title={art.description}
        subtitle={`Criada em ${new Date(art.createdAt).toLocaleDateString('pt-BR')}`}
        actions={
          <div className="flex items-center gap-2">
            <ArtTypeBadge type={art.type} />
            {art.artNumber && <StatusBadge variant="neutral">N. {art.artNumber}</StatusBadge>}
          </div>
        }
      />

      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-[#eee] bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-[#999] mb-1">
            <MapPin className="h-3 w-3" /> Localizacao
          </div>
          <p className="text-sm font-medium text-[#1a1a1a]">{art.location}</p>
        </div>
        <div className="rounded-xl border border-[#eee] bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-[#999] mb-1">
            <User className="h-3 w-3" /> Contratante
          </div>
          <p className="text-sm font-medium text-[#1a1a1a]">{art.contractorName}</p>
        </div>
        <div className="rounded-xl border border-[#eee] bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-[#999] mb-1">
            <Calendar className="h-3 w-3" /> Inicio
          </div>
          <p className="text-sm font-medium text-[#1a1a1a]">{new Date(art.startDate).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="rounded-xl border border-[#eee] bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-[#999] mb-1">
            <Calendar className="h-3 w-3" /> Termino
          </div>
          <p className="text-sm font-medium text-[#1a1a1a]">{new Date(art.endDate).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Activities */}
      <div className="rounded-xl border border-[#eee] bg-white p-5 mb-6">
        <h3 className="text-sm font-semibold text-[#1a1a1a] mb-4">Atividades declaradas</h3>
        <div className="space-y-3">
          {art.activities.map((activity) => (
            <div key={activity.id} className="rounded-lg bg-[#fafaf8] border border-[#eee] p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#999] mb-0.5">{activity.grupo} › {activity.subgrupo}</p>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {activity.obraServico}
                    {activity.complemento && <span className="text-[#666]"> — {activity.complemento}</span>}
                  </p>
                  <p className="text-xs text-[#aaa] mt-0.5">{activity.atividade}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-[#555] bg-[#f0f0ee] px-2 py-1 rounded">
                  {activity.quantidade} {activity.unidade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis section */}
      {art.latestAnalysis ? (
        <div className="rounded-xl border border-[#eee] bg-white p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ScoreBadge score={art.latestAnalysis.score} size="lg" />
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">
                {art.latestAnalysis.coherent ? 'ART coerente' : 'Inconsistencias encontradas'}
              </p>
              <p className="text-xs text-[#999] mt-0.5">
                Analise realizada em {new Date(art.latestAnalysis.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <Link href={`/arts/${id}/analysis`}>
            <Button variant="outline" className="border-[#ddd] rounded-lg h-9 text-sm gap-1.5">
              Ver analise completa
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#ddd] bg-[#fafaf8] p-6 text-center mb-6">
          <FileText className="h-8 w-8 mx-auto text-[#ccc] mb-2" />
          <p className="text-sm text-[#888] mb-3">Esta ART ainda nao foi analisada</p>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg h-9 text-sm px-5"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analisando coerencia...
              </span>
            ) : (
              'Analisar coerencia'
            )}
          </Button>
        </div>
      )}

      {/* Delete */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setShowDeleteDialog(true)}
          className="border-[#ddd] rounded-lg h-9 text-sm text-[#E24B4A] hover:bg-red-50 hover:border-red-200 gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Excluir ART
        </Button>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir ART"
        description="Tem certeza que deseja excluir esta ART? Esta acao nao pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  )
}
