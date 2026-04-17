'use client'

import { useState } from 'react'
import { Trash2, Plus, ChevronDown, Image as ImageIcon, Loader2 } from 'lucide-react'
import type { ConstructionStage, StageStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const statusConfig: Record<StageStatus, { label: string; color: string; bg: string; border: string; next: StageStatus }> = {
  NOT_STARTED: { label: 'Nao iniciada', color: 'text-[#888]', bg: 'bg-[#f5f5f3]', border: 'border-[#e5e5e3]', next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Em andamento', color: 'text-[#BA7517]', bg: 'bg-[#fef4e6]', border: 'border-[#f5ddb5]', next: 'COMPLETED' },
  COMPLETED: { label: 'Concluida', color: 'text-[#1D9E75]', bg: 'bg-[#e8f5ef]', border: 'border-[#c5e8d8]', next: 'NOT_STARTED' },
}

interface StageCardProps {
  stage: ConstructionStage
  onStatusChange: (stageId: string, status: StageStatus) => void
  onNameChange: (stageId: string, name: string) => void
  onDelete: (stageId: string) => void
  onAddUpdate: (stageId: string, description: string, image?: File) => Promise<void>
}

export function StageCard({ stage, onStatusChange, onNameChange, onDelete, onAddUpdate }: StageCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(stage.name)
  const [showUpdates, setShowUpdates] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateDesc, setUpdateDesc] = useState('')
  const [updateImage, setUpdateImage] = useState<File | null>(null)
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false)

  const config = statusConfig[stage.status]

  const handleNameBlur = () => {
    setIsEditing(false)
    if (editName.trim() && editName !== stage.name) {
      onNameChange(stage.id, editName.trim())
    } else {
      setEditName(stage.name)
    }
  }

  const handleAddUpdate = async () => {
    if (!updateDesc.trim()) return
    setIsSubmittingUpdate(true)
    try {
      await onAddUpdate(stage.id, updateDesc.trim(), updateImage || undefined)
      setUpdateDesc('')
      setUpdateImage(null)
      setShowUpdateForm(false)
    } finally {
      setIsSubmittingUpdate(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#eee] bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-xs font-medium text-[#ccc] w-5 shrink-0">{stage.stageOrder}</span>

        {/* Status badge - clickable */}
        <button
          onClick={() => onStatusChange(stage.id, config.next)}
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-none transition-all hover:scale-105',
            config.bg, config.color, config.border
          )}
          title={`Clique para alterar para: ${statusConfig[config.next].label}`}
        >
          {config.label}
        </button>

        {/* Name - editable */}
        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
            autoFocus
            className="h-7 text-sm border-[#ddd] rounded-md flex-1"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="flex-1 text-sm font-medium text-[#1a1a1a] cursor-text hover:text-[#555] transition-colors"
          >
            {stage.name}
          </span>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {stage.updates.length > 0 && (
            <button
              onClick={() => setShowUpdates(!showUpdates)}
              className="flex items-center gap-1 text-xs text-[#999] hover:text-[#666] px-1.5 py-1 rounded transition-colors"
            >
              {stage.updates.length} atualiz.
              <ChevronDown className={cn('h-3 w-3 transition-transform', showUpdates && 'rotate-180')} />
            </button>
          )}
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="p-1.5 text-[#ccc] hover:text-[#185FA5] hover:bg-[#e8f0fa] rounded-md transition-colors"
            title="Adicionar atualizacao"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(stage.id)}
            className="p-1.5 text-[#ccc] hover:text-[#E24B4A] hover:bg-red-50 rounded-md transition-colors"
            title="Remover etapa"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Update form */}
      {showUpdateForm && (
        <div className="border-t border-[#eee] px-4 py-3 bg-[#fafaf8]">
          <Textarea
            value={updateDesc}
            onChange={(e) => setUpdateDesc(e.target.value)}
            placeholder="Descricao da atualizacao..."
            rows={2}
            className="rounded-lg border-[#ddd] text-sm resize-none mb-2"
          />
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-1.5 text-xs text-[#888] cursor-pointer hover:text-[#666] transition-colors">
              <ImageIcon className="h-3.5 w-3.5" />
              {updateImage ? updateImage.name : 'Anexar imagem'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUpdateImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            <Button
              size="sm"
              onClick={handleAddUpdate}
              disabled={isSubmittingUpdate || !updateDesc.trim()}
              className="h-7 text-xs bg-[#1a1a1a] hover:bg-[#333] rounded-md px-3"
            >
              {isSubmittingUpdate ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Salvar'}
            </Button>
          </div>
        </div>
      )}

      {/* Updates list */}
      {showUpdates && stage.updates.length > 0 && (
        <div className="border-t border-[#eee]">
          {stage.updates.map((update) => (
            <div key={update.id} className="px-4 py-2.5 border-b last:border-b-0 border-[#f5f5f3]">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm text-[#444]">{update.description}</p>
                  <p className="text-[10px] text-[#bbb] mt-0.5">
                    {new Date(update.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                {update.imageUrl && (
                  <div className="h-10 w-10 rounded-md bg-[#f0f0ee] border border-[#eee] overflow-hidden shrink-0">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${update.imageUrl}`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
