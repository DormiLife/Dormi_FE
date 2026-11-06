import { useEffect, useState } from 'react'
import { initialMachines, isRunning, type Machine } from '@/lib/laundry'

/** 이용 정보를 비운다 */
function clearUsage(machine: Machine): Machine {
  return { ...machine, totalMinutes: undefined, endsAtMs: undefined }
}

/** 타이머가 끝난 기기의 상태를 바꾼다. 남이 쓰던 기기는 수거 대기로, 내 기기는 이용 완료로 넘어간다. 둘 다 수거해야 사용 가능이 된다 */
function expireMachines(machines: Machine[], now: number): Machine[] {
  const expired = (m: Machine) =>
    isRunning(m) && m.endsAtMs !== undefined && m.endsAtMs <= now
  if (!machines.some(expired)) return machines
  return machines.map((m) => {
    if (!expired(m)) return m
    return m.status === 'mine'
      ? { ...m, status: 'done' }
      : { ...clearUsage(m), status: 'waiting' }
  })
}

/** 세탁·건조 탭의 상태 */
export function useLaundry() {
  const [machines, setMachines] = useState(initialMachines)
  const [now, setNow] = useState(() => Date.now())
  const [registerId, setRegisterId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [releaseId, setReleaseId] = useState<string | null>(null)

  // 1초마다 시각을 갱신하고, 끝난 기기의 상태를 자동으로 바꾼다
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      setMachines((prev) => expireMachines(prev, t))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const myMachines = machines.filter(
    (m) => m.status === 'mine' || m.status === 'done',
  )
  const registerMachine = machines.find((m) => m.id === registerId) ?? null
  // 상세는 사용 중·내 기기만 보여준다. 열려 있는 동안 타이머가 끝나 수거 대기가 되면 닫힌 것으로 본다
  const detailMachine =
    machines.find(
      (m) =>
        m.id === detailId && m.status !== 'available' && m.status !== 'waiting',
    ) ?? null
  const releaseMachine = machines.find((m) => m.id === releaseId) ?? null

  const openRegister = (machineId: string) => setRegisterId(machineId)
  const closeRegister = () => setRegisterId(null)
  const openDetail = (machineId: string) => setDetailId(machineId)
  const closeDetail = () => setDetailId(null)

  const register = (machineId: string, minutes: number) => {
    // TODO: 이용 등록 API 연동
    const start = Date.now()
    // 남아 있던 상세 대상이 등록 직후 모달을 다시 열지 않도록 비운다
    closeDetail()
    setNow(start)
    setMachines((prev) =>
      prev.map((m) =>
        m.id === machineId
          ? {
              ...m,
              status: 'mine',
              totalMinutes: minutes,
              endsAtMs: start + minutes * 60_000,
            }
          : m,
      ),
    )
    closeRegister()
  }

  /** 이용 끝내기·수거 버튼을 눌렀을 때. 바로 비우지 않고 확인 모달을 연다 */
  const requestRelease = (machineId: string) => {
    closeDetail()
    setReleaseId(machineId)
  }
  const cancelRelease = () => setReleaseId(null)

  /** 이용 끝내기(중간 종료)와 수거하기는 모두 기기를 비운다 */
  const release = (machineId: string) => {
    // TODO: 이용 종료·수거 API 연동
    setMachines((prev) =>
      prev.map((m) =>
        m.id === machineId ? { ...clearUsage(m), status: 'available' } : m,
      ),
    )
    setReleaseId(null)
  }

  return {
    machines,
    myMachines,
    now,
    registerMachine,
    openRegister,
    closeRegister,
    register,
    release,
    releaseMachine,
    requestRelease,
    cancelRelease,
    detailMachine,
    openDetail,
    closeDetail,
  }
}

export type LaundryState = ReturnType<typeof useLaundry>
