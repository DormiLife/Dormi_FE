import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  initialSignUpValues,
  type SignUpValues,
} from "@/components/auth/signUpForm";
import {
  validateField,
  type SignUpErrors,
} from "@/components/auth/signUpValidation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

type EditableKey = "nickname" | "room" | "phone";

const editableFields: EditableKey[] = ["nickname", "room", "phone"];

// TODO: API 연동 시 내 정보로 교체
const currentProfile: SignUpValues = {
  ...initialSignUpValues,
  nickname: "민트",
  room: "301",
  phone: "01012345678",
};

export function EditProfilePage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<SignUpValues>(currentProfile);
  const [errors, setErrors] = useState<SignUpErrors>({});

  const goBack = () => navigate({ to: "/my" });

  const handleChange =
    (key: EditableKey) => (event: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [key]: event.target.value };
      setValues(next);
      // 이미 에러가 뜬 칸은 입력하는 동안 바로 다시 검사해서 문구를 갱신
      if (key in errors) {
        setErrors((prev) => ({ ...prev, [key]: validateField(key, next) }));
      }
    };

  const handleNicknameCheck = () => {
    const message = validateField("nickname", values);
    setErrors((prev) => ({ ...prev, nickname: message }));
    if (message) document.getElementById("nickname")?.focus();
    // TODO: 별명 중복 확인 API 연동
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: SignUpErrors = {};
    for (const key of editableFields) {
      const message = validateField(key, values);
      if (message) nextErrors[key] = message;
    }
    setErrors(nextErrors);

    const firstInvalid = editableFields.find((key) => nextErrors[key]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    // TODO: 내 정보 수정 API 연동 (전화번호 중복이면 서버 에러를 phone 아래에 표시)
    goBack();
  };

  return (
    <PageLayout
      header={<PageHeader title="내 정보 수정" onBack={goBack} centered />}
      footer={
        <Button type="submit" form="edit-profile-form" fullWidth size="lg">
          저장
        </Button>
      }
      flush
    >
      <form
        id="edit-profile-form"
        noValidate
        className="flex flex-col gap-3 px-4 py-4"
        onSubmit={handleSubmit}
      >
        <TextField
          label="별명"
          id="nickname"
          placeholder="별명"
          value={values.nickname}
          onChange={handleChange("nickname")}
          status={errors.nickname ? "error" : "default"}
          helper={
            errors.nickname ??
            (values.nickname === currentProfile.nickname
              ? "현재 사용 중인 별명이에요."
              : undefined)
          }
          action={
            <Button variant="outline" onClick={handleNicknameCheck}>
              중복 확인
            </Button>
          }
        />
        <TextField
          label="호실"
          id="room"
          inputMode="numeric"
          placeholder="101"
          value={values.room}
          onChange={handleChange("room")}
          status={errors.room ? "error" : "default"}
          helper={errors.room}
        />
        <TextField
          label="전화번호"
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="하이픈 없이 숫자만"
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange("phone")}
          status={errors.phone ? "error" : "default"}
          helper={errors.phone}
        />
      </form>
    </PageLayout>
  );
}
