import { CalendarDays, House, MessageCircle, User } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

export type NavKey = 'home' | 'board' | 'facility' | 'my'

const items: {
  key: NavKey
  label: string
  Icon: ComponentType<{ className?: string }>
}[] = [
  { key: 'home', label: '홈', Icon: House },
  { key: 'board', label: '게시판', Icon: MessageCircle },
  { key: 'facility', label: '시설', Icon: CalendarDays },
  { key: 'my', label: '마이', Icon: User },
]

interface BottomNavProps {
  active: NavKey
  onChange: (key: NavKey) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-10 flex shrink-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
      {items.map(({ key, label, Icon }) => {
        const selected = key === active
        return (
          <button
            key={key}
            type="button"
            aria-current={selected ? 'page' : undefined}
            onClick={() => onChange(key)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold',
              selected ? 'text-primary' : 'text-ink-mute',
            )}
          >
            <Icon className="size-6" />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
