import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ProjectIconTone } from '@/data/portfolio-meta'
import type { ProductPreviewVariant } from '@/data/project-showcase'
import { ProductPreview } from './ProductPreview'

const variants: Array<{
  variant: ProductPreviewVariant
  tone: ProjectIconTone
  title: string
  caption: string
}> = [
  {
    variant: 'notebooks',
    tone: 'blue',
    title: 'Docu-Nest',
    caption: 'AI notebooks · library · workspace',
  },
  {
    variant: 'notes',
    tone: 'yellow',
    title: 'Scribe Notes',
    caption: 'Desktop editor · slash commands',
  },
  {
    variant: 'canvas',
    tone: 'purple',
    title: 'Boom Scope',
    caption: 'Infinite canvas · design workspace',
  },
  {
    variant: 'api',
    tone: 'orange',
    title: 'Pulse API Client',
    caption: 'HTTP client · collections · Rust engine',
  },
  {
    variant: 'library',
    tone: 'green',
    title: 'SPST Knižnica',
    caption: 'Catalog · loans · admin',
  },
]

function PreviewCard({
  variant,
  tone,
  title,
  caption,
}: {
  variant: ProductPreviewVariant
  tone: ProjectIconTone
  title: string
  caption: string
}) {
  return (
    <figure className="w-full max-w-[420px]">
      <ProductPreview variant={variant} tone={tone} title={title} className="w-full" />
      <figcaption className="mt-3 px-0.5">
        <p className="text-[14px] font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{caption}</p>
      </figcaption>
    </figure>
  )
}

const meta = {
  title: 'Notion/ProductPreview',
  component: ProductPreview,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Anonymized product UI mocks used on project case studies — not real screenshots.',
      },
    },
  },
  args: {
    variant: 'canvas',
    tone: 'purple',
    title: 'Boom Scope',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'dashboard',
        'forms',
        'healthcare',
        'api',
        'licenses',
        'design-system',
        'notebooks',
        'notes',
        'canvas',
        'library',
      ],
    },
    tone: {
      control: 'select',
      options: ['blue', 'green', 'orange', 'purple', 'pink', 'yellow', 'red', 'gray'],
    },
  },
} satisfies Meta<typeof ProductPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  name: 'All project mocks',
  args: {
    variant: 'canvas',
    tone: 'purple',
    title: 'Boom Scope',
  },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid w-full max-w-5xl gap-8 sm:grid-cols-2">
      {variants.map((item) => (
        <PreviewCard key={item.variant} {...item} />
      ))}
    </div>
  ),
}

export const BoomScope: Story = {
  name: 'Boom Scope',
  args: {
    variant: 'canvas',
    tone: 'purple',
    title: 'Boom Scope',
  },
  render: (args) => (
    <PreviewCard
      variant={args.variant}
      tone={args.tone}
      title={args.title ?? 'Boom Scope'}
      caption="Infinite canvas · design workspace"
    />
  ),
}

export const DocuNest: Story = {
  name: 'Docu-Nest',
  args: {
    variant: 'notebooks',
    tone: 'blue',
    title: 'Docu-Nest',
  },
  render: (args) => (
    <PreviewCard
      variant={args.variant}
      tone={args.tone}
      title={args.title ?? 'Docu-Nest'}
      caption="AI notebooks · library · workspace"
    />
  ),
}

export const PulseApiClient: Story = {
  name: 'Pulse API Client',
  args: {
    variant: 'api',
    tone: 'orange',
    title: 'Pulse API Client',
  },
  render: (args) => (
    <PreviewCard
      variant={args.variant}
      tone={args.tone}
      title={args.title ?? 'Pulse API Client'}
      caption="HTTP client · collections · Rust engine"
    />
  ),
}

export const SpstLibrary: Story = {
  name: 'SPST Knižnica',
  args: {
    variant: 'library',
    tone: 'green',
    title: 'SPST Knižnica',
  },
  render: (args) => (
    <PreviewCard
      variant={args.variant}
      tone={args.tone}
      title={args.title ?? 'SPST Knižnica'}
      caption="Catalog · loans · admin"
    />
  ),
}
