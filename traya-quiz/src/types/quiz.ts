export type RootCause =
  | 'hormonal'
  | 'stress'
  | 'gut'
  | 'nutrition'
  | 'genetics'
  | 'scalp'

export type HairStage =
  | 'early'
  | 'moderate'
  | 'advanced'
  | 'maintenance'

export type QuestionType = 'single' | 'multi' | 'text' | 'photo'

export interface QuestionOption {
  id: string
  label: string
  description?: string
  icon?: string
  scores?: Partial<Record<RootCause, number>>
  stage?: HairStage
  showIf?: { questionId: string; optionIds: string[] }
}

export interface Question {
  id: string
  section: string
  sectionTitle: string
  sectionSubtitle?: string
  prompt: string
  helperText?: string
  type: QuestionType
  required?: boolean
  options?: QuestionOption[]
  placeholder?: string
  showIf?: { questionId: string; optionIds: string[] }
}

export type Answers = Record<string, string | string[]>

export interface AssessmentResult {
  stage: HairStage
  stageLabel: string
  rootCauses: { cause: RootCause; label: string; score: number; description: string }[]
  primaryCause: RootCause
  summary: string
  recommendations: string[]
  riskLevel: 'low' | 'moderate' | 'high'
}
