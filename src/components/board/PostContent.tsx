import type { ReactNode } from 'react'
import { BoardCategoryBadge } from '@/components/board/BoardCategoryBadge'
import { PostAuthorRow } from '@/components/board/PostAuthorRow'
import type { BoardPost } from '@/lib/board'

interface PostContentProps {
  post: BoardPost
  /** 작성자 줄 오른쪽 끝 영역 (좋아요 버튼) */
  right?: ReactNode
}

export function PostContent({ post, right }: PostContentProps) {
  const { category, title, author, createdAt, date, content, preview } = post
  return (
    <article className="bg-surface px-5 py-5">
      <BoardCategoryBadge category={category} size="sm" />
      <h2 className="mt-2.5 text-xl leading-snug font-bold text-ink">
        {title}
      </h2>
      <div className="mt-3">
        <PostAuthorRow
          author={author}
          createdAt={createdAt ?? date}
          right={right}
        />
      </div>
      <p className="mt-4 text-base leading-relaxed break-keep whitespace-pre-line text-ink">
        {content ?? preview}
      </p>
    </article>
  )
}
