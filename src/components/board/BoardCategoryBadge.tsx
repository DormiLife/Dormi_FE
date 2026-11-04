import { Badge } from '@/components/ui/Badge'
import { BOARD_CATEGORY_META, type BoardCategory } from '@/lib/board'

interface BoardCategoryBadgeProps {
  category: BoardCategory
  size?: 'sm' | 'md'
  className?: string
}

export function BoardCategoryBadge({
  category,
  size,
  className,
}: BoardCategoryBadgeProps) {
  const { label, tone } = BOARD_CATEGORY_META[category]
  return (
    <Badge tone={tone} size={size} className={className}>
      {label}
    </Badge>
  )
}
