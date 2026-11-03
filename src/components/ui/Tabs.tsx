import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabItem<T extends string> {
  value: T
  label: ReactNode
}

interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn('flex border-b border-line bg-surface', className)}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex-1 border-b-[3px] py-3.5 text-center text-base font-bold transition-colors',
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-ink-mute',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
