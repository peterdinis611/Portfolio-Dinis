export type NotionTagColor =
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'

const TAG_COLORS: Record<string, NotionTagColor> = {
  React: 'blue',
  TypeScript: 'blue',
  'Next.js': 'gray',
  'Node.js': 'green',
  NestJS: 'red',
  PostgreSQL: 'blue',
  MongoDB: 'green',
  GraphQL: 'pink',
  'Tailwind CSS': 'blue',
  Docker: 'blue',
  AWS: 'orange',
  Azure: 'blue',
  'React Native': 'blue',
  'UI/UX': 'purple',
  'Design Systems': 'purple',
}

export const notionTagClass: Record<NotionTagColor, string> = {
  gray: 'bg-[#e3e2e0]/80 text-[#32302c] dark:bg-white/10 dark:text-white/80',
  brown: 'bg-[#eee0da]/80 text-[#442a1e] dark:bg-[#4a3228]/60 dark:text-[#f0ddd4]',
  orange: 'bg-[#fadec9]/80 text-[#49290e] dark:bg-[#5c3d20]/60 dark:text-[#fadeca]',
  yellow: 'bg-[#fdecc8]/80 text-[#402c1b] dark:bg-[#594a2a]/60 dark:text-[#fdecc8]',
  green: 'bg-[#dbeddb]/80 text-[#1c3829] dark:bg-[#2d4a34]/60 dark:text-[#dbeddb]',
  blue: 'bg-[#d3e5ef]/80 text-[#183347] dark:bg-[#28455a]/60 dark:text-[#d3e5ef]',
  purple: 'bg-[#e8deee]/80 text-[#412454] dark:bg-[#4a3558]/60 dark:text-[#e8deee]',
  pink: 'bg-[#f5e0e9]/80 text-[#4c2337] dark:bg-[#5a3548]/60 dark:text-[#f5e0e9]',
  red: 'bg-[#ffe2dd]/80 text-[#5c1f1a] dark:bg-[#5c2e28]/60 dark:text-[#ffe2dd]',
}

export function getNotionTagColor(tag: string): NotionTagColor {
  return TAG_COLORS[tag] ?? 'gray'
}
