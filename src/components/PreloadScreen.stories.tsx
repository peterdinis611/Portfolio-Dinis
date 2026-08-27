import type { Meta, StoryObj } from '@storybook/react-vite'
import { PreloadScreen } from './PreloadScreen'

const meta = {
  title: 'Chrome/PreloadScreen',
  component: PreloadScreen,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    progress: 0.42,
  },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  },
} satisfies Meta<typeof PreloadScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {}

export const AlmostDone: Story = {
  args: { progress: 0.92 },
}

export const Done: Story = {
  args: { progress: 1 },
}

export const Indeterminate: Story = {
  args: { progress: 0 },
}
