import { Heart, MessageCircle } from 'lucide-react'
import { BoardCategoryBadge } from '@/components/board/BoardCategoryBadge'
import { BoardPostMeta } from '@/components/board/BoardPostMeta'
import type { BoardPost } from '@/lib/board'
import { cn } from '@/lib/utils'

interface BoardPostItemProps {
  post: BoardPost
  onClick?: (id: string) => void
}

export function BoardPostItem({ post, onClick }: BoardPostItemProps) {
  const { id, category, title, preview, author, date, likeCount, commentCount, liked } =
    post
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className="block w-full px-5 py-4 text-left"
    >
      <span className="flex items-center gap-2">
        <BoardCategoryBadge category={category} size="sm" className="shrink-0" />
        <span className="min-w-0 flex-1 truncate text-base font-bold text-ink">
          {title}
        </span>
      </span>
      {preview && (
        <span className="mt-1 block truncate text-sm text-ink-sub">
          {preview}
        </span>
      )}
      <span className="mt-2 flex items-center justify-between text-xs text-ink-mute">
        <BoardPostMeta date={date} author={author} />
        <span className="flex items-center gap-3">
          <span
            className={cn(
              'flex items-center gap-1',
              liked && 'font-semibold text-danger',
            )}
          >
            <Heart className={cn('size-3.5', liked && 'fill-current')} />
            {likeCount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {commentCount ?? 0}
          </span>
        </span>
      </span>
    </button>
  )
}
