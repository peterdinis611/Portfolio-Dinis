import { motion } from 'framer-motion'
import { techCategories, techIconUrl } from '../../data/technologies'
import { translations, type Lang } from '../../i18n/translations'

const EASE = [0.32, 0.72, 0, 1] as const

export function TechStack({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const titleMap = Object.fromEntries(t.techCategories.map((c) => [c.id, c.title])) as Record<
    string,
    string
  >

  return (
    <div className="book-tech-stack">
      {techCategories.map((cat, catIdx) => (
        <section key={cat.id} className="book-tech-group">
          <h3 className="book-tech-group-title">{titleMap[cat.id]}</h3>
          <ul className="book-tech-grid">
            {cat.items.map((item, i) => (
              <motion.li
                key={item.id}
                className="book-tech-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.08 + i * 0.04, duration: 0.4, ease: EASE }}
              >
                <span className="book-tech-icon-wrap">
                  <img
                    src={techIconUrl(item.icon, item.color)}
                    alt=""
                    className="book-tech-icon"
                    loading="lazy"
                    width={20}
                    height={20}
                  />
                </span>
                <span className="book-tech-name">{item.name}</span>
              </motion.li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
