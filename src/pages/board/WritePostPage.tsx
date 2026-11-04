import { useNavigate, useRouter } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { BoardCategorySelect } from '@/components/board/BoardCategorySelect'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { TextArea } from '@/components/ui/TextArea'
import { TextField } from '@/components/ui/TextField'
import type { BoardCategory, BoardPost } from '@/lib/board'
import { addBoardPost, updateBoardPost } from '@/lib/boardStore'

type Field = 'category' | 'title' | 'content'
type Errors = Partial<Record<Field, string>>

interface WritePostPageProps {
  /** 있으면 수정 모드: 해당 글의 내용을 채운 채로 시작한다 */
  post?: BoardPost
}

export function WritePostPage({ post }: WritePostPageProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const isEdit = Boolean(post)
  const [category, setCategory] = useState<BoardCategory | null>(
    post?.category ?? null,
  )
  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? post?.preview ?? '')
  const [errors, setErrors] = useState<Errors>({})

  const clearError = (field: Field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }))

  /** 이전 화면으로. 직접 열었다면 게시판으로 */
  const goBack = () => {
    if (router.history.canGoBack()) router.history.back()
    else navigate({ to: '/board' })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const next: Errors = {}
    if (!category) next.category = '카테고리를 선택하세요'
    if (!title.trim()) next.title = '제목을 입력하세요'
    if (!content.trim()) next.content = '내용을 입력하세요'
    setErrors(next)
    if (!category || next.title || next.content) return

    const input = {
      category,
      title: title.trim(),
      content: content.trim(),
    }
    if (post) {
      updateBoardPost(post.id, input)
      goBack()
    } else {
      addBoardPost(input)
      navigate({ to: '/board', replace: true })
    }
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title={isEdit ? '게시글 수정' : '게시글 작성'}
          centered
          onBack={goBack}
        />
      }
      flush
      className="flex flex-col bg-surface"
    >
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col" noValidate>
        <div className="flex flex-col gap-5 px-5 py-5">
          <FormField
            label="카테고리"
            helper={errors.category}
            status={errors.category ? 'error' : 'default'}
          >
            <BoardCategorySelect
              value={category}
              onChange={(next) => {
                setCategory(next)
                clearError('category')
              }}
            />
          </FormField>
          <TextField
            label="제목"
            placeholder="제목을 입력하세요"
            maxLength={100}
            showCount
            value={title}
            helper={errors.title}
            status={errors.title ? 'error' : 'default'}
            onChange={(event) => {
              setTitle(event.target.value)
              clearError('title')
            }}
          />
          <TextArea
            label="내용"
            placeholder="내용을 입력하세요"
            maxLength={2000}
            rows={7}
            value={content}
            helper={errors.content}
            status={errors.content ? 'error' : 'default'}
            onChange={(event) => {
              setContent(event.target.value)
              clearError('content')
            }}
          />
        </div>
        <div className="sticky bottom-0 mt-auto border-t border-line bg-surface px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button type="submit" size="lg" fullWidth>
            {isEdit ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </form>
    </PageLayout>
  )
}
