import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const sizeClass = {
  md: 'size-12 rounded-2xl [&>svg]:size-5',
  lg: 'size-[52px] rounded-2xl [&>svg]:size-6',
}

const toneClass = {
  soft: 'bg-primary-soft text-primary',
  solid: 'bg-primary text-white',
  gray: 'bg-muted text-ink-sub',
}

interface IconBoxProps {
  children: ReactNode
  size?: keyof typeof sizeClass
  tone?: keyof typeof toneClass
  className?: string
}

export function IconBox({
  children,
  size = 'md',
  tone = 'soft',
  className,
}: IconBoxProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        sizeClass[size],
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
