import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import {
  WEEKDAY_LABELS,
  formatDotDate,
  getMonthCells,
  isSameDay,
  startOfDay,
} from '@/lib/meal'
import { cn } from '@/lib/utils'
import { Modal } from './Modal'

/** 연·월을 하나의 숫자로 (월 단위 비교용) */
const monthIndex = (date: { year: number; month: number }) =>
  date.year * 12 + date.month

interface MonthPickerProps {
  value: Date
  min: Date
  onSelect: (date: Date) => void
}

// Modal은 닫히면 children을 그리지 않아서, 열 때마다 선택한 날짜의 달에서 시작한다
function MonthPicker({ value, min, onSelect }: MonthPickerProps) {
  const [view, setView] = useState({
    year: value.getFullYear(),
    month: value.getMonth(),
  })
  const minView = { year: min.getFullYear(), month: min.getMonth() }
  const today = startOfDay(new Date())

  const move = (delta: number) => {
    const index = monthIndex(view) + delta
    setView({ year: Math.floor(index / 12), month: index % 12 })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={monthIndex(view) <= monthIndex(minView)}
          aria-label="이전 달"
          className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-muted disabled:text-ink-mute/40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="size-5" />
        </button>
        <p className="text-base font-bold text-ink">
          {view.year}년 {view.month + 1}월
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="다음 달"
          className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-muted"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 text-center text-xs text-ink-mute">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-1.5">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {getMonthCells(view.year, view.month).map((day, i) => {
          if (!day) return <span key={i} />
          const disabled = day < min
          const selected = isSameDay(day, value)
          const isToday = isSameDay(day, today)
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-current={isToday ? 'date' : undefined}
              onClick={() => onSelect(day)}
              className={cn(
                'mx-auto flex size-10 items-center justify-center rounded-full text-[15px] font-medium transition-colors',
                selected
                  ? 'bg-primary text-white'
                  : disabled
                    ? 'text-ink-mute/40'
                    : isToday
                      ? 'text-primary ring-1 ring-primary ring-inset hover:bg-primary-soft'
                      : 'text-ink hover:bg-primary-soft',
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface DatePickerFieldProps {
  value: Date
  /** 이 날짜보다 이전은 고를 수 없다 */
  min: Date
  onChange: (date: Date) => void
  className?: string
}

/** 선택한 날짜(2026.11.04)를 보여 주고, 누르면 달력이 열려 날짜를 고르는 필드 */
export function DatePickerField({
  value,
  min,
  onChange,
  className,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`날짜 선택, 현재 ${formatDotDate(value)}`}
        className={cn(
          'flex w-full items-center gap-3 rounded-card border border-line bg-surface px-5 py-4 text-left',
          className,
        )}
      >
        <CalendarDays className="size-5 shrink-0 text-primary" />
        <span className="flex-1 text-lg font-bold text-ink">
          {formatDotDate(value)}
        </span>
        <ChevronDown className="size-5 shrink-0 text-ink-mute" />
      </button>

      <Modal open={open} onClose={() => setOpen(false)} aria-label="날짜 선택">
        <MonthPicker
          value={value}
          min={min}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
        />
      </Modal>
    </>
  )
}
