import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type FieldStatus = 'default' | 'success' | 'error'

interface FormFieldProps {
  label?: string
  htmlFor?: string
  helper?: ReactNode
  /** helper의 id. 입력창의 aria-describedby가 가리킨다 */
  helperId?: string
  /** 오른쪽 끝에 표시할 글자 수 등. helper는 같은 줄 왼쪽에 놓인다 */
  counter?: ReactNode
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
  helperId,
  counter,
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
      {(helper || counter) && (
        <div className="flex items-start justify-between gap-3 px-2">
          {helper && (
            <p
              id={helperId}
              className={cn('text-sm leading-snug', helperClass[status])}
            >
              {helper}
            </p>
          )}
          {counter && (
            <p className="ml-auto shrink-0 text-sm text-ink-mute">{counter}</p>
          )}
        </div>
      )}
    </div>
  )
}
