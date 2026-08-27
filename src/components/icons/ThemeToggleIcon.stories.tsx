import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeToggleIcon } from './ThemeToggleIcon'

const meta = {
  title: 'Icons/ThemeToggleIcon',
  component: ThemeToggleIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
} satisfies Meta<typeof ThemeToggleIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = {
  args: { theme: 'light' },
}

export const Dark: Story = {
  args: { theme: 'dark' },
}

export const Both: Story = {
  args: { theme: 'light' },
  render: () => (
    <div className="flex items-center gap-6 text-foreground">
      <div className="flex flex-col items-center gap-2">
        <ThemeToggleIcon theme="light" />
        <span className="text-[11px] text-muted-foreground">light → moon</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggleIcon theme="dark" />
        <span className="text-[11px] text-muted-foreground">dark → sun</span>
      </div>
    </div>
  ),
}
