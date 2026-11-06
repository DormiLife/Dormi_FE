export const DAY_START_HOUR = 9
export const DAY_END_HOUR = 24
export const SLOT_MINUTES = 30
export const SLOT_COUNT = ((DAY_END_HOUR - DAY_START_HOUR) * 60) / SLOT_MINUTES

const MINUTES_PER_DAY = 24 * 60

/**
 * free: 예약 가능
 * reserved: 다른 사람이 예약
 * reservedPast: 이미 지난(종료된) 다른 사람의 예약
 * mine: 내 예약
 * minePast: 이미 지난 내 예약
 * past: 이미 지난 시간 (이미 시작된 칸 포함)
 */
export type SlotState =
  | 'free'
  | 'reserved'
  | 'reservedPast'
  | 'mine'
  | 'minePast'
  | 'past'

/** 선택한 칸 구간. from, to 모두 포함하는 칸 번호 */
export interface SlotSelection {
  from: number
  to: number
}

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

/** 종료 시각이 시작 시각 이하면(예: 23:00~00:00) 다음 날 자정으로 보고 24:00으로 정규화 */
function toEndMinutesFromDayStart(start: string, end: string) {
  const endMinutes = toMinutesFromDayStart(end)
  return endMinutes <= toMinutesFromDayStart(start)
    ? endMinutes + MINUTES_PER_DAY
    : endMinutes
}

/** '14:30' -> 11 (09:00이 0번 칸) */
export function toSlotIndex(time: string) {
  return Math.floor(toMinutesFromDayStart(time) / SLOT_MINUTES)
}

/** 칸 번호 -> 칸이 시작하는 시각 'HH:mm' (SLOT_COUNT는 '24:00') */
export function slotToTime(index: number) {
  const minutes = DAY_START_HOUR * 60 + index * SLOT_MINUTES
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0')
  const mm = String(minutes % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

/** 칸 개수 -> '1시간 30분' */
export function formatSlotDuration(count: number) {
  const minutes = count * SLOT_MINUTES
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}분`
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`
}

/** 'HH:mm' -> 09:00 기준 칸 위치(소수). '14:30' -> 11, '24:00' -> 30 */
export function timeToSlotPosition(time: string) {
  return toMinutesFromDayStart(time) / SLOT_MINUTES
}

/** Date -> 09:00 기준 칸 위치(소수). 09:00 이전은 음수, 24:00 이후는 SLOT_COUNT 이상 */
export function dateToSlotPosition(date: Date) {
  const minutes = date.getHours() * 60 + date.getMinutes() - DAY_START_HOUR * 60
  return minutes / SLOT_MINUTES
}

/** 예약 목록을 칸별 예약 여부(길이 SLOT_COUNT)로 변환 */
export function toReservedSlots(reservations: Reservation[]) {
  const slots = Array.from({ length: SLOT_COUNT }, () => false)
  for (const { start, end } of reservations) {
    const from = Math.max(0, toSlotIndex(start))
    const to = Math.min(
      SLOT_COUNT,
      Math.ceil(toEndMinutesFromDayStart(start, end) / SLOT_MINUTES),
    )
    for (let i = from; i < to; i++) slots[i] = true
  }
  return slots
}
