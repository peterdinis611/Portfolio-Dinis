import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BlockBookmark,
  BlockCalloutRich,
  BlockCode,
  BlockGallery,
  BlockHighlight,
  BlockPageLink,
  BlockQuote,
  BlockTableOfContents,
  BlockTodoList,
  BlockToggle,
} from './notion-blocks'
import { ProjectIcon } from './ProjectIcon'

const meta = {
  title: 'Notion/NotionBlocks',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Quote: Story = {
  render: () => (
    <BlockQuote>
      A good product is not just code — clear UX, reliable architecture, and team delivery.
    </BlockQuote>
  ),
}

export const Highlights: Story = {
  render: () => (
    <p className="text-[16px] leading-[1.5]">
      Switch between <BlockHighlight tone="yellow">gallery</BlockHighlight> and{' '}
      <BlockHighlight tone="blue">table</BlockHighlight> views, or keep a{' '}
      <BlockHighlight tone="pink">focus</BlockHighlight> note in{' '}
      <BlockHighlight tone="gray">gray</BlockHighlight>.
    </p>
  ),
}

export const Code: Story = {
  render: () => (
    <BlockCode
      language="TypeScript"
      code={`export const createProject = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return await ctx.db.insert('projects', { name, createdAt: Date.now() })
  },
})`}
    />
  ),
}

export const Toggle: Story = {
  render: () => (
    <BlockToggle title="Technical notes" defaultOpen>
      <p>Stack decisions, trade-offs, and follow-up ideas live here.</p>
      <BlockCalloutRich variant="info" title="Tip">
        Keep notes short — one idea per toggle.
      </BlockCalloutRich>
    </BlockToggle>
  ),
}

export const BookmarkAndLinks: Story = {
  render: () => (
    <div className="max-w-xl space-y-2">
      <BlockBookmark
        href="https://github.com/peterdinis611/Boom-Scope"
        title="Source code"
        description="Boom Scope"
        external
      />
      <BlockBookmark
        href="https://boom-scope.vercel.app"
        title="Live demo"
        description="Boom Scope"
        external
      />
      <div className="flex flex-wrap gap-2 pt-2">
        <BlockPageLink href="#about" icon="👋" label="About" />
        <BlockPageLink href="#projects" icon="🚀" label="Projects" />
        <BlockPageLink href="#contact" icon="✉️" label="Contact" />
      </div>
    </div>
  ),
}

export const TableOfContents: Story = {
  render: () => (
    <BlockTableOfContents
      title="On this page"
      items={[
        { id: 'cs-preview', label: 'Preview' },
        { id: 'cs-problem', label: 'Problem' },
        { id: 'cs-solution', label: 'Solution' },
        { id: 'cs-features', label: 'Features' },
      ]}
    />
  ),
}

export const TodoList: Story = {
  render: () => (
    <BlockTodoList
      items={[
        { text: 'Understand product and team context', done: true },
        { text: 'Design solution and split into iterations', done: true },
        { text: 'Ship code with tests and docs', done: true },
        { text: 'Mentor and share know-how', done: false },
      ]}
    />
  ),
}

export const Gallery: Story = {
  render: () => (
    <BlockGallery
      items={[
        {
          id: 'boom-scope',
          href: '#projects/boom-scope',
          icon: <ProjectIcon projectId="boom-scope" size="md" />,
          title: 'Boom Scope',
          subtitle: 'Design workspace with AI and real-time Convex backend.',
          tags: ['SIDE PROJECT', 'Next.js', 'Convex', 'TipTap'],
        },
        {
          id: 'docu-nest',
          href: '#projects/docu-nest',
          icon: <ProjectIcon projectId="docu-nest" size="md" />,
          title: 'Docu-Nest',
          subtitle: 'AI-powered notebook platform with Clerk and Drizzle.',
          tags: ['SIDE PROJECT', 'Next.js', 'Drizzle', 'XState'],
        },
        {
          id: 'pulse-apiclient',
          href: '#projects/pulse-apiclient',
          icon: <ProjectIcon projectId="pulse-apiclient" size="md" />,
          title: 'Pulse API Client',
          subtitle: 'Postman-style desktop client in Tauri + Rust.',
          tags: ['DESKTOP APP', 'Tauri', 'Rust'],
        },
      ]}
    />
  ),
}

export const Callouts: Story = {
  render: () => (
    <div className="max-w-xl space-y-2">
      <BlockCalloutRich variant="default" title="Note">
        Default callout for general context.
      </BlockCalloutRich>
      <BlockCalloutRich variant="info" title="Info">
        Useful when linking to related pages.
      </BlockCalloutRich>
      <BlockCalloutRich variant="success" title="Done">
        Feature shipped and verified.
      </BlockCalloutRich>
      <BlockCalloutRich variant="warning" title="Watch out">
        NDA-bound details stay anonymized.
      </BlockCalloutRich>
      <BlockCalloutRich variant="idea" title="Idea">
        Try a gallery-first projects overview.
      </BlockCalloutRich>
    </div>
  ),
}
