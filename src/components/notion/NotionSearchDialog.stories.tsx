import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Button } from '@/components/ui/button'
import { NotionSearchDialog } from './NotionSearchDialog'

function SearchPlayground({
  lang,
  initialOpen = true,
}: {
  lang: 'en' | 'sk'
  initialOpen?: boolean
}) {
  const [open, setOpen] = useState(initialOpen)

  return (
    <div className="flex min-h-[240px] items-start justify-center p-8">
      <Button onClick={() => setOpen(true)}>Open search</Button>
      <NotionSearchDialog lang={lang} open={open} onOpenChange={setOpen} onNavigate={fn()} />
    </div>
  )
}

const meta = {
  title: 'Shell/NotionSearchDialog',
  component: NotionSearchDialog,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NotionSearchDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    lang: 'en',
    open: true,
    onOpenChange: fn(),
    onNavigate: fn(),
  },
  render: (args) => <SearchPlayground lang={args.lang} initialOpen />,
}

export const Slovak: Story = {
  args: {
    lang: 'sk',
    open: true,
    onOpenChange: fn(),
    onNavigate: fn(),
  },
  render: (args) => <SearchPlayground lang={args.lang} initialOpen />,
}
