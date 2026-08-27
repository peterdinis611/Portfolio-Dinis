import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { projects } from '@/data/portfolio'
import { ProjectDetailPage } from './ProjectDetailPage'

const pageDecorator: Decorator = (Story) => (
  <div className="mx-auto min-h-[100dvh] max-w-[720px] bg-[var(--editor-surface)] px-4 py-6 sm:px-8">
    <Story />
  </div>
)

const meta = {
  title: 'Pages/ProjectDetail',
  component: ProjectDetailPage,
  parameters: { layout: 'fullscreen' },
  decorators: [pageDecorator],
  args: {
    lang: 'en',
    projectId: 'boom-scope',
  },
  argTypes: {
    lang: { control: 'select', options: ['en', 'sk'] },
    projectId: {
      control: 'select',
      options: projects.map((project) => project.id),
    },
  },
} satisfies Meta<typeof ProjectDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const BoomScope: Story = {}

export const DocuNest: Story = {
  args: { projectId: 'docu-nest' },
}

export const ScribeNotes: Story = {
  args: { projectId: 'scribe-notes' },
}

export const PulseApiClient: Story = {
  args: { projectId: 'pulse-apiclient' },
}

export const SpstKniznica: Story = {
  args: { projectId: 'spst-kniznica' },
}

export const Slovak: Story = {
  args: { lang: 'sk', projectId: 'boom-scope' },
}

export const NotFound: Story = {
  args: { projectId: 'missing-project' },
}
