'use client'

import Link from 'next/link'
import { Building2, MapPin, ChevronRight, FileText } from 'lucide-react'
import type { Project } from '@/lib/types'
import { StatusBadge } from '@/components/shared/status-badge'

export function ProjectListItem({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex items-center gap-4 rounded-xl border border-[#eee] bg-white px-5 py-4 transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#e0e0de]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eeecf9]">
        <Building2 className="h-5 w-5 text-[#534AB7]" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1a1a1a] truncate">{project.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-[#999]">
          {project.address && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {project.address}
            </span>
          )}
          {project.obraType && <span>{project.obraType}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {project.artId && (
          <StatusBadge variant="info">
            <FileText className="h-2.5 w-2.5 mr-0.5" />
            ART vinculada
          </StatusBadge>
        )}
        <div className="flex items-center gap-2 min-w-[110px]">
          <div className="flex-1 h-1.5 rounded-full bg-[#f0f0ee] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#534AB7] transition-all duration-500"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-[#888] font-medium w-8 text-right">{project.progressPercentage}%</span>
        </div>
        <ChevronRight className="h-4 w-4 text-[#ccc] group-hover:text-[#999] transition-colors" />
      </div>
    </Link>
  )
}
