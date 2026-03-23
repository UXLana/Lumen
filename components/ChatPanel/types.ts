// ─── Chat Panel Types ────────────────────────────────────────────────────────

export type DotAnimation = 'pulse' | 'wind'

export interface ChatAction {
  label: string
  action: string
  payload?: Record<string, unknown>
}

export interface DataTableProps {
  title?: string
  columns: { key: string; label: string }[]
  rows: Record<string, string | number>[]
}

export interface EntityCardProps {
  title: string
  subtitle?: string
  fields: { label: string; value: string | number }[]
}

export interface StatCardsProps {
  items: { label: string; value: string | number }[]
}

export interface BannerProps {
  variant: 'info' | 'warning' | 'error' | 'success'
  title: string
  description?: string
}

export interface StepperProps {
  title?: string
  steps: { label: string; status: 'complete' | 'current' | 'upcoming' }[]
}

export type UIComponent =
  | { type: 'DATA_TABLE'; props: DataTableProps }
  | { type: 'ENTITY_CARD'; props: EntityCardProps }
  | { type: 'STAT_CARDS'; props: StatCardsProps }
  | { type: 'BANNER'; props: BannerProps }
  | { type: 'STEPPER'; props: StepperProps }

export interface AssistantPayload {
  text?: string
  components?: UIComponent[]
  actions?: ChatAction[]
}

export interface ChatMessage {
  /** Unique message identifier (used as React key) */
  id: string
  role: 'user' | 'assistant'
  content: string
  structured?: AssistantPayload
}
