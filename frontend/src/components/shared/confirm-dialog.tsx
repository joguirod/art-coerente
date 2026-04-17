'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  isLoading?: boolean
  variant?: 'destructive' | 'default'
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  onConfirm,
  isLoading,
  variant = 'destructive',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-xl border-[#eee]">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription className="text-sm text-[#888]">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border-[#ddd] text-sm h-9"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={
              variant === 'destructive'
                ? 'bg-[#E24B4A] hover:bg-[#d43d3c] text-white rounded-lg text-sm h-9'
                : 'bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg text-sm h-9'
            }
          >
            {isLoading ? 'Processando...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
