import { api } from '@/lib/api'
import type { AuthResponse } from '@/lib/types'

export const authService = {
  login: (emailOrUsername: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { emailOrUsername, password }),

  register: (data: { name: string; email: string; username: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, newPassword }),
}
