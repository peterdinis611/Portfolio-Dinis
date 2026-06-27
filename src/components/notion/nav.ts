import { projects } from '@/data/portfolio'
import { projectMeta } from '@/data/portfolio-meta'
import { type Lang, translations } from '../../i18n/translations'
import type { PortfolioRoute } from '../../lib/portfolio-route'
import type { NotionPageDef } from './types'

export type { PortfolioRoute } from '../../lib/portfolio-route'
export {
  getProjectName,
  isNotionPageId,
  isProjectId,
  pageFromHash,
  parsePortfolioRoute,
  setPageHash,
  setPortfolioHash,
} from '../../lib/portfolio-route'

export function getNotionPages(lang: Lang): NotionPageDef[] {
  const ui = translations[lang].ui
  return [
    { id: 'about', icon: '👋', label: ui.about },
    { id: 'tech', icon: '⚡', label: ui.tech },
    { id: 'experience', icon: '💼', label: ui.experience },
    { id: 'projects', icon: '🚀', label: ui.projects },
    { id: 'contact', icon: '✉️', label: ui.contact },
  ]
}

export function getProjectNavItems() {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    icon: projectMeta[project.id]?.icon ?? '📄',
    href: `#projects/${project.id}`,
  }))
}

export function isProjectsListActive(route: PortfolioRoute): boolean {
  return route.page === 'projects' && !route.projectId
}
