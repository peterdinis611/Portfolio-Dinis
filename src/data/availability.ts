export type AvailabilityStatus = 'open' | 'selective' | 'busy'

export type Localized = { sk: string; en: string }

export const availability = {
  status: 'selective' as AvailabilityStatus,
  headline: {
    sk: 'Aktuálne nie som dostupný okamžite — otvorený zaujímavým rolám',
    en: 'Not available immediately — open to the right roles',
  } satisfies Localized,
  workMode: {
    sk: 'Hybrid · Praha / remote · relokácia OK',
    en: 'Hybrid · Prague / remote · relocation OK',
  } satisfies Localized,
  detail: {
    sk: 'IBA.CZ a side projekty majú prioritu. Napíš, ak máš silnú full-stack / React príležitosť — ozvem sa podľa kapacity.',
    en: 'IBA.CZ and side projects come first. Reach out for a strong full-stack / React opportunity — I’ll respond as capacity allows.',
  } satisfies Localized,
}

export const availabilityTone: Record<
  AvailabilityStatus,
  { dot: string; badge: string; label: Localized }
> = {
  open: {
    dot: 'bg-[#0f7b6c]',
    badge:
      'bg-[rgba(15,123,108,0.12)] text-[#0f7b6c] dark:bg-[rgba(15,123,108,0.2)] dark:text-[#4dab9a]',
    label: { sk: 'Dostupný', en: 'Available' },
  },
  selective: {
    dot: 'bg-[#9a6700]',
    badge:
      'bg-[rgba(233,168,0,0.14)] text-[#9a6700] dark:bg-[rgba(233,168,0,0.2)] dark:text-[#ffdc49]',
    label: { sk: 'Selektivne', en: 'Selective' },
  },
  busy: {
    dot: 'bg-[#e03e3e]',
    badge:
      'bg-[rgba(224,62,62,0.12)] text-[#e03e3e] dark:bg-[rgba(224,62,62,0.2)] dark:text-[#ff7369]',
    label: { sk: 'Obsadený', en: 'Busy' },
  },
}
