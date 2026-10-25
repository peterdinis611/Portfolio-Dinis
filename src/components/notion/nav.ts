import { type ProjectListId, projects } from '@/data/portfolio'
import { projectMeta } from '@/data/portfolio-meta'
import { type Lang, translations } from '../../i18n/translations'
import { type PortfolioRoute, projectHref } from '../../lib/portfolio-route'
import type { NotionPageDef } from './types'

export type { PortfolioRoute, ProjectListId } from '../../lib/portfolio-route'
export {
  getAdjacentProjects,
  getProjectName,
  isNotionPageId,
  isProjectId,
  isProjectListId,
  noteHref,
  pageHref,
  parsePortfolioRoute,
  projectHref,
  projectListHref,
  routeToPath,
} from '../../lib/portfolio-route'

export function getNotionPages(lang: Lang): NotionPageDef[] {
  const ui = translations[lang].ui
  return [
    { id: 'about', icon: '👋', label: ui.about },
    { id: 'now', icon: '📡', label: ui.now },
    { id: 'tech', icon: '⚡', label: ui.tech },
    { id: 'experience', icon: '💼', label: ui.experience },
    { id: 'projects', icon: '🚀', label: ui.projects },
    { id: 'notes', icon: '✍️', label: ui.notes },
    { id: 'oss', icon: '🌿', label: ui.oss },
    { id: 'uses', icon: '🛠️', label: ui.uses },
    { id: 'cv', icon: '📄', label: ui.cv },
    { id: 'contact', icon: '✉️', label: ui.contact },
  ]
}

export function getProjectListLabel(lang: Lang, listId: ProjectListId): string {
  const ui = translations[lang].ui
  return listId === 'my-projects' ? ui.myProjects : ui.projects
}

export function getProjectNavItems(lang: Lang) {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    icon: projectMeta[project.id]?.icon ?? '📄',
    href: projectHref(lang, project.id),
  }))
}

/** @deprecated Prefer getProjectNavItems — groups removed with company projects */
export function getProjectNavGroups(lang: Lang) {
  const ui = translations[lang].ui
  return [
    {
      id: 'my-projects' as const,
      label: ui.myProjects,
      icon: '🛠️',
      items: getProjectNavItems(lang),
    },
  ]
}

export function isProjectsOverviewActive(route: PortfolioRoute): boolean {
  return route.page === 'projects' && !route.projectId && !route.projectList
}

export function isProjectListActive(route: PortfolioRoute, listId: ProjectListId): boolean {
  return route.page === 'projects' && route.projectList === listId && !route.projectId
}

/** @deprecated Use isProjectsOverviewActive */
export function isProjectsListActive(route: PortfolioRoute): boolean {
  return isProjectsOverviewActive(route)
}
