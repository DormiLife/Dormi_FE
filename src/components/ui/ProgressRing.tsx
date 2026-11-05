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
}

/** 원형 진행 표시. 채워지는 색은 text-primary를 따라간다 */
export function ProgressRing({
  value,
  max,
  children,
  size = 64,
  strokeWidth = 6,
  className,
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
          className="stroke-primary/20"
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
          className="stroke-primary transition-[stroke-dashoffset]"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-ink">
        {children}
      </div>
    </div>
  )
}
