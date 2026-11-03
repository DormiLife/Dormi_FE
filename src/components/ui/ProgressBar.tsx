import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
}

export function ProgressBar({ value, max = 100, className }: ProgressBarProps) {
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
        className="h-full rounded-full bg-primary transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
