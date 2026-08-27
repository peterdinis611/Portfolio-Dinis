import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { NotionSidebar } from './NotionSidebar'
import { NotionTopbar } from './NotionTopbar'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TechPage } from './pages/TechPage'
import { ScrollToTop } from './ScrollToTop'

function PortfolioShell({
  lang = 'en',
  theme = 'light',
  route = { page: 'about' },
}: {
  lang?: 'en' | 'sk'
  theme?: 'light' | 'dark'
  route?: PortfolioRoute
}) {
  const page =
    route.page === 'projects' && route.projectId ? (
      <ProjectDetailPage lang={lang} projectId={route.projectId} />
    ) : route.page === 'projects' ? (
      <ProjectsPage lang={lang} projectList={route.projectList} />
    ) : route.page === 'tech' ? (
      <TechPage lang={lang} />
    ) : route.page === 'experience' ? (
      <ExperiencePage lang={lang} />
    ) : route.page === 'contact' ? (
      <ContactPage lang={lang} />
    ) : (
      <AboutPage lang={lang} />
    )

  return (
    <div className="notion-app-shell flex h-[720px] overflow-hidden border border-border bg-background">
      <div className="hidden w-[260px] shrink-0 overflow-hidden border-r border-sidebar-border md:block">
        <NotionSidebar
          lang={lang}
          route={route}
          onNavigate={fn()}
          onOpenSearch={fn()}
          onCollapse={fn()}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <NotionTopbar
          lang={lang}
          theme={theme}
          route={route}
          onMenu={fn()}
          onOpenSearch={fn()}
          onLang={fn()}
          onTheme={fn()}
        />
        <main className="notion-page-pane relative flex-1 overflow-y-auto" id="main-content">
          <div className="mx-auto max-w-[720px] px-4 py-6 sm:px-8">{page}</div>
          <ScrollToTop lang={lang} />
        </main>
      </div>
    </div>
  )
}

const meta = {
  title: 'Shell/PortfolioApp',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const About: Story = {
  render: () => <PortfolioShell route={{ page: 'about' }} />,
}

export const Tech: Story = {
  render: () => <PortfolioShell route={{ page: 'tech' }} />,
}

export const Experience: Story = {
  render: () => <PortfolioShell route={{ page: 'experience' }} />,
}

export const Projects: Story = {
  render: () => <PortfolioShell route={{ page: 'projects' }} />,
}

export const ProjectDetail: Story = {
  render: () => <PortfolioShell route={{ page: 'projects', projectId: 'boom-scope' }} />,
}

export const Contact: Story = {
  render: () => <PortfolioShell route={{ page: 'contact' }} />,
}

export const SlovakDark: Story = {
  render: () => <PortfolioShell lang="sk" theme="dark" route={{ page: 'about' }} />,
}
