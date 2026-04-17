'use client'

import { useRouter } from 'next/navigation'
import { MapPin, ArrowRight, PlusCircle } from 'lucide-react'
import type { Project } from '@/lib/types'

interface ActiveProjectsListProps {
  projects: Project[]
}

export function ActiveProjectsList({ projects }: ActiveProjectsListProps) {
  const router = useRouter()

  return (
    <aside className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-extrabold tracking-tighter text-[#1a1c1a]">Obras em Curso</h4>
        <button className="text-[#3d4943] hover:text-[#1a1c1a] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => router.push(`/projects/${project.id}`)}
            className="bg-[#f4f3f1] p-5 rounded-xl border border-transparent hover:border-[#bccac1]/20 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <h5 className="text-sm font-bold text-[#1a1c1a] group-hover:text-[#00694c] transition-colors">
                {project.name}
              </h5>
              <span className="text-[10px] font-bold text-[#3d4943]">{project.progressPercentage}%</span>
            </div>
            <div className="w-full h-1 bg-[#e3e2e0] rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-[#00694c] rounded-full transition-all duration-500"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              {project.address ? (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#3d4943] uppercase tracking-wide">
                  <MapPin className="h-3 w-3" strokeWidth={2} />
                  {project.address}
                </div>
              ) : (
                <div />
              )}
              <ArrowRight
                className="h-4 w-4 text-[#3d4943] group-hover:translate-x-1 transition-transform"
                strokeWidth={1.8}
              />
            </div>
          </div>
        ))}

        {/* Add new obra button */}
        <button
          onClick={() => router.push('/projects/new')}
          className="w-full py-4 rounded-xl border-2 border-dashed border-[#bccac1]/30 flex flex-col items-center justify-center gap-1.5 hover:border-[#00694c]/50 hover:bg-[#00694c]/5 transition-all text-[#3d4943] hover:text-[#00694c] group"
        >
          <PlusCircle className="h-5 w-5" strokeWidth={1.8} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Registrar Nova Obra</span>
        </button>
      </div>
    </aside>
  )
}
