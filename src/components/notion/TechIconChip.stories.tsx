import type { Meta, StoryObj } from '@storybook/react-vite'
import { techCategories } from '@/data/technologies'
import { TechIconChip } from './TechIconChip'

const frontend = techCategories.find((c) => c.id === 'frontend')!.items
const backend = techCategories.find((c) => c.id === 'backend')!.items

const meta = {
  title: 'Notion/TechIconChip',
  component: TechIconChip,
  args: {
    item: frontend[5],
  },
} satisfies Meta<typeof TechIconChip>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {}

export const Frontend: Story = {
  args: { item: frontend[0] },
  render: () => (
    <ul className="flex flex-wrap gap-2">
      {frontend.map((item) => (
        <TechIconChip key={item.id} item={item} />
      ))}
    </ul>
  ),
}

export const Backend: Story = {
  args: { item: backend[0] },
  render: () => (
    <ul className="flex flex-wrap gap-2">
      {backend.map((item) => (
        <TechIconChip key={item.id} item={item} />
      ))}
    </ul>
  ),
}
