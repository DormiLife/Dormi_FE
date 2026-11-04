export type ReservationStatus = 'inUse' | 'upcoming' | 'done' | 'cancelled'

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

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** '2026-11-06' -> '11월 6일 (금)' */
export function formatReservationDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()]
  return `${month}월 ${day}일 (${weekday})`
}
