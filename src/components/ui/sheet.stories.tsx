import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { NotionSidebar } from '@/components/notion/NotionSidebar'
import { Button } from './button'
import { Sheet, SheetContent, SheetTrigger } from './sheet'

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const MobileSidebar: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div className="flex min-h-[360px] items-start p-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setOpen(true)}>Open mobile sidebar</Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <NotionSidebar
              lang="en"
              route={{ page: 'projects' }}
              onNavigate={fn()}
              onOpenSearch={fn()}
              className="w-full border-0"
            />
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}
