import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ListRow } from '@/components/ui/ListRow'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

export type BoardCategory = 'question' | 'info' | 'general'

const categoryMeta: Record<
  BoardCategory,
  { label: string; tone: BadgeTone; className?: string }
> = {
  question: { label: '질문', tone: 'orange' },
  info: {
    label: '정보',
    tone: 'blue',
    className: 'bg-info-soft text-info',
  },
  general: { label: '일반', tone: 'gray' },
}

export interface BoardPost {
  id: string
  category: BoardCategory
  title: string
  author: string
  /** 예: '10/27' */
  date: string
}

interface BoardPreviewCardProps {
  posts: BoardPost[]
  onViewMore?: () => void
  onPostClick?: (id: string) => void
}

export function BoardPreviewCard({
  posts,
  onViewMore,
  onPostClick,
}: BoardPreviewCardProps) {
  return (
    <Card padded={false}>
      <SectionHeader
        title="기숙사 게시판"
        actionLabel="더보기"
        actionIconOnly
        onAction={onViewMore}
        className="px-5 pt-5"
      />
      <div className="mt-2 divide-y divide-line px-5">
        {posts.map(({ id, category, title, author, date }) => (
          <ListRow
            key={id}
            icon={
              <Badge
                tone={categoryMeta[category].tone}
                className={cn(
                  'w-12 justify-center',
                  categoryMeta[category].className,
                )}
              >
                {categoryMeta[category].label}
              </Badge>
            }
            title={title}
            description={`${author} · ${date}`}
            onClick={() => onPostClick?.(id)}
            chevron={false}
            className="px-0"
          />
        ))}
      </div>
    </Card>
  )
}
