import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ListRowProps {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** 오른쪽 영역 (알림 개수 뱃지 등). chevron 앞에 표시 */
  right?: ReactNode
  onClick?: () => void
  /** 기본값: onClick이 있으면 true */
  chevron?: boolean
  danger?: boolean
  className?: string
}

export function ListRow({
  icon,
  title,
  description,
  right,
  onClick,
  chevron = Boolean(onClick),
  danger,
  className,
}: ListRowProps) {
  const body = (
    <>
      {icon}
      <span className="min-w-0 flex-1 text-left">
        <span
          className={cn(
            'block text-base font-semibold',
            danger ? 'text-danger' : 'text-ink',
          )}
        >
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-sm text-ink-mute">
            {description}
          </span>
        )}
      </span>
      {right}
      {chevron && <ChevronRight className="size-5 shrink-0 text-ink-mute" />}
    </>
  )

  const base = cn('flex w-full items-center gap-3.5 px-5 py-4', className)

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={base}>
        {body}
      </button>
    )
  }
  return <div className={base}>{body}</div>
}
