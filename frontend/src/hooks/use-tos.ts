'use client'

import { useState, useCallback, useRef } from 'react'
import type { TosItem } from '@/lib/types'
import { tosService } from '@/services/tos-service'

export function useTosSearch() {
  const [results, setResults] = useState<TosItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q || q.length < 2) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data = await tosService.search(q)
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [])

  const clear = useCallback(() => setResults([]), [])

  return { results, isLoading, search, clear }
}
