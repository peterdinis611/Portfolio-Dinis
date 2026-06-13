import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import {
  getTechIconPresentation,
  resolveTechPageSections,
  type TechPageSlice,
} from '../../data/technologies'
import { type Lang, translations } from '../../i18n/translations'
import { BrandIcon } from '../icons/BrandIcon'

export function TechStack({ lang, page }: { lang: Lang; page: TechPageSlice }) {
  const t = translations[lang]
  const titleMap = Object.fromEntries(t.techCategories.map((c) => [c.id, c.title])) as Record<
    string,
    string
  >
  const sections = resolveTechPageSections(page)

  return (
    <div className="book-tech-stack">
      {sections.map((cat) => (
        <section key={cat.id} className="book-tech-group">
          <h3 className="book-tech-group-title">{titleMap[cat.id]}</h3>
          <ul className="book-tech-grid">
            {cat.items.map((item) => {
              const icon = getTechIconPresentation(item)
              return (
                <motion.li
                  key={item.id}
                  className="book-tech-item"
                  style={{ '--tech-brand': icon.brand } as CSSProperties}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
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
