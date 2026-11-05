import { useEffect, useState } from 'react'
import { initialMachines, isRunning, type Machine } from '@/lib/laundry'

/** 이용 정보를 비운다 */
function clearUsage(machine: Machine): Machine {
  return { ...machine, totalMinutes: undefined, endsAtMs: undefined }
}

/** 타이머가 끝난 기기의 상태를 바꾼다. 남이 쓰던 기기는 사용 가능으로, 내 기기는 이용 완료(수거 전)로 넘어간다 */
function expireMachines(machines: Machine[], now: number): Machine[] {
  const expired = (m: Machine) =>
    isRunning(m) && m.endsAtMs !== undefined && m.endsAtMs <= now
  if (!machines.some(expired)) return machines
  return machines.map((m) => {
    if (!expired(m)) return m
    return m.status === 'mine'
      ? { ...m, status: 'done' }
      : { ...clearUsage(m), status: 'available' }
  })
}

/** 세탁·건조 탭의 상태 */
export function useLaundry() {
  const [machines, setMachines] = useState(initialMachines)
  const [now, setNow] = useState(() => Date.now())
  const [registerId, setRegisterId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)

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
  const detailMachine = machines.find((m) => m.id === detailId) ?? null

  const openRegister = (machineId: string) => setRegisterId(machineId)
  const closeRegister = () => setRegisterId(null)
  const openDetail = (machineId: string) => setDetailId(machineId)
  const closeDetail = () => setDetailId(null)

  const register = (machineId: string, minutes: number) => {
    // TODO: 이용 등록 API 연동
    const start = Date.now()
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

  /** 이용 끝내기(중간 종료)와 수거하기는 모두 기기를 비운다 */
  const release = (machineId: string) => {
    // TODO: 이용 종료·수거 API 연동
    setMachines((prev) =>
      prev.map((m) =>
        m.id === machineId ? { ...clearUsage(m), status: 'available' } : m,
      ),
    )
    closeDetail()
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
    detailMachine,
    openDetail,
    closeDetail,
  }
}

export type LaundryState = ReturnType<typeof useLaundry>
