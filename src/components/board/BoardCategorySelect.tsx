import {
  BOARD_CATEGORY_META,
  type BoardCategory,
} from '@/lib/board'
import { cn } from '@/lib/utils'

/** 글쓰기에서 보여줄 순서 */
const ORDER: BoardCategory[] = ['general', 'question', 'info']

const toneClass: Record<BoardCategory, { dot: string; selected: string }> = {
  general: {
    dot: 'bg-ink-sub',
    selected: 'border-ink-sub bg-muted text-ink-sub',
  },
  question: {
    dot: 'bg-warning',
    selected: 'border-warning bg-warning-soft text-warning',
  },
  info: {
    dot: 'bg-info',
    selected: 'border-info bg-info-soft text-info',
  },
}

interface BoardCategorySelectProps {
  value: BoardCategory | null
  onChange: (category: BoardCategory) => void
  className?: string
}

export function BoardCategorySelect({
  value,
  onChange,
  className,
}: BoardCategorySelectProps) {
  return (
    <div
      role="radiogroup"
      aria-label="카테고리"
      className={cn('flex gap-2', className)}
    >
      {ORDER.map((category) => {
        const selected = value === category
        return (
          <button
            key={category}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(category)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-colors',
              selected
                ? toneClass[category].selected
                : 'border-line bg-surface text-ink-sub',
            )}
          >
            <span
              aria-hidden="true"
              className={cn('size-1.5 rounded-full', toneClass[category].dot)}
            />
            {BOARD_CATEGORY_META[category].label}
          </button>
        )
      })}
    </div>
  )
}
