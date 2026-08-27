import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from './scroll-area'

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-72 rounded-md border border-border p-3">
      <div className="space-y-2 pr-3 text-[13px] text-foreground">
        {Array.from({ length: 24 }, (_, index) => `row-${index + 1}`).map((id, index) => (
          <p key={id}>Sidebar row #{index + 1}</p>
        ))}
      </div>
    </ScrollArea>
  ),
}
