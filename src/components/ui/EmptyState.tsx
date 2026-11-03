import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 px-6 py-16 text-center',
        className,
      )}
    >
      {icon && <div className="mb-2 text-ink-mute [&>svg]:size-10">{icon}</div>}
      <p className="text-base font-bold text-ink">{title}</p>
      {description && <p className="text-sm text-ink-mute">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
