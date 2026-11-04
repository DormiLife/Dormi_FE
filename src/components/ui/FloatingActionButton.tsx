import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  /** 스크린리더용 이름 (아이콘만 있으므로 필수) */
  label: string
  icon: ReactNode
  onClick?: () => void
  className?: string
}

export function FloatingActionButton({
  label,
  icon,
  onClick,
  className,
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary text-surface shadow-lg shadow-primary/30 transition-colors active:bg-primary-strong [&>svg]:size-7',
        className,
      )}
    >
      {icon}
    </button>
  )
}
