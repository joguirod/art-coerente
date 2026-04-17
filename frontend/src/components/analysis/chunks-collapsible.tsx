'use client'

import { useState } from 'react'
import { ChevronDown, BookOpen } from 'lucide-react'
import type { ChunkUsed } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ChunksCollapsible({ chunks }: { chunks: ChunkUsed[] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (chunks.length === 0) return null

  return (
    <div className="rounded-xl border border-[#eee] bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#fafaf8] transition-colors"
      >
        <span className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#888]" />
          Trechos normativos utilizados ({chunks.length})
        </span>
        <ChevronDown
          className={cn('h-4 w-4 text-[#999] transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <div className="border-t border-[#eee] px-5 py-4 space-y-3">
          {chunks.map((chunk, i) => (
            <div key={i} className="rounded-lg bg-[#fafaf8] border border-[#eee] p-3.5">
              <p className="text-xs font-medium text-[#888] mb-1.5">Fonte: {chunk.fonte}</p>
              <p className="text-sm text-[#444] leading-relaxed">{chunk.trecho}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
