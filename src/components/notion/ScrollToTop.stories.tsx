import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollToTop } from './ScrollToTop'

const meta = {
  title: 'Shell/ScrollToTop',
  component: ScrollToTop,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    lang: 'en',
    targetId: 'story-scroll-pane',
  },
  decorators: [
    (Story) => (
      <div className="relative h-[480px]">
        <div
          id="story-scroll-pane"
          className="h-full overflow-y-auto border border-border bg-background p-6"
        >
          <p className="mb-4 text-sm text-muted-foreground">
            Scroll down to reveal the floating button.
          </p>
          {Array.from({ length: 40 }, (_, index) => `row-${index + 1}`).map((id, index) => (
            <p key={id} className="mb-3 text-[15px] leading-relaxed text-foreground">
              Portfolio section placeholder #{index + 1}. Keep scrolling past 320px.
            </p>
          ))}
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollToTop>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Slovak: Story = {
  args: { lang: 'sk' },
}
