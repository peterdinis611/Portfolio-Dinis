import type { ReactNode } from 'react'
import { profile, projects } from '../../data/portfolio'
import { techBookPages } from '../../data/technologies'
import { type Lang, translations } from '../../i18n/translations'
import { ProfilePhoto } from '../ui/ProfilePhoto'
import { BookFinale } from './BookFinale'
import { ContactPanel } from './ContactPanel'
import { ProjectsList } from './ProjectsList'
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
  const expChunks: (typeof exp)[number][][] = []
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
            {'summary' in job && job.summary ? (
              <p className="book-job-summary">{job.summary}</p>
            ) : null}
            <ul className="book-job-list">
              {job.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            {'projects' in job && job.projects ? (
              <p className="book-job-meta">
                <span>{ui.expProjects}</span> {job.projects}
              </p>
            ) : null}
            {'tech' in job && job.tech ? <p className="book-job-tech">{job.tech}</p> : null}
          </article>
        ))}
      </>
    ),
  }))

  const techPages: BookPageDef[] = techBookPages.map((slice, idx) => ({
    id: slice.id,
    chapter: ui.chapter2,
    title: ui.tech,
    render: () => (
      <>
        {idx === 0 ? <p className="book-page-text book-page-text--tech">{ui.techIntro}</p> : null}
        <TechStack lang={lang} page={slice} />
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
            <ProfilePhoto className="book-page-photo" priority />
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
          <h3 className="book-subtitle book-subtitle--about">{ui.whatIDo}</h3>
          <ol className="book-services book-services--about">
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
    ...techPages,
    ...expPages,
    {
      id: 'projects',
      chapter: ui.chapter4,
      title: ui.projects,
      render: () => (
        <>
          <p className="book-page-text book-page-text--projects">{ui.projectsIntro}</p>
          <ProjectsList projects={projectMeta} />
        </>
      ),
    },
    {
      id: 'contact',
      chapter: ui.epilogue,
      title: ui.contact,
      render: () => <ContactPanel lang={lang} />,
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
  const ids = ['about', 'tech-1', 'exp-1', 'projects', 'contact'] as const
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
