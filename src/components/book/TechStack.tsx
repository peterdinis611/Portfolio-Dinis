import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import {
  getTechIconPresentation,
  resolveTechPageSections,
  type TechPageSlice,
} from '../../data/technologies'
import { BrandIcon } from '../icons/BrandIcon'
import { translations, type Lang } from '../../i18n/translations'

const EASE = [0.32, 0.72, 0, 1] as const

export function TechStack({ lang, page }: { lang: Lang; page: TechPageSlice }) {
  const t = translations[lang]
  const titleMap = Object.fromEntries(t.techCategories.map((c) => [c.id, c.title])) as Record<
    string,
    string
  >
  const sections = resolveTechPageSections(page)

  return (
    <div className="book-tech-stack">
      {sections.map((cat, catIdx) => (
        <section key={cat.id} className="book-tech-group">
          <h3 className="book-tech-group-title">{titleMap[cat.id]}</h3>
          <ul className="book-tech-grid">
            {cat.items.map((item, i) => {
              const icon = getTechIconPresentation(item)
              return (
                <motion.li
                  key={item.id}
                  className="book-tech-item"
                  style={{ '--tech-brand': icon.brand } as CSSProperties}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.06 + i * 0.03, duration: 0.35, ease: EASE }}
                >
                  <span className="book-tech-icon-wrap book-tech-icon-wrap--solid">
                    <BrandIcon
                      slug={item.icon}
                      color={icon.iconColor}
                      className="book-tech-icon"
                      label={item.name}
                    />
                  </span>
                  <span className="book-tech-name">{item.name}</span>
                </motion.li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
