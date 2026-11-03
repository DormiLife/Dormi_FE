import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { EmailPasswordFields } from "@/components/auth/EmailPasswordFields";
import { ProfileFields } from "@/components/auth/ProfileFields";
import {
  initialSignUpValues,
  type SignUpValues,
} from "@/components/auth/signUpForm";
import {
  stepFields,
  validateField,
  validateStep,
  type SignUpErrors,
} from "@/components/auth/signUpValidation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

const TOTAL_STEPS = 2;

const stepTitle = ["계정 정보", "프로필 정보"];

export function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<SignUpValues>(initialSignUpValues);

  const [errors, setErrors] = useState<SignUpErrors>({});

  const handleChange =
    (key: keyof SignUpValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [key]: event.target.value };
      setValues(next);
      // 이미 에러가 뜬 칸은 입력하는 동안 바로 다시 검사해서 문구를 갱신
      setErrors((prev) => {
        const updated = { ...prev };
        for (const field of key === "password"
          ? (["password", "passwordConfirm"] as const)
          : ([key] as const)) {
          if (field in prev) {
            const message = validateField(field, next);
            if (message) updated[field] = message;
            else delete updated[field];
          }
        }
        return updated;
      });
    };

  const handleBack = () => {
    if (step === 1) navigate({ to: "/login" });
    else {
      setErrors({});
      setStep(step - 1);
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
    const stepErrors = validateStep(step, values);
    setErrors(stepErrors);

    const firstInvalid = stepFields[step - 1].find((key) => stepErrors[key]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    // TODO: 가입 API 연동
  };

  return (
    <PageLayout
      header={<PageHeader title="회원가입" onBack={handleBack} centered />}
      footer={
        <Button type="submit" form="signup-form" fullWidth size="lg">
          {step < TOTAL_STEPS ? "다음" : "가입하기"}
        </Button>
      }
      flush
    >
      <form
        id="signup-form"
        noValidate
        className="flex flex-col gap-3 px-4 py-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-ink-sub">
            {step} / {TOTAL_STEPS} · {stepTitle[step - 1]}
          </p>
          <ProgressBar value={step} max={TOTAL_STEPS} className="h-1.5" />
        </div>
        {step === 1 ? (
          <EmailPasswordFields
            withConfirm
            values={values}
            errors={errors}
            onChange={handleChange}
            passwordPlaceholder="8자 이상 입력하세요"
            passwordAutoComplete="new-password"
          />
        ) : (
          <ProfileFields
            values={values}
            errors={errors}
            onChange={handleChange}
            onGenderChange={(gender) =>
              setValues((prev) => ({ ...prev, gender }))
            }
            onNicknameCheck={handleNicknameCheck}
          />
        )}
      </form>
    </PageLayout>
  );
}
