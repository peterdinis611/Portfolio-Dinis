import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { AboutPage } from './AboutPage'

const pageDecorator: Decorator = (Story) => (
  <div className="mx-auto min-h-[100dvh] max-w-[720px] bg-[var(--editor-surface)] px-4 py-6 sm:px-8">
    <Story />
  </div>
)

const meta = {
  title: 'Pages/About',
  component: AboutPage,
  parameters: { layout: 'fullscreen' },
  decorators: [pageDecorator],
  args: { lang: 'en' },
  argTypes: {
    lang: { control: 'select', options: ['en', 'sk'] },
  },
} satisfies Meta<typeof AboutPage>

export default meta
type Story = StoryObj<typeof meta>

export const English: Story = {}

export const Slovak: Story = {
  args: { lang: 'sk' },
}
