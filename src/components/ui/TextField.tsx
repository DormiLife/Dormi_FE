import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { controlClass } from './controlClass'
import { FormField, type FieldStatus } from './FormField'

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helper?: ReactNode
  status?: FieldStatus
  /** 입력창 오른쪽에 붙는 버튼 (예: 중복 확인) */
  action?: ReactNode
  /** maxLength와 함께 쓰면 "0 / 100" 카운터 표시 */
  showCount?: boolean
}

export function TextField({
  label,
  helper,
  status = 'default',
  action,
  showCount,
  id,
  className,
  value,
  maxLength,
  ...props
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const length = String(value ?? '').length

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      helper={helper}
      status={status}
      className={className}
    >
      <div className="flex items-center gap-2.5">
        <input
          id={inputId}
          value={value}
          maxLength={maxLength}
          aria-invalid={status === 'error' || undefined}
          className={cn(controlClass(status), 'h-12 min-w-0 flex-1')}
          {...props}
        />
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {showCount && maxLength && (
        <p className="text-right text-sm text-ink-mute">
          {length} / {maxLength}
        </p>
      )}
    </FormField>
  )
}
