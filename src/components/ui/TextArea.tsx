import {
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
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
  defaultValue,
  onChange,
  maxLength,
  rows = 10,
  'aria-describedby': describedBy,
  ...props
}: TextAreaProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const helperId = helper ? `${inputId}-helper` : undefined
  const [uncontrolledLength, setUncontrolledLength] = useState(
    String(defaultValue ?? '').length,
  )
  const length =
    value !== undefined ? String(value).length : uncontrolledLength
  const countVisible = showCount ?? Boolean(maxLength)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUncontrolledLength(event.target.value.length)
    onChange?.(event)
  }

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      helper={helper}
      helperId={helperId}
      counter={countVisible && maxLength ? `${length} / ${maxLength}` : undefined}
      status={status}
      className={className}
    >
      <textarea
        id={inputId}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={status === 'error' || undefined}
        aria-describedby={
          [describedBy, helperId].filter(Boolean).join(' ') || undefined
        }
        className={cn(controlClass(status), 'resize-none py-3.5 leading-relaxed')}
        {...props}
      />
    </FormField>
  )
}
