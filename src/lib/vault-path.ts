import type { PortfolioRoute } from '@/lib/portfolio-route'
import { projects } from '@/data/portfolio'

export function routeToVaultFile(route: PortfolioRoute): string {
  if (route.page === 'not-found') return '404.md'
  if (route.page === 'error') return 'error.md'
  if (route.projectId) return `projects/${route.projectId}.md`
  if (route.projectList) return `projects/${route.projectList}.md`
  return `${route.page}.md`
}

export function routeToVaultLabel(route: PortfolioRoute, lang: 'sk' | 'en'): string {
  if (route.projectId) {
    return projects.find((p) => p.id === route.projectId)?.name ?? route.projectId
  }
  const labels: Record<string, Record<'sk' | 'en', string>> = {
    about: { sk: 'O mne', en: 'About' },
    tech: { sk: 'Technológie', en: 'Technologies' },
    experience: { sk: 'Skúsenosti', en: 'Experience' },
    projects: { sk: 'Projekty', en: 'Projects' },
    contact: { sk: 'Kontakt', en: 'Contact' },
    'not-found': { sk: '404', en: '404' },
    error: { sk: 'Chyba', en: 'Error' },
    'my-projects': { sk: 'Moje projekty', en: 'My projects' },
  }
  if (route.projectList) return labels[route.projectList]?.[lang] ?? route.projectList
  return labels[route.page]?.[lang] ?? route.page
}
