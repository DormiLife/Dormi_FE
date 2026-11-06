import { cn } from '@/lib/utils'

const toneClass = {
  blue: { text: 'text-primary', dot: 'bg-primary' },
  green: { text: 'text-success', dot: 'bg-success' },
}

interface MachineAvailabilityTileProps {
  label: string
  available: number
  total: number
  tone?: keyof typeof toneClass
  className?: string
}

export function MachineAvailabilityTile({
  label,
  available,
  total,
  tone = 'blue',
  className,
}: MachineAvailabilityTileProps) {
  return (
    <div className={cn('rounded-2xl bg-canvas p-3', className)}>
      <p className="text-sm text-ink-sub">{label}</p>
      <p className="flex items-baseline gap-1">
        <span className={cn('text-2xl font-bold', toneClass[tone].text)}>
          {available}
        </span>
        <span className="text-base text-ink-mute">/ {total}대</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              'size-2.5 rounded-full',
              i < available ? toneClass[tone].dot : 'bg-ink-mute/25',
            )}
          />
        ))}
      </div>
    </div>
  )
}
