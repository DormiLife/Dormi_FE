import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type BadgeTone =
  | 'blue'
  | 'green'
  | 'orange'
  | 'gray'
  | 'red'
  | 'yellow'
  | 'purple'

const toneClass: Record<BadgeTone, string> = {
  blue: 'bg-primary-soft text-primary-strong',
  green: 'bg-success-soft text-success',
  orange: 'bg-warning-soft text-warning',
  gray: 'bg-muted text-ink-sub',
  red: 'bg-danger-soft text-danger',
  yellow: 'bg-amber-100 text-amber-800',
  purple: 'bg-purple-100 text-purple-700',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  size?: 'sm' | 'md'
}

export function Badge({
  tone = 'gray',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        toneClass[tone],
        className,
      )}
      {...props}
    />
  )
}
