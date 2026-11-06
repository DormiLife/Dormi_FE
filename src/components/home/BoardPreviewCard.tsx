import { BoardCategoryBadge } from '@/components/board/BoardCategoryBadge'
import { BoardPostMeta } from '@/components/board/BoardPostMeta'
import { Card } from '@/components/ui/Card'
import { ListRow } from '@/components/ui/ListRow'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { BoardPost } from '@/lib/board'

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
        className="px-4 pt-4"
      />
      <div className="mt-1 divide-y divide-line px-4">
        {posts.map(({ id, category, title, author, date }) => (
          <ListRow
            key={id}
            icon={
              <BoardCategoryBadge
                category={category}
                className="w-12 justify-center"
              />
            }
            title={title}
            description={<BoardPostMeta date={date} author={author} />}
            onClick={() => onPostClick?.(id)}
            chevron={false}
            className="px-0 py-3"
            titleClassName="text-[15px] font-medium"
          />
        ))}
      </div>
    </Card>
  )
}
