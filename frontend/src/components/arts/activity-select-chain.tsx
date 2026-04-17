'use client'

import { X, Plus } from 'lucide-react'
import { ATIVIDADES_PROFISSIONAIS, UNIDADES } from '@/lib/constants'
import type { CreateArtActivityRequest, TosItem } from '@/lib/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TosCombobox } from './tos-combobox'

interface ActivitySelectChainProps {
  activities: CreateArtActivityRequest[]
  onChange: (activities: CreateArtActivityRequest[]) => void
}

const emptyActivity: CreateArtActivityRequest = {
  atividade: '',
  grupo: '',
  subgrupo: '',
  obraServico: '',
  complemento: '',
  quantidade: 0,
  unidade: '',
}

export function ActivitySelectChain({ activities, onChange }: ActivitySelectChainProps) {
  const addActivity = () => {
    onChange([...activities, { ...emptyActivity }])
  }

  const removeActivity = (index: number) => {
    onChange(activities.filter((_, i) => i !== index))
  }

  const updateActivity = (index: number, field: string, value: string | number) => {
    const updated = [...activities]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const updateTosItem = (index: number, item: TosItem | null) => {
    const updated = [...activities]
    updated[index] = {
      ...updated[index],
      grupo: item?.grupo ?? '',
      subgrupo: item?.subgrupo ?? '',
      obraServico: item?.obraServico ?? '',
      complemento: item?.complemento ?? '',
    }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-[#1a1a1a]">Atividades tecnicas</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addActivity}
          className="h-8 text-xs border-[#ddd] rounded-lg gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar atividade
        </Button>
      </div>

      {activities.map((activity, index) => (
        <ActivityCard
          key={index}
          index={index}
          activity={activity}
          onUpdate={updateActivity}
          onUpdateTos={(item) => updateTosItem(index, item)}
          onRemove={removeActivity}
          canRemove={activities.length > 1}
        />
      ))}
    </div>
  )
}

function ActivityCard({
  index,
  activity,
  onUpdate,
  onUpdateTos,
  onRemove,
  canRemove,
}: {
  index: number
  activity: CreateArtActivityRequest
  onUpdate: (index: number, field: string, value: string | number) => void
  onUpdateTos: (item: TosItem | null) => void
  onRemove: (index: number) => void
  canRemove: boolean
}) {
  const selectedTosItem: TosItem | null =
    activity.grupo && activity.subgrupo && activity.obraServico
      ? {
          seq: -1,
          grupo: activity.grupo,
          subgrupo: activity.subgrupo,
          obraServico: activity.obraServico,
          complemento: activity.complemento ?? null,
        }
      : null

  return (
    <div className="rounded-xl border border-[#eee] bg-[#fafaf8] p-4 space-y-3 relative">
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-3 right-3 p-1 rounded-md text-[#ccc] hover:text-[#E24B4A] hover:bg-red-50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="text-xs font-medium text-[#999] mb-2">Atividade {index + 1}</div>

      {/* Atividade profissional (fixed list) */}
      <div>
        <Label className="text-xs text-[#666] mb-1 block">Atividade profissional</Label>
        <select
          value={activity.atividade}
          onChange={(e) => onUpdate(index, 'atividade', e.target.value)}
          className="w-full h-9 rounded-lg border border-[#ddd] bg-white px-3 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-1"
        >
          <option value="">Selecione...</option>
          {ATIVIDADES_PROFISSIONAIS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Obra/Serviço via TOS autocomplete */}
      <TosCombobox
        label="Obra / Servico (Tabela TOS)"
        value={selectedTosItem}
        onChange={onUpdateTos}
        placeholder="Digite para buscar na tabela TOS..."
      />

      {/* Complemento — pré-preenchido pelo TOS, editável */}
      <div>
        <Label className="text-xs text-[#666] mb-1 block">Complemento</Label>
        <Input
          value={activity.complemento ?? ''}
          onChange={(e) => onUpdate(index, 'complemento', e.target.value)}
          placeholder="Ex: de alvenaria, unifamiliar..."
          className="h-9 rounded-lg border-[#ddd] text-sm"
        />
      </div>

      {/* Quantidade e Unidade */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-[#666] mb-1 block">Quantidade</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={activity.quantidade || ''}
            onChange={(e) => onUpdate(index, 'quantidade', parseFloat(e.target.value) || 0)}
            className="h-9 rounded-lg border-[#ddd] text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-[#666] mb-1 block">Unidade</Label>
          <select
            value={activity.unidade}
            onChange={(e) => onUpdate(index, 'unidade', e.target.value)}
            className="w-full h-9 rounded-lg border border-[#ddd] bg-white px-3 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-1"
          >
            <option value="">Selecione...</option>
            {UNIDADES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
