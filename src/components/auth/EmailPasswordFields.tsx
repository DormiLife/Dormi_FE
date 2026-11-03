import type { ChangeEvent } from 'react'
import { TextField } from '@/components/ui/TextField'

type FieldKey = 'email' | 'password' | 'passwordConfirm'

interface EmailPasswordFieldsProps {
  values: { email: string; password: string; passwordConfirm?: string }
  errors?: Partial<Record<FieldKey, string>>
  onChange: (key: FieldKey) => (event: ChangeEvent<HTMLInputElement>) => void
  /** 회원가입처럼 비밀번호 확인 칸이 필요할 때 켠다 */
  withConfirm?: boolean
  passwordPlaceholder?: string
  /** 로그인은 current-password, 회원가입은 new-password */
  passwordAutoComplete?: 'current-password' | 'new-password'
}

export function EmailPasswordFields({
  values,
  errors = {},
  onChange,
  withConfirm,
  passwordPlaceholder = '비밀번호를 입력하세요',
  passwordAutoComplete = 'current-password',
}: EmailPasswordFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <TextField
        label="이메일"
        id="email"
        type="email"
        placeholder="example@email.com"
        autoComplete="email"
        value={values.email}
        onChange={onChange('email')}
        status={errors.email ? 'error' : 'default'}
        helper={errors.email}
      />
      <TextField
        label="비밀번호"
        id="password"
        type="password"
        placeholder={passwordPlaceholder}
        autoComplete={passwordAutoComplete}
        value={values.password}
        onChange={onChange('password')}
        status={errors.password ? 'error' : 'default'}
        helper={errors.password}
      />
      {withConfirm && (
        <TextField
          label="비밀번호 확인"
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          autoComplete="new-password"
          value={values.passwordConfirm ?? ''}
          onChange={onChange('passwordConfirm')}
          status={errors.passwordConfirm ? 'error' : 'default'}
          helper={errors.passwordConfirm}
        />
      )}
    </div>
  )
}
