import { Wind, WashingMachine } from 'lucide-react'
import type { MachineKind } from '@/lib/laundry'

interface KindIconProps {
  kind: MachineKind
  className?: string
}

/** 세탁기·건조기 종류를 나타내는 아이콘 */
export function KindIcon({ kind, className }: KindIconProps) {
  const Icon = kind === 'washer' ? WashingMachine : Wind
  return <Icon className={className} aria-hidden="true" />
}
