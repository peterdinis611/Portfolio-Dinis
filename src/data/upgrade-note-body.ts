import type { NoteBlock, NoteCoverId } from '@/lib/note-blocks'
import { resolveNoteBody } from '@/lib/note-blocks'

export type NoteExtras = {
  callout?: string
  list?: string[]
  code?: { code: string; lang?: string }
  quote?: string
  quoteCite?: string
}

/** Split flat paragraphs into headed sections + optional rich extras. */
export function structureParagraphs(
  paragraphs: string[],
  headings: string[],
  extras?: NoteExtras,
): NoteBlock[] {
  if (paragraphs.length === 0) return []

  // Already rich? resolveNoteBody handles, but we only get strings here.
  const titles = headings.length > 0 ? headings : ['Overview']
  const chunk = Math.max(1, Math.ceil(paragraphs.length / titles.length))
  const blocks: NoteBlock[] = []

  titles.forEach((heading, index) => {
    blocks.push({ type: 'h2', text: heading })
    const slice = paragraphs.slice(index * chunk, (index + 1) * chunk)
    for (const text of slice) {
      blocks.push({ type: 'p', text })
    }

    if (index === 0 && extras?.list?.length) {
      blocks.push({ type: 'ul', items: extras.list })
    }
    if (index === Math.min(1, titles.length - 1) && extras?.code) {
      blocks.push({ type: 'code', code: extras.code.code, lang: extras.code.lang })
    }
  })

  if (extras?.quote) {
    blocks.push({ type: 'quote', text: extras.quote, cite: extras.quoteCite })
  }
  if (extras?.callout) {
    blocks.push({ type: 'callout', text: extras.callout, tone: 'tip' })
  }

  return blocks
}

export function upgradeBody(
  body: { sk: string[] | NoteBlock[]; en: string[] | NoteBlock[] },
  outline?: { sk: string[]; en: string[] },
  extras?: { sk?: NoteExtras; en?: NoteExtras },
): { sk: NoteBlock[]; en: NoteBlock[] } {
  const skResolved = resolveNoteBody(body.sk)
  const enResolved = resolveNoteBody(body.en)

  const skIsPlain = body.sk.length > 0 && typeof body.sk[0] === 'string'
  const enIsPlain = body.en.length > 0 && typeof body.en[0] === 'string'

  return {
    sk: skIsPlain
      ? structureParagraphs(body.sk as string[], outline?.sk ?? [], extras?.sk)
      : skResolved,
    en: enIsPlain
      ? structureParagraphs(body.en as string[], outline?.en ?? [], extras?.en)
      : enResolved,
  }
}

export type NoteDraft = {
  id: string
  icon: string
  date: string
  readingMinutes: number
  tags: string[]
  title: { sk: string; en: string }
  summary: { sk: string; en: string }
  body: { sk: string[] | NoteBlock[]; en: string[] | NoteBlock[] }
  featured?: boolean
  cover?: NoteCoverId
  accent?: string
  outline?: { sk: string[]; en: string[] }
  extras?: { sk?: NoteExtras; en?: NoteExtras }
}
