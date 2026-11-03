import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: ReactNode
  description?: ReactNode
  actionLabel?: string
  actionIconOnly?: boolean
  onAction?: () => void
  className?: string
}

export function SectionHeader({
  title,
  description,
  actionLabel,
  actionIconOnly,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-ink-mute">{description}</p>
        )}
      </div>
      {actionLabel && actionIconOnly && (
        <button
          type="button"
          onClick={onAction}
          aria-label={actionLabel}
          className="-mt-0.5 -mr-1 flex size-8 shrink-0 items-center justify-center text-ink"
        >
          <ChevronRight className="size-6" />
        </button>
      )}
      {actionLabel && !actionIconOnly && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex shrink-0 items-center text-sm font-semibold text-primary"
        >
          {actionLabel}
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  )
}
