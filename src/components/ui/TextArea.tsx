import { useId, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { controlClass } from './controlClass'
import { FormField, type FieldStatus } from './FormField'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helper?: ReactNode
  status?: FieldStatus
  /** maxLength가 있으면 기본으로 "0 / 2000" 카운터 표시 */
  showCount?: boolean
}

export function TextArea({
  label,
  helper,
  status = 'default',
  showCount,
  id,
  className,
  value,
  maxLength,
  rows = 10,
  ...props
}: TextAreaProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const length = String(value ?? '').length
  const countVisible = showCount ?? Boolean(maxLength)

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      helper={helper}
      status={status}
      className={className}
    >
      <textarea
        id={inputId}
        value={value}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={status === 'error' || undefined}
        className={cn(controlClass(status), 'resize-none py-3.5 leading-relaxed')}
        {...props}
      />
      {countVisible && maxLength && (
        <p className="text-right text-sm text-ink-mute">
          {length} / {maxLength}
        </p>
      )}
    </FormField>
  )
}
