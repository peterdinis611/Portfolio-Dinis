import type { Lang } from '@/i18n/translations'
import { celebrateCvAction } from '@/lib/celebrate'

export type CvCelebrateKind = 'download' | 'print'

type ToastFn = (payload: {
  icon?: string
  title: string
  description?: string
  durationMs?: number
}) => void

const PRINT_TOASTS: Record<Lang, Array<{ title: string; description: string }>> = {
  sk: [
    {
      title: 'Printer gods: aktivovaní',
      description: 'Alebo v dialógu zvoľ „Uložiť ako PDF“ — starý dobrý trick.',
    },
    {
      title: 'Papier sa trasie od vzrušenia',
      description: 'Ak nie, Save as PDF funguje rovnako dobre. Recruiteri milujú PDF.',
    },
    {
      title: 'Ctrl/Cmd + P vibes',
      description: 'CV je ready. Nezabudni skryť sidebar v print preview.',
    },
  ],
  en: [
    {
      title: 'Printer gods: summoned',
      description: 'Or hit “Save as PDF” in the dialog — the classic move.',
    },
    {
      title: 'Paper is shaking with excitement',
      description: 'If not, Save as PDF works just as well. Recruiters love PDFs.',
    },
    {
      title: 'Ctrl/Cmd + P vibes',
      description: 'CV is ready. Hide the sidebar in print preview if needed.',
    },
  ],
}

const DOWNLOAD_TOASTS: Record<Lang, Array<{ title: string; description: string }>> = {
  sk: [
    {
      title: 'PDF mieri do Downloads',
      description: 'Recruiteri už cítia vibes. Otvor to a pošli ďalej.',
    },
    {
      title: 'Súbor odchádza. Ty zostávaš legenda.',
      description: 'Peter-Dinis-CV.pdf — čerstvý, stiahnutý, ready to ship.',
    },
    {
      title: 'Download complete energy',
      description: 'Ak sa nič neobjavilo, skontroluj pop-up blocker. Inak: ship it.',
    },
  ],
  en: [
    {
      title: 'PDF inbound to Downloads',
      description: 'Recruiters can smell it already. Open it and send it out.',
    },
    {
      title: 'File leaves. You stay legendary.',
      description: 'Peter-Dinis-CV.pdf — fresh, downloaded, ready to ship.',
    },
    {
      title: 'Download complete energy',
      description: 'Nothing showed up? Check the popup blocker. Otherwise: ship it.',
    },
  ],
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

/** Confetti + funny toast for CV print / PDF download. */
export function celebrateCvExport(kind: CvCelebrateKind, lang: Lang, toast: ToastFn) {
  celebrateCvAction(kind === 'download' ? 0.72 : 0.82, 0.12)
  const message = pick(kind === 'download' ? DOWNLOAD_TOASTS[lang] : PRINT_TOASTS[lang])
  toast({
    icon: kind === 'download' ? '📥' : '🖨️',
    title: message.title,
    description: message.description,
    durationMs: 4200,
  })
}
