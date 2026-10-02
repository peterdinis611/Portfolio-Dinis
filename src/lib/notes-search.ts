import Fuse from 'fuse.js'
import type { Note } from '@/data/notes'
import { getNotesByTag, notes } from '@/data/notes'
import type { Lang } from '@/i18n/translations'
import { flattenNoteBody } from '@/lib/note-blocks'

export type NotesQuery = {
  lang: Lang
  query?: string
  tag?: string | null
}

type NoteSearchDoc = {
  id: string
  title: string
  summary: string
  tags: string
  body: string
  note: Note
}

/** Diacritics-insensitive lowercase for SK/EN search. */
export function normalizeSearch(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
}

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
    // Slightly fuzzy — good for typos + SK/EN fragments.
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

/**
 * Fuse score is 0 (best) → 1 (worst). Convert to higher-is-better ~0–100.
 * Exact-ish hits land near 100; weak fuzzy matches stay low.
 */
export function scoreNote(note: Note, lang: Lang, query: string): number {
  const trimmed = query.trim()
  if (!trimmed) return 1

  const fuse = getNotesFuse(lang)
  const hit = fuse.search(normalizeSearch(trimmed)).find((result) => result.item.id === note.id)
  if (!hit || hit.score == null) return 0
  return Math.round((1 - hit.score) * 100)
}

/**
 * Filter + rank blog notes via Fuse.js (optional tag pre-filter).
 * Empty query returns date-sorted (or tag-filtered) list.
 */
export function filterNotes({ lang, query, tag = null }: NotesQuery): Note[] {
  const base = getNotesByTag(tag)
  const trimmed = query?.trim() ?? ''
  if (!trimmed) return base

  const allowed = new Set(base.map((note) => note.id))
  const fuse = getNotesFuse(lang)
  const results = fuse.search(normalizeSearch(trimmed))

  return results.filter((result) => allowed.has(result.item.id)).map((result) => result.item.note)
}

/** Test helper — clear Fuse caches between suites if needed. */
export function resetNotesSearchCache() {
  fuseByLang.clear()
}
