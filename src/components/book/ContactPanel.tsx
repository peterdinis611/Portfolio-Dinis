import { profile, socials } from '../../data/portfolio'
import { translations, type Lang } from '../../i18n/translations'
import { BrandIcon } from '../icons/BrandIcon'

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
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <path fill="currentColor" d={paths[type]} />
    </svg>
  )
}

export function ContactPanel({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui

  return (
    <div className="book-contact-card">
      <h3 className="book-contact-card-title">{ui.getInTouch}</h3>

      <div className="book-contact-rows">
        <a className="book-contact-row" href={`mailto:${profile.email}`}>
          <span className="book-contact-icon book-contact-icon--email">
            <ContactIcon type="email" />
          </span>
          <span className="book-contact-copy">
            <span className="book-contact-label">{ui.emailLabel}</span>
            <span className="book-contact-value">{profile.email}</span>
          </span>
        </a>

        <a className="book-contact-row" href={`tel:${profile.phoneHref}`}>
          <span className="book-contact-icon book-contact-icon--phone">
            <ContactIcon type="phone" />
          </span>
          <span className="book-contact-copy">
            <span className="book-contact-label">{ui.phoneLabel}</span>
            <span className="book-contact-value">{profile.phone}</span>
          </span>
        </a>

        <div className="book-contact-row book-contact-row--static">
          <span className="book-contact-icon book-contact-icon--location">
            <ContactIcon type="location" />
          </span>
          <span className="book-contact-copy">
            <span className="book-contact-label">{ui.locationLabel}</span>
            <span className="book-contact-value">{ui.contactLocation}</span>
          </span>
        </div>
      </div>

      <div className="book-contact-divider" aria-hidden />

      <p className="book-contact-follow">{ui.followMe}</p>
      <ul className="book-socials">
        {socials.map((s) => (
          <li key={s.name}>
            <a href={s.url} target="_blank" rel="noreferrer">
              <span className="book-social-icon">
                <BrandIcon slug={s.icon} label={s.name} />
              </span>
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
