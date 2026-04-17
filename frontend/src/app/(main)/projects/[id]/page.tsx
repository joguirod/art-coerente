'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, MapPin, Calendar, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useProject } from '@/hooks/use-projects'
import { useStageActions } from '@/hooks/use-stages'
import { projectService } from '@/services/project-service'
import { ApiException } from '@/lib/api'
import type { StageStatus } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/page-header'
import { DetailSkeleton } from '@/components/shared/loading-skeleton'
import { ErrorState } from '@/components/shared/error-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { StageCard } from '@/components/projects/stage-card'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { project, isLoading, error, refetch } = useProject(id)
  const stageActions = useStageActions(id)
  const [newStageName, setNewStageName] = useState('')
  const [isAddingStage, setIsAddingStage] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAddStage = async () => {
    if (!newStageName.trim()) return
    setIsAddingStage(true)
    try {
      await stageActions.createStage(newStageName.trim())
      setNewStageName('')
      refetch()
    } catch (err) {
      toast.error('Erro ao adicionar etapa.')
    } finally {
      setIsAddingStage(false)
    }
  }

  const handleStatusChange = async (stageId: string, status: StageStatus) => {
    try {
      await stageActions.updateStage(stageId, { status })
      refetch()
    } catch {
      toast.error('Erro ao atualizar status.')
    }
  }

  const handleNameChange = async (stageId: string, name: string) => {
    try {
      await stageActions.updateStage(stageId, { name })
      refetch()
    } catch {
      toast.error('Erro ao atualizar nome.')
    }
  }

  const handleDeleteStage = async (stageId: string) => {
    try {
      await stageActions.deleteStage(stageId)
      refetch()
    } catch {
      toast.error('Erro ao remover etapa.')
    }
  }

  const handleAddUpdate = async (stageId: string, description: string, image?: File) => {
    try {
      await stageActions.addUpdate(stageId, description, image)
      toast.success('Atualizacao adicionada')
      refetch()
    } catch {
      toast.error('Erro ao adicionar atualizacao.')
    }
  }

  const handleDeleteProject = async () => {
    setIsDeleting(true)
    try {
      await projectService.delete(id)
      toast.success('Obra excluida com sucesso')
      router.push('/projects')
    } catch (err) {
      if (err instanceof ApiException) {
        toast.error(err.message)
      } else {
        toast.error('Erro ao excluir obra.')
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (isLoading) return <DetailSkeleton />
  if (!project) return null

  const completedCount = project.stages.filter((s) => s.status === 'COMPLETED').length
  const totalStages = project.stages.length

  return (
    <div className="max-w-3xl animate-slide-up">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar
      </Link>

      <PageHeader
        title={project.name}
        subtitle={project.description || undefined}
        actions={
          <div className="flex items-center gap-2">
            {project.obraType && <StatusBadge variant="purple">{project.obraType}</StatusBadge>}
            {project.artId && (
              <Link href={`/arts/${project.artId}`}>
                <StatusBadge variant="info">
                  <FileText className="h-2.5 w-2.5 mr-0.5" />
                  Ver ART
                </StatusBadge>
              </Link>
            )}
          </div>
        }
      />

      {/* Info row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#999] mb-6">
        {project.address && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {project.address}
          </span>
        )}
        {project.startDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Inicio: {new Date(project.startDate).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-[#eee] bg-white p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#1a1a1a]">Progresso geral</span>
          <span className="text-sm font-semibold text-[#534AB7]">{project.progressPercentage}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#f0f0ee] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#534AB7] to-[#7c74d4] transition-all duration-700"
            style={{ width: `${project.progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-[#999] mt-2">{completedCount} de {totalStages} etapas concluidas</p>
      </div>

      {/* Stages */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Etapas</h3>
        <div className="space-y-2">
          {project.stages
            .sort((a, b) => a.stageOrder - b.stageOrder)
            .map((stage) => (
              <StageCard
                key={stage.id}
                stage={stage}
                onStatusChange={handleStatusChange}
                onNameChange={handleNameChange}
                onDelete={handleDeleteStage}
                onAddUpdate={handleAddUpdate}
              />
            ))}
        </div>

        {/* Add stage */}
        <div className="flex gap-2 mt-3">
          <Input
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            placeholder="Nova etapa..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStage())}
            className="h-9 rounded-lg border-[#ddd] px-3 text-sm flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddStage}
            disabled={isAddingStage || !newStageName.trim()}
            className="h-9 border-[#ddd] rounded-lg px-3"
          >
            {isAddingStage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Delete project */}
      <div className="flex justify-end border-t border-[#eee] pt-5">
        <Button
          variant="outline"
          onClick={() => setShowDeleteDialog(true)}
          className="border-[#ddd] rounded-lg h-9 text-sm text-[#E24B4A] hover:bg-red-50 hover:border-red-200 gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Excluir obra
        </Button>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir obra"
        description="Tem certeza que deseja excluir esta obra e todas as suas etapas? Esta acao nao pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={handleDeleteProject}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  )
}
