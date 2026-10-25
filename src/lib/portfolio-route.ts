import type { NotionPageId } from '@/components/notion/types'
import { getNote, isNoteId, notes } from '@/data/notes'
import {
  getProjectsForList,
  PROJECT_CATEGORY_BY_LIST,
  type ProjectListId,
  projects,
} from '@/data/portfolio'
import type { Locale } from '@/lib/locale'
import { DEFAULT_LOCALE, isLocale } from '@/lib/locale'

export type { ProjectListId } from '@/data/portfolio'

export type PortfolioPageId = NotionPageId | 'not-found' | 'error'

export type PortfolioRoute = {
  page: PortfolioPageId
  projectId?: string
  projectList?: ProjectListId
  noteId?: string
  attemptedPath?: string
}

const PROJECT_IDS = new Set(projects.map((project) => project.id))
const PROJECT_LIST_IDS = new Set<ProjectListId>(['my-projects'])

export function isProjectId(value: string): boolean {
  return PROJECT_IDS.has(value)
}

export function isProjectListId(value: string): value is ProjectListId {
  return PROJECT_LIST_IDS.has(value as ProjectListId)
}

export function isNotionPageId(value: string): value is NotionPageId {
  return [
    'about',
    'now',
    'tech',
    'experience',
    'projects',
    'notes',
    'oss',
    'uses',
    'cv',
    'contact',
  ].includes(value)
}

/** Strip leading locale segment from a pathname. */
export function stripLocaleFromPath(pathname: string): { locale: Locale; path: string } {
  const cleaned = pathname.replace(/^\/+|\/+$/g, '')
  const segments = cleaned.split('/').filter(Boolean)
  if (segments[0] && isLocale(segments[0])) {
    return { locale: segments[0], path: segments.slice(1).join('/') }
  }
  return { locale: DEFAULT_LOCALE, path: cleaned }
}

function parseRoutePath(path: string): PortfolioRoute {
  if (!path) {
    return { page: 'about' }
  }

  const segments = path.split('/').filter(Boolean)
  const [pagePart, secondSegment, ...extra] = segments

  if (extra.length > 0) {
    return { page: 'not-found', attemptedPath: path }
  }

  if (pagePart === 'error') {
    return { page: 'error' }
  }

  if (pagePart === 'projects') {
    if (secondSegment) {
      if (isProjectListId(secondSegment)) {
        return { page: 'projects', projectList: secondSegment }
      }
      if (isProjectId(secondSegment)) {
        return { page: 'projects', projectId: secondSegment }
      }
      return { page: 'not-found', attemptedPath: path }
    }
    return { page: 'projects' }
  }

  if (pagePart === 'notes') {
    if (secondSegment) {
      if (isNoteId(secondSegment)) {
        return { page: 'notes', noteId: secondSegment }
      }
      return { page: 'not-found', attemptedPath: path }
    }
    return { page: 'notes' }
  }

  if (isNotionPageId(pagePart)) {
    return { page: pagePart }
  }

  return { page: 'not-found', attemptedPath: path }
}

export function parsePortfolioRoute(pathname: string): PortfolioRoute {
  const { path } = stripLocaleFromPath(pathname)
  return parseRoutePath(path)
}

export function portfolioRouteEquals(a: PortfolioRoute, b: PortfolioRoute): boolean {
  return (
    a.page === b.page &&
    a.projectId === b.projectId &&
    a.projectList === b.projectList &&
    a.noteId === b.noteId &&
    a.attemptedPath === b.attemptedPath
  )
}

export function routeToPath(locale: Locale, route: PortfolioRoute): string {
  if (route.page === 'not-found') return `/${locale}`
  if (route.projectId) return `/${locale}/projects/${route.projectId}`
  if (route.projectList) return `/${locale}/projects/${route.projectList}`
  if (route.noteId) return `/${locale}/notes/${route.noteId}`
  if (route.page === 'about') return `/${locale}`
  return `/${locale}/${route.page}`
}

export function getProjectName(projectId: string): string | undefined {
  return projects.find((project) => project.id === projectId)?.name
}

export function getNoteTitle(noteId: string, lang: 'sk' | 'en'): string | undefined {
  return getNote(noteId)?.title[lang]
}

export function pageHref(locale: Locale, page: NotionPageId | 'error'): string {
  return page === 'about' ? `/${locale}` : `/${locale}/${page}`
}

export function projectHref(locale: Locale, projectId: string): string {
  return `/${locale}/projects/${projectId}`
}

export function projectListHref(locale: Locale, listId: ProjectListId): string {
  return `/${locale}/projects/${listId}`
}

export function noteHref(locale: Locale, noteId: string): string {
  return `/${locale}/notes/${noteId}`
}

export function getAdjacentProjects(projectId: string) {
  const project = projects.find((item) => item.id === projectId)
  if (!project) return { prev: undefined, next: undefined }

  const peers = getProjectsForList(PROJECT_CATEGORY_BY_LIST[project.category])
  const index = peers.findIndex((item) => item.id === projectId)
  if (index < 0) return { prev: undefined, next: undefined }

  return {
    prev: index > 0 ? peers[index - 1] : undefined,
    next: index < peers.length - 1 ? peers[index + 1] : undefined,
  }
}

export function getAdjacentNotes(noteId: string) {
  const index = notes.findIndex((item) => item.id === noteId)
  if (index < 0) return { prev: undefined, next: undefined }

  return {
    prev: index > 0 ? notes[index - 1] : undefined,
    next: index < notes.length - 1 ? notes[index + 1] : undefined,
  }
}
