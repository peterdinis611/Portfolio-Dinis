import type { Lang } from '@/i18n/translations'
import type { ProjectIconTone } from '@/data/portfolio-meta'

export type ProjectMetric = {
  value: string
  label: Record<Lang, string>
}

export type LocalizedText = Record<Lang, string>

export type ProductPreviewVariant =
  | 'dashboard'
  | 'forms'
  | 'healthcare'
  | 'api'
  | 'licenses'
  | 'design-system'
  | 'notebooks'
  | 'notes'
  | 'canvas'
  | 'library'

export type ProjectDemo = {
  type: 'live' | 'repo'
  url: string
}

export type RoleOutcome = {
  role: LocalizedText
  outcome: LocalizedText
}

export type FlowStep = LocalizedText

export type BeforeAfter = {
  before: LocalizedText
  after: LocalizedText
}

export type ProjectShowcase = {
  metrics: ProjectMetric[]
  preview: ProductPreviewVariant
  previewSecondary?: ProductPreviewVariant
  tone: ProjectIconTone
  /** Reserved for NDA-bound work — no real product UI */
  anonymized?: boolean
  demo?: ProjectDemo
  rolesOutcomes?: RoleOutcome[]
  architecture?: FlowStep[]
  beforeAfter?: BeforeAfter
}

export const projectShowcase: Record<string, ProjectShowcase> = {
  'docu-nest': {
    tone: 'blue',
    preview: 'notebooks',
    previewSecondary: 'dashboard',
    demo: { type: 'repo', url: 'https://github.com/peterdinis611/Docu-Nest' },
    metrics: [
      { value: 'AI', label: { sk: 'notebook workflow', en: 'notebook workflow' } },
      { value: 'XState', label: { sk: 'stavové stroje', en: 'state machines' } },
      { value: 'SQLite', label: { sk: 'lokálne dáta', en: 'local data' } },
    ],
  },
  'scribe-notes': {
    tone: 'yellow',
    preview: 'notes',
    previewSecondary: 'notebooks',
    demo: { type: 'repo', url: 'https://github.com/peterdinis611/Scribe-Notes-App' },
    metrics: [
      { value: 'Tauri', label: { sk: 'natívny desktop', en: 'native desktop' } },
      { value: 'FTS5', label: { sk: 'fulltext search', en: 'full-text search' } },
      { value: 'Offline', label: { sk: 'lokálne SQLite', en: 'local SQLite' } },
    ],
  },
  'boom-scope': {
    tone: 'purple',
    preview: 'canvas',
    previewSecondary: 'notes',
    demo: { type: 'live', url: 'https://boom-scope.vercel.app' },
    metrics: [
      { value: 'AI', label: { sk: 'design generátor', en: 'design generator' } },
      { value: 'Live', label: { sk: 'Convex real-time', en: 'Convex real-time' } },
      { value: '1', label: { sk: 'workspace app', en: 'workspace app' } },
    ],
  },
  'pulse-apiclient': {
    tone: 'orange',
    preview: 'api',
    previewSecondary: 'dashboard',
    demo: { type: 'repo', url: 'https://github.com/peterdinis611/Pulse-ApiClient' },
    metrics: [
      { value: 'Rust', label: { sk: 'HTTP engine', en: 'HTTP engine' } },
      { value: 'WS', label: { sk: 'WebSocket klient', en: 'WebSocket client' } },
      { value: 'Tauri', label: { sk: 'desktop runtime', en: 'desktop runtime' } },
    ],
  },
  'spst-kniznica': {
    tone: 'green',
    preview: 'library',
    previewSecondary: 'dashboard',
    demo: { type: 'live', url: 'https://spst-kniznica.vercel.app' },
    metrics: [
      { value: 'Full', label: { sk: 'katalóg + admin', en: 'catalog + admin' } },
      { value: 'Auth', label: { sk: 'Auth.js sessions', en: 'Auth.js sessions' } },
      { value: 'SQL', label: { sk: 'atomické výpožičky', en: 'atomic loans' } },
    ],
  },
}

export function getProjectShowcase(projectId: string): ProjectShowcase | undefined {
  return projectShowcase[projectId]
}
