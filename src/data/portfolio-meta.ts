export const portfolioStats = [
  { id: 'years', value: '4+' },
  { id: 'roles', value: '4' },
  { id: 'products', value: '10+' },
  { id: 'mentored', value: '2' },
] as const

export type ProjectIconTone =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'pink'
  | 'yellow'
  | 'red'
  | 'gray'

export type ProjectMeta = {
  /** @deprecated Prefer lucide + ProjectIcon */
  icon: string
  lucide: string
  tone: ProjectIconTone
}

export const projectMeta: Record<string, ProjectMeta> = {
  udzs: { icon: '🏛️', lucide: 'Building2', tone: 'blue' },
  eforms: { icon: '📋', lucide: 'ClipboardList', tone: 'orange' },
  prolekare: { icon: '💊', lucide: 'HeartPulse', tone: 'pink' },
  licenses: { icon: '🔑', lucide: 'KeyRound', tone: 'purple' },
  'iba-rd': { icon: '🧪', lucide: 'FlaskConical', tone: 'green' },
  'docu-nest': { icon: '📓', lucide: 'BookMarked', tone: 'blue' },
  'scribe-notes': { icon: '✍️', lucide: 'NotepadText', tone: 'yellow' },
  'boom-scope': { icon: '🎨', lucide: 'Sparkles', tone: 'purple' },
  'pulse-apiclient': { icon: '⚡', lucide: 'Zap', tone: 'orange' },
  'spst-kniznica': { icon: '📚', lucide: 'BookOpen', tone: 'green' },
}

export function getProjectMeta(projectId: string): ProjectMeta {
  return (
    projectMeta[projectId] ?? {
      icon: '📄',
      lucide: 'BookMarked',
      tone: 'gray',
    }
  )
}

export const serviceIcons: Record<string, string> = {
  '01': '🏗️',
  '02': '🎨',
  '03': '⚙️',
  '04': '🧭',
}
