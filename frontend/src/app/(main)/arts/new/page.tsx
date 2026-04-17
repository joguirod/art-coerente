'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import type { ArtType, CreateArtActivityRequest, CreateArtRequest, PdfExtractionResult } from '@/lib/types'
import { artService } from '@/services/art-service'
import { ApiException } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/shared/page-header'
import { ActivitySelectChain } from '@/components/arts/activity-select-chain'
import { PdfUploadZone } from '@/components/arts/pdf-upload-zone'

const emptyActivity: CreateArtActivityRequest = {
  atividade: '',
  grupo: '',
  subgrupo: '',
  obraServico: '',
  complemento: '',
  quantidade: 0,
  unidade: '',
}

export default function NewArtPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const artType = (searchParams.get('type') as ArtType) || 'PRE'

  const [form, setForm] = useState<CreateArtRequest>({
    type: artType,
    artNumber: '',
    description: '',
    location: '',
    contractorName: '',
    startDate: '',
    endDate: '',
    activities: [{ ...emptyActivity }],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionResult, setExtractionResult] = useState<PdfExtractionResult | null>(null)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setForm((prev) => ({ ...prev, type: artType }))
  }, [artType])

  const handleChange = (field: keyof CreateArtRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handlePdfSelect = async (file: File) => {
    setIsExtracting(true)
    setExtractionResult(null)
    try {
      const result = await artService.extractPdf(file)
      setExtractionResult(result)
      setForm((prev) => ({
        ...prev,
        artNumber: result.artNumber || prev.artNumber,
        description: result.description || prev.description,
        location: result.location || prev.location,
        contractorName: result.contractorName || prev.contractorName,
        startDate: result.startDate || prev.startDate,
        endDate: result.endDate || prev.endDate,
      }))
      toast.success('Dados extraidos do PDF com sucesso')
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : 'Falha ao extrair dados do PDF.')
    } finally {
      setIsExtracting(false)
    }
  }

  const isMissing = (field: string) =>
    extractionResult?.missingFields?.includes(field) ?? false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const art = await artService.create(form)
      toast.info('ART criada. Analisando coerencia...')

      try {
        await artService.analyze(art.id)
        router.push(`/arts/${art.id}/analysis`)
      } catch (analyzeErr) {
        const msg = analyzeErr instanceof ApiException
          ? analyzeErr.message
          : 'Erro ao analisar. Tente novamente na tela de detalhes.'
        toast.error(msg)
        router.push(`/arts/${art.id}`)
      }
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errors) {
          setFieldErrors(err.errors)
        } else {
          setError(err.message)
        }
      } else {
        setError('Erro ao criar ART. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl animate-slide-up">
      <div className="mb-6">
        <Link
          href="/arts"
          className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </Link>
        <PageHeader
          title={artType === 'PRE' ? 'Nova Pre-ART' : 'Nova Pos-ART'}
          subtitle={
            artType === 'PRE'
              ? 'Analise a coerencia antes de registrar a ART'
              : 'Analise uma ART ja emitida'
          }
        />
      </div>

      {artType === 'POST' && (
        <div className="mb-6">
          <PdfUploadZone onFileSelect={handlePdfSelect} isExtracting={isExtracting} />
          {extractionResult && extractionResult.missingFields.length > 0 && (
            <div className="mt-3 rounded-lg bg-[#fef4e6] border border-[#f5ddb5] px-4 py-3 text-sm text-[#BA7517]">
              Campos nao extraidos: {extractionResult.missingFields.join(', ')}. Preencha manualmente.
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-[#E24B4A]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {artType === 'POST' && (
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Numero da ART</Label>
            <Input
              value={form.artNumber}
              onChange={(e) => handleChange('artNumber', e.target.value)}
              className={`h-10 rounded-lg border-[#ddd] px-3.5 text-sm ${isMissing('artNumber') ? 'border-[#E24B4A] bg-red-50/30' : ''}`}
            />
            {isMissing('artNumber') && <p className="text-xs text-[#BA7517]">Nao extraido do PDF</p>}
            {fieldErrors.artNumber && <p className="text-xs text-[#E24B4A]">{fieldErrors.artNumber}</p>}
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-sm text-[#555]">Descricao da obra</Label>
          <Textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={3}
            className={`rounded-lg border-[#ddd] px-3.5 py-2.5 text-sm resize-none ${isMissing('description') ? 'border-[#E24B4A] bg-red-50/30' : ''}`}
          />
          {fieldErrors.description && <p className="text-xs text-[#E24B4A]">{fieldErrors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Localizacao</Label>
            <Input
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
              className={`h-10 rounded-lg border-[#ddd] px-3.5 text-sm ${isMissing('location') ? 'border-[#E24B4A] bg-red-50/30' : ''}`}
            />
            {fieldErrors.location && <p className="text-xs text-[#E24B4A]">{fieldErrors.location}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Contratante</Label>
            <Input
              value={form.contractorName}
              onChange={(e) => handleChange('contractorName', e.target.value)}
              required
              className={`h-10 rounded-lg border-[#ddd] px-3.5 text-sm ${isMissing('contractorName') ? 'border-[#E24B4A] bg-red-50/30' : ''}`}
            />
            {fieldErrors.contractorName && <p className="text-xs text-[#E24B4A]">{fieldErrors.contractorName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Data de inicio</Label>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
              className={`h-10 rounded-lg border-[#ddd] px-3.5 text-sm ${isMissing('startDate') ? 'border-[#E24B4A] bg-red-50/30' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-[#555]">Data de termino</Label>
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              required
              className={`h-10 rounded-lg border-[#ddd] px-3.5 text-sm ${isMissing('endDate') ? 'border-[#E24B4A] bg-red-50/30' : ''}`}
            />
          </div>
        </div>

        <div className="border-t border-[#eee] pt-5">
          <ActivitySelectChain
            activities={form.activities}
            onChange={(activities) => setForm((prev) => ({ ...prev, activities }))}
          />
        </div>

        <div className="border-t border-[#eee] pt-5 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg h-10 text-sm px-6 min-w-[180px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analisando coerencia...
              </span>
            ) : (
              'Analisar coerencia'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
