import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProfilePhoto } from './ProfilePhoto'

const meta = {
  title: 'UI/ProfilePhoto',
  component: ProfilePhoto,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProfilePhoto>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'h-24 w-24 overflow-hidden rounded-[18px] border border-border shadow-sm',
  },
}

export const Large: Story = {
  args: {
    className: 'h-40 w-40 overflow-hidden rounded-[28px] border border-border shadow-md',
    priority: true,
  },
}

export const Circle: Story = {
  args: {
    className: 'h-20 w-20 overflow-hidden rounded-full border border-border',
  },
}
