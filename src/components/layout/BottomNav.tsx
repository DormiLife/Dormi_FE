import { Link } from '@tanstack/react-router'
import { CalendarDays, House, MessageCircle, User } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

export type NavKey = 'home' | 'board' | 'facility' | 'my'

const items: {
  key: NavKey
  label: string
  /** 라우트가 아직 없는 탭은 비워둔다 */
  to?: '/' | '/my'
  /** 아이콘 크기를 개별 조정할 때 */
  iconClass?: string
  Icon: ComponentType<{ className?: string }>
}[] = [
  { key: 'home', label: '홈', to: '/', Icon: House },
  { key: 'board', label: '게시판', iconClass: 'size-[22px]', Icon: MessageCircle },
  { key: 'facility', label: '시설', Icon: CalendarDays },
  { key: 'my', label: '마이', to: '/my', Icon: User },
]

interface BottomNavProps {
  active: NavKey
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-10 flex shrink-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
      {items.map(({ key, label, to, iconClass, Icon }) => {
        const selected = key === active
        const className = cn(
          'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold',
          selected ? 'text-primary' : 'text-ink-mute',
        )
        const content = (
          <>
            <span className="flex size-6 items-center justify-center">
              <Icon className={iconClass ?? 'size-6'} />
            </span>
            {label}
          </>
        )
        return to ? (
          <Link
            key={key}
            to={to}
            aria-current={selected ? 'page' : undefined}
            className={className}
          >
            {content}
          </Link>
        ) : (
          <button key={key} type="button" className={className}>
            {content}
          </button>
        )
      })}
    </nav>
  )
}
