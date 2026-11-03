import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean
  padded?: boolean
}

export function Card({
  selected,
  padded = true,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border bg-surface',
        selected ? 'border-2 border-primary' : 'border-line',
        padded && 'p-5',
        className,
      )}
      {...props}
    />
  )
}
