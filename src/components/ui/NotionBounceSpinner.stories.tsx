import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotionBounceSpinner } from './NotionBounceSpinner'

const meta = {
  title: 'UI/NotionBounceSpinner',
  component: NotionBounceSpinner,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NotionBounceSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

export const OnMuted: Story = {
  render: () => (
    <div className="rounded-lg bg-muted px-8 py-6">
      <NotionBounceSpinner size="lg" label="Loading" />
    </div>
  ),
}
