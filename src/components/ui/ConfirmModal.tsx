import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmModalProps {
  open: boolean
  title: string
  description?: ReactNode
  /** 설명 아래에 들어가는 영역 (탈퇴 확인 체크박스 등) */
  children?: ReactNode
  icon?: ReactNode
  tone?: 'danger' | 'primary'
  cancelLabel?: string
  confirmLabel: string
  confirmDisabled?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  children,
  icon,
  tone = 'danger',
  cancelLabel = '취소',
  confirmLabel,
  confirmDisabled,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} aria-label={title}>
      <div className="flex flex-col items-center text-center">
        <span
          className={cn(
            'flex size-12 items-center justify-center rounded-full [&>svg]:size-6',
            tone === 'danger'
              ? 'bg-danger-soft text-danger'
              : 'bg-primary-soft text-primary',
          )}
        >
          {icon ?? <CircleAlert />}
        </span>
        <h2 className="mt-4 text-xl font-bold text-ink">{title}</h2>
        {description && (
          <div className="mt-3 text-sm leading-relaxed text-ink-sub">
            {description}
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="soft" size="lg" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          variant={tone === 'danger' ? 'danger' : 'primary'}
          size="lg"
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
