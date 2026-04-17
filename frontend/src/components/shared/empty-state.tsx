import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0efed]">
        <Icon className="h-6 w-6 text-[#bbb]" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-medium text-[#1A1C1A] mb-1.5">{title}</h3>
      <p className="text-sm text-[#666] max-w-xs mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="px-5 text-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
