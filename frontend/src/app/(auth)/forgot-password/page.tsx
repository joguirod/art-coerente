'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth-service'
import { ApiException } from '@/lib/api'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message)
      } else {
        setError('Erro ao enviar email. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-[#eee] bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-slide-up text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f5ef]">
          <CheckCircle2 className="h-6 w-6 text-[#1D9E75]" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a1a] mb-1.5">Email enviado</h3>
        <p className="text-sm text-[#888] mb-6">
          Se o email estiver cadastrado, voce recebera um link para redefinir sua senha.
        </p>
        <Link href="/login">
          <Button variant="outline" className="rounded-lg border-[#ddd] text-sm h-9">
            Voltar para login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#eee] bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-slide-up">
      <h3 className="text-base font-semibold text-[#1a1a1a] mb-1">Recuperar senha</h3>
      <p className="text-sm text-[#888] mb-6">Informe seu email para receber o link de recuperacao</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-[#E24B4A]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm text-[#555]">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm placeholder:text-[#ccc] focus-visible:ring-[#1a1a1a]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg text-sm font-medium"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar link de recuperacao'}
        </Button>
      </form>

      <div className="mt-5 text-center">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para login
        </Link>
      </div>
    </div>
  )
}
