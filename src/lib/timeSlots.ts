export const DAY_START_HOUR = 9
export const DAY_END_HOUR = 24
export const SLOT_MINUTES = 30
export const SLOT_COUNT = ((DAY_END_HOUR - DAY_START_HOUR) * 60) / SLOT_MINUTES

export interface Reservation {
  /** 'HH:mm' */
  start: string
  /** 'HH:mm' */
  end: string
}

function toMinutesFromDayStart(time: string) {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute - DAY_START_HOUR * 60
}

/** '14:30' -> 11 (09:00이 0번 칸) */
export function toSlotIndex(time: string) {
  return Math.floor(toMinutesFromDayStart(time) / SLOT_MINUTES)
}

/** 예약 목록을 칸별 예약 여부(길이 SLOT_COUNT)로 변환 */
export function toReservedSlots(reservations: Reservation[]) {
  const slots = Array.from({ length: SLOT_COUNT }, () => false)
  for (const { start, end } of reservations) {
    const from = Math.max(0, toSlotIndex(start))
    const to = Math.min(
      SLOT_COUNT,
      Math.ceil(toMinutesFromDayStart(end) / SLOT_MINUTES),
    )
    for (let i = from; i < to; i++) slots[i] = true
  }
  return slots
}
