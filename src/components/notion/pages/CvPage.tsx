import { Printer } from 'lucide-react'
import { EmailDisplay } from '@/components/ui/EmailDisplay'
import { profile, projects, socials } from '@/data/portfolio'
import { techCategories } from '@/data/technologies'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'

export function CvPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const productionJobs = t.experience.filter((job) => job.tier === 'production')
  const stackPreview = techCategories
    .flatMap((category) => category.items.map((item) => item.name))
    .slice(0, 16)

  return (
    <PageShell className="cv-page">
      <MotionSection>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-[13px] text-muted-foreground">{ui.cvDownloadHint}</p>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Printer className="h-3.5 w-3.5" strokeWidth={2} />
            {ui.cvPrint}
          </button>
        </div>
        <PageTitle icon="📄" description={ui.cvIntro}>
          {ui.cv}
        </PageTitle>

        <header className="mb-8 border-b border-border pb-6">
          <h1 className="font-[family-name:var(--font-display)] text-[36px] font-normal tracking-[-0.02em] text-foreground">
            {profile.name}
          </h1>
          <p className="mt-1 text-[16px] font-medium text-foreground">{t.profile.title}</p>
          <p className="mt-1 max-w-2xl text-[14px] text-muted-foreground">{t.profile.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
            <span>
              {ui.locationLabel}: {ui.contactLocation}
            </span>
            <span>
              {ui.phoneLabel}: {profile.phone}
            </span>
            <span className="inline-flex items-center gap-1">
              {ui.emailLabel}: <EmailDisplay />
            </span>
            {socials.slice(0, 2).map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="text-[var(--link)] hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {social.name}
              </a>
            ))}
          </div>
        </header>
      </MotionSection>

      <MotionSection delay={0.04} className="mb-8">
        <h2 className="mb-3 text-[13px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">
          {ui.cvExperience}
        </h2>
        <ul className="space-y-5">
          {productionJobs.map((job) => (
            <li key={job.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[15px] font-semibold text-foreground">{job.role}</p>
                <p className="text-[12px] text-muted-foreground">{job.period}</p>
              </div>
              <p className="text-[13px] text-muted-foreground">{job.company}</p>
              {'summary' in job && job.summary ? (
                <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/90">
                  {job.summary}
                </p>
              ) : null}
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
                {job.highlights.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {'tech' in job && job.tech ? (
                <p className="mt-2 text-[12px] text-muted-foreground">{job.tech}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </MotionSection>

      <MotionSection delay={0.06} className="mb-8">
        <h2 className="mb-3 text-[13px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">
          {ui.cvStack}
        </h2>
        <p className="text-[13px] leading-relaxed text-foreground/90">{stackPreview.join(' · ')}</p>
      </MotionSection>

      <MotionSection delay={0.08} className="mb-8">
        <h2 className="mb-3 text-[13px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">
          {ui.cvProjects}
        </h2>
        <ul className="space-y-2">
          {projects.map((project) => {
            const copy = t.projects.find((item) => item.id === project.id)
            return (
              <li key={project.id} className="break-inside-avoid text-[13px]">
                <span className="font-semibold text-foreground">{project.name}</span>
                <span className="text-muted-foreground"> — {project.tech}</span>
                {copy?.description ? (
                  <p className="mt-0.5 text-muted-foreground">{copy.description}</p>
                ) : null}
              </li>
            )
          })}
        </ul>
      </MotionSection>

      <MotionSection delay={0.1}>
        <h2 className="mb-2 text-[13px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">
          {ui.cvContact}
        </h2>
        <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          {t.profile.bio}
        </p>
      </MotionSection>
    </PageShell>
  )
}
