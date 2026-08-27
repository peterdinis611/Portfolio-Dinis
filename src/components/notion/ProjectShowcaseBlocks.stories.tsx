import type { Meta, StoryObj } from '@storybook/react-vite'
import { caseStudyUi } from '@/i18n/portfolio-template'
import { ProjectShowcaseBlocks } from './ProjectShowcaseBlocks'

const labels = {
  impactTitle: caseStudyUi.en.impactTitle,
  mediaTitle: caseStudyUi.en.mediaTitle,
  mediaTitleAnonymized: caseStudyUi.en.mediaTitleAnonymized,
  anonymizedNote: caseStudyUi.en.anonymizedNote,
  roleOutcomeTitle: caseStudyUi.en.roleOutcomeTitle,
  architectureTitle: caseStudyUi.en.architectureTitle,
  beforeAfterTitle: caseStudyUi.en.beforeAfterTitle,
  beforeLabel: caseStudyUi.en.beforeLabel,
  afterLabel: caseStudyUi.en.afterLabel,
  demoTitle: caseStudyUi.en.demoTitle,
  openLiveDemo: caseStudyUi.en.openLiveDemo,
  viewSource: caseStudyUi.en.viewSource,
  tryLive: caseStudyUi.en.tryLive,
  hideLive: caseStudyUi.en.hideLive,
}

const meta = {
  title: 'Notion/ProjectShowcaseBlocks',
  component: ProjectShowcaseBlocks,
  args: {
    lang: 'en' as const,
    labels,
    compact: false,
  },
  argTypes: {
    projectId: {
      control: 'select',
      options: ['docu-nest', 'scribe-notes', 'boom-scope', 'pulse-apiclient', 'spst-kniznica'],
    },
    lang: {
      control: 'select',
      options: ['en', 'sk'],
    },
    compact: { control: 'boolean' },
  },
} satisfies Meta<typeof ProjectShowcaseBlocks>

export default meta
type Story = StoryObj<typeof meta>

export const BoomScope: Story = {
  args: {
    projectId: 'boom-scope',
    projectName: 'Boom Scope',
  },
}

export const DocuNest: Story = {
  args: {
    projectId: 'docu-nest',
    projectName: 'Docu-Nest',
  },
}

export const Compact: Story = {
  args: {
    projectId: 'spst-kniznica',
    projectName: 'SPST Knižnica',
    compact: true,
  },
}

export const Slovak: Story = {
  args: {
    projectId: 'pulse-apiclient',
    projectName: 'Pulse API Client',
    lang: 'sk',
    labels: {
      impactTitle: caseStudyUi.sk.impactTitle,
      mediaTitle: caseStudyUi.sk.mediaTitle,
      mediaTitleAnonymized: caseStudyUi.sk.mediaTitleAnonymized,
      anonymizedNote: caseStudyUi.sk.anonymizedNote,
      roleOutcomeTitle: caseStudyUi.sk.roleOutcomeTitle,
      architectureTitle: caseStudyUi.sk.architectureTitle,
      beforeAfterTitle: caseStudyUi.sk.beforeAfterTitle,
      beforeLabel: caseStudyUi.sk.beforeLabel,
      afterLabel: caseStudyUi.sk.afterLabel,
      demoTitle: caseStudyUi.sk.demoTitle,
      openLiveDemo: caseStudyUi.sk.openLiveDemo,
      viewSource: caseStudyUi.sk.viewSource,
      tryLive: caseStudyUi.sk.tryLive,
      hideLive: caseStudyUi.sk.hideLive,
    },
  },
}
