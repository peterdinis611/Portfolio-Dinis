import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailDisplay } from './EmailDisplay'
import { ExternalLink } from './ExternalLink'
import { MailtoLink } from './MailtoLink'

const meta = {
  title: 'UI/Links',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Email: Story = {
  render: () => (
    <div className="space-y-3 text-[15px]">
      <p>
        Display: <EmailDisplay className="font-medium" />
      </p>
      <p>
        Mailto:{' '}
        <MailtoLink className="text-primary underline">
          <EmailDisplay />
        </MailtoLink>
      </p>
    </div>
  ),
}

export const External: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-[15px]">
      <ExternalLink href="https://github.com/peterdinis" className="text-primary underline">
        GitHub
      </ExternalLink>
      <ExternalLink
        href="https://www.linkedin.com/in/peter-dinis-58520b214/"
        className="text-primary underline"
      >
        LinkedIn
      </ExternalLink>
    </div>
  ),
}
