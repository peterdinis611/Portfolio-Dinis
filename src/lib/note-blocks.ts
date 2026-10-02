import type { Note } from '@/data/notes'

export type NoteBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; code: string; lang?: string }
  | { type: 'callout'; text: string; tone?: 'info' | 'tip' | 'warn' }
  | { type: 'quote'; text: string; cite?: string }

export type NoteTocItem = {
  id: string
  text: string
  level: 2 | 3
}

export type NotesSort = 'newest' | 'reading' | 'az'

export type NoteCoverId =
  | 'about'
  | 'tech'
  | 'experience'
  | 'projects'
  | 'contact'
  | 'code'
  | 'docu-nest'
  | 'scribe-notes'
  | 'boom-scope'
  | 'pulse-apiclient'
  | 'spst-kniznica'

/** Normalize legacy string[] bodies or rich blocks into NoteBlock[]. */
export function resolveNoteBody(body: NoteBlock[] | string[]): NoteBlock[] {
  if (body.length === 0) return []
  if (typeof body[0] === 'string') {
    return (body as string[]).map((text) => ({ type: 'p' as const, text }))
  }
  return body as NoteBlock[]
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64)
}

export function headingId(text: string, used: Set<string>): string {
  const base = slugifyHeading(text) || 'section'
  let id = base
  let i = 2
  while (used.has(id)) {
    id = `${base}-${i}`
    i += 1
  }
  used.add(id)
  return id
}

export function extractNoteToc(blocks: NoteBlock[]): NoteTocItem[] {
  const used = new Set<string>()
  const items: NoteTocItem[] = []
  for (const block of blocks) {
    if (block.type !== 'h2' && block.type !== 'h3') continue
    items.push({
      id: headingId(block.text, used),
      text: block.text,
      level: block.type === 'h2' ? 2 : 3,
    })
  }
  return items
}

/** Assign stable heading ids while rendering (same order as extractNoteToc). */
export function withHeadingIds(blocks: NoteBlock[]): Array<NoteBlock & { id?: string }> {
  const used = new Set<string>()
  return blocks.map((block) => {
    if (block.type === 'h2' || block.type === 'h3') {
      return { ...block, id: headingId(block.text, used) }
    }
    return block
  })
}

/** Flatten block text for search indexing. */
export function flattenNoteBody(body: NoteBlock[] | string[]): string {
  const blocks = resolveNoteBody(body)
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'p':
        case 'h2':
        case 'h3':
        case 'callout':
        case 'quote':
          return block.text
        case 'ul':
        case 'ol':
          return block.items.join(' ')
        case 'code':
          return block.code
        default:
          return ''
      }
    })
    .join(' ')
}

export function sortNotes(list: Note[], sort: NotesSort, lang: 'sk' | 'en'): Note[] {
  const copy = [...list]
  switch (sort) {
    case 'reading':
      return copy.sort((a, b) => a.readingMinutes - b.readingMinutes || (a.date < b.date ? 1 : -1))
    case 'az':
      return copy.sort((a, b) => a.title[lang].localeCompare(b.title[lang], lang))
    default:
      return copy.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  }
}

export function getFeaturedNote(list: Note[]): Note | undefined {
  return list.find((note) => note.featured) ?? list[0]
}

/** Build bilingual rich body from parallel section recipes. */
export function buildBilingualBody(sections: { sk: NoteBlock[]; en: NoteBlock[] }): {
  sk: NoteBlock[]
  en: NoteBlock[]
} {
  return sections
}

export const nb = {
  p: (text: string): NoteBlock => ({ type: 'p', text }),
  h2: (text: string): NoteBlock => ({ type: 'h2', text }),
  h3: (text: string): NoteBlock => ({ type: 'h3', text }),
  ul: (items: string[]): NoteBlock => ({ type: 'ul', items }),
  ol: (items: string[]): NoteBlock => ({ type: 'ol', items }),
  code: (code: string, lang?: string): NoteBlock => ({ type: 'code', code, lang }),
  callout: (text: string, tone: 'info' | 'tip' | 'warn' = 'tip'): NoteBlock => ({
    type: 'callout',
    text,
    tone,
  }),
  quote: (text: string, cite?: string): NoteBlock => ({ type: 'quote', text, cite }),
}
