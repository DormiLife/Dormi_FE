import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  header?: ReactNode
  /** 하단 고정 영역 (저장, 예약하기 버튼 등). BottomNav 위에 붙는다 */
  footer?: ReactNode
  bottomNav?: ReactNode
  /** 오른쪽 하단에 떠 있는 버튼 (FloatingActionButton). BottomNav 위에 붙는다 */
  fab?: ReactNode
  children: ReactNode
  /** 본문 바깥 여백 제거 (목록처럼 가장자리까지 채울 때) */
  flush?: boolean
  className?: string
}

export function PageLayout({
  header,
  footer,
  bottomNav,
  fab,
  children,
  flush,
  className,
}: PageLayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-canvas">
      {header}
      <main className={cn('flex-1', !flush && 'px-4 py-4', className)}>
        {children}
      </main>
      {footer && (
        <div
          className={cn(
            'sticky z-10 bg-canvas px-4 pt-3',
            bottomNav
              ? 'bottom-[calc(4.25rem+env(safe-area-inset-bottom))] pb-3'
              : 'bottom-0 pb-[calc(1rem+env(safe-area-inset-bottom))]',
          )}
        >
          {footer}
        </div>
      )}
      {fab && (
        <div
          className={cn(
            'pointer-events-none sticky z-20 flex h-0 items-end justify-end px-4',
            bottomNav
              ? 'bottom-[calc(4.25rem+env(safe-area-inset-bottom))]'
              : 'bottom-[env(safe-area-inset-bottom)]',
          )}
        >
          <div className="mb-4">{fab}</div>
        </div>
      )}
      {bottomNav}
    </div>
  )
}
