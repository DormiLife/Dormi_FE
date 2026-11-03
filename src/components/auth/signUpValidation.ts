import type { SignUpValues } from './signUpForm'

export type SignUpErrors = Partial<Record<keyof SignUpValues, string>>

/** 단계별로 검사할 필드 (화면 위에서 아래 순서) */
export const stepFields: (keyof SignUpValues)[][] = [
  ['email', 'password', 'passwordConfirm'],
  ['name', 'room', 'nickname', 'phone'],
]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])[\x21-\x7E]{8,20}$/
const NAME = /^[가-힣a-zA-Z]{1,10}$/
const ROOM = /^[1-9]\d{2}$/
const NICKNAME = /^[가-힣a-zA-Z0-9_]*$/
const PHONE = /^\d{10,11}$/

/** 규칙은 백엔드 검증(@NotBlank, @Size, @Pattern)과 같은 순서·문구를 따른다 */
export function validateField(
  key: keyof SignUpValues,
  values: SignUpValues,
): string | undefined {
  const value = typeof values[key] === 'string' ? values[key].trim() : ''

  switch (key) {
    case 'email':
      if (!value) return '이메일을 입력해주세요.'
      if (!EMAIL.test(value)) return '올바른 이메일 형식으로 입력해주세요.'
      return
    case 'password': {
      const password = values.password
      if (!password.trim()) return '비밀번호를 입력해주세요.'
      if (password.length < 8 || password.length > 20)
        return '비밀번호는 8자 이상 20자 이하여야 합니다.'
      if (!PASSWORD.test(password))
        return '비밀번호는 영문, 숫자, 특수문자를 각각 1자 이상 포함해야 하며 공백이나 한글은 사용할 수 없습니다.'
      return
    }
    case 'passwordConfirm':
      if (!values.passwordConfirm) return '비밀번호를 한 번 더 입력해주세요.'
      if (values.password !== values.passwordConfirm)
        return '비밀번호가 일치하지 않아요.'
      return
    case 'name':
      if (!value) return '이름을 입력해주세요.'
      if (!NAME.test(value)) return '이름은 한글 또는 영문 10자 이하로 입력해주세요.'
      return
    case 'room':
      if (!value) return '방 번호를 입력해주세요.'
      if (!ROOM.test(value))
        return '방 번호는 3자리 숫자여야 합니다.'
      return
    case 'nickname':
      if (!value) return '별명을 입력해주세요.'
      if (value.length < 2 || value.length > 10)
        return '별명은 2자 이상 10자 이하여야 합니다.'
      if (!NICKNAME.test(value))
        return '별명은 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.'
      return
    case 'phone':
      if (!value) return '전화번호를 입력해주세요.'
      if (!PHONE.test(value))
        return '전화번호가 잘못 입력되었습니다. 다시 입력해주세요.'
      return
    default:
      return
  }
}

export function validateStep(
  step: number,
  values: SignUpValues,
): SignUpErrors {
  const errors: SignUpErrors = {}
  for (const key of stepFields[step - 1]) {
    const message = validateField(key, values)
    if (message) errors[key] = message
  }
  return errors
}
