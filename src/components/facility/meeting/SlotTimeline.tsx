import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatFullDate } from '@/lib/meal'
import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  SLOT_COUNT,
  formatSlotDuration,
  slotToTime,
  type SlotSelection,
  type SlotState,
} from '@/lib/timeSlots'
import { cn } from '@/lib/utils'
import { TimelineLegend } from './TimelineLegend'
import { TimelineMinimap, type TimelineViewport } from './TimelineMinimap'

const SLOT_WIDTH = 26
const SLOT_GAP = 2
const SLOT_PITCH = SLOT_WIDTH + SLOT_GAP
const TIMELINE_WIDTH = SLOT_COUNT * SLOT_PITCH - SLOT_GAP
/** 마우스 드래그로 인정하기 전 최소 이동 거리(px) */
const DRAG_THRESHOLD = 5

const HOURS = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
  (_, i) => DAY_START_HOUR + i,
)

// 눌러서 고를 수 있는 칸(free)은 테두리가 있는 흰 칸, 못 고르는 칸은 채워진 회색으로 구분한다
const slotClass: Record<SlotState, string> = {
  free: 'bg-surface ring-1 ring-ink-mute/40 ring-inset hover:bg-primary-soft',
  past: 'bg-muted',
  reserved: 'bg-slate-700',
  // 종료된 예약은 예약 목록의 종료 행 막대와 같은 흐린 색
  reservedPast: 'bg-slate-700/50',
  mine: 'bg-primary',
  minePast: 'bg-primary/35',
}

const slotLabel: Record<SlotState, string> = {
  free: '예약 가능',
  past: '지난 시간',
  reserved: '예약됨',
  reservedPast: '지난 예약',
  mine: '내 예약',
  minePast: '지난 내 예약',
}

interface DragState {
  startX: number
  startLeft: number
  active: boolean
}

interface SlotTimelineProps {
  slots: SlotState[]
  selection: SlotSelection | null
  /** 날짜가 바뀔 때 처음 보여 줄 칸 */
  initialSlot: number
  /** 값이 바뀌면(날짜 변경) 타임라인을 initialSlot으로 되돌린다 */
  resetKey: string
  onSlotClick: (index: number) => void
  /** 예약된 칸(내 예약 포함)을 눌렀을 때 */
  onReservationClick: (index: number) => void
  /** 선택한 날짜. 예약하기 버튼에 표시한다 */
  date: Date
  /** 선택한 시간으로 예약하기 (예약 정보 입력 창을 연다) */
  onBook: () => void
}

