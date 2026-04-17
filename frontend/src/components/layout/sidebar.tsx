'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Building2, Settings, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/arts', label: 'ARTs', icon: FileText },
  { href: '/projects', label: 'Obras', icon: Building2 },
]

const bottomNav = [
  { href: '#', label: 'Settings', icon: Settings },
  { href: '#', label: 'Support', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col bg-[#f4f3f1] py-8 px-4">
      {/* Brand */}
      <div className="mb-12 px-2">
        <h1 className="text-xl font-bold text-[#1a1c1a] tracking-tighter">ART Tech</h1>
        <p className="text-xs text-[#3d4943]/60 font-medium mt-0.5">Precision Control</p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-[#00694c] font-semibold border-r-4 border-[#00694c] bg-[#e3e2e0]/30'
                  : 'text-[#1a1c1a]/60 hover:text-[#1a1c1a] hover:bg-[#e3e2e0]'
              )}
            >
              <item.icon
                className={cn('h-5 w-5 shrink-0', isActive ? 'text-[#00694c]' : 'text-current')}
                strokeWidth={1.8}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom nav */}
      <div className="pt-6 border-t border-[#bccac1]/20 space-y-1">
        {bottomNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#1a1c1a]/60 hover:text-[#1a1c1a] hover:bg-[#e3e2e0] transition-colors duration-200"
          >
            <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
