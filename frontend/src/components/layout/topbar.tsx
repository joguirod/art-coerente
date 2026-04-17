'use client'

import { Bell, History, Search } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

const navLinks = ['Documentos', 'Logs', 'Relatórios']

export function TopBar() {
  const { engineer } = useAuth()

  const initials = engineer?.name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '?'

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[#faf9f6]/80 backdrop-blur-md border-b border-[#1a1c1a]/5 flex justify-between items-center h-16 px-8">
      {/* Left: search + nav */}
      <div className="flex items-center gap-8 flex-1">
        <div className="relative max-w-xs w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#3d4943]/60"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Buscar logs técnicos..."
            className="w-full bg-[#f4f3f1] border-none rounded-lg py-2 pl-9 pr-4 text-xs font-semibold text-[#1a1c1a] placeholder:text-[#3d4943]/50 focus:outline-none focus:ring-1 focus:ring-[#00694c] transition-all"
          />
        </div>
        <nav className="flex items-center gap-6">
          {navLinks.map((label) => (
            <a
              key={label}
              href="#"
              className="text-[#1a1c1a]/50 font-semibold text-[10px] uppercase tracking-widest hover:text-[#00694c] transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-4 pl-8 border-l border-[#bccac1]/20">
        <button className="text-[#3d4943] hover:text-[#00694c] transition-colors">
          <Bell className="h-5 w-5" strokeWidth={1.8} />
        </button>
        <button className="text-[#3d4943] hover:text-[#00694c] transition-colors">
          <History className="h-5 w-5" strokeWidth={1.8} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#e3e2e0] flex items-center justify-center">
          <span className="text-[11px] font-bold text-[#1a1c1a]">{initials}</span>
        </div>
      </div>
    </header>
  )
}
