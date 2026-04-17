'use client'

import Link from 'next/link'
import { MapPin, Calendar, ChevronRight, LinkIcon } from 'lucide-react'
import type { Art } from '@/lib/types'
import { ArtTypeBadge } from './art-type-badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { ScoreBadge } from '@/components/analysis/score-badge'

interface ArtListItemProps {
  art: Art
}

export function ArtListItem({ art }: ArtListItemProps) {
  return (
    <Link
      href={`/arts/${art.id}`}
      className="group flex items-center gap-4 rounded-xl border border-[#eee] bg-white px-5 py-4 transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#e0e0de]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-sm font-medium text-[#1a1a1a] truncate">{art.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#999]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {art.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(art.startDate).toLocaleDateString('pt-BR')}
          </span>
          {art.artNumber && <span className="text-[#bbb]">N. {art.artNumber}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ArtTypeBadge type={art.type} />
        {art.latestAnalysis ? (
          <ScoreBadge score={art.latestAnalysis.score} size="sm" />
        ) : (
          <StatusBadge variant="neutral">Pendente</StatusBadge>
        )}
        {art.pdfPath && (
          <StatusBadge variant="neutral">
            <LinkIcon className="h-2.5 w-2.5 mr-0.5" />
            PDF
          </StatusBadge>
        )}
        <ChevronRight className="h-4 w-4 text-[#ccc] group-hover:text-[#999] transition-colors" />
      </div>
    </Link>
  )
}
