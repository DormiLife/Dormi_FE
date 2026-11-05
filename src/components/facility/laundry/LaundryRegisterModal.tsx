import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TimeWheel } from '@/components/ui/TimeWheel'
import {
  DEFAULT_USAGE,
  MAX_USAGE_HOURS,
  USAGE_MINUTE_STEP,
  clockAfter,
  machineKindLabel,
  type Machine,
} from '@/lib/laundry'
import { cn } from '@/lib/utils'
import { KindIcon } from './KindIcon'

const hourItems = Array.from({ length: MAX_USAGE_HOURS + 1 }, (_, i) => i)
const minuteItems = Array.from(
  { length: 60 / USAGE_MINUTE_STEP },
  (_, i) => i * USAGE_MINUTE_STEP,
)

interface RegisterFormProps {
  machine: Machine
  onClose: () => void
  onSubmit: (machineId: string, minutes: number) => void
}

// Modal은 닫히면 children을 그리지 않아서, 열 때마다 선택 상태가 새로 시작된다
function RegisterForm({ machine, onClose, onSubmit }: RegisterFormProps) {
  const [usage, setUsage] = useState<{ hours: number; minutes: number }>(
    DEFAULT_USAGE,
  )
  // 모달을 연 시각 기준으로 종료 시각을 미리 보여준다
  const [openedAt] = useState(() => Date.now())

  const totalMinutes = usage.hours * 60 + usage.minutes

  return (
    <>
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
        <KindIcon kind={machine.kind} className="size-6" />
        {machineKindLabel[machine.kind]} {machine.number}번
      </h2>
      <p className="mt-1 text-sm text-ink-mute">이용 시간을 돌려서 정하세요</p>

      <TimeWheel
        className="mt-3"
        hours={usage.hours}
        minutes={usage.minutes}
        hourItems={hourItems}
        minuteItems={minuteItems}
        onChange={setUsage}
      />
      <p
        className={cn(
          'mt-2 min-h-5 text-center text-sm',
          totalMinutes === 0 ? 'text-danger' : 'text-ink-sub',
        )}
        aria-live="polite"
      >
        {totalMinutes === 0 ? (
          `${USAGE_MINUTE_STEP}분 이상 선택해 주세요`
        ) : (
          <>
            <span className="font-bold text-ink">
              {clockAfter(totalMinutes, openedAt)}
            </span>
            에 끝나요
          </>
        )}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="soft" size="sm" onClick={onClose}>
          취소
        </Button>
        <Button
          size="sm"
          disabled={totalMinutes === 0}
          onClick={() => onSubmit(machine.id, totalMinutes)}
        >
          등록
        </Button>
      </div>
    </>
  )
}

interface LaundryRegisterModalProps {
  /** 값이 있으면 열린다. 눌러서 고른 기기 */
  machine: Machine | null
  onClose: () => void
  onSubmit: (machineId: string, minutes: number) => void
}

/** 눌러서 고른 기기의 이용 시간을 돌려서 정하고 이용을 등록한다 */
export function LaundryRegisterModal({
  machine,
  onClose,
  onSubmit,
}: LaundryRegisterModalProps) {
  return (
    <Modal open={machine !== null} onClose={onClose} aria-label="이용 등록">
      {machine && (
        <RegisterForm machine={machine} onClose={onClose} onSubmit={onSubmit} />
      )}
    </Modal>
  )
}
