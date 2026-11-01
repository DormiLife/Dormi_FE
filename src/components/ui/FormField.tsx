import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type FieldStatus = 'default' | 'success' | 'error'

interface FormFieldProps {
  label?: string
  htmlFor?: string
  helper?: ReactNode
  status?: FieldStatus
  children: ReactNode
  className?: string
}

const helperClass: Record<FieldStatus, string> = {
  default: 'text-ink-mute',
  success: 'text-success',
  error: 'text-danger',
}

export function FormField({
  label,
  htmlFor,
  helper,
  status = 'default',
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-semibold text-ink-sub">
          {label}
        </label>
      )}
      {children}
      {helper && (
        <p className={cn('text-sm leading-snug', helperClass[status])}>
          {helper}
        </p>
      )}
    </div>
  )
}
