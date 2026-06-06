export type TechItem = {
  id: string
  name: string
  icon: string
  color: string
}

export type TechCategory = {
  id: 'frontend' | 'backend' | 'cloud' | 'mobile'
  items: TechItem[]
}

export const techCategories: TechCategory[] = [
  {
    id: 'frontend',
    items: [
      { id: 'html', name: 'HTML', icon: 'html5', color: 'E34F26' },
      { id: 'css', name: 'CSS', icon: 'css', color: '1572B6' },
      { id: 'scss', name: 'SCSS', icon: 'sass', color: 'CC6699' },
      { id: 'js', name: 'JavaScript', icon: 'javascript', color: 'F7DF1E' },
      { id: 'ts', name: 'TypeScript', icon: 'typescript', color: '3178C6' },
      { id: 'react', name: 'React', icon: 'react', color: '61DAFB' },
      { id: 'next', name: 'Next.js', icon: 'nextdotjs', color: '000000' },
      { id: 'tailwind', name: 'Tailwind', icon: 'tailwindcss', color: '06B6D4' },
      { id: 'tanstack', name: 'TanStack Query', icon: 'reactquery', color: 'FF4154' },
      { id: 'less', name: 'Less', icon: 'less', color: '1D365D' },
      { id: 'chakra', name: 'Chakra UI', icon: 'chakraui', color: '319795' },
    ],
  },
  {
    id: 'backend',
    items: [
      { id: 'node', name: 'Node.js', icon: 'nodedotjs', color: '339933' },
      { id: 'mongo', name: 'MongoDB', icon: 'mongodb', color: '47A248' },
      { id: 'nest', name: 'NestJS', icon: 'nestjs', color: 'E0234E' },
      { id: 'graphql', name: 'GraphQL', icon: 'graphql', color: 'E10098' },
      { id: 'mysql', name: 'MySQL', icon: 'mysql', color: '4479A1' },
      { id: 'postgres', name: 'PostgreSQL', icon: 'postgresql', color: '4169E1' },
      { id: 'dotnet', name: 'ASP.NET', icon: 'dotnet', color: '512BD4' },
    ],
  },
  {
    id: 'cloud',
    items: [
      { id: 'aws', name: 'AWS', icon: 'amazonaws', color: '232F3E' },
      { id: 'docker', name: 'Docker', icon: 'docker', color: '2496ED' },
      { id: 'linux', name: 'Linux', icon: 'linux', color: 'FCC624' },
      { id: 'azure', name: 'Azure', icon: 'microsoftazure', color: '0078D4' },
    ],
  },
  {
    id: 'mobile',
    items: [
      { id: 'rn', name: 'React Native', icon: 'react', color: '61DAFB' },
      { id: 'pwa', name: 'PWA', icon: 'pwa', color: '5A0FC8' },
    ],
  },
]

export type TechPageSlice = {
  id: string
  categories: Array<{
    categoryId: TechCategory['id']
    from?: number
    to?: number
  }>
}

/** Book pages for tech chapter — no scroll, all icons visible per spread side. */
export const techBookPages: TechPageSlice[] = [
  {
    id: 'tech-1',
    categories: [{ categoryId: 'frontend', from: 0, to: 6 }],
  },
  {
    id: 'tech-2',
    categories: [{ categoryId: 'frontend', from: 6 }],
  },
  {
    id: 'tech-3',
    categories: [{ categoryId: 'backend' }],
  },
  {
    id: 'tech-4',
    categories: [{ categoryId: 'cloud' }, { categoryId: 'mobile' }],
  },
]

export function resolveTechPageSections(page: TechPageSlice): TechCategory[] {
  return page.categories
    .map(({ categoryId, from, to }) => {
      const category = techCategories.find((c) => c.id === categoryId)
      if (!category) return null
      const items = category.items.slice(from ?? 0, to)
      if (items.length === 0) return null
      return { ...category, items }
    })
    .filter((c): c is TechCategory => c !== null)
}

/** Per-item icon presentation — solid chips for readable contrast on dark paper. */
export function getTechIconPresentation(item: TechItem) {
  type Preset = { brand: string; iconColor: string; solid: true }

  const presets: Record<string, Preset> = {
    js: { brand: '#F7DF1E', iconColor: '323330', solid: true },
    linux: { brand: '#FCC624', iconColor: '000000', solid: true },
    aws: { brand: '#FF9900', iconColor: 'FFFFFF', solid: true },
    next: { brand: '#000000', iconColor: 'FFFFFF', solid: true },
    less: { brand: '#1D365D', iconColor: 'FFFFFF', solid: true },
    mysql: { brand: '#4479A1', iconColor: 'FFFFFF', solid: true },
    postgres: { brand: '#4169E1', iconColor: 'FFFFFF', solid: true },
    react: { brand: '#0D2B2E', iconColor: '61DAFB', solid: true },
    rn: { brand: '#0D2B2E', iconColor: '61DAFB', solid: true },
    tailwind: { brand: '#0F3D45', iconColor: '06B6D4', solid: true },
    tanstack: { brand: '#3D1218', iconColor: 'FF4154', solid: true },
  }

  if (presets[item.id]) return presets[item.id]

  return {
    brand: `#${item.color}`,
    iconColor: 'FFFFFF',
    solid: true as const,
  }
}