/** 09시~24시를 30분 칸으로 늘어놓은, 좌우로 스크롤되는 예약 타임라인 */
export function SlotTimeline({
  slots,
  selection,
  initialSlot,
  resetKey,
  onSlotClick,
  onReservationClick,
  date,
  onBook,
}: SlotTimelineProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragState | null>(null)
  const suppressClick = useRef(false)
  const [viewport, setViewport] = useState<TimelineViewport>({ start: 0, width: 1 })

  const measure = () => {
    const el = scrollerRef.current
    if (!el || el.scrollWidth === 0) return
    setViewport({
      start: el.scrollLeft / el.scrollWidth,
      width: el.clientWidth / el.scrollWidth,
    })
  }

  // 화면 크기가 정해지거나 바뀔 때 미니맵의 보이는 구간을 다시 잰다
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      if (el.scrollWidth === 0) return
      setViewport({
        start: el.scrollLeft / el.scrollWidth,
        width: el.clientWidth / el.scrollWidth,
      })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 처음 열 때와 날짜가 바뀔 때 기준 위치로 이동. initialSlot은 시간이 흐르며 바뀔 수 있어
  // 사용자가 스크롤하던 중에 튀지 않도록 날짜(resetKey)가 바뀔 때만 따른다.
  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollLeft = Math.max(0, initialSlot - 1) * SLOT_PITCH
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  const seek = (ratio: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({
      left: ratio * el.scrollWidth - el.clientWidth / 2,
      behavior: 'smooth',
    })
  }

  // 마우스는 가로 스크롤을 끌어서 할 수 없으므로 드래그를 직접 처리 (터치는 기본 스크롤 사용)
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { startX: e.clientX, startLeft: el.scrollLeft, active: false }
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    const d = drag.current
    if (!el || !d) return
    const dx = e.clientX - d.startX
    if (!d.active) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      d.active = true
      el.setPointerCapture(e.pointerId)
    }
    el.scrollLeft = d.startLeft - dx
  }

  const endDrag = () => {
    const d = drag.current
    drag.current = null
    if (!d?.active) return
    // 끌기가 끝난 직후 발생하는 click이 칸 선택으로 이어지지 않게 막는다
    suppressClick.current = true
    window.setTimeout(() => {
      suppressClick.current = false
    }, 0)
  }

  const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <Card padded={false} className="space-y-3 py-3">
      {/* 바깥 px-3 덕분에 스크롤해도 칸이 카드 가장자리에 붙지 않고 안쪽 여백에서 잘린다 */}
      <div className="px-3">
      <div
        ref={scrollerRef}
        onScroll={measure}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        className="cursor-grab overflow-x-auto overscroll-x-contain [scrollbar-width:none] select-none [&::-webkit-scrollbar]:hidden"
      >
        <div className="box-content px-2" style={{ width: TIMELINE_WIDTH }}>
          <div className="flex" style={{ gap: SLOT_GAP }}>
            {slots.map((state, i) => {
              const selected = selection && i >= selection.from && i <= selection.to
              // 비어 있는 칸은 시간 선택, 예약된 칸은 상세 보기. 지난 빈 칸만 누를 수 없다
              const isReservation = state !== 'free' && state !== 'past'
              return (
                <button
                  key={i}
                  type="button"
                  disabled={state === 'past'}
                  aria-pressed={selected ? true : undefined}
                  aria-label={`${slotToTime(i)} ~ ${slotToTime(i + 1)} ${selected ? '선택됨' : slotLabel[state]}${isReservation ? ' 상세 보기' : ''}`}
                  onClick={() =>
                    isReservation ? onReservationClick(i) : onSlotClick(i)
                  }
                  className={cn(
                    'h-12 shrink-0 rounded-[3px] transition-colors disabled:cursor-default',
                    selected
                      ? 'bg-primary-soft ring-2 ring-primary ring-inset'
                      : slotClass[state],
                  )}
                  style={{ width: SLOT_WIDTH }}
                />
              )
            })}
          </div>

          <div aria-hidden="true" className="relative mt-1 h-5 text-xs text-ink-mute">
            {HOURS.map((hour, i) => (
              <span
                key={hour}
                className="absolute top-0 -translate-x-1/2"
                style={{ left: i * 2 * SLOT_PITCH - SLOT_GAP / 2 }}
              >
                {String(hour).padStart(2, '0')}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>

      <TimelineMinimap
        slots={slots}
        selection={selection}
        viewport={viewport}
        onSeek={seek}
      />

      <TimelineLegend />

      {/* 시간을 고르면 회색에서 파랑으로 바뀌고 날짜와 시간이 뜬다. 높이는 항상 같다 */}
      <div className="px-3">
        <Button
          fullWidth
          size="lg"
          variant={selection ? 'primary' : 'soft'}
          disabled={!selection}
          onClick={onBook}
        >
          {selection ? (
            <span className="flex flex-col items-center leading-tight">
              <span>예약하기</span>
              <span className="text-xs font-medium opacity-90">
                {formatFullDate(date)} · {slotToTime(selection.from)} ~{' '}
                {slotToTime(selection.to + 1)} ·{' '}
                {formatSlotDuration(selection.to - selection.from + 1)}
              </span>
            </span>
          ) : (
            '예약하기'
          )}
        </Button>
      </div>
    </Card>
  )
}
