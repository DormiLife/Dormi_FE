export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Meal {
  type: MealType
  menus: string[]
}

export const mealMeta: Record<MealType, { label: string; color: string }> = {
  breakfast: { label: '아침', color: 'text-amber-700' },
  lunch: { label: '점심', color: 'text-green-700' },
  dinner: { label: '저녁', color: 'text-purple-muted' },
}

export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const

/** 시·분·초를 버린 로컬 자정 기준 Date */
export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** 월요일 시작 기준으로 그 날짜가 속한 주의 월요일 */
export function startOfWeek(date: Date) {
  const day = startOfDay(date)
  const offset = (day.getDay() + 6) % 7 // 월=0 … 일=6
  return addDays(day, -offset)
}

/** 두 날짜가 속한 주(월요일 시작)의 차이: b가 a보다 몇 주 뒤인지 */
export function diffInWeeks(a: Date, b: Date) {
  const days = (startOfWeek(b).getTime() - startOfWeek(a).getTime()) / 86_400_000
  return Math.round(days / 7)
}

/** 월~일 7일 */
export function getWeekDays(date: Date) {
  const monday = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/** 예: '10월 27일 (화)' */
export function formatFullDate(date: Date) {
  const weekday = WEEKDAY_LABELS[(date.getDay() + 6) % 7]
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`
}

/**
 * 그 주가 속한 달과 몇 번째 주인지.
 * 월요일 시작, 그 주의 목요일이 속한 달을 기준으로 하고
 * 그 달의 첫 목요일이 있는 주가 1주차다. totalWeeks는 그 달의 목요일 개수(4~5).
 */
export function getWeekOfMonth(date: Date) {
  const thursday = addDays(startOfWeek(date), 3)
  const year = thursday.getFullYear()
  const month = thursday.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstThursday = 1 + ((4 - new Date(year, month, 1).getDay() + 7) % 7)
  return {
    month: month + 1,
    week: Math.ceil(thursday.getDate() / 7),
    totalWeeks: Math.floor((daysInMonth - firstThursday) / 7) + 1,
  }
}

/** 예: '10월 5주차' */
export function formatWeekTitle(date: Date) {
  const { month, week } = getWeekOfMonth(date)
  return `${month}월 ${week}주차`
}

/** 예: '10.26 ~ 11.01' */
export function formatWeekRange(date: Date) {
  const days = getWeekDays(date)
  const fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  return `${fmt(days[0])} ~ ${fmt(days[6])}`
}
