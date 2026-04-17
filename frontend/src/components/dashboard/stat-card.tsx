import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  suffix?: string
  icon: LucideIcon
  color: 'green' | 'amber' | 'tertiary' | 'secondary'
  badge?: ReactNode
}

const colorMap = {
  green:    { bg: 'bg-[#00694c]/10', icon: 'text-[#00694c]' },
  amber:    { bg: 'bg-amber-500/10',  icon: 'text-amber-600' },
  tertiary: { bg: 'bg-[#554cb9]/10', icon: 'text-[#554cb9]' },
  secondary:{ bg: 'bg-[#3e6655]/10', icon: 'text-[#3e6655]' },
}

export function StatCard({ label, value, suffix, icon: Icon, color, badge }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div className="bg-white p-6 rounded-xl flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className={cn('p-3 rounded-lg', c.bg)}>
          <Icon className={cn('h-5 w-5', c.icon)} strokeWidth={1.8} />
        </div>
        {badge}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#3d4943] mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-4xl font-extrabold text-[#1a1c1a] tracking-tight">{value}</h3>
          {suffix && (
            <span className="text-lg font-bold text-[#3d4943]">{suffix}</span>
          )}
        </div>
      </div>
    </div>
  )
}
