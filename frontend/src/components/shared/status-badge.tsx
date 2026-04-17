import { cn } from '@/lib/utils'

const variants = {
  success: 'bg-[#e8f5ef] text-[#1D9E75] border-[#c5e8d8]',
  warning: 'bg-[#fef4e6] text-[#BA7517] border-[#f5ddb5]',
  error: 'bg-[#fdeaea] text-[#E24B4A] border-[#f5c5c4]',
  info: 'bg-[#e8f0fa] text-[#185FA5] border-[#bdd4f0]',
  purple: 'bg-[#eeecf9] text-[#534AB7] border-[#d4d0ed]',
  neutral: 'bg-[#f5f5f3] text-[#666] border-[#e5e5e3]',
}

interface StatusBadgeProps {
  variant: keyof typeof variants
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-none',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
