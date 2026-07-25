export type NotionTagColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'

export type NotionTagMeta = {
  color: NotionTagColor
  icon?: string
}

/** Longest needles first so "react native" wins over "react". */
const TAG_META: Array<{ match: string; color: NotionTagColor; icon?: string }> = [
  { match: 'react native', color: 'blue', icon: 'react' },
  { match: 'tanstack query', color: 'red', icon: 'reactquery' },
  { match: 'tanstack start', color: 'red', icon: 'reactquery' },
  { match: 'fluent ui', color: 'blue', icon: 'microsoftazure' },
  { match: 'sharepoint', color: 'blue', icon: 'microsoftazure' },
  { match: 'next.js', color: 'default', icon: 'nextdotjs' },
  { match: 'node.js', color: 'green', icon: 'nodedotjs' },
  { match: 'vue.js', color: 'green', icon: 'vuedotjs' },
  { match: 'shadcn/ui', color: 'default', icon: 'shadcnui' },
  { match: 'shadcn', color: 'default', icon: 'shadcnui' },
  { match: 'postgresql', color: 'blue', icon: 'postgresql' },
  { match: 'typescript', color: 'purple', icon: 'typescript' },
  { match: 'javascript', color: 'yellow', icon: 'javascript' },
  { match: 'tailwind', color: 'blue', icon: 'tailwindcss' },
  { match: 'mongodb', color: 'green', icon: 'mongodb' },
  { match: 'graphql', color: 'pink', icon: 'graphql' },
  { match: 'nestjs', color: 'red', icon: 'nestjs' },
  { match: 'docker', color: 'blue', icon: 'docker' },
  { match: 'drizzle', color: 'green', icon: 'drizzle' },
  { match: 'sqlite', color: 'blue', icon: 'sqlite' },
  { match: 'convex', color: 'yellow', icon: 'convex' },
  { match: 'openai', color: 'green', icon: 'openai' },
  { match: 'xstate', color: 'purple', icon: 'xstate' },
  { match: 'tiptap', color: 'purple', icon: 'tiptap' },
  { match: 'tauri', color: 'orange', icon: 'tauri' },
  { match: 'figma', color: 'pink', icon: 'figma' },
  { match: 'clerk', color: 'purple', icon: 'clerk' },
  { match: 'auth.js', color: 'purple', icon: 'auth0' },
  { match: 'konva', color: 'orange', icon: 'konva' },
  { match: 'mysql', color: 'blue', icon: 'mysql' },
  { match: 'linux', color: 'yellow', icon: 'linux' },
  { match: 'azure', color: 'blue', icon: 'microsoftazure' },
  { match: 'rust', color: 'orange', icon: 'rust' },
  { match: 'java', color: 'orange', icon: 'openjdk' },
  { match: 'react', color: 'blue', icon: 'react' },
  { match: 'next', color: 'default', icon: 'nextdotjs' },
  { match: 'vue', color: 'green', icon: 'vuedotjs' },
  { match: 'node', color: 'green', icon: 'nodedotjs' },
  { match: 'aws', color: 'orange', icon: 'amazonaws' },
  { match: 'html', color: 'orange', icon: 'html5' },
  { match: 'css', color: 'blue', icon: 'css' },
  { match: 'scss', color: 'pink', icon: 'sass' },
  { match: 'sass', color: 'pink', icon: 'sass' },
  { match: 'less', color: 'purple', icon: 'less' },
  { match: 'pwa', color: 'purple', icon: 'pwa' },
  { match: 'dotnet', color: 'purple', icon: 'dotnet' },
  { match: 'asp.net', color: 'purple', icon: 'dotnet' },
]

export const notionTagClass: Record<NotionTagColor, string> = {
  default: 'bg-[rgba(55,53,47,0.08)] text-foreground dark:bg-[rgba(255,255,255,0.08)]',
  gray: 'bg-[rgba(155,154,151,0.25)] text-foreground',
  brown: 'bg-[rgba(140,46,0,0.15)] text-[#64473a] dark:text-[#d3b8a7]',
  orange: 'bg-[rgba(233,87,10,0.15)] text-[#d9730d] dark:text-[#ffa344]',
  yellow: 'bg-[rgba(233,168,0,0.2)] text-[#cb912f] dark:text-[#ffdc49]',
  green: 'bg-[rgba(15,123,108,0.15)] text-[#0f7b6c] dark:text-[#4dab9a]',
  blue: 'bg-[rgba(35,131,226,0.15)] text-[#0b6e99] dark:text-[#6cb5f9]',
  purple: 'bg-[rgba(105,64,165,0.15)] text-[#6940a5] dark:text-[#9a6dd7]',
  pink: 'bg-[rgba(226,85,161,0.15)] text-[#ad1a72] dark:text-[#e255a1]',
  red: 'bg-[rgba(224,62,62,0.15)] text-[#e03e3e] dark:text-[#ff7369]',
}

export function getNotionTagMeta(tag: string): NotionTagMeta {
  const key = tag.toLowerCase().replace(/\s+/g, ' ').trim()
  for (const entry of TAG_META) {
    if (key.includes(entry.match)) {
      return { color: entry.color, icon: entry.icon }
    }
  }
  return { color: 'default' }
}

export function getNotionTagColor(tag: string): NotionTagColor {
  return getNotionTagMeta(tag).color
}
