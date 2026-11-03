import { cn } from '@/lib/utils'

const tones = [
  'bg-primary-soft text-primary-strong',
  'bg-warning-soft text-warning',
  'bg-success-soft text-success',
  'bg-purple-100 text-purple-700',
]

const sizeClass = {
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-14 text-xl',
  xl: 'size-[72px] text-3xl',
}

function toneFor(name: string) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return tones[hash % tones.length]
}

interface AvatarProps {
  name: string
  size?: keyof typeof sizeClass
  /** 내 계정처럼 강조할 때 파란 채움으로 표시 */
  solid?: boolean
  className?: string
}

export function Avatar({ name, size = 'md', solid, className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold',
        sizeClass[size],
        solid ? 'bg-primary text-white' : toneFor(name),
        className,
      )}
    >
      {[...name][0]}
    </span>
  )
}
