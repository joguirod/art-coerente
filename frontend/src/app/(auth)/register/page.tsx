'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth-service'
import { ApiException } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: 'As senhas nao coincidem.' })
      return
    }
    if (form.password.length < 8) {
      setFieldErrors({ password: 'A senha deve ter no minimo 8 caracteres.' })
      return
    }

    setIsLoading(true)
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        username: form.username,
        password: form.password,
      })
      router.push('/login?registered=true')
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errors) {
          setFieldErrors(err.errors)
        } else {
          setError(err.message)
        }
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#eee] bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-slide-up">
      <h3 className="text-base font-semibold text-[#1a1a1a] mb-1">Criar conta</h3>
      <p className="text-sm text-[#888] mb-6">Cadastre-se para comecar a usar</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-[#E24B4A]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm text-[#555]">Nome completo</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm placeholder:text-[#ccc] focus-visible:ring-[#1a1a1a]"
          />
          {fieldErrors.name && <p className="text-xs text-[#E24B4A]">{fieldErrors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm text-[#555]">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm placeholder:text-[#ccc] focus-visible:ring-[#1a1a1a]"
          />
          {fieldErrors.email && <p className="text-xs text-[#E24B4A]">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-sm text-[#555]">Usuario</Label>
          <Input
            id="username"
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
            minLength={3}
            className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm placeholder:text-[#ccc] focus-visible:ring-[#1a1a1a]"
          />
          {fieldErrors.username && <p className="text-xs text-[#E24B4A]">{fieldErrors.username}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm text-[#555]">Senha</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              minLength={8}
              className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm placeholder:text-[#ccc] focus-visible:ring-[#1a1a1a]"
            />
            {fieldErrors.password && <p className="text-xs text-[#E24B4A]">{fieldErrors.password}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm text-[#555]">Confirmar</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
              className="h-10 rounded-lg border-[#ddd] px-3.5 text-sm placeholder:text-[#ccc] focus-visible:ring-[#1a1a1a]"
            />
            {fieldErrors.confirmPassword && <p className="text-xs text-[#E24B4A]">{fieldErrors.confirmPassword}</p>}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg text-sm font-medium mt-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar conta'}
        </Button>
      </form>

      <div className="mt-5 text-center text-sm">
        <Link href="/login" className="text-[#888] hover:text-[#1a1a1a] transition-colors">
          Ja tem uma conta? Entrar
        </Link>
      </div>
    </div>
  )
}
