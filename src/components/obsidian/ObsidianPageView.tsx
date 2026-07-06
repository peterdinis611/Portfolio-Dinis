import { AnimatePresence, motion } from 'framer-motion'
import type { Lang } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { hasSyncedContent } from '@/lib/obsidian-recordmaps'
import { ObsidianRendererPage } from './ObsidianRendererPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { ErrorPage } from './pages/ErrorPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TechPage } from './pages/TechPage'
import type { ObsidianPageId } from './types'

const EASE = [0.32, 0.72, 0, 1] as const

type ObsidianPageViewProps = {
  lang: Lang
  route: PortfolioRoute
  darkMode: boolean
}

function FallbackPage({
  lang,
  page,
  projectId,
  projectList,
  attemptedPath,
}: {
  lang: Lang
  page: PortfolioRoute['page']
  projectId?: string
  projectList?: PortfolioRoute['projectList']
  attemptedPath?: string
}) {
  if (page === 'not-found') {
    return <NotFoundPage lang={lang} attemptedPath={attemptedPath} />
  }

  if (page === 'error') {
    return <ErrorPage lang={lang} demo />
  }

  if (page === 'projects' && projectId) {
    return <ProjectDetailPage lang={lang} projectId={projectId} />
  }

  switch (page) {
    case 'about':
      return <AboutPage lang={lang} />
    case 'tech':
      return <TechPage lang={lang} />
    case 'experience':
      return <ExperiencePage lang={lang} />
    case 'projects':
      return <ProjectsPage lang={lang} projectList={projectList} />
    case 'contact':
      return <ContactPage lang={lang} />
  }
}

export function ObsidianPageView({ lang, route, darkMode }: ObsidianPageViewProps) {
  const { page, projectId, projectList, attemptedPath } = route
  const useSyncedRenderer =
    page !== 'not-found' &&
    page !== 'error' &&
    hasSyncedContent(page) &&
    !projectId &&
    !projectList

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${lang}-${page}-${projectId ?? 'root'}-${projectList ?? ''}-${attemptedPath ?? ''}-${useSyncedRenderer ? 'synced' : 'fallback'}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: EASE }}
      >
        {useSyncedRenderer ? (
          <ObsidianRendererPage page={page as ObsidianPageId} darkMode={darkMode} />
        ) : (
          <FallbackPage
            lang={lang}
            page={page}
            projectId={projectId}
            projectList={projectList}
            attemptedPath={attemptedPath}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
