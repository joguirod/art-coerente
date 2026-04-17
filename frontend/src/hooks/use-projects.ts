'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CreateProjectRequest, Project } from '@/lib/types'
import { projectService } from '@/services/project-service'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  return { projects, isLoading, error, refetch: fetchProjects }
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await projectService.getById(id)
      setProject(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projeto.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => { fetchProject() }, [fetchProject])

  return { project, isLoading, error, refetch: fetchProject }
}

export function useProjectActions() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createProject = async (data: CreateProjectRequest): Promise<Project> => {
    setIsSubmitting(true)
    try {
      return await projectService.create(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteProject = async (id: string): Promise<void> => {
    setIsSubmitting(true)
    try {
      await projectService.delete(id)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { createProject, deleteProject, isSubmitting }
}
