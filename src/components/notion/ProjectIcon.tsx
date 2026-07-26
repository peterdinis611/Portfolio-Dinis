import type { LucideIcon } from 'lucide-react'
import {
  BookMarked,
  BookOpen,
  Building2,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  KeyRound,
  NotepadText,
  Sparkles,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProjectMeta, type ProjectIconTone } from '@/data/portfolio-meta'

const projectIcons: Record<string, LucideIcon> = {
  Building2,
  ClipboardList,
  HeartPulse,
  KeyRound,
  FlaskConical,
  BookMarked,
  NotepadText,
  Sparkles,
  Zap,
  BookOpen,
}

const toneClass: Record<ProjectIconTone, string> = {
  blue: 'bg-[rgba(35,131,226,0.14)] text-[#2383e2] dark:bg-[rgba(35,131,226,0.22)] dark:text-[#6cb5f9]',
  green: 'bg-[rgba(15,123,108,0.14)] text-[#0f7b6c] dark:bg-[rgba(15,123,108,0.22)] dark:text-[#4dab9a]',
  orange: 'bg-[rgba(217,115,13,0.14)] text-[#c77100] dark:bg-[rgba(217,115,13,0.22)] dark:text-[#ffa344]',
  purple: 'bg-[rgba(105,64,165,0.14)] text-[#6940a5] dark:bg-[rgba(105,64,165,0.22)] dark:text-[#9a6dd7]',
  pink: 'bg-[rgba(173,26,114,0.12)] text-[#ad1a72] dark:bg-[rgba(173,26,114,0.2)] dark:text-[#e255a1]',
  yellow: 'bg-[rgba(233,168,0,0.16)] text-[#9a6700] dark:bg-[rgba(233,168,0,0.2)] dark:text-[#ffdc49]',
  red: 'bg-[rgba(224,62,62,0.12)] text-[#e03e3e] dark:bg-[rgba(224,62,62,0.2)] dark:text-[#ff7369]',
  gray: 'bg-[rgba(55,53,47,0.08)] text-[rgba(55,53,47,0.65)] dark:bg-[rgba(255,255,255,0.08)] dark:text-[rgba(255,255,255,0.75)]',
}

const sizeClass = {
  xs: { box: 'h-5 w-5 rounded-[5px]', icon: 'h-3 w-3' },
  sm: { box: 'h-7 w-7 rounded-[6px]', icon: 'h-3.5 w-3.5' },
  md: { box: 'h-10 w-10 rounded-[10px]', icon: 'h-5 w-5' },
  lg: { box: 'h-[72px] w-[72px] rounded-[14px]', icon: 'h-9 w-9' },
} as const

type ProjectIconProps = {
  projectId: string
  size?: keyof typeof sizeClass
  className?: string
}

export function ProjectIcon({ projectId, size = 'sm', className }: ProjectIconProps) {
  const meta = getProjectMeta(projectId)
  const Icon = projectIcons[meta.lucide] ?? BookMarked
  const dims = sizeClass[size]

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        dims.box,
        toneClass[meta.tone],
        className,
      )}
      aria-hidden
    >
      <Icon className={dims.icon} strokeWidth={size === 'lg' ? 1.75 : 2} />
    </span>
  )
}
