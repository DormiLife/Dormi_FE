import { useNavigate, useParams } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { EmptyState } from '@/components/ui/EmptyState'
import { CURRENT_USER_NICKNAME } from '@/lib/board'
import { useBoardPosts } from '@/lib/boardStore'
import { WritePostPage } from '@/pages/board/WritePostPage'

export function PostEditPage() {
  const { postId } = useParams({ strict: false })
  const posts = useBoardPosts()
  const navigate = useNavigate()
  const post = posts.find((item) => item.id === postId)

  // 없는 글이거나 내 글이 아니면 수정할 수 없다
  if (!post || post.author !== CURRENT_USER_NICKNAME) {
    return (
      <PageLayout
        header={
          <PageHeader
            title="게시글 수정"
            centered
            onBack={() => navigate({ to: '/board' })}
          />
        }
      >
        <EmptyState
          icon={<FileQuestion />}
          title="수정할 수 없는 게시글이에요"
          description="없는 글이거나 내가 쓴 글이 아니에요."
        />
      </PageLayout>
    )
  }

  return <WritePostPage key={post.id} post={post} />
}
