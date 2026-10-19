import { useState, type FormEvent } from "react";
import { LogOut } from "lucide-react";
import { errorMessage } from "../api";
import { useAuth, useCurrentChild } from "../auth/authContext";
import AppHeader from "../components/AppHeader";
import Button from "../components/common/Button";
import TextField from "../components/common/TextField";
import { useUpdateChild } from "../hooks/useAccount";
import { todayString } from "../utils/date";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const child = useCurrentChild();
  const updateChild = useUpdateChild(child.id);
  const [name, setName] = useState(child.name);
  const [birthDate, setBirthDate] = useState(child.birthDate ?? "");

  const trimmed = name.trim();
  const nameError = trimmed.length === 0 ? "아이 이름을 알려 주세요." : undefined;
  const dirty = trimmed !== child.name || (birthDate || null) !== child.birthDate;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (nameError || !dirty) return;
    updateChild.mutate({ name: trimmed, birthDate: birthDate || null });
  };

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-4 sm:px-6">
      <AppHeader title="설정" />

      <section className="rounded-2xl bg-white/80 p-5 shadow-sm sm:p-6">
        <h2 className="font-story text-lg text-brown">아이 프로필</h2>
        <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
          <TextField
            label="아이 이름"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            hint="동화 속 주인공 이름이에요."
            error={nameError}
          />
          <TextField
            label="생년월일 (선택)"
            type="date"
            max={todayString()}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          {updateChild.isError && (
            <p role="alert" className="text-sm text-coral-deep">
              {errorMessage(updateChild.error)}
            </p>
          )}
          {updateChild.isSuccess && !dirty && (
            <p role="status" className="text-sm text-mint-deep">
              저장했어요.
            </p>
          )}
          <Button type="submit" loading={updateChild.isPending} disabled={!dirty || !!nameError}>
            저장하기
          </Button>
        </form>
      </section>

      <section className="mt-4 rounded-2xl bg-white/80 p-5 shadow-sm sm:p-6">
        <h2 className="font-story text-lg text-brown">계정</h2>
        <p className="mt-2 text-sm text-brown/60">{user?.email}</p>
        <Button variant="danger" className="mt-4 w-full" onClick={signOut}>
          <LogOut size={18} aria-hidden />
          로그아웃
        </Button>
      </section>
    </div>
  );
}
