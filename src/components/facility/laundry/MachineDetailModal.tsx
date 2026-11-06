import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  endClock,
  formatCountdown,
  machineTitle,
  remainingSeconds,
  type Machine,
} from '@/lib/laundry'

interface MachineDetailModalProps {
  /** 값이 있으면 열린다 */
  machine: Machine | null
  now: number
  onClose: () => void
  /** 이용 끝내기, 수거하기 */
  onRelease: (machineId: string) => void
}

/** 사용 중인 기기의 종료 시각과 진행 상황 */
export function MachineDetailModal({
  machine,
  now,
  onClose,
  onRelease,
}: MachineDetailModalProps) {
  const open = machine !== null && machine.status !== 'available'
  const remaining = machine ? remainingSeconds(machine, now) : 0
  const totalSeconds = (machine?.totalMinutes ?? 0) * 60
  const ends = machine ? endClock(machine) : undefined
  const isDone = machine?.status === 'done'

  return (
    <Modal open={open} onClose={onClose} aria-label="기기 상세">
      {machine && open && (
        <>
          <h2 className="text-lg font-bold text-ink">
            {machineTitle(machine)}
            {(machine.status === 'mine' || isDone) && ' · 내 이용'}
          </h2>
          {isDone ? (
            <p className="mt-1 text-sm font-medium text-primary-strong">
              이용이 끝났어요. 빨래를 수거해 주세요
            </p>
          ) : (
            <>
              {ends && (
                <p className="mt-1 text-sm text-ink-sub">{ends} 완료 예정</p>
              )}
              <ProgressBar
                value={totalSeconds - remaining}
                max={totalSeconds}
                className="mt-4 h-2"
                barClassName={machine.status === 'mine' ? undefined : 'bg-ink-mute'}
              />
              <p className="mt-2 text-sm text-ink-mute tabular-nums">
                남은 시간 {formatCountdown(remaining)} / 전체 {machine.totalMinutes}분
              </p>
            </>
          )}
          {isDone && (
            <Button
              size="sm"
              fullWidth
              className="mt-6"
              onClick={() => onRelease(machine.id)}
            >
              수거하기
            </Button>
          )}
          {machine.status === 'mine' && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              className="mt-6"
              onClick={() => onRelease(machine.id)}
            >
              이용 끝내기
            </Button>
          )}
          <Button
            variant="soft"
            size="sm"
            fullWidth
            className="mt-2"
            onClick={onClose}
            data-autofocus
          >
            닫기
          </Button>
        </>
      )}
    </Modal>
  )
}
