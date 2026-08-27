import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './separator'

const meta = {
  title: 'UI/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <p className="text-sm text-muted-foreground">Above</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Below</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-3">
      <span className="text-sm">SK</span>
      <Separator orientation="vertical" />
      <span className="text-sm">EN</span>
    </div>
  ),
}
