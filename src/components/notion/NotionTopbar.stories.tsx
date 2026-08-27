import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { NotionTopbar } from './NotionTopbar'

const meta = {
  title: 'Shell/NotionTopbar',
  component: NotionTopbar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    lang: 'en',
    theme: 'light',
    route: { page: 'about' } satisfies PortfolioRoute,
    sidebarCollapsed: false,
    onMenu: fn(),
    onOpenSidebar: fn(),
    onOpenSearch: fn(),
    onLang: fn(),
    onTheme: fn(),
  },
  argTypes: {
    lang: { control: 'select', options: ['en', 'sk'] },
    theme: { control: 'select', options: ['light', 'dark'] },
  },
} satisfies Meta<typeof NotionTopbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SidebarCollapsed: Story = {
  args: {
    sidebarCollapsed: true,
  },
}

export const ProjectRoute: Story = {
  args: {
    route: { page: 'projects', projectId: 'docu-nest' },
  },
}

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    route: { page: 'tech' },
  },
}
