import { AnimatePresence, motion } from 'framer-motion'
import type { Lang } from '@/i18n/translations'
import { hasNotionContent } from '@/lib/notion-recordmaps'
import { NotionRendererPage } from './NotionRendererPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TechPage } from './pages/TechPage'
import type { NotionPageId } from './types'

const EASE = [0.32, 0.72, 0, 1] as const

type NotionPageViewProps = {
  lang: Lang
  page: NotionPageId
  projectId?: string
  darkMode: boolean
}

function FallbackPage({
  lang,
  page,
  projectId,
}: {
  lang: Lang
  page: NotionPageId
  projectId?: string
}) {
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
      return <ProjectsPage lang={lang} />
    case 'contact':
      return <ContactPage lang={lang} />
  }
}

export function NotionPageView({ lang, page, projectId, darkMode }: NotionPageViewProps) {
  const useNotionRenderer = hasNotionContent(page) && !projectId

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${lang}-${page}-${projectId ?? 'root'}-${useNotionRenderer ? 'notion' : 'fallback'}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: EASE }}
      >
        {useNotionRenderer ? (
          <NotionRendererPage page={page} darkMode={darkMode} />
        ) : (
          <FallbackPage lang={lang} page={page} projectId={projectId} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
