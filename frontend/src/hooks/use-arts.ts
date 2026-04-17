'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Art, CoherenceAnalysis, CreateArtRequest, PdfExtractionResult } from '@/lib/types'
import { artService } from '@/services/art-service'

export function useArts() {
  const [arts, setArts] = useState<Art[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await artService.getAll()
      setArts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ARTs.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchArts() }, [fetchArts])

  return { arts, isLoading, error, refetch: fetchArts }
}

export function useArt(id: string) {
  const [art, setArt] = useState<Art | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArt = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await artService.getById(id)
      setArt(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ART.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => { fetchArt() }, [fetchArt])

  return { art, isLoading, error, refetch: fetchArt }
}

export function useArtActions() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createArt = async (data: CreateArtRequest): Promise<Art> => {
    setIsSubmitting(true)
    try {
      return await artService.create(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const analyzeArt = async (id: string): Promise<CoherenceAnalysis> => {
    setIsSubmitting(true)
    try {
      return await artService.analyze(id)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteArt = async (id: string): Promise<void> => {
    setIsSubmitting(true)
    try {
      await artService.delete(id)
    } finally {
      setIsSubmitting(false)
    }
  }

  const extractPdf = async (file: File): Promise<PdfExtractionResult> => {
    setIsSubmitting(true)
    try {
      return await artService.extractPdf(file)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { createArt, analyzeArt, deleteArt, extractPdf, isSubmitting }
}

export function useAnalysis(artId: string) {
  const [analysis, setAnalysis] = useState<CoherenceAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await artService.getAnalysis(artId)
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar analise.')
    } finally {
      setIsLoading(false)
    }
  }, [artId])

  useEffect(() => { fetchAnalysis() }, [fetchAnalysis])

  return { analysis, isLoading, error, refetch: fetchAnalysis }
}
