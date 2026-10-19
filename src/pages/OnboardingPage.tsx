import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { errorMessage } from "../api";
import AuthLayout from "../components/Auth/AuthLayout";
import Button from "../components/common/Button";
import TextField from "../components/common/TextField";
import { useCreateChild } from "../hooks/useAccount";
import { mascot } from "../mock/illustrations";
import { todayString } from "../utils/date";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const createChild = useCreateChild();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const trimmed = name.trim();
  const nameError =
    trimmed.length === 0
      ? "아이 이름을 알려 주세요."
      : trimmed.length > 20
        ? "이름은 20자까지 쓸 수 있어요."
        : undefined;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError || createChild.isPending) return;
    createChild.mutate(
      { name: trimmed, birthDate: birthDate || null },
      { onSuccess: () => navigate("/", { replace: true }) },
    );
  };

  return (
    <AuthLayout
      title="반가워요, 저는 하루예요"
      description="앞으로 만들 동화의 주인공을 소개해 주세요."
      illustration={mascot.hug}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="아이 이름 (필수)"
          placeholder="예: 서아"
          autoComplete="off"
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          hint="이 이름으로 동화 속 주인공이 불려요."
          error={submitted ? nameError : undefined}
        />
        <TextField
          label="생년월일 (선택)"
          type="date"
          max={todayString()}
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        {createChild.isError && (
          <p role="alert" className="rounded-xl bg-coral-light/60 px-4 py-3 text-sm text-brown">
            {errorMessage(createChild.error)}
          </p>
        )}
        <Button type="submit" loading={createChild.isPending} className="mt-1 w-full">
          {trimmed ? `${trimmed}의 하루 시작하기` : "시작하기"}
        </Button>
      </form>
    </AuthLayout>
  );
}
