import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  endClock,
  formatCountdown,
  machineTitle,
  remainingSeconds,
  type Machine,
  type MachineStatus,
} from '@/lib/laundry'
import { cn } from '@/lib/utils'

export type MachineLayout = 'card' | 'tile'

// 섹션 카드 안에 놓이므로 테두리 없이 색으로만 구분한다
const containerClass: Record<MachineStatus, string> = {
  available: 'bg-surface ring-1 ring-gray-300 ring-inset',
  inUse: 'bg-gray-500',
  waiting: 'bg-line',
  mine: 'bg-primary-soft ring-[1.5px] ring-primary ring-inset',
  done: 'bg-primary-soft ring-[1.5px] ring-primary ring-inset',
}

const accentClass: Record<MachineStatus, string> = {
  available: 'text-ink-sub',
  inUse: 'text-gray-100',
  waiting: 'text-ink-sub',
  mine: 'text-primary-strong',
  done: 'text-primary-strong',
}

// 진한 배경(사용 중)에서는 번호·제목도 흰 글씨로 바꾼다
const titleClass: Record<MachineStatus, string> = {
  available: 'text-ink',
  inUse: 'text-white',
  waiting: 'text-ink',
  mine: 'text-ink',
  done: 'text-ink',
}

function cardStatus(machine: Machine, now: number) {
  const left = formatCountdown(remainingSeconds(machine, now))
  switch (machine.status) {
    case 'available':
      return '사용 가능 · 등록하기'
    case 'waiting':
      return '수거 대기'
    case 'mine':
      return `내 이용 · ${left} 남음`
    case 'done':
      return '내 이용 · 완료'
    default: {
      const ends = endClock(machine)
      return `${left} 남음${ends ? ` · ${ends} 종료` : ''}`
    }
  }
}

function tileStatus(machine: Machine, now: number) {
  const left = formatCountdown(remainingSeconds(machine, now))
  switch (machine.status) {
    case 'available':
      return '사용 가능'
    case 'waiting':
      return '수거 대기'
    case 'mine':
      return `내 이용 · ${left}`
    case 'done':
      return '내 이용 · 완료'
    default:
      return left
  }
}

interface MachineCardProps {
  machine: Machine
  /** card: 2열 큰 카드, tile: 3열 작은 타일 */
  layout: MachineLayout
  /** 타이머 기준 현재 시각(epoch ms) */
  now: number
  /** 눌렀을 때. 사용 가능이면 이용 등록, 사용 중이면 상세로 이어진다 */
  onSelect: (machine: Machine) => void
}

export function MachineCard({ machine, layout, now, onSelect }: MachineCardProps) {
  const { number, status, totalMinutes = 0 } = machine
  const remaining = remainingSeconds(machine, now)
  const title = machineTitle(machine)
  const isTile = layout === 'tile'

  // 카드는 정보가 다 보여서 사용 가능한 기기와 내 기기(끝내기·수거)만 눌린다.
  // 타일은 사용 중인 기기도 눌러서 상세를 본다.
  const clickable =
    status === 'available' ||
    status === 'mine' ||
    status === 'done' ||
    (isTile && status === 'inUse')

  const className = cn(
    'flex w-full rounded-xl transition-colors',
    isTile
      ? 'h-[60px] flex-col items-center justify-center px-1 text-center'
      : 'min-h-20 flex-col justify-center px-4 py-3 text-left',
    containerClass[status],
    clickable && 'active:brightness-95',
  )

  const body = isTile ? (
    <>
      <span className={cn('text-lg leading-tight font-bold', titleClass[status])}>{number}</span>
      <span className={cn('text-[11px] leading-tight font-medium', accentClass[status])}>
        {tileStatus(machine, now)}
      </span>
    </>
  ) : (
    <>
      <span className={cn('text-base font-bold', titleClass[status])}>{title}</span>
      <p className={cn('mt-0.5 text-sm font-medium', accentClass[status])}>
        {cardStatus(machine, now)}
      </p>
      {status === 'inUse' && totalMinutes > 0 && (
        <ProgressBar
          value={totalMinutes * 60 - remaining}
          max={totalMinutes * 60}
          className="mt-2 h-1.5 bg-white/20"
          barClassName="bg-white/80"
        />
      )}
    </>
  )

  if (clickable) {
    return (
      <button
        type="button"
        onClick={() => onSelect(machine)}
        aria-label={status === 'available' ? `${title} 이용 등록` : `${title} 상세`}
        className={className}
      >
        {body}
      </button>
    )
  }
  return <div className={className}>{body}</div>
}
