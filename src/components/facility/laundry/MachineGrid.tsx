import {
  machineKindLabel,
  machineKinds,
  pickLayout,
  type Machine,
} from '@/lib/laundry'
import { cn } from '@/lib/utils'
import { KindIcon } from './KindIcon'
import { MachineCard } from './MachineCard'

interface MachineGridProps {
  machines: Machine[]
  now: number
  onSelect: (machine: Machine) => void
}

/** 세탁기, 건조기를 각각 카드 한 덩어리로 묶어서 보여준다 */
export function MachineGrid({ machines, now, onSelect }: MachineGridProps) {
  const layout = pickLayout(machines)

  return (
    <div className="space-y-3">
      {machineKinds.map((kind) => {
        const list = machines.filter((m) => m.kind === kind)
        if (list.length === 0) return null

        return (
          <section
            key={kind}
            aria-label={machineKindLabel[kind]}
            className="rounded-2xl border border-line bg-surface p-3"
          >
            <h2 className="mb-2.5 flex items-center gap-2 px-0.5 text-base font-bold text-ink">
              <KindIcon kind={kind} className="size-5" />
              {machineKindLabel[kind]}
            </h2>
            <ul
              className={cn(
                'grid gap-1.5',
                layout === 'tile' ? 'grid-cols-3' : 'grid-cols-2 gap-2',
              )}
            >
              {list.map((machine) => (
                <li key={machine.id}>
                  <MachineCard
                    machine={machine}
                    layout={layout}
                    now={now}
                    onSelect={onSelect}
                  />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
