import { CalendarDays, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatFullDate } from '@/lib/meal'
import { cn } from '@/lib/utils'
import type { DayReservationItem } from '@/pages/facility/useMeetingBooking'

interface DayReservationListProps {
  date: Date
  isToday: boolean
  items: DayReservationItem[]
  onItemClick: (item: DayReservationItem) => void
}

/** 선택한 날짜의 예약 내역. 행을 누르면 그 예약의 상세 창이 열린다 */
export function DayReservationList({
  date,
  isToday,
  items,
  onItemClick,
}: DayReservationListProps) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between px-0.5">
        <h2 className="text-base font-bold text-ink">
          {isToday ? '오늘 예약' : '예약'} {items.length}건
        </h2>
        <span className="text-sm text-ink-mute">{formatFullDate(date)}</span>
      </div>

      {items.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            icon={<CalendarDays />}
            title="이 날은 예약이 없어요"
            description="원하는 시간을 선택해 예약해 보세요."
            className="py-8"
          />
        </Card>
      ) : (
        <Card padded={false} className="divide-y divide-line overflow-hidden">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 text-left',
                item.isPast && 'opacity-50',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'w-1 self-stretch rounded-full',
                  item.isMine ? 'bg-primary' : 'bg-slate-700',
                )}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-ink">
                  {item.start} ~ {item.end}
                </span>
                <span className="mt-0.5 block text-sm text-ink-mute">
                  {item.isMine ? '내 예약' : item.reserver}
                </span>
              </span>
              {item.isPast ? (
                <Badge tone="gray" size="sm">
                  종료
                </Badge>
              ) : (
                item.isMine && (
                  <Badge tone="blue" size="sm">
                    내 예약
                  </Badge>
                )
              )}
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-ink-mute"
              />
            </button>
          ))}
        </Card>
      )}
    </section>
  )
}
