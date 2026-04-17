'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { Engineer } from '@/lib/types'
import { authService } from '@/services/auth-service'

interface AuthContextType {
  engineer: Engineer | null
  token: string | null
  isLoading: boolean
  login: (emailOrUsername: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; username: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [engineer, setEngineer] = useState<Engineer | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedEngineer = localStorage.getItem('engineer')
    if (savedToken && savedEngineer) {
      setToken(savedToken)
      try {
        setEngineer(JSON.parse(savedEngineer))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('engineer')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    const res = await authService.login(emailOrUsername, password)
    localStorage.setItem('token', res.token)
    localStorage.setItem('engineer', JSON.stringify(res.engineer))
    document.cookie = `auth-token=${res.token}; path=/; SameSite=Strict`
    setToken(res.token)
    setEngineer(res.engineer)
    router.push('/dashboard')
  }, [router])

  const register = useCallback(async (data: { name: string; email: string; username: string; password: string }) => {
    await authService.register(data)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('engineer')
    document.cookie = 'auth-token=; path=/; max-age=0'
    setToken(null)
    setEngineer(null)
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ engineer, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
