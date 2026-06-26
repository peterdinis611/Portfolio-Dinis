import type { ExtendedRecordMap } from 'notion-types'
import { lazy, Suspense, useMemo } from 'react'
import { NotionRenderer } from 'react-notion-x'
import { getRecordMap } from '@/lib/notion-recordmaps'
import { cn } from '@/lib/utils'
import type { NotionPageId } from './types'

const Code = lazy(() =>
  import('react-notion-x/third-party/code').then((m) => ({ default: m.Code })),
)
const Collection = lazy(() =>
  import('react-notion-x/third-party/collection').then((m) => ({ default: m.Collection })),
)
const Equation = lazy(() =>
  import('react-notion-x/third-party/equation').then((m) => ({ default: m.Equation })),
)
const Modal = lazy(() =>
  import('react-notion-x/third-party/modal').then((m) => ({ default: m.Modal })),
)
const Pdf = lazy(() => import('react-notion-x/third-party/pdf').then((m) => ({ default: m.Pdf })))

type NotionRendererPageProps = {
  page: NotionPageId
  darkMode: boolean
  recordMap?: ExtendedRecordMap | null
}

export function NotionRendererPage({ page, darkMode, recordMap }: NotionRendererPageProps) {
  const map = useMemo(() => recordMap ?? getRecordMap(page), [page, recordMap])

  if (!map) return null

  return (
    <div className={cn('notion-page-content notion-renderer', darkMode && 'dark')}>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <NotionRenderer
          recordMap={map}
          fullPage={false}
          darkMode={darkMode}
          disableHeader
          components={{ Code, Collection, Equation, Modal, Pdf }}
        />
      </Suspense>
    </div>
  )
}
