import { CommentItem } from '@/components/board/CommentItem'
import { EmptyState } from '@/components/ui/EmptyState'
import type { BoardComment } from '@/lib/board'
import { cn } from '@/lib/utils'

interface CommentListProps {
  comments: BoardComment[]
  /** 내 댓글을 구분할 별명 */
  currentUser: string
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export function CommentList({
  comments,
  currentUser,
  onEdit,
  onDelete,
  className,
}: CommentListProps) {
  return (
    <section className={cn('bg-surface', className)} aria-label="댓글">
      <h3 className="border-b border-line px-5 py-3 text-sm font-bold text-ink">
        댓글 {comments.length}
      </h3>
      {comments.length === 0 ? (
        <EmptyState
          title="아직 댓글이 없어요"
          description="첫 댓글을 남겨 보세요."
          className="py-12"
        />
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="border-b border-line">
              <CommentItem
                comment={comment}
                isMine={comment.author === currentUser}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
