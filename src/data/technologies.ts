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
      { id: 'css', name: 'CSS', icon: 'css3', color: '1572B6' },
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
      { id: 'aws', name: 'AWS', icon: 'amazonwebservices', color: '232F3E' },
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

export function techIconUrl(icon: string, color: string) {
  return `https://cdn.simpleicons.org/${icon}/${color}`
}
