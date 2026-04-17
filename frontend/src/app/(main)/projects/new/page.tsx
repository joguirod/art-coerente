'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Art, CreateProjectRequest } from '@/lib/types'
import { projectService } from '@/services/project-service'
import { artService } from '@/services/art-service'
import { DEFAULT_STAGES } from '@/lib/constants'
import { ApiException } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/shared/page-header'

export default function NewProjectPage() {
  const router = useRouter()
  const [form, setForm] = useState<CreateProjectRequest>({
    name: '',
    address: '',
    obraType: '',
    startDate: '',
    description: '',
    artId: '',
    stages: [...DEFAULT_STAGES],
  })
  const [availableArts, setAvailableArts] = useState<Art[]>([])
  const [newStage, setNewStage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    artService.getAll().then((arts) => {
      setAvailableArts(arts)
    }).catch(() => {})
  }, [])

  const handleChange = (field: keyof CreateProjectRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addStage = () => {
    if (newStage.trim()) {
      setForm((prev) => ({ ...prev, stages: [...(prev.stages || []), newStage.trim()] }))
      setNewStage('')
    }
  }

  const removeStage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      stages: (prev.stages || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const payload: CreateProjectRequest = {
        name: form.name,
        stages: form.stages,
      }
      if (form.address) payload.address = form.address
      if (form.obraType) payload.obraType = form.obraType
      if (form.startDate) payload.startDate = form.startDate
      if (form.description) payload.description = form.description
      if (form.artId) payload.artId = form.artId

      const project = await projectService.create(payload)
      toast.success('Obra criada com sucesso')
      router.push(`/projects/${project.id}`)
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message)
      } else {
        setError('Erro ao criar obra.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl animate-slide-up">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar
      </Link>
      <PageHeader title="Nova obra" subtitle="Cadastre uma obra para acompanhar as etapas" />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-[#E24B4A]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-sm text-[#555]">Nome da obra *</Label>
          <Input
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            placeholder="Ex: Residencia Silva"
            className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm placeholder:text-[#ccc]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Endereco</Label>
            <Input
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Tipo</Label>
            <select
              value={form.obraType}
              onChange={(e) => handleChange('obraType', e.target.value)}
              className="w-full h-10 rounded-lg border border-[#ddd] bg-white px-3 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-1"
            >
              <option value="">Selecione...</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="Reforma">Reforma</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Data de inicio</Label>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Vincular ART</Label>
            <select
              value={form.artId}
              onChange={(e) => handleChange('artId', e.target.value)}
              className="w-full h-10 rounded-lg border border-[#ddd] bg-white px-3 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-1"
            >
              <option value="">Nenhuma</option>
              {availableArts.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.description} ({art.type === 'PRE' ? 'Pre' : 'Pos'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-[#555]">Descricao</Label>
          <Textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={2}
            className="rounded-lg border-[#ddd] px-3.5 py-2.5 text-sm resize-none"
          />
        </div>

        {/* Stages */}
        <div className="border-t border-[#eee] pt-5">
          <Label className="text-sm font-medium text-[#1a1a1a] mb-3 block">Etapas</Label>
          <div className="space-y-1.5 mb-3">
            {(form.stages || []).map((stage, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-[#fafaf8] border border-[#eee] px-3 py-2">
                <span className="text-xs font-medium text-[#999] w-5">{i + 1}.</span>
                <span className="flex-1 text-sm text-[#333]">{stage}</span>
                <button
                  type="button"
                  onClick={() => removeStage(i)}
                  className="p-0.5 text-[#ccc] hover:text-[#E24B4A] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              placeholder="Nova etapa..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStage())}
              className="h-9 rounded-lg border-[#ddd] px-3 text-sm flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={addStage} className="h-9 border-[#ddd] rounded-lg px-3">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="border-t border-[#eee] pt-5 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg h-10 text-sm px-6"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar obra'}
          </Button>
        </div>
      </form>
    </div>
  )
}
