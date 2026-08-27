import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageCover } from './PageCover'

const meta = {
  title: 'Notion/PageCover',
  component: PageCover,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['about', 'tech', 'experience', 'projects', 'contact'],
    },
    projectId: {
      control: 'select',
      options: [
        undefined,
        'docu-nest',
        'scribe-notes',
        'boom-scope',
        'pulse-apiclient',
        'spst-kniznica',
      ],
    },
  },
} satisfies Meta<typeof PageCover>

export default meta
type Story = StoryObj<typeof meta>

export const About: Story = {
  args: { variant: 'about' },
}

export const Projects: Story = {
  args: { variant: 'projects' },
}

export const Experience: Story = {
  args: { variant: 'experience' },
}

export const ProjectDetail: Story = {
  args: { projectId: 'boom-scope' },
}

export const AllVariants: Story = {
  args: { variant: 'about' },
  render: () => (
    <div className="space-y-4 bg-background p-4">
      {(['about', 'tech', 'experience', 'projects', 'contact'] as const).map((variant) => (
        <div key={variant}>
          <p className="mb-1 text-[12px] font-medium text-muted-foreground">{variant}</p>
          <PageCover variant={variant} />
        </div>
      ))}
    </div>
  ),
}
