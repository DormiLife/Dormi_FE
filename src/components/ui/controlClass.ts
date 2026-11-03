import { cn } from '@/lib/utils'
import type { FieldStatus } from './FormField'

export const controlClass = (status: FieldStatus = 'default') =>
  cn(
    'w-full rounded-control border bg-surface px-4 text-base text-ink outline-none transition-colors placeholder:text-ink-mute/70 focus:border-ink-sub',
    status === 'success' && 'border-success focus:border-success',
    status === 'error' && 'border-danger focus:border-danger',
    status === 'default' && 'border-line',
  )
