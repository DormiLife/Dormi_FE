import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: ReactNode
  /** 있으면 왼쪽에 뒤로가기 버튼을 표시 */
  onBack?: () => void
  /** 오른쪽 액션 (등록 버튼, 모두 읽음, 알림 아이콘 등) */
  right?: ReactNode
  className?: string
}

export function PageHeader({ title, onBack, right, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-surface px-4',
        className,
      )}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="-ml-1 flex size-10 items-center justify-center text-ink"
        >
          <ChevronLeft className="size-7" />
        </button>
      )}
      <h1 className="min-w-0 flex-1 truncate text-xl font-bold text-ink">
        {title}
      </h1>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  )
}
