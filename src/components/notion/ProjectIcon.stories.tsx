import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectIcon } from './ProjectIcon'

const meta = {
  title: 'Notion/ProjectIcon',
  component: ProjectIcon,
  args: {
    projectId: 'boom-scope',
    size: 'md',
  },
  argTypes: {
    projectId: {
      control: 'select',
      options: ['docu-nest', 'scribe-notes', 'boom-scope', 'pulse-apiclient', 'spst-kniznica'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof ProjectIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Large: Story = {
  args: { size: 'lg' },
}

export const AllProjects: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      {(
        ['docu-nest', 'scribe-notes', 'boom-scope', 'pulse-apiclient', 'spst-kniznica'] as const
      ).map((id) => (
        <div key={id} className="flex flex-col items-center gap-1.5">
          <ProjectIcon projectId={id} size="md" />
          <span className="text-[11px] text-muted-foreground">{id}</span>
        </div>
      ))}
    </div>
  ),
}
