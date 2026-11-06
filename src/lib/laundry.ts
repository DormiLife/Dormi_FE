export type MachineKind = 'washer' | 'dryer'

/**
 * available: 사용 가능
 * inUse: 다른 사람이 사용 중
 * waiting: 다른 사람의 타이머는 끝났지만 아직 수거 전(사용 불가)
 * mine: 내가 사용 중
 * done: 내 이용이 끝나 수거를 기다리는 중
 */
export type MachineStatus = 'available' | 'inUse' | 'waiting' | 'mine' | 'done'

export interface Machine {
  id: string
  kind: MachineKind
  number: number
  status: MachineStatus
  /** 이용 중일 때 전체 이용 시간(분) */
  totalMinutes?: number
  /** 이용 중일 때 완료 예정 시각(epoch ms). 남은 시간은 이 값에서 계산한다 */
  endsAtMs?: number
}

export const machineKindLabel: Record<MachineKind, string> = {
  washer: '세탁기',
  dryer: '건조기',
}

export const machineKinds: MachineKind[] = ['washer', 'dryer']

/** 세탁기·건조기 중 한쪽이라도 이 대수 이상이면 3열 타일로, 아니면 2열 카드로 보여준다 */
export const COMPACT_GRID_THRESHOLD = 9

/** 세탁기·건조기 중 한쪽이라도 많으면 두 섹션 모두 3열 타일로 맞춘다 */
export function pickLayout(machines: Machine[]): 'card' | 'tile' {
  const compact = machineKinds.some(
    (kind) =>
      machines.filter((m) => m.kind === kind).length >= COMPACT_GRID_THRESHOLD,
  )
  return compact ? 'tile' : 'card'
}

/** 이용 시간 휠: 시간은 0~MAX_USAGE_HOURS, 분은 USAGE_MINUTE_STEP 단위 */
export const MAX_USAGE_HOURS = 3
export const USAGE_MINUTE_STEP = 5
export const DEFAULT_USAGE = { hours: 1, minutes: 0 } as const

/** 종류별 사용 가능 대수와 전체 대수 */
export function countAvailability(machines: Machine[], kind: MachineKind) {
  const list = machines.filter((m) => m.kind === kind)
  return {
    available: list.filter((m) => m.status === 'available').length,
    total: list.length,
  }
}

/** 타이머가 돌고 있는(inUse, mine) 상태인지 */
export function isRunning({ status }: Machine) {
  return status === 'inUse' || status === 'mine'
}

/** 남은 시간(초). 0 미만으로 내려가지 않는다 */
export function remainingSeconds({ endsAtMs }: Machine, now: number) {
  return endsAtMs === undefined ? 0 : Math.max(0, Math.ceil((endsAtMs - now) / 1000))
}

/** 초 -> 'mm:ss' */
export function formatCountdown(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function machineTitle({ kind, number }: Pick<Machine, 'kind' | 'number'>) {
  return `${machineKindLabel[kind]} ${number}`
}

/** Date -> 'HH:mm' */
export function formatClock(date: Date) {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

/** 지금부터 minutes분 뒤의 'HH:mm' */
export function clockAfter(minutes: number, from: number = Date.now()) {
  return formatClock(new Date(from + minutes * 60_000))
}

/** 이용이 끝나는 시각 'HH:mm' */
export function endClock({ endsAtMs }: Machine) {
  return endsAtMs === undefined ? undefined : formatClock(new Date(endsAtMs))
}

function running(
  kind: MachineKind,
  number: number,
  remainingMinutes: number,
  totalMinutes: number,
  status: 'inUse' | 'mine' = 'inUse',
): Machine {
  return {
    id: `${kind[0]}${number}`,
    kind,
    number,
    status,
    totalMinutes,
    endsAtMs: Date.now() + remainingMinutes * 60_000,
  }
}

function idle(
  kind: MachineKind,
  number: number,
  status: 'available' | 'waiting' = 'available',
): Machine {
  return { id: `${kind[0]}${number}`, kind, number, status }
}

// TODO: API 연동 시 교체
export const initialMachines: Machine[] = [
  idle('washer', 1),
  running('washer', 2, 18, 60, 'mine'),
  running('washer', 3, 42, 60),
  idle('washer', 4),
  running('washer', 5, 25, 90),
  idle('washer', 6),
  running('washer', 7, 10, 60),
  running('washer', 8, 55, 60),
  idle('washer', 9, 'waiting'),
  running('washer', 10, 5, 30),
  idle('washer', 11),
  idle('washer', 12),
  idle('dryer', 1),
  idle('dryer', 2),
  running('dryer', 3, 20, 60),
  idle('dryer', 4),
  idle('dryer', 5),
  running('dryer', 6, 35, 60),
]
