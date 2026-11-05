import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'
import {
  endClock,
  formatCountdown,
  machineTitle,
  remainingSeconds,
  type Machine,
} from '@/lib/laundry'

interface MyMachineBannerProps {
  machine: Machine
  /** 타이머 기준 현재 시각(epoch ms) */
  now: number
  /** 이용 끝내기, 수거하기 */
  onRelease: (machineId: string) => void
}

/** 내가 이용 중인 기기 한 대의 진행 상황. 이용이 끝나면 수거하기로 바뀐다 */
export function MyMachineBanner({ machine, now, onRelease }: MyMachineBannerProps) {
  const title = machineTitle(machine)

  const remaining = remainingSeconds(machine, now)
  const totalSeconds = (machine.totalMinutes ?? 0) * 60
  const ends = endClock(machine)
  const isDone = machine.status === 'done'
  const elapsedMinutes = Math.max(
    0,
    Math.floor((now - (machine.endsAtMs ?? now)) / 60_000),
  )

  return (
    <section
      aria-label={`${title} ${isDone ? '이용 완료' : '이용 중'}`}
      className="rounded-2xl border border-primary/30 bg-primary-soft px-4 py-3"
    >
      <div className="flex items-center gap-4">
        <ProgressRing
          value={isDone ? 1 : totalSeconds - remaining}
          max={isDone ? 1 : totalSeconds}
          size={64}
        >
          {isDone ? (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-primary"
              aria-hidden="true"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          ) : (
            <span className="text-xs tabular-nums">{formatCountdown(remaining)}</span>
          )}
        </ProgressRing>
        <div>
          <p className="text-base font-bold text-ink">
            {title} {isDone ? '이용 완료' : '이용 중'}
          </p>
          <p className="mt-0.5 text-sm font-medium text-primary-strong">
            {isDone
              ? elapsedMinutes > 0
                ? `${elapsedMinutes}분 전에 끝났어요`
                : '방금 끝났어요'
              : ends && `${ends} 완료 예정`}
          </p>
        </div>
      </div>
      <Button
        variant={isDone ? 'primary' : 'outline'}
        size="sm"
        fullWidth
        className="mt-3"
        onClick={() => onRelease(machine.id)}
      >
        {isDone ? '수거하기' : '이용 끝내기'}
      </Button>
    </section>
  )
}
