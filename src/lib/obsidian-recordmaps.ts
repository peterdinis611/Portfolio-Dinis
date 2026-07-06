import type { ExtendedRecordMap } from 'notion-types'
import type { ObsidianPageId } from '@/components/obsidian/types'

const recordMapModules = import.meta.glob<{ default: ExtendedRecordMap }>(
  '../../data/obsidian/recordmaps/*.json',
  { eager: true },
)

function fileKey(page: ObsidianPageId): string {
  return `../../data/obsidian/recordmaps/${page}.json`
}

export function getRecordMap(page: ObsidianPageId): ExtendedRecordMap | null {
  const mod = recordMapModules[fileKey(page)]
  return mod?.default ?? null
}

export function hasSyncedContent(page: ObsidianPageId): boolean {
  return getRecordMap(page) !== null
}

export function listSyncedPages(): ObsidianPageId[] {
  return Object.keys(recordMapModules)
    .map((path) => path.match(/\/([^.]+)\.json$/)?.[1])
    .filter((id): id is ObsidianPageId =>
      ['about', 'tech', 'experience', 'projects', 'contact'].includes(id ?? ''),
    )
}
