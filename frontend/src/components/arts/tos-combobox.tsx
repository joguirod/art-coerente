'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Loader2, X } from 'lucide-react'
import type { TosItem } from '@/lib/types'
import { useTosSearch } from '@/hooks/use-tos'
import { Label } from '@/components/ui/label'

interface TosComboboxProps {
  value: TosItem | null
  onChange: (item: TosItem | null) => void
  label?: string
  placeholder?: string
}

export function TosCombobox({ value, onChange, label, placeholder = 'Buscar obra ou serviço...' }: TosComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { results, isLoading, search, clear } = useTosSearch()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    setOpen(true)
    search(q)
  }

  function handleSelect(item: TosItem) {
    onChange(item)
    setQuery('')
    setOpen(false)
    clear()
  }

  function handleClear() {
    onChange(null)
    setQuery('')
    clear()
    inputRef.current?.focus()
  }

  function formatLabel(item: TosItem) {
    const parts = [item.grupo, item.subgrupo, item.obraServico]
    if (item.complemento) parts.push(item.complemento)
    return parts.join(' › ')
  }

  return (
    <div ref={containerRef} className="relative">
      {label && <Label className="text-xs text-[#666] mb-1 block">{label}</Label>}

      {value ? (
        <div className="flex items-start gap-2 rounded-lg border border-[#ddd] bg-[#f5f5f3] px-3 py-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#999] mb-0.5">{value.grupo} › {value.subgrupo}</div>
            <div className="text-sm text-[#1a1a1a] font-medium leading-snug">
              {value.obraServico}{value.complemento ? ` — ${value.complemento}` : ''}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 mt-0.5 p-0.5 rounded text-[#bbb] hover:text-[#E24B4A] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#aaa]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder={placeholder}
            className="w-full h-9 rounded-lg border border-[#ddd] bg-white pl-9 pr-3 text-sm text-[#1a1a1a] placeholder:text-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-1"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#aaa] animate-spin" />
          )}
        </div>
      )}

      {open && !value && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-[#eee] bg-white shadow-lg max-h-64 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.seq}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-3 py-2.5 hover:bg-[#f5f5f3] transition-colors border-b border-[#f5f5f3] last:border-0"
            >
              <div className="text-[10px] text-[#999] mb-0.5">{item.grupo} › {item.subgrupo}</div>
              <div className="text-sm text-[#1a1a1a] leading-snug">
                {item.obraServico}
                {item.complemento && <span className="text-[#666]"> — {item.complemento}</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {open && !value && !isLoading && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-[#eee] bg-white shadow-lg px-3 py-3 text-sm text-[#999]">
          Nenhum resultado para "{query}"
        </div>
      )}
    </div>
  )
}
