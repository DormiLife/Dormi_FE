import { useEffect, useMemo, useState } from 'react'
import { isSameDay, startOfDay } from '@/lib/meal'
import {
  createMockRoomReservations,
  getRoomReservationPhase,
  toDateKey,
  type RoomBookingDetails,
  type RoomReservation,
  type RoomReservationPhase,
} from '@/lib/reservations'
import {
  SLOT_COUNT,
  dateToSlotPosition,
  slotToTime,
  toReservedSlots,
  type SlotSelection,
  type SlotState,
} from '@/lib/timeSlots'

export interface DayReservationItem extends RoomReservation {
  /** 이미 끝난 예약 */
  isPast: boolean
}

/** 예약 상세 창에 보여 줄 예약과, 지금 기준 그 예약의 단계 */
export interface ReservationDetail {
  reservation: RoomReservation
  phase: RoomReservationPhase
}

/** 회의실 탭의 상태. 예약 정보를 입력하는 창과 상세 창의 상태도 여기서 가진다 */
export function useMeetingBooking() {
  const [today] = useState(() => startOfDay(new Date()))
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(today)
  const [reservations, setReservations] = useState<RoomReservation[]>(() =>
    createMockRoomReservations(today),
  )
  const [selection, setSelection] = useState<SlotSelection | null>(null)
  const [bookingFormOpen, setBookingFormOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  // 현재 시각 기준의 지난 칸과 예약 단계가 시간이 지나면 따라가도록 1분마다 갱신
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const dateKey = toDateKey(selectedDate)
  const isToday = isSameDay(selectedDate, today)

  const dayReservations = useMemo(
    () =>
      reservations
        .filter((r) => r.date === dateKey)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [reservations, dateKey],
  )

  const nowPosition = isToday ? dateToSlotPosition(now) : null
  // index < pastLimit 인 칸은 이미 시작된 칸이라 지난 시간으로 본다
  // (10:03이면 10:00~10:30 칸도 예약할 수 없다)
  const pastLimit = selectedDate < today ? SLOT_COUNT : (nowPosition ?? 0)

  const slotStates = useMemo<SlotState[]>(() => {
    const others = toReservedSlots(dayReservations.filter((r) => !r.isMine))
    const mine = toReservedSlots(dayReservations.filter((r) => r.isMine))
    return Array.from({ length: SLOT_COUNT }, (_, i) => {
      const isPast = i < pastLimit
      if (mine[i]) return isPast ? 'minePast' : 'mine'
      if (others[i]) return isPast ? 'reservedPast' : 'reserved'
      return isPast ? 'past' : 'free'
    })
  }, [dayReservations, pastLimit])

  /** 칸 번호별로 그 칸을 차지한 예약 (타임라인에서 예약 칸을 눌렀을 때 찾는 용도) */
  const slotOwners = useMemo(() => {
    const owners: (RoomReservation | undefined)[] = Array.from(
      { length: SLOT_COUNT },
      () => undefined,
    )
    for (const reservation of dayReservations) {
      toReservedSlots([reservation]).forEach((reserved, i) => {
        if (reserved) owners[i] = reservation
      })
    }
    return owners
  }, [dayReservations])

  const dayItems: DayReservationItem[] = dayReservations.map((r) => ({
    ...r,
    isPast: getRoomReservationPhase(r, now) === 'ended',
  }))

  /** 날짜를 처음 열 때 타임라인이 보여 줄 칸: 오늘은 현재 시각, 그 외엔 처음 */
  const initialSlot = nowPosition === null ? 0 : Math.max(0, Math.floor(nowPosition))

  /** 지난 날짜는 고를 수 없다 */
  const changeDate = (date: Date) => {
    if (startOfDay(date) < today) return
    setSelectedDate(startOfDay(date))
    setSelection(null)
  }

  /**
   * 칸 선택 규칙
   * - 비어 있는 칸만 누를 수 있다
   * - 선택이 없으면 그 칸 하나를 선택
   * - 선택한 구간 뒤쪽 칸을 누르면, 사이에 막힌 칸이 없을 때 거기까지 늘린다
   * - 구간 안쪽 칸을 누르면 그 칸 하나로 줄이고, 한 칸만 선택된 상태에서 다시 누르면 해제
   * - 그 밖(앞쪽이거나 사이가 막힌 경우)은 그 칸에서 새로 시작
   */
  const selectSlot = (index: number) => {
    if (slotStates[index] !== 'free') return
    setSelection((prev) => {
      if (!prev) return { from: index, to: index }
      if (index >= prev.from && index <= prev.to) {
        return prev.from === prev.to ? null : { from: index, to: index }
      }
      const canExtend =
        index > prev.to &&
        slotStates.slice(prev.to + 1, index + 1).every((s) => s === 'free')
      return canExtend ? { from: prev.from, to: index } : { from: index, to: index }
    })
  }

  const openBookingForm = () => {
    if (selection) setBookingFormOpen(true)
  }
  const closeBookingForm = () => setBookingFormOpen(false)

  /** 예약 창에서 이용 구분과 사용 목적을 작성하고 확정한다 */
  const book = (details: RoomBookingDetails) => {
    if (!selection) return
    // TODO: 예약 API 연동
    setReservations((prev) => [
      ...prev,
      {
        id: `room-${Date.now()}`,
        date: dateKey,
        start: slotToTime(selection.from),
        end: slotToTime(selection.to + 1),
        reserver: '내 예약',
        isMine: true,
        ...details,
      },
    ])
    setSelection(null)
    setBookingFormOpen(false)
  }

  /** 타임라인의 예약된 칸을 눌렀을 때 그 예약의 상세를 연다 */
  const openDetail = (slotIndex: number) => {
    const reservation = slotOwners[slotIndex]
    if (reservation) setDetailId(reservation.id)
  }
  /** 예약 목록의 행을 눌렀을 때 그 예약의 상세를 연다 */
  const openReservationDetail = (reservation: RoomReservation) =>
    setDetailId(reservation.id)
  const closeDetail = () => setDetailId(null)

  const detailReservation = reservations.find((r) => r.id === detailId)
  const detail: ReservationDetail | null = detailReservation
    ? {
        reservation: detailReservation,
        phase: getRoomReservationPhase(detailReservation, now),
      }
    : null

  /** 내 예약 취소. 시작 전인 예약만 취소할 수 있다 (이미 시작했거나 끝난 예약은 막는다) */
  const cancelReservation = (id: string) => {
    const target = reservations.find((r) => r.id === id)
    if (!target?.isMine) return
    if (getRoomReservationPhase(target, now) !== 'upcoming') return
    // TODO: 예약 취소 API 연동
    setReservations((prev) => prev.filter((r) => r.id !== id))
    setDetailId(null)
  }

  return {
    today,
    selectedDate,
    dateKey,
    isToday,
    slotStates,
    selection,
    initialSlot,
    dayItems,
    bookingFormOpen,
    detail,
    changeDate,
    selectSlot,
    openBookingForm,
    closeBookingForm,
    book,
    openDetail,
    openReservationDetail,
    closeDetail,
    cancelReservation,
  }
}

export type MeetingBooking = ReturnType<typeof useMeetingBooking>
