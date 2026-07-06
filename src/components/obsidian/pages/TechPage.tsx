import { TechIconChip } from '@/components/obsidian/TechIconChip'
import { techCategories } from '@/data/technologies'
import { type Lang, translations } from '@/i18n/translations'
import { obsidianPageBlocks } from '@/i18n/obsidian-blocks-content'
import { BlockHeading, BlockText, PageShell, PageTitle } from '../blocks'
import { MotionItem, MotionSection } from '../motion'
import { BlockQuote, BlockTableOfContents, BlockToggleGroup } from '../obsidian-blocks'

export function TechPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const blocks = obsidianPageBlocks[lang].tech
  const titleMap = Object.fromEntries(t.techCategories.map((c) => [c.id, c.title])) as Record<
    string,
    string
  >

  return (
    <PageShell>
      <MotionSection>
        <PageTitle fileName="tech.md">{ui.tech}</PageTitle>
        <BlockText>{ui.techIntro}</BlockText>
      </MotionSection>

      <MotionSection delay={0.06}>
        <BlockTableOfContents
          title={blocks.tocTitle}
          items={techCategories.map((cat) => ({
            id: `tech-${cat.id}`,
            label: titleMap[cat.id],
          }))}
        />
        <BlockQuote>{blocks.quote}</BlockQuote>
      </MotionSection>

      <MotionSection delay={0.1} className="mt-4">
        <BlockToggleGroup
          items={blocks.principles.map((item) => ({
            title: item.title,
            body: <BlockText>{item.body}</BlockText>,
          }))}
        />
      </MotionSection>

      {techCategories.map((cat, index) => (
        <MotionItem key={cat.id} delay={0.14 + index * 0.06} className="mt-8">
          <section id={`tech-${cat.id}`} className="border border-border bg-card/30 p-3">
            <BlockHeading className="mt-0">{titleMap[cat.id]}</BlockHeading>
            <ul className="mt-3 flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <TechIconChip key={item.id} item={item} />
              ))}
            </ul>
          </section>
        </MotionItem>
      ))}
    </PageShell>
  )
}
