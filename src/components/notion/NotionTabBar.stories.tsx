import type { Meta, StoryObj } from '@storybook/react-vite'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { NotionTabBar } from './NotionTabBar'

const meta = {
  title: 'Shell/NotionTabBar',
  component: NotionTabBar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    route: { page: 'about' } satisfies PortfolioRoute,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl border border-border bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotionTabBar>

export default meta
type Story = StoryObj<typeof meta>

export const About: Story = {}

export const ProjectFile: Story = {
  args: {
    route: { page: 'projects', projectId: 'scribe-notes' },
  },
}
