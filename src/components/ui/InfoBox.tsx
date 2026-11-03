import { CircleCheck, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InfoBoxProps {
  children: ReactNode
  /** info: 파란 안내 박스, plain: 흰 카드 안내(목록형), success: 완료 안내 */
  tone?: 'info' | 'plain' | 'success'
  className?: string
}

export function InfoBox({ children, tone = 'info', className }: InfoBoxProps) {
  const Icon = tone === 'success' ? CircleCheck : Info
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-2xl px-4 py-3.5 text-sm leading-relaxed',
        tone === 'plain'
          ? 'border border-line bg-surface text-ink-sub'
          : 'bg-primary-soft text-primary-strong',
        className,
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
