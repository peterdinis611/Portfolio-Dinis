import { AnimatePresence, motion } from 'framer-motion'
import type { Lang } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { hasNotionContent } from '@/lib/notion-recordmaps'
import { NotionRendererPage } from './NotionRendererPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TechPage } from './pages/TechPage'
import type { NotionPageId } from './types'

const EASE = [0.32, 0.72, 0, 1] as const

type NotionPageViewProps = {
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

export function NotionPageView({ lang, route, darkMode }: NotionPageViewProps) {
  const { page, projectId, projectList, attemptedPath } = route
  const useNotionRenderer =
    page !== 'not-found' && hasNotionContent(page) && !projectId && !projectList

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${lang}-${page}-${projectId ?? 'root'}-${projectList ?? ''}-${attemptedPath ?? ''}-${useNotionRenderer ? 'notion' : 'fallback'}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: EASE }}
      >
        {useNotionRenderer ? (
          <NotionRendererPage page={page as NotionPageId} darkMode={darkMode} />
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
