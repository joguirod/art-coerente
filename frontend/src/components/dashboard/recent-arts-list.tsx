'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Art } from '@/lib/types'

interface RecentArtsListProps {
  arts: Art[]
}

function getStatus(art: Art): { dot: string; label: string } | null {
  if (!art.latestAnalysis) return null
  if (art.latestAnalysis.coherent) return { dot: 'bg-[#00694c]', label: 'Aprovado' }
  if (art.latestAnalysis.score >= 60) return { dot: 'bg-amber-500', label: 'Em Revisão' }
  return { dot: 'bg-[#ba1a1a]', label: 'Recusado' }
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#00694c'
  if (score >= 60) return '#f59e0b'
  return '#ba1a1a'
}

function ScoreCircle({ score }: { score: number }) {
  const color = getScoreColor(score)
  const offset = 100 - score
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20" cy="20" r="16" fill="transparent"
          stroke="#bccac1" strokeOpacity="0.2" strokeWidth="2.5"
        />
        <circle
          cx="20" cy="20" r="16" fill="transparent"
          stroke={color} strokeWidth="2.5"
          strokeDasharray="100" strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[10px] font-bold text-[#1a1c1a]">{score}</span>
    </div>
  )
}

export function RecentArtsList({ arts }: RecentArtsListProps) {
  const router = useRouter()

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-extrabold tracking-tighter text-[#1a1c1a]">ARTs Recentes</h4>
        <Link
          href="/arts"
          className="text-xs font-bold text-[#00694c] uppercase tracking-widest hover:underline"
        >
          Ver todas
        </Link>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f3f1]">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3d4943]">
                Descrição do Projeto
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3d4943]">
                Tipo
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3d4943]">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3d4943] text-center">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bccac1]/10">
            {arts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <p className="text-sm text-[#3d4943]/60 mb-4">Nenhuma ART cadastrada ainda.</p>
                  <button
                    onClick={() => router.push('/arts/new?type=PRE')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#00694c] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-80"
                  >
                    Criar ART
                  </button>
                </td>
              </tr>
            ) : (
              arts.map((art) => {
                const status = getStatus(art)
                return (
                  <tr
                    key={art.id}
                    onClick={() => router.push(`/arts/${art.id}`)}
                    className="hover:bg-[#efeeeb]/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1a1c1a]">{art.description}</span>
                        <span className="text-[10px] text-[#3d4943]">{art.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={
                          art.type === 'PRE'
                            ? 'px-2 py-1 text-[10px] font-extrabold rounded bg-[#00694c]/5 text-[#00694c]'
                            : 'px-2 py-1 text-[10px] font-extrabold rounded bg-[#554cb9]/5 text-[#554cb9]'
                        }
                      >
                        {art.type === 'PRE' ? 'PRE' : 'POST'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {status ? (
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                          <span className="text-xs font-semibold text-[#1a1c1a]">{status.label}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#3d4943]/50 font-medium">Pendente</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {art.latestAnalysis ? (
                          <ScoreCircle score={art.latestAnalysis.score} />
                        ) : (
                          <span className="text-[10px] text-[#3d4943]/40 font-medium">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
