import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'ART - Analise de Coerencia',
  description: 'Sistema de analise de coerencia de ARTs para engenheiros',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#faf9f6]">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
