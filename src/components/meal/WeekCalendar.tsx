import { Card } from '@/components/ui/Card'
import {
  WEEKDAY_LABELS,
  addDays,
  diffInWeeks,
  formatWeekRange,
  formatWeekTitle,
  getWeekDays,
  getWeekOfMonth,
  isSameDay,
  startOfWeek,
} from '@/lib/meal'
import { cn } from '@/lib/utils'
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react'

/** 오늘 기준 앞뒤로 스크롤할 수 있는 주 수 */
const WEEK_RANGE = 52
/** 마우스 드래그로 인정하기 전 최소 이동 거리(px) */
const DRAG_THRESHOLD = 5
/** 이 비율 이상 끌면 다음/이전 주로 넘긴다 */
const DRAG_SWITCH_RATIO = 0.15

interface WeekCalendarProps {
  selectedDate: Date
  today: Date
  /** 날짜를 직접 눌렀을 때만 호출된다. 스크롤·드래그로 주를 넘겨도 선택은 바뀌지 않는다 */
  onSelect: (date: Date) => void
}

interface DragState {
  startX: number
  startLeft: number
  startIndex: number
  active: boolean
}

export function WeekCalendar({ selectedDate, today, onSelect }: WeekCalendarProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragState | null>(null)
  const suppressClick = useRef(false)

  const weeks = useMemo(() => {
    const base = startOfWeek(today)
    return Array.from({ length: WEEK_RANGE * 2 + 1 }, (_, i) =>
      getWeekDays(addDays(base, (i - WEEK_RANGE) * 7)),
    )
  }, [today])

  const clampIndex = (index: number) => Math.min(weeks.length - 1, Math.max(0, index))

  // 화면에 보이는 주 (선택한 날짜와는 별개)
  const [visibleIndex, setVisibleIndex] = useState(() =>
    clampIndex(WEEK_RANGE + diffInWeeks(today, selectedDate)),
  )
  const initialIndex = useRef(visibleIndex)

  // clientWidth는 정수로 반올림되어 칸 수가 많으면 어긋나므로 전체 폭에서 한 주 폭을 구한다
  const getSlideWidth = (el: HTMLDivElement) => el.scrollWidth / weeks.length

  // 처음 열 때 선택한 날짜의 주로 이동
  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollLeft = initialIndex.current * (el.scrollWidth / weeks.length)
  }, [weeks.length])

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el || el.scrollWidth === 0) return
    setVisibleIndex(clampIndex(Math.round(el.scrollLeft / getSlideWidth(el))))
  }

  // 마우스는 가로 스크롤을 끌어서 할 수 없으므로 드래그를 직접 처리 (터치는 기본 스크롤 사용)
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = {
      startX: e.clientX,
      startLeft: el.scrollLeft,
      startIndex: clampIndex(Math.round(el.scrollLeft / getSlideWidth(el))),
      active: false,
    }
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
      el.style.scrollSnapType = 'none' // 끄는 동안은 스냅이 위치를 되돌리지 않게
    }
    el.scrollLeft = d.startLeft - dx
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    const d = drag.current
    drag.current = null
    if (!el || !d?.active) return

    // 끌기가 끝난 직후 발생하는 click이 날짜 선택으로 이어지지 않게 막는다
    suppressClick.current = true
    window.setTimeout(() => {
      suppressClick.current = false
    }, 0)

    const slideWidth = getSlideWidth(el)
    const dx = e.clientX - d.startX
    let target = d.startIndex
    if (dx < -slideWidth * DRAG_SWITCH_RATIO) target += 1
    else if (dx > slideWidth * DRAG_SWITCH_RATIO) target -= 1

    el.style.scrollSnapType = ''
    el.scrollTo({ left: clampIndex(target) * slideWidth, behavior: 'smooth' })
  }

  const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const visibleWeek = weeks[visibleIndex]
  const { week, totalWeeks } = getWeekOfMonth(visibleWeek[0])

  return (
    <Card className="px-3 pt-3 pb-2">
      <div className="pb-2 text-center">
        <p className="text-base font-bold text-ink">{formatWeekTitle(visibleWeek[0])}</p>
        <p className="text-xs text-ink-mute">{formatWeekRange(visibleWeek[0])}</p>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        className="flex cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {weeks.map((days) => (
          <div
            key={days[0].getTime()}
            className="grid w-full shrink-0 snap-start snap-always grid-cols-7"
          >
            {days.map((day, i) => {
              const selected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, today)
              return (
                <button
                  key={day.getTime()}
                  type="button"
                  onClick={() => onSelect(day)}
                  aria-pressed={selected}
                  aria-current={isToday ? 'date' : undefined}
                  className="flex cursor-pointer flex-col items-center gap-0.5 py-1 text-xs text-ink-sub"
                >
                  {WEEKDAY_LABELS[i]}
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full text-[15px] font-medium',
                      selected ? 'bg-primary text-white' : 'text-ink',
                    )}
                  >
                    {day.getDate()}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-1 rounded-full',
                      isToday ? 'bg-primary' : 'bg-transparent',
                    )}
                  />
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* 그 달의 주 수만큼 표시하는 위치 점 (표시 전용, 누를 수 없음) */}
      <div
        role="img"
        aria-label={`${totalWeeks}주 중 ${week}주차`}
        className="flex justify-center gap-1.5 pt-1 pb-1"
      >
        {Array.from({ length: totalWeeks }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              'h-1.5 rounded-full transition-all',
              i + 1 === week ? 'w-4 bg-primary' : 'w-1.5 bg-line',
            )}
          />
        ))}
      </div>
    </Card>
  )
}
