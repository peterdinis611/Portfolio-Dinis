import { type Lang, translations } from '../../i18n/translations'
import type { NotionPageDef, NotionPageId } from './types'

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

export function isNotionPageId(value: string): value is NotionPageId {
  return ['about', 'tech', 'experience', 'projects', 'contact'].includes(value)
}

export function pageFromHash(): NotionPageId {
  const hash = window.location.hash.replace(/^#\/?/, '')
  return isNotionPageId(hash) ? hash : 'about'
}

export function setPageHash(page: NotionPageId) {
  const next = `#${page}`
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next)
  }
}
