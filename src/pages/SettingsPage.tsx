import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CloudCheck, Info, Lock, LogOut, ShieldCheck } from "lucide-react";
import { USE_MOCK, errorMessage } from "../api";
import { useAuth, useCurrentChild } from "../auth/authContext";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/common/Button";
import CharacterAvatar from "../components/common/CharacterAvatar";
import CharacterPicker from "../components/common/CharacterPicker";
import TextField from "../components/common/TextField";
import { useToast } from "../components/common/toastContext";
import { useUpdateChild } from "../hooks/useAccount";
import type { ChildGender } from "../types";
import { todayString } from "../utils/date";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const child = useCurrentChild();
  const updateChild = useUpdateChild(child.id);
  const toast = useToast();
  const [name, setName] = useState(child.name);
  const [birthDate, setBirthDate] = useState(child.birthDate ?? "");
  const [gender, setGender] = useState<ChildGender | null>(child.gender);

  const trimmed = name.trim();
  const nameError = trimmed.length === 0 ? "아이 이름을 알려 주세요." : undefined;
  const dirty = trimmed !== child.name || (birthDate || null) !== child.birthDate || gender !== child.gender;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (nameError || !dirty) return;
    updateChild.mutate(
      { name: trimmed, birthDate: birthDate || null, gender },
      { onSuccess: () => toast.show("아이 프로필을 저장했어요.") },
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-10">
      <PageHeader eyebrow="설정" title="우리 아이와 계정" />

      <section className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-hairline/60 sm:p-7">
        <div className="flex items-center gap-4">
          <CharacterAvatar gender={child.gender} className="h-16 w-16" />
          <div>
            <h2 className="text-lg font-bold text-brown">{child.name}</h2>
            <p className="text-sm text-brown/55">동화 속 주인공 프로필</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <TextField
            label="아이 이름"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            hint="동화 속에서 불리는 이름이에요."
            error={nameError}
          />
          <CharacterPicker value={gender} onChange={setGender} />
          <TextField
            label="생일 (선택)"
            type="date"
            max={todayString()}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          {updateChild.isError && dirty && (
            <p role="alert" className="text-sm text-error">
              {errorMessage(updateChild.error)}
            </p>
          )}
          <Button type="submit" size="lg" loading={updateChild.isPending} disabled={!dirty || !!nameError}>
            변경 내용 저장
          </Button>
          <p className="-mt-2 text-xs text-brown/45">이미 완성된 동화는 그대로 두고, 새로 만드는 동화부터 반영돼요.</p>
        </form>
      </section>

      <section className="mt-5 rounded-[28px] bg-white p-5 shadow-card ring-1 ring-hairline/60 sm:p-7">
        <h2 className="text-lg font-bold text-brown">기록 보관과 개인정보</h2>
        <ul className="mt-4 space-y-4 text-sm leading-relaxed">
          <li className="flex gap-3">
            <CloudCheck size={20} className="shrink-0 text-forest" aria-hidden />
            <div>
              <p className="font-semibold text-brown">기록은 계정에 저장돼요</p>
              <p className="text-brown/55">
                {USE_MOCK
                  ? "체험 버전에서는 이 브라우저에만 저장돼요. 브라우저 데이터를 지우면 함께 지워져요."
                  : "저장한 사진과 글은 서버에 보관돼 다른 기기에서도 그대로 볼 수 있어요."}
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Lock size={20} className="shrink-0 text-ocean-deep" aria-hidden />
            <div>
              <p className="font-semibold text-brown">우리 가족만 볼 수 있어요</p>
              <p className="text-brown/55">기록과 동화는 공개되지 않고, 로그인한 계정에서만 열려요.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <ShieldCheck size={20} className="shrink-0 text-sand-ink" aria-hidden />
            <div>
              <p className="font-semibold text-brown">아이 사진으로 그림을 만들지 않아요</p>
              <p className="text-brown/55">동화 삽화는 그림책 캐릭터로 그려요. 사진은 기록을 보여줄 때만 쓰여요.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="mt-5 rounded-[28px] bg-white p-5 shadow-card ring-1 ring-hairline/60 sm:p-7">
        <h2 className="text-lg font-bold text-brown">계정</h2>
        <p className="mt-1 text-sm text-brown/55">{user?.email}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/intro"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-[15px] font-semibold text-brown ring-1 ring-hairline hover:bg-sand-light"
          >
            <Info size={17} aria-hidden />
            서비스 소개 보기
          </Link>
          <Button variant="danger" className="flex-1" onClick={signOut}>
            <LogOut size={17} aria-hidden />
            로그아웃
          </Button>
        </div>
      </section>
    </div>
  );
}
