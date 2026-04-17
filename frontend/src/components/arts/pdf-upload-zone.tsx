'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PdfUploadZoneProps {
  onFileSelect: (file: File) => void
  isExtracting: boolean
}

export function PdfUploadZone({ onFileSelect, isExtracting }: PdfUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type === 'application/pdf') {
        setSelectedFile(file)
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  if (isExtracting) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[#ddd] bg-[#fafaf8] p-8 text-center">
        <Loader2 className="h-8 w-8 mx-auto text-[#888] animate-spin mb-3" />
        <p className="text-sm font-medium text-[#555]">Extraindo dados do PDF...</p>
        <p className="text-xs text-[#999] mt-1">Isso pode levar alguns segundos</p>
      </div>
    )
  }

  if (selectedFile && !isExtracting) {
    return (
      <div className="rounded-xl border border-[#eee] bg-[#fafaf8] p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f0fa]">
          <FileText className="h-5 w-5 text-[#185FA5]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1a1a1a] truncate">{selectedFile.name}</p>
          <p className="text-xs text-[#999]">{(selectedFile.size / 1024).toFixed(0)} KB</p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedFile(null)}
          className="p-1.5 rounded-md text-[#ccc] hover:text-[#E24B4A] hover:bg-red-50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
        isDragging
          ? 'border-[#1a1a1a] bg-[#f5f5f3]'
          : 'border-[#ddd] bg-[#fafaf8] hover:border-[#bbb]'
      )}
    >
      <label className="cursor-pointer block">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload className="h-8 w-8 mx-auto text-[#bbb] mb-3" strokeWidth={1.5} />
        <p className="text-sm font-medium text-[#555]">
          Arraste o PDF da ART ou <span className="text-[#1a1a1a] underline underline-offset-2">clique para selecionar</span>
        </p>
        <p className="text-xs text-[#999] mt-1">Apenas arquivos PDF</p>
      </label>
    </div>
  )
}
