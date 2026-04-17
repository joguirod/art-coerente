'use client'

import { useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { ListSkeleton } from '@/components/shared/loading-skeleton'
import { ProjectListItem } from '@/components/projects/project-list-item'
import { useProjects } from '@/hooks/use-projects'

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, isLoading, error, refetch } = useProjects()

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="animate-slide-up">
      <PageHeader
        title="Obras"
        subtitle="Acompanhamento de etapas construtivas"
        actions={
          <Button
            onClick={() => router.push('/projects/new')}
            className="rounded-lg h-9 text-sm px-4"
          >
            Nova obra
          </Button>
        }
      />

      {isLoading ? (
        <ListSkeleton count={3} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Nenhuma obra cadastrada"
          description="Crie sua primeira obra para acompanhar as etapas construtivas."
          actionLabel="Criar obra"
          onAction={() => router.push('/projects/new')}
        />
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
