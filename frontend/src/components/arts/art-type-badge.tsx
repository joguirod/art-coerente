import type { ArtType } from '@/lib/types'
import { StatusBadge } from '@/components/shared/status-badge'

export function ArtTypeBadge({ type }: { type: ArtType }) {
  return (
    <StatusBadge variant={type === 'PRE' ? 'info' : 'purple'}>
      {type === 'PRE' ? 'Pre-ART' : 'Pos-ART'}
    </StatusBadge>
  )
}
