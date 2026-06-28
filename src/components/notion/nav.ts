import { getProjectsForList, projects, type ProjectListId } from '@/data/portfolio'
import { projectMeta } from '@/data/portfolio-meta'
import { type Lang, translations } from '../../i18n/translations'
import {
  projectHref,
  type PortfolioRoute,
} from '../../lib/portfolio-route'
import type { NotionPageDef } from './types'

export type { PortfolioRoute, ProjectListId } from '../../lib/portfolio-route'
export {
  getAdjacentProjects,
  getProjectName,
  isNotionPageId,
  isProjectId,
  isProjectListId,
  pageFromHash,
  parsePortfolioRoute,
  projectHref,
  projectListHref,
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

export function getProjectListLabel(lang: Lang, listId: ProjectListId): string {
  const ui = translations[lang].ui
  return listId === 'companies-projects' ? ui.companiesProjects : ui.myProjects
}

export function getProjectNavGroups(lang: Lang) {
  const ui = translations[lang].ui

  return ([
    {
      id: 'companies-projects' as const,
      label: ui.companiesProjects,
      icon: '💼',
      items: getProjectsForList('companies-projects').map((project) => ({
        id: project.id,
        name: project.name,
        icon: projectMeta[project.id]?.icon ?? '📄',
        href: projectHref(project.id),
      })),
    },
    {
      id: 'my-projects' as const,
      label: ui.myProjects,
      icon: '🛠️',
      items: getProjectsForList('my-projects').map((project) => ({
        id: project.id,
        name: project.name,
        icon: projectMeta[project.id]?.icon ?? '📄',
        href: projectHref(project.id),
      })),
    },
  ])
}

/** @deprecated Use getProjectNavGroups */
export function getProjectNavItems() {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    icon: projectMeta[project.id]?.icon ?? '📄',
    href: projectHref(project.id),
  }))
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
