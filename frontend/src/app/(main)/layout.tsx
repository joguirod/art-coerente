'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/contexts/auth-context'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/topbar'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return null

  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <TopBar />
        <main className="ml-64 pt-16 flex-1 min-h-screen">
          <div className="px-10 py-12">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}
