import type { ApiError } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export class ApiException extends Error {
  status: number
  errors?: Record<string, string>

  constructor(status: number, message: string, errors?: Record<string, string>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers: Record<string, string> = {}

  if (options?.headers) {
    Object.assign(headers, options.headers)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('engineer')
        document.cookie = 'auth-token=; path=/; max-age=0'
        window.location.href = '/login'
      }
      throw new ApiException(res.status, 'Sessao expirada. Faca login novamente.')
    }

    let errorData: ApiError | null = null
    try {
      errorData = await res.json()
    } catch {
      // response body may not be JSON
    }

    if (res.status === 400) {
      throw new ApiException(
        400,
        errorData?.message || 'Dados invalidos.',
        errorData?.errors
      )
    }
    if (res.status === 409) {
      throw new ApiException(409, errorData?.message || 'Conflito ao processar a requisicao.')
    }
    if (res.status === 503) {
      throw new ApiException(503, errorData?.message || 'Servico de analise temporariamente indisponivel.')
    }

    throw new ApiException(
      res.status,
      errorData?.message || `Erro ${res.status} ao processar a requisicao.`
    )
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json()
}

export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) =>
    fetchApi<T>(endpoint, { method: 'DELETE' }),
}
