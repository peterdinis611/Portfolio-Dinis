import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BlockBullets,
  BlockCallout,
  BlockDivider,
  BlockHeading,
  BlockText,
  NotionDatabase,
  PageTitle,
  PropertyRow,
  PropertyTable,
  StatGrid,
  TagList,
} from './blocks'
import { ProjectIcon } from './ProjectIcon'

const meta = {
  title: 'Notion/Blocks',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const PageTitleDefault: Story = {
  render: () => (
    <PageTitle
      icon="🚀"
      description="Personal and open-source projects — desktop apps, full-stack tools, and student products."
    >
      Projects
    </PageTitle>
  ),
}

export const PageTitleWithMeta: Story = {
  render: () => (
    <PageTitle
      icon={<ProjectIcon projectId="boom-scope" size="lg" />}
      meta={
        <span className="inline-flex rounded-[3px] bg-[rgba(105,64,165,0.16)] px-1.5 py-0.5 text-[12px] font-medium text-[#6940a5] dark:text-[#9a6dd7]">
          SIDE PROJECT
        </span>
      }
    >
      Boom Scope
    </PageTitle>
  ),
}

export const Stats: Story = {
  render: () => (
    <StatGrid
      items={[
        { value: 'AI', label: 'design generator' },
        { value: 'Live', label: 'Convex real-time' },
        { value: '1', label: 'workspace app' },
      ]}
    />
  ),
}

export const Tags: Story = {
  render: () => (
    <TagList tags={['React', 'TypeScript', 'Next.js', 'Tailwind', 'PostgreSQL', 'Docker']} />
  ),
}

export const Properties: Story = {
  render: () => (
    <PropertyTable>
      <PropertyRow label="Role">
        <TagList tags={['Full-Stack Developer']} />
      </PropertyRow>
      <PropertyRow label="Date">Jun 2026</PropertyRow>
      <PropertyRow label="Tools">
        <TagList tags={['Next.js', 'Convex', 'TipTap']} />
      </PropertyRow>
    </PropertyTable>
  ),
}

export const CalloutAndLists: Story = {
  render: () => (
    <div className="max-w-xl space-y-2">
      <BlockHeading>Solution</BlockHeading>
      <BlockText>
        Next.js dashboard with TipTap, Konva canvas, OpenAI generator, and Convex Auth.
      </BlockText>
      <BlockCallout icon="💡">Prefer short iterations and transparent delivery.</BlockCallout>
      <BlockBullets
        items={[
          'Projects, notes, and infinite canvas',
          'AI design system generation',
          'Pomodoro timer and dark mode',
        ]}
      />
      <BlockDivider />
      <BlockText className="text-muted-foreground">End of section</BlockText>
    </div>
  ),
}

export const Database: Story = {
  render: () => (
    <NotionDatabase
      columns={['Name', 'Type', 'Stack']}
      rows={[
        {
          id: 'boom-scope',
          href: '#projects/boom-scope',
          icon: <ProjectIcon projectId="boom-scope" size="sm" />,
          cells: ['Boom Scope', 'SIDE PROJECT', 'Next.js · Convex · TipTap'],
        },
        {
          id: 'docu-nest',
          href: '#projects/docu-nest',
          icon: <ProjectIcon projectId="docu-nest" size="sm" />,
          cells: ['Docu-Nest', 'SIDE PROJECT', 'Next.js · Drizzle · Clerk'],
        },
        {
          id: 'pulse-apiclient',
          href: '#projects/pulse-apiclient',
          icon: <ProjectIcon projectId="pulse-apiclient" size="sm" />,
          cells: ['Pulse API Client', 'DESKTOP APP', 'Tauri · React · Rust'],
        },
      ]}
    />
  ),
}
