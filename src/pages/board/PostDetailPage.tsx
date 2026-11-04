import { useNavigate, useParams, useRouter } from '@tanstack/react-router'
import { FileQuestion, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CommentInput } from '@/components/board/CommentInput'
import { CommentList } from '@/components/board/CommentList'
import { PostContent } from '@/components/board/PostContent'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { LikeButton } from '@/components/ui/LikeButton'
import {
  CURRENT_USER_NICKNAME,
  MOCK_BOARD_COMMENTS,
  type BoardComment,
  type BoardPost,
} from '@/lib/board'
import { useBoardPosts } from '@/lib/boardStore'

function formatNow() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getMonth() + 1}/${now.getDate()} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export function PostDetailPage() {
  const { postId } = useParams({ strict: false })
  const posts = useBoardPosts()
  const post = posts.find((item) => item.id === postId)

  if (!post) return <PostNotFound />
  return <PostDetail key={post.id} post={post} />
}

function PostNotFound() {
  const navigate = useNavigate()
  return (
    <PageLayout
      header={
        <PageHeader title="게시글" onBack={() => navigate({ to: '/board' })} />
      }
    >
      <EmptyState
        icon={<FileQuestion />}
        title="게시글을 찾을 수 없어요"
        description="삭제되었거나 없는 글이에요."
      />
    </PageLayout>
  )
}

function PostDetail({ post }: { post: BoardPost }) {
  const navigate = useNavigate()
  const router = useRouter()

  /** 이전 화면(홈, 게시판 등)으로 돌아간다. 직접 열었다면 게시판으로 */
  const goBack = () => {
    if (router.history.canGoBack()) router.history.back()
    else navigate({ to: '/board' })
  }
  const [liked, setLiked] = useState(post.liked ?? false)
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0)
  const [comments, setComments] = useState<BoardComment[]>(
    MOCK_BOARD_COMMENTS[post.id] ?? [],
  )
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [postDeleteOpen, setPostDeleteOpen] = useState(false)
  const isMine = post.author === CURRENT_USER_NICKNAME

  const toggleLike = () => {
    setLikeCount((count) => count + (liked ? -1 : 1))
    setLiked(!liked)
  }

  const addComment = (content: string) => {
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: CURRENT_USER_NICKNAME,
        content,
        createdAt: formatNow(),
      },
    ])
  }

  const editComment = (id: string, content: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, content } : comment,
      ),
    )
  }

  const confirmDelete = () => {
    setComments((prev) => prev.filter((comment) => comment.id !== deleteTarget))
    setDeleteTarget(null)
  }

  return (
    <PageLayout
      header={
        <PageHeader
          onBack={goBack}
          className="h-14 border-b-0"
          right={
            isMine && (
              <ActionMenu
                label="게시글 메뉴"
                className="-mr-2"
                items={[
                  {
                    // TODO: 글 수정 화면이 생기면 연결
                    label: '수정',
                    icon: <Pencil />,
                    onClick: () => undefined,
                  },
                  {
                    label: '삭제',
                    icon: <Trash2 />,
                    onClick: () => setPostDeleteOpen(true),
                    danger: true,
                  },
                ]}
              />
            )
          }
        />
      }
      flush
      className="flex flex-col bg-surface"
    >
      <PostContent
        post={post}
        right={
          <LikeButton liked={liked} count={likeCount} onToggle={toggleLike} />
        }
      />
      <div aria-hidden="true" className="h-2.5 bg-canvas" />
      <CommentList
        comments={comments}
        currentUser={CURRENT_USER_NICKNAME}
        onEdit={editComment}
        onDelete={setDeleteTarget}
        className="flex-1"
      />
      <div aria-hidden="true" className="h-2.5 bg-canvas" />
      <CommentInput onSubmit={addComment} />

      <ConfirmModal
        open={deleteTarget !== null}
        title="댓글을 삭제할까요?"
        description="삭제한 댓글은 복구할 수 없어요."
        confirmLabel="삭제"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <ConfirmModal
        open={postDeleteOpen}
        title="게시글을 삭제할까요?"
        description="삭제한 게시글은 복구할 수 없어요."
        confirmLabel="삭제"
        onCancel={() => setPostDeleteOpen(false)}
        onConfirm={() => {
          setPostDeleteOpen(false)
          navigate({ to: '/board' })
        }}
      />
    </PageLayout>
  )
}
