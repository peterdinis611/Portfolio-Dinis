import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './spinner'

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

export const OnMuted: Story = {
  render: () => (
    <div className="rounded-lg bg-muted px-8 py-6">
      <Spinner size="lg" label="Loading" />
    </div>
  ),
}
