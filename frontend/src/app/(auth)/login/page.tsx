'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ApiException } from '@/lib/api'

function LoginForm() {
  const { login } = useAuth()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(emailOrUsername, password)
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message)
      } else {
        setError('Erro ao realizar login. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8 animate-slide-up">
      <h3 className="text-xl font-bold text-[#1a1c1a] mb-1">Bem-vindo</h3>
      <p className="text-sm text-[#3d4943] mb-6">
        Acesse sua conta para gerenciar ARTs e Obras.
      </p>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-[#ba1a1a]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#3d4943]">
            E-mail/Usuário
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3d4943]/50" strokeWidth={1.8} />
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full bg-[#e9e8e5]/50 border-none rounded-lg py-3 pl-10 pr-4 text-sm text-[#1a1c1a] placeholder:text-[#3d4943]/40 focus:outline-none focus:ring-2 focus:ring-[#00694c] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#3d4943]">
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#00694c] font-semibold hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3d4943]/50" strokeWidth={1.8} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#e9e8e5]/50 border-none rounded-lg py-3 pl-10 pr-4 text-sm text-[#1a1c1a] placeholder:text-[#3d4943]/40 focus:outline-none focus:ring-2 focus:ring-[#00694c] focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-[#00694c] hover:bg-[#005a41] text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center mt-2 disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-[#3d4943] mt-6">
        Ainda não possui uma conta?{' '}
        <Link href="/register" className="text-[#00694c] font-semibold hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
