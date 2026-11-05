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
   * track: 회색 트랙 안에서 선택 칸이 흰색으로 올라오는 토글 (목록 보기 전환)
   */
  variant?: 'soft' | 'solid' | 'pill' | 'track'
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
  const isTrack = variant === 'track'

  return (
    <div
      role="radiogroup"
      className={cn(
        isPill
          ? 'flex flex-wrap gap-2'
          : isTrack
            ? // isolate: 안쪽 버튼의 z-10이 sticky 헤더(z-10) 위로 새어 나가지 않게 한다
              'relative isolate flex rounded-card bg-muted p-1'
            : 'grid gap-2.5',
        className,
      )}
      style={
        isPill || isTrack
          ? undefined
          : { gridTemplateColumns: `repeat(${columns ?? options.length}, 1fr)` }
      }
    >
      {isTrack && (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 rounded-2xl bg-surface shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{
            width: `calc((100% - 0.5rem) / ${options.length})`,
            transform: `translateX(${Math.max(
              options.findIndex((o) => o.value === value),
              0,
            ) * 100}%)`,
          }}
        />
      )}
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={
              isTrack
                ? cn(
                    'relative z-10 h-10 flex-1 rounded-2xl text-sm font-semibold transition-colors duration-200',
                    selected ? 'text-ink' : 'text-ink-mute',
                  )
                : cn(
                    'border text-base font-semibold transition-colors',
                    isPill
                      ? 'h-10 rounded-full px-5 text-sm'
                      : 'h-12 rounded-control',
                    selected
                      ? variant === 'soft'
                        ? 'border-primary bg-primary-soft text-primary-strong'
                        : 'border-primary bg-primary text-white'
                      : 'border-line bg-surface text-ink-sub',
                  )
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
