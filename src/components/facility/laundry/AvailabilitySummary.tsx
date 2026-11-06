import {
  countAvailability,
  machineKindLabel,
  machineKinds,
  type Machine,
  type MachineKind,
} from '@/lib/laundry'
import { KindIcon } from './KindIcon'

interface AvailabilitySummaryProps {
  machines: Machine[]
}

function CountTile({ kind, machines }: { kind: MachineKind; machines: Machine[] }) {
  const { available, total } = countAvailability(machines, kind)
  return (
    <div className="flex-1 rounded-2xl border border-line bg-surface px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-sm font-bold text-ink-sub">
        <KindIcon kind={kind} className="size-[18px] text-ink" />
        {machineKindLabel[kind]}
      </p>
      <p className="mt-0.5 text-xl font-bold text-ink">
        {available}
        <span className="text-sm font-medium text-ink-mute">/{total}</span>
      </p>
    </div>
  )
}

/** 세탁기·건조기별로 사용 가능한 대수 */
export function AvailabilitySummary({ machines }: AvailabilitySummaryProps) {
  return (
    <div className="flex gap-2">
      {machineKinds.map((kind) => (
        <CountTile key={kind} kind={kind} machines={machines} />
      ))}
    </div>
  )
}
