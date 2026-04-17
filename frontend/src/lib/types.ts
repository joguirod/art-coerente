export type ArtType = 'PRE' | 'POST'
export type StageStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface Engineer {
  id: string
  name: string
  email: string
  username: string
}

export interface AuthResponse {
  token: string
  engineer: Engineer
}

export interface ArtActivity {
  id: string
  atividade: string
  grupo: string
  subgrupo: string
  obraServico: string
  complemento: string | null
  quantidade: number
  unidade: string
}

export interface TosItem {
  seq: number
  grupo: string
  subgrupo: string
  obraServico: string
  complemento: string | null
}

export interface AnalysisSummary {
  id: string
  score: number
  coherent: boolean
  createdAt: string
}

export interface Art {
  id: string
  type: ArtType
  artNumber: string | null
  description: string
  location: string
  contractorName: string
  startDate: string
  endDate: string
  pdfPath: string | null
  createdAt: string
  activities: ArtActivity[]
  latestAnalysis: AnalysisSummary | null
}

export interface AnalysisAlert {
  tipo: string
  mensagem: string
  fonte: string
  atividade: string | null
}

export interface ChunkUsed {
  fonte: string
  trecho: string
}

export interface CoherenceAnalysis {
  id: string
  score: number
  coherent: boolean
  summary: string
  alerts: AnalysisAlert[]
  suggestions: string[]
  complementaryRecommendations: string[]
  chunksUsed: ChunkUsed[]
  createdAt: string
}

export interface StageUpdate {
  id: string
  description: string
  imageUrl: string | null
  createdAt: string
}

export interface ConstructionStage {
  id: string
  name: string
  stageOrder: number
  status: StageStatus
  updatedAt: string
  updates: StageUpdate[]
}

export interface Project {
  id: string
  name: string
  address: string | null
  obraType: string | null
  startDate: string | null
  description: string | null
  artId: string | null
  createdAt: string
  stages: ConstructionStage[]
  progressPercentage: number
}

export interface DashboardSummary {
  analyzedArtsCount: number
  pendingArtsCount: number
  averageScore: number | null
  activeProjectsCount: number
  recentArts: Art[]
  activeProjects: Project[]
}

export interface PdfExtractionResult {
  artNumber: string | null
  description: string | null
  location: string | null
  contractorName: string | null
  startDate: string | null
  endDate: string | null
  missingFields: string[]
}

export interface CreateArtRequest {
  type: ArtType
  artNumber?: string
  description: string
  location: string
  contractorName: string
  startDate: string
  endDate: string
  activities: CreateArtActivityRequest[]
}

export interface CreateArtActivityRequest {
  atividade: string
  grupo: string
  subgrupo: string
  obraServico: string
  complemento?: string
  quantidade: number
  unidade: string
}

export interface CreateProjectRequest {
  name: string
  address?: string
  obraType?: string
  startDate?: string
  description?: string
  artId?: string
  stages?: string[]
}

export interface UpdateProjectRequest {
  name: string
  address?: string
  obraType?: string
  startDate?: string
  description?: string
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string>
}
