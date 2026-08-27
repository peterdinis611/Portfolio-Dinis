import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ErrorPage } from './ErrorPage'
import { createDemoPortfolioError } from './status-page-parts'

const pageDecorator: Decorator = (Story) => (
  <div className="mx-auto min-h-[100dvh] max-w-[720px] bg-[var(--editor-surface)] px-4 py-6 sm:px-8">
    <Story />
  </div>
)

const meta = {
  title: 'Pages/Error',
  component: ErrorPage,
  parameters: { layout: 'fullscreen' },
  decorators: [pageDecorator],
  args: {
    lang: 'en',
    onRetry: fn(),
  },
  argTypes: {
    lang: { control: 'select', options: ['en', 'sk'] },
  },
} satisfies Meta<typeof ErrorPage>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  args: { demo: true },
}

export const WithCustomError: Story = {
  args: {
    error: Object.assign(new Error('Failed to render ProjectDetailPage'), {
      componentStack: createDemoPortfolioError().componentStack,
    }),
  },
}

export const Slovak: Story = {
  args: { lang: 'sk', demo: true },
}
