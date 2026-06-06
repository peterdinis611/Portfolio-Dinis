import type { ReactNode } from 'react'
import profilePhoto from '../../assets/profile.png'
import { profile, projects, socials } from '../../data/portfolio'
import { translations, type Lang } from '../../i18n/translations'
import { BookFinale } from './BookFinale'
import { TechStack } from './TechStack'

export type BookPageDef = {
  id: string
  chapter: string
  title: string
  render: () => ReactNode
}

export type TocEntry = {
  id: string
  pageIndex: number
  label: string
}

const EXP_PER_PAGE = 2

export function getBookPages(lang: Lang): BookPageDef[] {
  const t = translations[lang]
  const ui = t.ui

  const projectMeta = projects.map((p) => {
    const loc = t.projects.find((x) => x.id === p.id)!
    return { ...p, description: loc.description }
  })

  const exp = t.experience
  const expChunks: (typeof exp[number])[][] = []
  for (let i = 0; i < exp.length; i += EXP_PER_PAGE) {
    expChunks.push([...exp.slice(i, i + EXP_PER_PAGE)])
  }

  const expPages: BookPageDef[] = expChunks.map((chunk, idx) => ({
    id: `exp-${idx + 1}`,
    chapter: ui.chapter3,
    title: ui.experience,
    render: () => (
      <>
        {idx === 0 && <p className="book-page-text">{ui.expIntro}</p>}
        {chunk.map((job) => (
          <article key={job.id} className="book-job">
            <div className="book-job-head">
              <strong>{job.role}</strong>
              <span>{job.period}</span>
            </div>
            <p className="book-job-company">{job.company}</p>
            <ul>
              {job.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </>
    ),
  }))

  return [
    {
      id: 'about',
      chapter: ui.chapter1,
      title: ui.about,
      render: () => (
        <>
          <div className="book-page-hero">
            <img src={profilePhoto} alt={profile.name} className="book-page-photo" />
            <div>
              <p className="book-page-lead">{t.profile.tagline}</p>
            </div>
          </div>
          <p className="book-page-text">{t.profile.bio}</p>
          <p className="book-page-meta">
            {t.profile.title} · {t.profile.location}
          </p>
          <ul className="book-tags">
            {profile.interests.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'tech',
      chapter: ui.chapter2,
      title: ui.tech,
      render: () => (
        <>
          <p className="book-page-text">{ui.techIntro}</p>
          <TechStack lang={lang} />
          <h3 className="book-subtitle">{ui.whatIDo}</h3>
          <ol className="book-services">
            {t.services.map((s) => (
              <li key={s.id}>
                <span>{s.id}</span>
                {s.label}
              </li>
            ))}
          </ol>
        </>
      ),
    },
    ...expPages,
    {
      id: 'projects',
      chapter: ui.chapter4,
      title: ui.projects,
      render: () => (
        <>
          <p className="book-page-text">{ui.projectsIntro}</p>
          <ul className="book-projects">
            {projectMeta.map((p, i) => (
              <li key={p.id}>
                <span className="book-project-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{p.name}</strong>
                  <span className="book-project-tech">{p.tech}</span>
                  <p>{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'contact',
      chapter: ui.epilogue,
      title: ui.contact,
      render: () => (
        <>
          <p className="book-page-lead">{ui.contactLead}</p>
          <p className="book-page-text">{ui.contactText}</p>
          <a className="book-contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <ul className="book-socials">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  <span>{s.icon}</span>
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'finale',
      chapter: ui.epilogue,
      title: ui.endTitle,
      render: () => <BookFinale />,
    },
  ]
}

export function getTocEntries(lang: Lang, pages: BookPageDef[]): TocEntry[] {
  const ui = translations[lang].ui
  const ids = ['about', 'tech', 'exp-1', 'projects', 'contact'] as const
  const labels = [ui.about, ui.tech, ui.experience, ui.projects, ui.contact]

  return ids.map((id, i) => ({
    id,
    label: labels[i]!,
    pageIndex: pages.findIndex((p) => p.id === id),
  }))
}

export function pageIndexToSpread(pageIndex: number): number {
  return pageIndex % 2 === 0 ? pageIndex : pageIndex - 1
}
