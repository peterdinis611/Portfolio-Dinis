import { TechIconChip } from '@/components/notion/TechIconChip'
import { techCategories } from '@/data/technologies'
import { type Lang, translations } from '@/i18n/translations'
import { BlockHeading, BlockText, PageShell, PageTitle } from '../blocks'
import { MotionItem, MotionSection } from '../motion'
import { PageCover } from '../PageCover'

export function TechPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const titleMap = Object.fromEntries(t.techCategories.map((c) => [c.id, c.title])) as Record<
    string,
    string
  >

  return (
    <PageShell cover={<PageCover variant="tech" />}>
      <MotionSection className="pt-2">
        <PageTitle icon="⚡">{ui.tech}</PageTitle>
        <BlockText>{ui.techIntro}</BlockText>
      </MotionSection>

      {techCategories.map((cat, index) => (
        <MotionItem key={cat.id} delay={0.1 + index * 0.06} className="mt-8">
          <section className="rounded-xl border border-border/70 bg-card/50 p-4 shadow-sm">
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
