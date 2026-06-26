export const portfolioStats = [
  { id: 'years', value: '4+' },
  { id: 'roles', value: '7' },
  { id: 'projects', value: '4' },
  { id: 'stack', value: '15+' },
] as const

export const projectMeta: Record<string, { icon: string }> = {
  legato: { icon: '🏥' },
  carter: { icon: '🖨️' },
  library: { icon: '📚' },
  licenses: { icon: '🔑' },
}

export const serviceIcons: Record<string, string> = {
  '01': '⚛️',
  '02': '🛠️',
  '03': '☁️',
  '04': '📱',
}
