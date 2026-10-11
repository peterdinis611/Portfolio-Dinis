import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'

const meta = {
  title: 'UI/Select',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj

export const NotionSort: Story = {
  render: () => (
    <Select defaultValue="newest">
      <SelectTrigger aria-label="Sort" className="min-w-[9.5rem]">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="reading">Reading time</SelectItem>
        <SelectItem value="az">A–Z</SelectItem>
      </SelectContent>
    </Select>
  ),
}
