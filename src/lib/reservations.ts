import { addDays } from '@/lib/meal'

export type ReservationStatus ='inUse' | 'upcoming' | 'done' | 'cancelled'

export interface MyReservation {
  id: string
  /** 'YYYY-MM-DD' */
  date: string
  /** 'HH:mm' */
  start: string
  /** 'HH:mm' */
  end: string
  status: ReservationStatus
}

// TODO: API 연동 시 교체
export const initialMyReservations: MyReservation[] = [
  { id: 'r0', date: '2026-11-04', start: '14:00', end: '16:00', status: 'inUse' },
  { id: 'r1', date: '2026-11-06', start: '14:00', end: '15:00', status: 'upcoming' },
  { id: 'r2', date: '2026-11-09', start: '19:30', end: '21:00', status: 'upcoming' },
  { id: 'r3', date: '2026-10-28', start: '14:00', end: '15:00', status: 'done' },
  { id: 'r4', date: '2026-10-21', start: '20:00', end: '22:00', status: 'done' },
  { id: 'r5', date: '2026-10-15', start: '16:00', end: '17:00', status: 'cancelled' },
]

/** 회의실 이용 구분 */
export type RoomUseType = 'personal' | 'group'

export const roomUseTypeLabel: Record<RoomUseType, string> = {
  personal: '개인',
  group: '단체',
}

/** 사용 목적 최대 글자 수 */
export const ROOM_PURPOSE_MAX_LENGTH = 20

/** 예약할 때 작성하는 내용 */
export interface RoomBookingDetails {
  useType: RoomUseType
  purpose: string
}

/** 공용 회의실 예약 (타임라인과 날짜별 예약 목록에 쓰인다) */
export interface RoomReservation extends RoomBookingDetails {
  id: string
  /** 'YYYY-MM-DD' */
  date: string
  /** 'HH:mm' */
  start: string
  /** 'HH:mm' */
  end: string
  /** 예약자 표시 (예: '301호 김**') */
  reserver: string
  isMine: boolean
}

/**
 * upcoming: 아직 시작 전 (취소 가능)
 * inProgress: 이미 시작했고 아직 끝나지 않음 (취소 불가)
 * ended: 끝난 예약
 */
export type RoomReservationPhase = 'upcoming' | 'inProgress' | 'ended'

/** ('YYYY-MM-DD', 'HH:mm') -> Date. '24:00'은 다음 날 00:00으로 계산된다 */
function toDateTime(date: string, time: string) {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

/** 현재 시각 기준으로 예약이 시작 전인지, 진행 중인지, 끝났는지 */
export function getRoomReservationPhase(
  reservation: Pick<RoomReservation, 'date' | 'start' | 'end'>,
  now: Date,
): RoomReservationPhase {
  const start = toDateTime(reservation.date, reservation.start)
  let end = toDateTime(reservation.date, reservation.end)
  // 종료가 시작 이하면 다음 날 자정으로 본다 (예: 23:00~00:00)
  if (end <= start) end = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1, end.getHours(), end.getMinutes())
  if (now >= end) return 'ended'
  if (now >= start) return 'inProgress'
  return 'upcoming'
}

/** Date -> 'YYYY-MM-DD' (로컬 날짜 기준) */
export function toDateKey(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${mm}-${dd}`
}

// TODO: API 연동 시 교체. 언제 열어도 데이터가 보이도록 오늘 기준 날짜로 만든 임시 데이터
export function createMockRoomReservations(today: Date): RoomReservation[] {
  const dayKey = (offset: number) => toDateKey(addDays(today, offset))
  return [
    { id: 'room-1', date: dayKey(0), start: '11:00', end: '12:00', reserver: '301호 김**', isMine: false, useType: 'personal', purpose: '개인 공부' },
    { id: 'room-2', date: dayKey(0), start: '14:00', end: '15:30', reserver: '내 예약', isMine: true, useType: 'group', purpose: '팀 프로젝트 회의' },
    { id: 'room-3', date: dayKey(0), start: '20:00', end: '21:00', reserver: '502호 이**', isMine: false, useType: 'group', purpose: '스터디' },
    { id: 'room-4', date: dayKey(1), start: '10:00', end: '12:00', reserver: '403호 박**', isMine: false, useType: 'group', purpose: '동아리 모임' },
    { id: 'room-6', date: dayKey(1), start: '16:00', end: '17:00', reserver: '내 예약', isMine: true, useType: 'group', purpose: '동아리 회의' },
    { id: 'room-5', date: dayKey(2), start: '14:00', end: '15:00', reserver: '내 예약', isMine: true, useType: 'personal', purpose: '면접 준비' },
  ]
}

const WEEKDAYS =['일', '월', '화', '수', '목', '금', '토']

/** '2026-11-06' -> '11월 6일 (금)' */
export function formatReservationDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()]
  return `${month}월 ${day}일 (${weekday})`
}
