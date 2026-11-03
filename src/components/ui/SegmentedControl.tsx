import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Option<T extends string> {
  value: T
  label: ReactNode
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  /**
   * soft: 선택 시 연한 파랑 + 파란 테두리 (게시판 선택, 이용 시간)
   * solid: 선택 시 파란 채움 (성별)
   * pill: 둥근 알약 (말머리)
   */
  variant?: 'soft' | 'solid' | 'pill'
  /** soft/solid의 열 개수. 기본값은 옵션 개수 */
  columns?: number
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  variant = 'soft',
  columns,
  className,
}: SegmentedControlProps<T>) {
  const isPill = variant === 'pill'

  return (
    <div
      role="radiogroup"
      className={cn(isPill ? 'flex flex-wrap gap-2' : 'grid gap-2.5', className)}
      style={
        isPill
          ? undefined
          : { gridTemplateColumns: `repeat(${columns ?? options.length}, 1fr)` }
      }
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'border text-base font-semibold transition-colors',
              isPill ? 'h-10 rounded-full px-5 text-sm' : 'h-12 rounded-control',
              selected
                ? variant === 'soft'
                  ? 'border-primary bg-primary-soft text-primary-strong'
                  : 'border-primary bg-primary text-white'
                : 'border-line bg-surface text-ink-sub',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
