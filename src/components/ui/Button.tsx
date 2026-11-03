import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant =
  | 'primary'
  | 'outline'
  | 'danger'
  | 'dangerOutline'
  | 'soft'
  | 'kakao'
  | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-strong disabled:bg-primary-soft disabled:text-primary/60',
  outline:
    'border border-primary bg-surface text-primary hover:bg-primary-soft disabled:border-line disabled:text-ink-mute',
  danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-40',
  dangerOutline:
    'border border-line bg-surface text-danger hover:bg-danger-soft disabled:text-ink-mute',
  soft: 'bg-muted text-ink-sub hover:bg-line',
  kakao: 'bg-kakao text-ink hover:brightness-95',
  ghost: 'bg-transparent text-primary hover:bg-primary-soft',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-control font-bold transition-colors',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
}
