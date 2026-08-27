import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { NotionSidebar } from './NotionSidebar'

const meta = {
  title: 'Shell/NotionSidebar',
  component: NotionSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    lang: 'en',
    route: { page: 'about' } satisfies PortfolioRoute,
    onNavigate: fn(),
    onOpenSearch: fn(),
    onCollapse: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex h-[640px] w-[260px] border-r border-sidebar-border bg-sidebar">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    lang: { control: 'select', options: ['en', 'sk'] },
  },
} satisfies Meta<typeof NotionSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const About: Story = {}

export const ProjectsExpanded: Story = {
  args: {
    route: { page: 'projects' },
  },
}

export const ProjectDetail: Story = {
  args: {
    route: { page: 'projects', projectId: 'boom-scope' },
  },
}

export const Contact: Story = {
  args: {
    route: { page: 'contact' },
  },
}

export const Slovak: Story = {
  args: {
    lang: 'sk',
    route: { page: 'experience' },
  },
}
