import Fuse from 'fuse.js'
import type { Note } from '@/data/notes'
import { getNotesByTag, notes } from '@/data/notes'
import type { Lang } from '@/i18n/translations'
import { flattenNoteBody } from '@/lib/note-blocks'
import { normalizeSearch } from '@/lib/search-utils'

export type NotesQuery = {
  lang: Lang
  query?: string
  tag?: string | null
}

export type NoteSearchHit = {
  note: Note
  score: number
  query: string
}

type NoteSearchDoc = {
  id: string
  title: string
  summary: string
  tags: string
  body: string
  note: Note
}

export { normalizeSearch }

const fuseByLang = new Map<Lang, Fuse<NoteSearchDoc>>()

function buildDocs(lang: Lang): NoteSearchDoc[] {
  return notes.map((note) => ({
    id: note.id,
    title: normalizeSearch(note.title[lang]),
    summary: normalizeSearch(note.summary[lang]),
    tags: normalizeSearch(note.tags.join(' ')),
    body: normalizeSearch(flattenNoteBody(note.body[lang]).slice(0, 1200)),
    note,
  }))
}

function getNotesFuse(lang: Lang): Fuse<NoteSearchDoc> {
  const cached = fuseByLang.get(lang)
  if (cached) return cached

  const fuse = new Fuse(buildDocs(lang), {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.38,
    distance: 120,
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'tags', weight: 0.25 },
      { name: 'summary', weight: 0.2 },
      { name: 'body', weight: 0.1 },
    ],
  })

  fuseByLang.set(lang, fuse)
  return fuse
}

export function scoreNote(note: Note, lang: Lang, query: string): number {
  const trimmed = query.trim()
  if (!trimmed) return 1

  const fuse = getNotesFuse(lang)
  const hit = fuse.search(normalizeSearch(trimmed)).find((result) => result.item.id === note.id)
  if (!hit || hit.score == null) return 0
  return Math.round((1 - hit.score) * 100)
}

export function filterNotes({ lang, query, tag = null }: NotesQuery): Note[] {
  return searchNotes({ lang, query, tag }).map((hit) => hit.note)
}

/** Fuse-ranked notes with query retained for highlight rendering. */
export function searchNotes({ lang, query, tag = null }: NotesQuery): NoteSearchHit[] {
  const base = getNotesByTag(tag)
  const trimmed = query?.trim() ?? ''
  if (!trimmed) {
    return base.map((note) => ({ note, score: 1, query: '' }))
  }

  const allowed = new Set(base.map((note) => note.id))
  const fuse = getNotesFuse(lang)
  return fuse
    .search(normalizeSearch(trimmed))
    .filter((result) => allowed.has(result.item.id))
    .map((result) => ({
      note: result.item.note,
      score: Math.round((1 - (result.score ?? 1)) * 100),
      query: trimmed,
    }))
}

export function resetNotesSearchCache() {
  fuseByLang.clear()
}
