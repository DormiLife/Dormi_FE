import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { ListRow } from '@/components/ui/ListRow'
import { SectionHeader } from '@/components/ui/SectionHeader'

export interface UsageItem {
  id: string
  icon: ReactNode
  title: string
  description: string
  onClick?: () => void
}

interface MyUsageCardProps {
  items: UsageItem[]
}

export function MyUsageCard({ items }: MyUsageCardProps) {
  return (
    <Card className="p-4">
      <SectionHeader
        title="나의 이용 현황"
      />
      <div className="mt-3 space-y-1.5">
        {items.map(({ id, icon, title, description, onClick }) => (
          <ListRow
            key={id}
            icon={
              <span className="flex shrink-0 text-primary [&>svg]:size-6">
                {icon}
              </span>
            }
            title={title}
            description={description}
            onClick={onClick}
            className="rounded-xl bg-canvas px-4 py-2.5"
          />
        ))}
      </div>
    </Card>
  )
}
