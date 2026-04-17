import { cn } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'lg'
}

function getScoreColor(score: number) {
  if (score >= 80) return { border: 'border-[#1D9E75]', bg: 'bg-[#e8f5ef]', text: 'text-[#1D9E75]' }
  if (score >= 60) return { border: 'border-[#BA7517]', bg: 'bg-[#fef4e6]', text: 'text-[#BA7517]' }
  return { border: 'border-[#E24B4A]', bg: 'bg-[#fdeaea]', text: 'text-[#E24B4A]' }
}

export function ScoreBadge({ score, size = 'sm' }: ScoreBadgeProps) {
  const colors = getScoreColor(score)

  if (size === 'lg') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-[3px]',
          colors.border,
          colors.bg,
          'h-20 w-20'
        )}
      >
        <span className={cn('text-2xl font-bold', colors.text)}>{score}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full border-2 h-8 w-8 text-xs font-semibold',
        colors.border,
        colors.bg,
        colors.text
      )}
    >
      {score}
    </div>
  )
}
