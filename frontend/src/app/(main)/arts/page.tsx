'use client'

import { useRouter } from 'next/navigation'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { ListSkeleton } from '@/components/shared/loading-skeleton'
import { ArtListItem } from '@/components/arts/art-list-item'
import { useArts } from '@/hooks/use-arts'

export default function ArtsPage() {
  const router = useRouter()
  const { arts, isLoading, error, refetch } = useArts()

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="animate-slide-up">
      <PageHeader
        title="ARTs"
        subtitle="Analise de coerencia tecnica"
        actions={
          <>
            <Button
              onClick={() => router.push('/arts/new?type=PRE')}
              className="rounded-lg h-9 text-sm px-4"
            >
              <Plus className="w-4 h-4 mr-1" />
              Pre-ART
            </Button>
            <Button
              onClick={() => router.push('/arts/new?type=POST')}
              variant="outline"
              className="border-[#ddd] rounded-lg h-9 text-sm px-4"
            >
              <Plus className="w-4 h-4 mr-1" />
              Pos-ART
            </Button>
          </>
        }
      />

      {isLoading ? (
        <ListSkeleton count={4} />
      ) : arts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhuma ART cadastrada"
          description="Crie sua primeira ART para comecar a analise de coerencia."
          actionLabel="Criar ART"
          onAction={() => router.push('/arts/new?type=PRE')}
        />
      ) : (
        <div className="space-y-2">
          {arts.map((art) => (
            <ArtListItem key={art.id} art={art} />
          ))}
        </div>
      )}
    </div>
  )
}
