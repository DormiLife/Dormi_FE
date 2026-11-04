import type { ReactNode } from 'react'
import { Avatar } from '@/components/ui/Avatar'

interface PostAuthorRowProps {
  author: string
  createdAt: string
  /** 오른쪽 끝 영역 (좋아요 버튼 등) */
  right?: ReactNode
}

export function PostAuthorRow({
  author,
  createdAt,
  right,
}: PostAuthorRowProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar name={author} size="sm" />
      <span className="text-sm font-semibold text-ink">{author}</span>
      <span className="text-sm text-ink-mute">{createdAt}</span>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  )
}
