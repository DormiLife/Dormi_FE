import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FilterChipItem<T extends string> {
  value: T
  label: ReactNode
}

interface FilterChipsProps<T extends string> {
  items: FilterChipItem<T>[]
  value: T
  onChange: (value: T) => void
  /** true면 칩이 너비를 균등하게 나눠 가득 채운다 */
  fill?: boolean
  className?: string
}

export function FilterChips<T extends string>({
  items,
  value,
  onChange,
  fill,
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      role="group"
      className={cn('flex gap-2 overflow-x-auto px-4 py-3', className)}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors',
              fill && 'flex-1 px-0',
              active ? 'bg-ink text-surface' : 'bg-muted text-ink-sub',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
