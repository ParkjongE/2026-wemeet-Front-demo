import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { errorMessage } from "../api";
import AuthLayout from "../components/Auth/AuthLayout";
import Button from "../components/common/Button";
import CharacterPicker from "../components/common/CharacterPicker";
import TextField from "../components/common/TextField";
import { useCreateChild } from "../hooks/useAccount";
import { brandArt } from "../assets/art";
import type { ChildGender } from "../types";
import { todayString } from "../utils/date";
import { possessive } from "../utils/korean";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const createChild = useCreateChild();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<ChildGender | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const trimmed = name.trim();
  const nameError =
    trimmed.length === 0 ? "아이 이름을 알려 주세요." : trimmed.length > 20 ? "이름은 20자까지 쓸 수 있어요." : undefined;
  const genderError = gender ? undefined : "주인공 모습을 골라 주세요.";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError || genderError || createChild.isPending) return;
    createChild.mutate(
      { name: trimmed, birthDate: birthDate || null, gender },
      { onSuccess: () => navigate("/", { replace: true }) },
    );
  };

  return (
    <AuthLayout
      title="동화의 주인공을 소개해 주세요"
      description="이름과 모습만 알려 주시면 돼요. 나중에 설정에서 언제든 바꿀 수 있어요."
      illustration={brandArt.welcome}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <TextField
          label="아이 이름"
          placeholder="예: 서아"
          autoComplete="off"
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          hint="동화 속에서 이 이름으로 불려요."
          error={submitted ? nameError : undefined}
        />
        <div>
          <CharacterPicker value={gender} onChange={setGender} />
          {submitted && genderError && <p className="mt-1.5 text-xs text-error">{genderError}</p>}
        </div>
        <TextField
          label="생일 (선택)"
          type="date"
          max={todayString()}
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          hint="홈에서 아이와 함께한 날을 세어 드려요."
        />
        {createChild.isError && (
          <p role="alert" className="rounded-xl bg-error-light px-4 py-3 text-sm text-brown">
            {errorMessage(createChild.error)}
          </p>
        )}
        <Button type="submit" size="lg" loading={createChild.isPending} className="mt-1 w-full">
          {trimmed ? `${possessive(trimmed)} 하루 시작하기` : "시작하기"}
        </Button>
      </form>
    </AuthLayout>
  );
}
