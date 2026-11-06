import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  toReservedSlots,
  type Reservation,
} from '@/lib/timeSlots'
import { cn } from '@/lib/utils'

const TICK_HOURS = [9, 12, 15, 18, 21, 24]

function tickStyle(hour: number) {
  const ratio = (hour - DAY_START_HOUR) / (DAY_END_HOUR - DAY_START_HOUR)
  const shift = ratio === 0 ? '0' : ratio === 1 ? '-100%' : '-50%'
  return { left: `${ratio * 100}%`, transform: `translateX(${shift})` }
}

interface MeetingRoomTimelineProps {
  reservations: Reservation[]
  className?: string
}

export function MeetingRoomTimeline({
  reservations,
  className,
}: MeetingRoomTimelineProps) {
  const slots = toReservedSlots(reservations)

  return (
    <div className={cn('rounded-2xl bg-canvas p-3', className)}>
      <div
        role="img"
        aria-label="오늘 회의실 예약 현황"
        className="flex gap-0.5"
      >
        {slots.map((reserved, i) => (
          <span
            key={i}
            className={cn(
              'h-6 flex-1 rounded-[3px]',
              reserved ? 'bg-primary' : 'bg-ink-mute/20',
            )}
          />
        ))}
      </div>

      <div className="relative mt-2 h-4 text-xs text-ink-mute" aria-hidden="true">
        {TICK_HOURS.map((hour) => (
          <span
            key={hour}
            className="absolute top-0"
            style={tickStyle(hour)}
          >
            {String(hour).padStart(2, '0')}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-4 text-sm text-ink-sub">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-[3px] bg-primary" />
          예약됨
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-[3px] bg-ink-mute/20" />
          비어 있음
        </span>
      </div>
    </div>
  )
}
