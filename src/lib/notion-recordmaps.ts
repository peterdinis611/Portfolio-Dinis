import type { ExtendedRecordMap } from 'notion-types'
import type { NotionPageId } from '@/components/notion/types'

const recordMapModules = import.meta.glob<{ default: ExtendedRecordMap }>(
  '../../data/notion/recordmaps/*.json',
  { eager: true },
)

function fileKey(page: NotionPageId): string {
  return `../../data/notion/recordmaps/${page}.json`
}

export function getRecordMap(page: NotionPageId): ExtendedRecordMap | null {
  const mod = recordMapModules[fileKey(page)]
  return mod?.default ?? null
}

export function hasNotionContent(page: NotionPageId): boolean {
  return getRecordMap(page) !== null
}

export function listSyncedPages(): NotionPageId[] {
  return Object.keys(recordMapModules)
    .map((path) => path.match(/\/([^.]+)\.json$/)?.[1])
    .filter((id): id is NotionPageId =>
      ['about', 'tech', 'experience', 'projects', 'contact'].includes(id ?? ''),
    )
}
