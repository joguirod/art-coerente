import { AlertTriangle, XCircle } from 'lucide-react'
import type { AnalysisAlert } from '@/lib/types'
import { StatusBadge } from '@/components/shared/status-badge'

export function AlertCard({ alert }: { alert: AnalysisAlert }) {
  const isError = alert.tipo === 'erro'

  return (
    <div
      className={`rounded-xl border-l-[3px] bg-white px-4 py-3.5 ${
        isError ? 'border-l-[#E24B4A] border border-l-[3px] border-red-100' : 'border-l-[#BA7517] border border-l-[3px] border-amber-100'
      }`}
    >
      <div className="flex items-start gap-3">
        {isError ? (
          <XCircle className="h-4 w-4 text-[#E24B4A] mt-0.5 shrink-0" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-[#BA7517] mt-0.5 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge variant={isError ? 'error' : 'warning'}>
              {isError ? 'Erro' : 'Aviso'}
            </StatusBadge>
            {alert.atividade && (
              <StatusBadge variant="neutral">{alert.atividade}</StatusBadge>
            )}
          </div>
          <p className="text-sm text-[#333]">{alert.mensagem}</p>
          <p className="text-xs text-[#999] mt-1">Fonte: {alert.fonte}</p>
        </div>
      </div>
    </div>
  )
}
