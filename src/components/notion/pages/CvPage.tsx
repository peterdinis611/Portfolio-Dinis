import { Download, Printer } from 'lucide-react'
import { AvailabilityBanner } from '@/components/notion/AvailabilityBanner'
import { EmailDisplay } from '@/components/ui/EmailDisplay'
import { useToast } from '@/components/ui/Toast'
import {
  cvCertifications,
  cvCompetencies,
  cvEducation,
  cvLanguages,
  cvLeadership,
  cvMeta,
  cvSkillGroups,
} from '@/data/cv'
import { profile, projects, socials } from '@/data/portfolio'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { celebrateCvExport } from '@/lib/cv-celebrate'
import { noteHref, pageHref, projectHref } from '@/lib/portfolio-route'
import {
  BlockDivider,
  BlockHeading,
  BlockText,
  PageShell,
  PageTitle,
  PropertyRow,
  TagList,
} from '../blocks'
import { MotionSection } from '../motion'

export function CvPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const { toast } = useToast()
  const productionJobs = t.experience.filter((job) => job.tier === 'production')
  const earlyJobs = t.experience.filter((job) => job.tier === 'early')

  const onDownload = () => {
    celebrateCvExport('download', lang, toast)
  }

  const onPrint = () => {
    celebrateCvExport('print', lang, toast)
    window.setTimeout(() => window.print(), 280)
  }

  return (
    <PageShell className="cv-page">
      <MotionSection>
        <div className="print:hidden mb-1 flex flex-wrap items-center justify-end gap-1.5">
          <a
            href={cvMeta.pdfHref}
            download={cvMeta.pdfFileName}
            onClick={onDownload}
            className="inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.055)]"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            {ui.cvDownload}
          </a>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-[4px] bg-primary px-2.5 py-1.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Printer className="h-3.5 w-3.5" strokeWidth={2} />
            {ui.cvPrint}
          </button>
        </div>

        <PageTitle
          icon="📄"
          description={ui.cvIntro}
          meta={
            <span className="rounded-[3px] bg-[rgba(55,53,47,0.06)] px-1.5 py-0.5 text-[12px] font-medium text-muted-foreground dark:bg-[rgba(255,255,255,0.08)]">
              {cvMeta.availabilityLine[lang]}
            </span>
          }
        >
          {ui.cv}
        </PageTitle>

        <AvailabilityBanner lang={lang} />
      </MotionSection>

      <MotionSection delay={0.04} className="mt-2">
        <header className="mb-1">
          <h2 className="text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[36px]">
            {profile.name}
          </h2>
          <p className="mt-1 text-[16px] font-semibold text-foreground">{t.profile.title}</p>
          <p className="mt-1 text-[15px] text-muted-foreground">{t.profile.subtitle}</p>
        </header>

        <section className="my-4" aria-label={ui.cvContact}>
          <dl className="space-y-0.5">
            <PropertyRow icon="🎯" label={ui.cvTarget}>
              {cvMeta.targetRole[lang]}
            </PropertyRow>
            <PropertyRow icon="📍" label={ui.locationLabel}>
              {ui.contactLocation}
            </PropertyRow>
            <PropertyRow icon="📞" label={ui.phoneLabel}>
              <a href={`tel:${profile.phoneHref}`} className="text-[var(--link)] hover:underline">
                {profile.phone}
              </a>
            </PropertyRow>
            <PropertyRow icon="✉️" label={ui.emailLabel}>
              <EmailDisplay />
            </PropertyRow>
            <PropertyRow icon="🔗" label={ui.followMe}>
              <span className="flex flex-wrap gap-x-3 gap-y-1">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--link)] hover:underline"
                  >
                    {social.name}
                  </a>
                ))}
              </span>
            </PropertyRow>
          </dl>
        </section>

        <BlockDivider />
      </MotionSection>

      <MotionSection delay={0.06}>
        <div className="cv-layout grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] xl:gap-12">
          <div className="cv-main min-w-0">
            <BlockHeading className="mt-0">{ui.cvSummary}</BlockHeading>
            <BlockText>{cvMeta.summary[lang]}</BlockText>

            <BlockHeading>{ui.cvExperience}</BlockHeading>
            <div className="space-y-8">
              {productionJobs.map((job) => (
                <article key={job.id} className="cv-job break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                      {job.role}
                    </h3>
                    <time className="text-[13px] text-muted-foreground tabular-nums">
                      {job.period}
                    </time>
                  </div>
                  <p className="mt-0.5 text-[14px] text-muted-foreground">{job.company}</p>
                  {'summary' in job && job.summary ? (
                    <p className="mt-2 text-[15px] leading-[1.55] text-foreground/90">
                      {job.summary}
                    </p>
                  ) : null}
                  <ul className="mt-2 list-disc space-y-1.5 pl-6 text-[15px] leading-[1.55] text-foreground/85 marker:text-muted-foreground">
                    {job.highlights.map((item) => (
                      <li key={item} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {'projects' in job && job.projects ? (
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground/75">{ui.expProjects}: </span>
                      {job.projects}
                    </p>
                  ) : null}
                  {'tech' in job && job.tech ? (
                    <div className="mt-2.5">
                      <TagList tags={job.tech.split(' · ').map((item) => item.trim())} />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>

            {earlyJobs.length > 0 ? (
              <>
                <BlockHeading>{ui.expEarly}</BlockHeading>
                <div className="space-y-5">
                  {earlyJobs.map((job) => (
                    <article key={job.id} className="break-inside-avoid">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="text-[15px] font-semibold text-foreground">{job.role}</h3>
                        <time className="text-[12.5px] text-muted-foreground tabular-nums">
                          {job.period}
                        </time>
                      </div>
                      <p className="text-[13.5px] text-muted-foreground">{job.company}</p>
                      {'summary' in job && job.summary ? (
                        <p className="mt-1 text-[14px] leading-relaxed text-foreground/85">
                          {job.summary}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </>
            ) : null}

            <BlockHeading>{ui.cvProjects}</BlockHeading>
            <ul className="notion-gallery-grid cv-projects-grid grid gap-2 sm:grid-cols-2">
              {projects.map((project) => {
                const copy = t.projects.find((item) => item.id === project.id)
                return (
                  <li key={project.id}>
                    <a
                      href={projectHref(project.id)}
                      className="notion-gallery-card group flex h-full flex-col rounded-[8px] border border-[rgba(55,53,47,0.09)] p-3 transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.09)] dark:hover:bg-[rgba(255,255,255,0.04)]"
                    >
                      <span className="text-[15px] font-semibold text-foreground group-hover:text-[var(--link)]">
                        {project.name}
                      </span>
                      <span className="mt-1 text-[12.5px] leading-snug text-muted-foreground">
                        {project.tech}
                      </span>
                      {copy?.description ? (
                        <span className="mt-2 text-[13.5px] leading-relaxed text-foreground/80">
                          {copy.description}
                        </span>
                      ) : null}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="print:hidden mt-8">
              <BlockHeading className="mt-0">{ui.cvMore}</BlockHeading>
              <div className="flex flex-wrap gap-2">
                <a href={pageHref('notes')} className="notion-page-link">
                  ✍️ {ui.notes}
                </a>
                <a href={pageHref('contact')} className="notion-page-link">
                  ✉️ {ui.contact}
                </a>
                <a href={noteHref('mentoring-juniors')} className="notion-page-link">
                  🧭 {ui.cvLeadership}
                </a>
              </div>
            </div>
          </div>

          <aside className="cv-aside min-w-0 space-y-8 xl:sticky xl:top-6 xl:self-start">
            <section>
              <BlockHeading className="mt-0">{ui.cvStack}</BlockHeading>
              <div className="space-y-4">
                {cvSkillGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-1.5 text-[13px] font-semibold text-foreground">
                      {group.title[lang]}
                    </p>
                    <TagList tags={group.items} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <BlockHeading>{ui.cvCompetencies}</BlockHeading>
              <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-[1.55] text-foreground/85 marker:text-muted-foreground">
                {cvCompetencies.map((item) => (
                  <li key={item.en}>{item[lang]}</li>
                ))}
              </ul>
            </section>

            <section>
              <BlockHeading>{ui.cvEducation}</BlockHeading>
              <div className="space-y-4">
                {cvEducation.map((item) => (
                  <div key={item.id} className="break-inside-avoid">
                    <p className="text-[14px] font-semibold text-foreground">{item.school[lang]}</p>
                    <p className="text-[12.5px] text-muted-foreground tabular-nums">
                      {item.period}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                      {item.detail[lang]}
                    </p>
                    {item.bullets ? (
                      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] text-muted-foreground marker:text-muted-foreground">
                        {item.bullets.map((bullet) => (
                          <li key={bullet.en}>{bullet[lang]}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <BlockHeading>{ui.cvLanguages}</BlockHeading>
              <dl className="space-y-1">
                {cvLanguages.map((item) => (
                  <div
                    key={item.name.en}
                    className="grid grid-cols-[1fr_auto] gap-2 rounded-[4px] px-1 py-1.5 text-[14px] hover:bg-[rgba(55,53,47,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]"
                  >
                    <dt className="font-medium text-foreground">{item.name[lang]}</dt>
                    <dd className="text-muted-foreground">{item.level[lang]}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <BlockHeading>{ui.cvCerts}</BlockHeading>
              <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-[1.55] text-foreground/85 marker:text-muted-foreground">
                {cvCertifications.map((item) => (
                  <li key={item.en}>{item[lang]}</li>
                ))}
              </ul>
            </section>

            <section>
              <BlockHeading>{ui.cvLeadership}</BlockHeading>
              <BlockText className="text-[14px]">{cvLeadership[lang]}</BlockText>
            </section>

            <section className="rounded-[4px] bg-[rgba(55,53,47,0.04)] px-3.5 py-3 dark:bg-[rgba(255,255,255,0.04)]">
              <p className="text-[13px] font-semibold text-foreground">{ui.cvContact}</p>
              <p className="mt-1.5 text-[14px] leading-[1.55] text-muted-foreground">
                {t.profile.bio}
              </p>
              <a
                href={pageHref('contact')}
                className="mt-2 inline-flex text-[14px] font-medium text-[var(--link)] hover:underline"
              >
                {ui.getInTouch} →
              </a>
            </section>
          </aside>
        </div>
      </MotionSection>
    </PageShell>
  )
}
