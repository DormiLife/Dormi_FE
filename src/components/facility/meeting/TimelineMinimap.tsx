import { SLOT_COUNT, type SlotSelection, type SlotState } from '@/lib/timeSlots'
import { cn } from '@/lib/utils'

const MINIMAP_LABELS = ['09', '12', '15', '18', '21', '24']

const slotClass: Record<SlotState, string> = {
  free: 'bg-surface ring-1 ring-ink-mute/40 ring-inset',
  past: 'bg-muted',
  reserved: 'bg-slate-700',
  reservedPast: 'bg-slate-700/50',
  mine: 'bg-primary',
  minePast: 'bg-primary/35',
}

export interface TimelineViewport {
  /** 하루 전체 중 보이는 구간의 시작 (0~1) */
  start: number
  /** 하루 전체 중 보이는 구간의 폭 (0~1) */
  width: number
}

interface TimelineMinimapProps {
  slots: SlotState[]
  selection: SlotSelection | null
  viewport: TimelineViewport
  /** 누른 위치를 하루 전체 기준 비율(0~1)로 알려준다 */
  onSeek: (ratio: number) => void
}

/** 하루 전체 예약 현황과 지금 타임라인에 보이는 구간을 보여 주는 얇은 막대 */
export function TimelineMinimap({
  slots,
  selection,
  viewport,
  onSeek,
}: TimelineMinimapProps) {
  return (
    // 타임라인의 칸 버튼이 키보드 조작을 맡으므로 이 막대는 보조 표시로만 둔다
    <div aria-hidden="true" className="px-3">
      <div
        className="relative flex cursor-pointer gap-px"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          onSeek((e.clientX - rect.left) / rect.width)
        }}
      >
        {Array.from({ length: SLOT_COUNT }, (_, i) => {
          const selected = selection && i >= selection.from && i <= selection.to
          return (
            <span
              key={i}
              className={cn(
                'h-2 flex-1 rounded-[1px]',
                selected ? 'bg-primary-soft ring-1 ring-primary ring-inset' : slotClass[slots[i]],
              )}
            />
          )
        })}
        <span
          className="pointer-events-none absolute -inset-y-1 rounded border-2 border-ink"
          style={{
            left: `${viewport.start * 100}%`,
            width: `${viewport.width * 100}%`,
          }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-mute">
        {MINIMAP_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
