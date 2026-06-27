export const portfolioStats = [
  { id: 'years', value: '4+' },
  { id: 'roles', value: '4' },
  { id: 'products', value: '8+' },
  { id: 'mentored', value: '2' },
] as const

export const projectMeta: Record<string, { icon: string }> = {
  udzs: { icon: '🏛️' },
  eforms: { icon: '📋' },
  prolekare: { icon: '💊' },
  licenses: { icon: '🔑' },
  'iba-rd': { icon: '🧪' },
}

export const serviceIcons: Record<string, string> = {
  '01': '🏗️',
  '02': '🎨',
  '03': '⚙️',
  '04': '🧭',
}
