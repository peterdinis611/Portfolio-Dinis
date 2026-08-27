import type { Meta, StoryObj } from '@storybook/react-vite'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { NotionStatusBar } from './NotionStatusBar'

const meta = {
  title: 'Shell/NotionStatusBar',
  component: NotionStatusBar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    lang: 'en',
    theme: 'light',
    route: { page: 'about' } satisfies PortfolioRoute,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl border border-border">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    lang: { control: 'select', options: ['en', 'sk'] },
    theme: { control: 'select', options: ['light', 'dark'] },
  },
} satisfies Meta<typeof NotionStatusBar>

export default meta
type Story = StoryObj<typeof meta>

export const About: Story = {}

export const ProjectDetail: Story = {
  args: {
    route: { page: 'projects', projectId: 'boom-scope' },
  },
}

export const Dark: Story = {
  args: {
    theme: 'dark',
    route: { page: 'contact' },
  },
}
