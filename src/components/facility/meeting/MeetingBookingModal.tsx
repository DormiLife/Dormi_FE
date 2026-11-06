import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { TextField } from '@/components/ui/TextField'
import { formatFullDate } from '@/lib/meal'
import {
  ROOM_PURPOSE_MAX_LENGTH,
  roomUseTypeLabel,
  type RoomBookingDetails,
  type RoomUseType,
} from '@/lib/reservations'
import {
  formatSlotDuration,
  slotToTime,
  type SlotSelection,
} from '@/lib/timeSlots'

const useTypeOptions = (['personal', 'group'] as const).map((value) => ({
  value,
  label: roomUseTypeLabel[value],
}))

interface BookingFormProps {
  date: Date
  selection: SlotSelection
  onClose: () => void
  onSubmit: (details: RoomBookingDetails) => void
}

// Modal은 닫히면 children을 그리지 않아서, 열 때마다 입력이 새로 시작된다
function BookingForm({ date, selection, onClose, onSubmit }: BookingFormProps) {
  const [useType, setUseType] = useState<RoomUseType>('personal')
  const [purpose, setPurpose] = useState('')
  const [showError, setShowError] = useState(false)

  const trimmed = purpose.trim()
  const hasError = showError && trimmed === ''

  const handleSubmit = () => {
    if (trimmed === '') {
      setShowError(true)
      return
    }
    onSubmit({ useType, purpose: trimmed })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <h2 className="text-lg font-bold text-ink">회의실 예약</h2>

      <p className="mt-3 rounded-xl bg-canvas px-4 py-2.5 text-sm text-ink-sub">
        {formatFullDate(date)}{' '}
        <span className="font-bold text-primary-strong">
          {slotToTime(selection.from)} ~ {slotToTime(selection.to + 1)}
        </span>{' '}
        · {formatSlotDuration(selection.to - selection.from + 1)}
      </p>

      <div className="mt-4">
        <p className="mb-1.5 text-sm font-semibold text-ink-sub">이용 구분</p>
        <SegmentedControl
          value={useType}
          onChange={setUseType}
          options={useTypeOptions}
          className="[&_button]:h-11"
        />
      </div>

      <TextField
        label="사용 목적"
        className="mt-4"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        maxLength={ROOM_PURPOSE_MAX_LENGTH}
        showCount
        placeholder="예) 스터디, 팀 회의"
        status={hasError ? 'error' : 'default'}
        helper={hasError ? '사용 목적을 입력해 주세요' : undefined}
      />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="soft" size="sm" onClick={onClose}>
          취소
        </Button>
        <Button type="submit" size="sm">
          예약하기
        </Button>
      </div>
    </form>
  )
}

interface MeetingBookingModalProps {
  open: boolean
  date: Date
  selection: SlotSelection | null
  onClose: () => void
  onSubmit: (details: RoomBookingDetails) => void
}

/** 예약하기를 누르면 열리는 창. 이용 구분(개인/단체)과 사용 목적을 받는다 */
export function MeetingBookingModal({
  open,
  date,
  selection,
  onClose,
  onSubmit,
}: MeetingBookingModalProps) {
  return (
    <Modal open={open && selection !== null} onClose={onClose} aria-label="회의실 예약">
      {selection && (
        <BookingForm
          date={date}
          selection={selection}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  )
}
