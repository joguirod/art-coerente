'use client'

import { useState } from 'react'
import type { ConstructionStage, StageStatus, StageUpdate } from '@/lib/types'
import { stageService } from '@/services/stage-service'

export function useStageActions(projectId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createStage = async (name: string): Promise<ConstructionStage> => {
    setIsSubmitting(true)
    try {
      return await stageService.create(projectId, name)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateStage = async (stageId: string, data: { name?: string; status?: StageStatus }): Promise<ConstructionStage> => {
    setIsSubmitting(true)
    try {
      return await stageService.update(projectId, stageId, data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteStage = async (stageId: string): Promise<void> => {
    setIsSubmitting(true)
    try {
      await stageService.delete(projectId, stageId)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addUpdate = async (stageId: string, description: string, image?: File): Promise<StageUpdate> => {
    setIsSubmitting(true)
    try {
      return await stageService.addUpdate(projectId, stageId, description, image)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { createStage, updateStage, deleteStage, addUpdate, isSubmitting }
}
