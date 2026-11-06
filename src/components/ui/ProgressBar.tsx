import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  /** 채워지는 막대의 색 등 (기본: 파랑) */
  barClassName?: string
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-line', className)}
    >
      <div
        className={cn(
          'h-full rounded-full bg-primary transition-[width]',
          barClassName,
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
