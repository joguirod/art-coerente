'use client'

import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function UserNav() {
  const { engineer, logout } = useAuth()

  if (!engineer) return null

  const initials = engineer.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="border-t border-[#E3E2E0] px-4 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-[#E3E2E0]">
          <AvatarFallback className="bg-[#ECEAE7] text-[11px] font-medium text-[#555]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-[#1A1C1A]">{engineer.name}</p>
          <p className="truncate text-[11px] text-[#666]">{engineer.email}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-md p-1.5 text-[#aaa] transition-colors hover:bg-[#ECEAE7] hover:text-[#666]"
          title="Sair"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}
