import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrandIcon } from './BrandIcon'

const meta = {
  title: 'Icons/BrandIcon',
  component: BrandIcon,
  args: {
    slug: 'react',
    label: 'React',
    className: 'h-8 w-8',
  },
  argTypes: {
    slug: {
      control: 'select',
      options: [
        'react',
        'typescript',
        'nextdotjs',
        'nodedotjs',
        'nestjs',
        'postgresql',
        'docker',
        'github',
      ],
    },
  },
} satisfies Meta<typeof BrandIcon>

export default meta
type Story = StoryObj<typeof meta>

export const React: Story = {}

export const Stack: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {[
        'react',
        'typescript',
        'nextdotjs',
        'nodedotjs',
        'nestjs',
        'postgresql',
        'docker',
        'github',
      ].map((slug) => (
        <div key={slug} className="flex flex-col items-center gap-1.5">
          <BrandIcon slug={slug} className="h-8 w-8" label={slug} />
          <span className="text-[11px] text-muted-foreground">{slug}</span>
        </div>
      ))}
    </div>
  ),
}
