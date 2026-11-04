import { FileText } from 'lucide-react'
import { BoardPostItem } from '@/components/board/BoardPostItem'
import { EmptyState } from '@/components/ui/EmptyState'
import type { BoardPost } from '@/lib/board'

interface BoardPostListProps {
  posts: BoardPost[]
  onPostClick?: (id: string) => void
  emptyTitle?: string
  emptyDescription?: string
}

export function BoardPostList({
  posts,
  onPostClick,
  emptyTitle = '아직 게시글이 없어요',
  emptyDescription = '첫 글을 작성해 보세요.',
}: BoardPostListProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText />}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }
  return (
    <ul className="divide-y divide-line bg-surface">
      {posts.map((post) => (
        <li key={post.id}>
          <BoardPostItem post={post} onClick={onPostClick} />
        </li>
      ))}
    </ul>
  )
}
