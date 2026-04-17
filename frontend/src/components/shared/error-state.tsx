import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Ocorreu um erro ao carregar os dados.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
        <AlertTriangle className="h-6 w-6 text-[#E24B4A]" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-medium text-[#1a1a1a] mb-1.5">Erro ao carregar</h3>
      <p className="text-sm text-[#888] max-w-xs mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="rounded-lg px-5 h-9 text-sm border-[#ddd]">
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
