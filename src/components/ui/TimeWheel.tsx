import { useLayoutEffect, useRef, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

const ITEM_HEIGHT = 40
const VISIBLE_ITEMS = 5
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS
const EDGE_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2)

const fade =
  'linear-gradient(transparent, #000 35%, #000 65%, transparent)'

interface WheelColumnProps {
  label: string
  unit: string
  items: number[]
  value: number
  onChange: (value: number) => void
  /** 항목을 화면에 보여줄 글자로 */
  format?: (value: number) => string
}

function WheelColumn({
  label,
  unit,
  items,
  value,
  onChange,
  format = String,
}: WheelColumnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const selectedIndex = Math.max(0, items.indexOf(value))

  // 처음 그려질 때 선택값 위치로 맞춘다. 이후는 사용자가 스크롤하는 대로 따라간다.
  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = selectedIndex * ITEM_HEIGHT
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const move = (index: number) => {
    const next = Math.min(items.length - 1, Math.max(0, index))
    ref.current?.scrollTo({ top: next * ITEM_HEIGHT })
    onChange(items[next])
  }

  const handleScroll = () => {
    if (!ref.current) return
    const index = Math.round(ref.current.scrollTop / ITEM_HEIGHT)
    const next = items[Math.min(items.length - 1, Math.max(0, index))]
    if (next !== value) onChange(next)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      move(selectedIndex - 1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      move(selectedIndex + 1)
    }
  }

  return (
    <div className="flex items-center">
      <div
        ref={ref}
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={items[0]}
        aria-valuemax={items[items.length - 1]}
        aria-valuetext={`${format(value)}${unit}`}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="w-20 snap-y snap-mandatory overflow-y-scroll rounded-lg outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-scrollbar]:hidden"
        style={{
          height: WHEEL_HEIGHT,
          paddingBlock: EDGE_PADDING,
          WebkitMaskImage: fade,
          maskImage: fade,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item}
            aria-hidden="true"
            onClick={() => move(index)}
            className={cn(
              'flex snap-center items-center justify-center text-2xl',
              item === value ? 'font-bold text-ink' : 'text-ink-mute/70',
            )}
            style={{ height: ITEM_HEIGHT }}
          >
            {format(item)}
          </div>
        ))}
      </div>
      <span className="ml-1 w-8 text-base font-medium text-ink-sub">{unit}</span>
    </div>
  )
}

interface TimeWheelProps {
  hours: number
  minutes: number
  hourItems: number[]
  minuteItems: number[]
  onChange: (next: { hours: number; minutes: number }) => void
  className?: string
}

/** 아이폰 타이머처럼 시간·분을 돌려서 고르는 휠 */
export function TimeWheel({
  hours,
  minutes,
  hourItems,
  minuteItems,
  onChange,
  className,
}: TimeWheelProps) {
  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ height: WHEEL_HEIGHT }}
    >
      {/* 가운데 선택 영역 표시 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 rounded-xl bg-muted"
        style={{ height: ITEM_HEIGHT, top: EDGE_PADDING }}
      />
      <div className="relative flex items-center gap-2">
        <WheelColumn
          label="시간"
          unit="시간"
          items={hourItems}
          value={hours}
          onChange={(h) => onChange({ hours: h, minutes })}
        />
        <WheelColumn
          label="분"
          unit="분"
          items={minuteItems}
          value={minutes}
          onChange={(m) => onChange({ hours, minutes: m })}
          format={(v) => String(v).padStart(2, '0')}
        />
      </div>
    </div>
  )
}
