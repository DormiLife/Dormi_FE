import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { BoardPostList } from '@/components/board/BoardPostList'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { FilterChips } from '@/components/ui/FilterChips'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton'
import {
  BOARD_CATEGORY_META,
  type BoardCategory,
} from '@/lib/board'
import { useBoardPosts } from '@/lib/boardStore'

type CategoryFilter = 'all' | BoardCategory

const filterItems: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'question', label: BOARD_CATEGORY_META.question.label },
  { value: 'info', label: BOARD_CATEGORY_META.info.label },
  { value: 'general', label: BOARD_CATEGORY_META.general.label },
]

export function BoardPage() {
  const navigate = useNavigate()
  const allPosts = useBoardPosts()
  const [category, setCategory] = useState<CategoryFilter>('all')

  const posts =
    category === 'all'
      ? allPosts
      : allPosts.filter((post) => post.category === category)

  return (
    <PageLayout
      header={
        <div className="sticky top-0 z-10 border-b border-line bg-surface">
          <PageHeader
            title="게시판"
            centered
            className="static border-b-0"
          />
          <FilterChips
            items={filterItems}
            value={category}
            onChange={setCategory}
            fill
            className="pt-1"
          />
        </div>
      }
      bottomNav={<BottomNav active="board" />}
      fab={
        <FloatingActionButton
          label="글쓰기"
          icon={<Plus />}
          onClick={() => navigate({ to: '/board/new' })}
        />
      }
      flush
      className="pb-24"
    >
      <BoardPostList
        posts={posts}
        onPostClick={(postId) =>
          navigate({ to: '/board/$postId', params: { postId } })
        }
      />
    </PageLayout>
  )
}
