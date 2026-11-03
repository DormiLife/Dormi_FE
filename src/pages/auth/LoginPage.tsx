import { Link } from "@tanstack/react-router";
import { House } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { EmailPasswordFields } from "@/components/auth/EmailPasswordFields";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/components/ui/IconBox";

type LoginKey = "email" | "password";

const emptyMessage: Record<LoginKey, string> = {
  email: "이메일을 입력해주세요.",
  password: "비밀번호를 입력해주세요.",
};

export function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<LoginKey, string>>>({});

  const handleChange =
    (key: LoginKey | "passwordConfirm") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (key === "passwordConfirm") return;
      const value = event.target.value;
      setValues((prev) => ({ ...prev, [key]: value }));
      // 에러가 뜬 칸은 값을 입력하는 즉시 경고를 지운다
      if (value.trim()) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<LoginKey, string>> = {};
    for (const key of ["email", "password"] as const) {
      if (!values[key].trim()) next[key] = emptyMessage[key];
    }
    setErrors(next);

    const firstInvalid = (["email", "password"] as const).find(
      (key) => next[key],
    );
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    // TODO: 로그인 API 연동
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg p-6">
        <div className="flex flex-col gap-2">
          <IconBox
            tone="solid"
            className="mx-auto size-20 rounded-3xl [&>svg]:size-10"
          >
            <House aria-hidden="true" />
          </IconBox>
          <h1 className="text-center text-2xl font-bold text-ink">DORMI</h1>
          <p className="text-center text-ink-mute">기숙사 생활을 편리하게</p>
        </div>

        <form
          noValidate
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <EmailPasswordFields
            values={values}
            errors={errors}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth>
            로그인
          </Button>
        </form>

        <div className="flex justify-center text-sm text-ink-sub">
          <span>아직 계정이 없나요? </span>
          <Link
            to="/signup"
            className="ml-1 font-bold text-primary hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
