import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  liked: boolean
  count: number
  onToggle: () => void
  className?: string
}

export function LikeButton({
  liked,
  count,
  onToggle,
  className,
}: LikeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={`좋아요 ${count}개`}
      onClick={onToggle}
      className={cn(
        '-mr-2 flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-full px-2 text-sm font-semibold transition-colors',
        liked ? 'text-danger' : 'text-ink-mute',
        className,
      )}
    >
      <Heart className={cn('size-5', liked && 'fill-current')} />
      {count}
    </button>
  )
}
