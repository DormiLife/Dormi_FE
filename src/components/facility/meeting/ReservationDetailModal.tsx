import { useState } from 'react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  formatReservationDate,
  roomUseTypeLabel,
  type RoomReservationPhase,
} from '@/lib/reservations'
import type { ReservationDetail } from '@/pages/facility/useMeetingBooking'

const phaseBadge: Record<
  RoomReservationPhase,
  { label: string; tone: BadgeTone } | null
> = {
  upcoming: null,
  inProgress: { label: '진행 중', tone: 'green' },
  ended: { label: '종료', tone: 'gray' },
}

interface DetailBodyProps {
  detail: ReservationDetail
  onClose: () => void
  onCancel: (id: string) => void
}

// Modal은 닫히면 children을 그리지 않아서, 열 때마다 취소 확인 단계가 새로 시작된다
function DetailBody({ detail, onClose, onCancel }: DetailBodyProps) {
  const { reservation, phase } = detail
  const [confirming, setConfirming] = useState(false)
  const badge = reservation.isMine
    ? phase === 'upcoming'
      ? { label: '내 예약', tone: 'blue' as const }
      : phaseBadge[phase]
    : phaseBadge[phase]

  const rows: [string, string][] = [
    ['예약자', reservation.isMine ? '내 예약' : reservation.reserver],
    ['날짜', formatReservationDate(reservation.date)],
    ['시간', `${reservation.start} ~ ${reservation.end}`],
    ['이용 구분', roomUseTypeLabel[reservation.useType]],
    ['사용 목적', reservation.purpose],
  ]

  const canCancelRule = reservation.isMine && phase !== 'ended'

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-ink">예약 상세</h2>
        {badge && (
          <Badge tone={badge.tone} size="sm">
            {badge.label}
          </Badge>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1.5 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-ink-mute">{label}</dt>
            <dd className="font-medium break-words text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      {/* 진행 중인 내 예약은 취소 버튼을 비활성화하고 이유를 안내한다 */}
      {reservation.isMine && phase === 'inProgress' && (
        <p role="status" className="mt-4 text-sm font-medium text-danger">
          진행 중인 예약은 취소할 수 없습니다
        </p>
      )}

      {confirming && (
        <p className="mt-4 text-sm text-ink-sub">
          예약을 취소할까요? 취소한 예약은 되돌릴 수 없어요.
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        {!canCancelRule ? (
          <Button
            variant="soft"
            size="sm"
            className="col-span-2"
            data-autofocus
            onClick={onClose}
          >
            닫기
          </Button>
        ) : confirming ? (
          <>
            <Button
              variant="soft"
              size="sm"
              data-autofocus
              onClick={() => setConfirming(false)}
            >
              돌아가기
            </Button>
            <Button variant="danger" size="sm" onClick={() => onCancel(reservation.id)}>
              예약 취소
            </Button>
          </>
        ) : (
          <>
            <Button variant="soft" size="sm" data-autofocus onClick={onClose}>
              닫기
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={phase !== 'upcoming'}
              onClick={() => setConfirming(true)}
            >
              예약 취소
            </Button>
          </>
        )}
      </div>
    </>
  )
}

interface ReservationDetailModalProps {
  detail: ReservationDetail | null
  onClose: () => void
  onCancel: (id: string) => void
}

/** 타임라인에서 예약된 칸을 눌렀을 때 열리는 상세 창. 내 예약이면 취소할 수 있다 */
export function ReservationDetailModal({
  detail,
  onClose,
  onCancel,
}: ReservationDetailModalProps) {
  return (
    <Modal open={detail !== null} onClose={onClose} aria-label="예약 상세">
      {detail && (
        <DetailBody detail={detail} onClose={onClose} onCancel={onCancel} />
      )}
    </Modal>
  )
}
