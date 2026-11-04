import { Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { controlClass } from '@/components/ui/controlClass'
import { cn } from '@/lib/utils'

interface CommentInputProps {
  onSubmit: (content: string) => void
  className?: string
}

export function CommentInput({ onSubmit, className }: CommentInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const content = value.trim()
    if (!content) return
    onSubmit(content)
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'sticky bottom-0 mt-auto flex items-center gap-2 border-t border-line bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]',
        className,
      )}
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="댓글을 입력하세요"
        aria-label="댓글 입력"
        className={cn(controlClass(), 'h-11 min-w-0 flex-1 rounded-full bg-canvas')}
      />
      <button
        type="submit"
        aria-label="댓글 등록"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors active:bg-primary-strong"
      >
        <Send className="size-5" />
      </button>
    </form>
  )
}
