import { AnimatePresence, motion } from 'framer-motion'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import type { Lang } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { MOTION_EASE } from './motion'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { CvPage } from './pages/CvPage'
import { ErrorPage } from './pages/ErrorPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { NoteDetailPage } from './pages/NoteDetailPage'
import { NotesPage } from './pages/NotesPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TechPage } from './pages/TechPage'

type NotionPageViewProps = {
  lang: Lang
  route: PortfolioRoute
}

function FallbackPage({
  lang,
  page,
  projectId,
  projectList,
  noteId,
  attemptedPath,
}: {
  lang: Lang
  page: PortfolioRoute['page']
  projectId?: string
  projectList?: PortfolioRoute['projectList']
  noteId?: string
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

  if (page === 'notes' && noteId) {
    return <NoteDetailPage lang={lang} noteId={noteId} />
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
    case 'notes':
      return <NotesPage lang={lang} />
    case 'cv':
      return <CvPage lang={lang} />
    case 'contact':
      return <ContactPage lang={lang} />
  }
}

export function NotionPageView({ lang, route }: NotionPageViewProps) {
  const { page, projectId, projectList, noteId, attemptedPath } = route
  const reduce = useMotionDisabled()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${lang}-${page}-${projectId ?? 'root'}-${projectList ?? ''}-${noteId ?? ''}-${attemptedPath ?? ''}`}
        initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={reduce ? undefined : { opacity: 0, y: -10, filter: 'blur(3px)' }}
        transition={{ duration: reduce ? 0 : 0.38, ease: MOTION_EASE }}
      >
        <FallbackPage
          lang={lang}
          page={page}
          projectId={projectId}
          projectList={projectList}
          noteId={noteId}
          attemptedPath={attemptedPath}
        />
      </motion.div>
    </AnimatePresence>
  )
}
