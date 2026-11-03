export type Gender = 'male' | 'female'

export interface SignUpValues {
  email: string
  password: string
  passwordConfirm: string
  name: string
  room: string
  nickname: string
  gender: Gender
  phone: string
}

export const initialSignUpValues: SignUpValues = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  room: '',
  nickname: '',
  gender: 'male',
  phone: '',
}
