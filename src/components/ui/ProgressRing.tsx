import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  value: number
  max: number
  /** 링 안에 들어갈 내용 (보통 남은 시간) */
  children?: ReactNode
  size?: number
  strokeWidth?: number
  className?: string
  /** 기본 stroke-primary/20 */
  trackClassName?: string
  /** 기본 stroke-primary */
  barClassName?: string
}

/** 원형 진행 표시. 기본 색은 primary이고 trackClassName·barClassName으로 바꾼다 */
export function ProgressRing({
  value,
  max,
  children,
  size = 64,
  strokeWidth = 6,
  className,
  trackClassName = 'stroke-primary/20',
  barClassName = 'stroke-primary',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className={cn('transition-[stroke-dashoffset]', barClassName)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-ink">
        {children}
      </div>
    </div>
  )
}
