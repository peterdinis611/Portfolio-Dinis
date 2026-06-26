import { AnimatePresence, motion } from 'framer-motion'
import type { Lang } from '@/i18n/translations'
import { hasNotionContent } from '@/lib/notion-recordmaps'
import { NotionRendererPage } from './NotionRendererPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TechPage } from './pages/TechPage'
import type { NotionPageId } from './types'

const EASE = [0.32, 0.72, 0, 1] as const

type NotionPageViewProps = {
  lang: Lang
  page: NotionPageId
  darkMode: boolean
}

function FallbackPage({ lang, page }: { lang: Lang; page: NotionPageId }) {
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

export function NotionPageView({ lang, page, darkMode }: NotionPageViewProps) {
  const useNotionRenderer = hasNotionContent(page)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${lang}-${page}-${useNotionRenderer ? 'notion' : 'fallback'}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: EASE }}
      >
        {useNotionRenderer ? (
          <NotionRendererPage page={page} darkMode={darkMode} />
        ) : (
          <FallbackPage lang={lang} page={page} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
