import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { controlClass } from '@/components/ui/controlClass'
import type { BoardComment } from '@/lib/board'
import { cn } from '@/lib/utils'

interface CommentItemProps {
  comment: BoardComment
  isMine?: boolean
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
}

export function CommentItem({
  comment,
  isMine,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const { id, author, content, createdAt } = comment
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(content)

  const startEdit = () => {
    setDraft(content)
    setEditing(true)
  }

  const save = () => {
    const next = draft.trim()
    if (!next) return
    if (next !== content) onEdit?.(id, next)
    setEditing(false)
  }

  return (
    <div className={cn('flex gap-3 px-5 py-4', isMine && 'bg-primary-soft/40')}>
      <Avatar name={author} size="sm" solid={isMine} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink">{author}</span>
          <span className="text-sm text-ink-mute">{createdAt}</span>
          {isMine && !editing && (
            <ActionMenu
              label="댓글 메뉴"
              className="-my-2.5 -mr-2 ml-auto"
              items={[
                { label: '수정', icon: <Pencil />, onClick: startEdit },
                {
                  label: '삭제',
                  icon: <Trash2 />,
                  onClick: () => onDelete?.(id),
                  danger: true,
                },
              ]}
            />
          )}
        </div>

        {editing ? (
          <div className="mt-2">
            <textarea
              autoFocus
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="댓글 수정"
              className={cn(controlClass(), 'resize-none py-3')}
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                variant="soft"
                size="sm"
                onClick={() => setEditing(false)}
              >
                취소
              </Button>
              <Button size="sm" onClick={save}>
                저장
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-base leading-relaxed break-keep whitespace-pre-line text-ink">
            {content}
          </p>
        )}
      </div>
    </div>
  )
}
