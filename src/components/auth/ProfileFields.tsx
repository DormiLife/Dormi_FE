import type { ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { TextField } from '@/components/ui/TextField'
import type { Gender, SignUpValues } from './signUpForm'
import type { SignUpErrors } from './signUpValidation'

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
]

interface ProfileFieldsProps {
  values: SignUpValues
  errors: SignUpErrors
  onChange: (
    key: keyof SignUpValues,
  ) => (event: ChangeEvent<HTMLInputElement>) => void
  onGenderChange: (gender: Gender) => void
  onNicknameCheck: () => void
}

export function ProfileFields({
  values,
  errors,
  onChange,
  onGenderChange,
  onNicknameCheck,
}: ProfileFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 items-start gap-2.5">
        <TextField
          label="이름"
          id="name"
          placeholder="홍길동"
          autoComplete="name"
          value={values.name}
          onChange={onChange('name')}
          status={errors.name ? 'error' : 'default'}
          helper={errors.name}
        />
        <TextField
          label="호실"
          id="room"
          inputMode="numeric"
          placeholder="101"
          value={values.room}
          onChange={onChange('room')}
          status={errors.room ? 'error' : 'default'}
          helper={errors.room}
        />
      </div>
      <TextField
        label="별명"
        id="nickname"
        placeholder="별명"
        value={values.nickname}
        onChange={onChange('nickname')}
        status={errors.nickname ? 'error' : 'default'}
        helper={errors.nickname}
        action={
          <Button variant="outline" onClick={onNicknameCheck}>
            중복 확인
          </Button>
        }
      />
      <FormField label="성별">
        <SegmentedControl
          variant="solid"
          options={genderOptions}
          value={values.gender}
          onChange={onGenderChange}
        />
      </FormField>
      <TextField
        label="전화번호"
        id="phone"
        type="tel"
        inputMode="numeric"
        placeholder="하이픈 없이 숫자만"
        autoComplete="tel"
        value={values.phone}
        onChange={onChange('phone')}
        status={errors.phone ? 'error' : 'default'}
        helper={errors.phone}
      />
    </>
  )
}
