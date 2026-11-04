import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { BoardCategorySelect } from '@/components/board/BoardCategorySelect'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { TextArea } from '@/components/ui/TextArea'
import { TextField } from '@/components/ui/TextField'
import type { BoardCategory } from '@/lib/board'
import { addBoardPost } from '@/lib/boardStore'

type Field = 'category' | 'title' | 'content'
type Errors = Partial<Record<Field, string>>

export function WritePostPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<BoardCategory | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const clearError = (field: Field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const next: Errors = {}
    if (!category) next.category = '카테고리를 선택하세요'
    if (!title.trim()) next.title = '제목을 입력하세요'
    if (!content.trim()) next.content = '내용을 입력하세요'
    setErrors(next)
    if (!category || next.title || next.content) return

    addBoardPost({ category, title: title.trim(), content: content.trim() })
    navigate({ to: '/board', replace: true })
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="게시글 작성"
          centered
          onBack={() => navigate({ to: '/board' })}
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
            등록하기
          </Button>
        </div>
      </form>
    </PageLayout>
  )
}
