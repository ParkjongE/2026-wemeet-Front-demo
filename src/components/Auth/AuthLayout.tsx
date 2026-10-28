import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { brandArt } from "../../assets/art";
import Brand from "../layout/Brand";

interface AuthLayoutProps {
  title: string;
  description: string;
  illustration?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, description, illustration = brandArt.welcome, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* 그림 영역 (넓은 화면) */}
      <aside className="relative hidden overflow-hidden bg-sand-light lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Brand to="/intro" />
        <div className="relative">
          <img src={illustration} alt="" className="relative mx-auto w-full max-w-md mix-blend-multiply soft-edges" />
        </div>
        <div>
          <p className="font-display text-2xl leading-snug text-brown">
            우리 아이의 하루가,
            <br />
            한 권의 동화로.
          </p>
          <p className="mt-2 text-sm text-brown/60">사진 한 장과 짧은 글이 아이가 주인공인 그림책이 돼요.</p>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:min-h-0 lg:justify-center lg:py-12">
        <div className="lg:hidden">
          <Brand to="/intro" />
        </div>
        <div className="mx-auto w-full max-w-[400px] flex-1 lg:flex-none">
          <img src={illustration} alt="" className="mx-auto mt-4 h-40 w-auto mix-blend-multiply soft-edges lg:hidden" />
          <h1 className="mt-4 font-display text-[30px] leading-snug text-brown lg:mt-0">{title}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-brown/60">{description}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-brown/40">
            <Lock size={13} aria-hidden />
            기록과 사진은 우리 가족 계정에만 안전하게 보관돼요
          </p>
        </div>
      </main>
    </div>
  );
}
