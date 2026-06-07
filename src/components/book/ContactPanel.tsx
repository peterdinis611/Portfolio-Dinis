import { profile, socials } from '../../data/portfolio'
import { type Lang, translations } from '../../i18n/translations'
import { BrandIcon } from '../icons/BrandIcon'
import { ProfilePhoto } from '../ui/ProfilePhoto'

function ContactIcon({ type }: { type: 'email' | 'phone' | 'location' }) {
  const paths = {
    email:
      'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
    phone:
      'M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.47a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.18 2.2z',
    location:
      'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  }

  return (
    <svg viewBox="0 0 24 24" width={15} height={15} aria-hidden>
      <path fill="currentColor" d={paths[type]} />
    </svg>
  )
}

function ContactItem({
  type,
  label,
  value,
  href,
}: {
  type: 'email' | 'phone' | 'location'
  label: string
  value: string
  href?: string
}) {
  const body = (
    <>
      <span className="book-contact-icon" aria-hidden>
        <ContactIcon type={type} />
      </span>
      <span className="book-contact-copy">
        <span className="book-contact-label">{label}</span>
        <span className="book-contact-value">{value}</span>
      </span>
    </>
  )

  if (href) {
    return (
      <a className="book-contact-item" href={href}>
        {body}
      </a>
    )
  }

  return <div className="book-contact-item book-contact-item--static">{body}</div>
}

export function ContactPanel({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui

  return (
    <address className="book-contact-card">
      <div className="book-contact-header">
        <ProfilePhoto className="book-contact-avatar" />
        <div className="book-contact-header-copy">
          <p className="book-contact-name">{profile.name}</p>
          <p className="book-contact-role">{t.profile.title}</p>
        </div>
      </div>

      <p className="book-contact-lead">{ui.contactLead}</p>
      <p className="book-contact-text">{ui.contactText}</p>

      <div className="book-contact-list">
        <ContactItem
          type="email"
          label={ui.emailLabel}
          value={profile.email}
          href={`mailto:${profile.email}`}
        />
        <ContactItem
          type="phone"
          label={ui.phoneLabel}
          value={profile.phone}
          href={`tel:${profile.phoneHref}`}
        />
        <ContactItem type="location" label={ui.locationLabel} value={ui.contactLocation} />
      </div>

      <div className="book-contact-actions">
        <a className="book-contact-cta" href={`mailto:${profile.email}`}>
          {ui.endCta}
        </a>

        <div className="book-contact-social">
          <p className="book-contact-social-label">{ui.followMe}</p>
          <ul className="book-contact-social-list">
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  title={s.name}
                >
                  <BrandIcon slug={s.icon} className="book-contact-social-icon" label={s.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </address>
  )
}
