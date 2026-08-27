import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { NotFoundPage } from './NotFoundPage'

const pageDecorator: Decorator = (Story) => (
  <div className="mx-auto min-h-[100dvh] max-w-[720px] bg-[var(--editor-surface)] px-4 py-6 sm:px-8">
    <Story />
  </div>
)

const meta = {
  title: 'Pages/NotFound',
  component: NotFoundPage,
  parameters: { layout: 'fullscreen' },
  decorators: [pageDecorator],
  args: {
    lang: 'en',
    attemptedPath: 'projects/legacy-udzs',
  },
  argTypes: {
    lang: { control: 'select', options: ['en', 'sk'] },
  },
} satisfies Meta<typeof NotFoundPage>

export default meta
type Story = StoryObj<typeof meta>

export const WithPath: Story = {}

export const WithoutPath: Story = {
  args: { attemptedPath: undefined },
}

export const Slovak: Story = {
  args: { lang: 'sk' },
}
