import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  CloudCheck,
  Lock,
  PenLine,
  ShieldCheck,
  Sticker as StickerIcon,
  Volume2,
} from "lucide-react";
import { DEMO_ACCOUNT, USE_MOCK } from "../api";
import { useAuth } from "../auth/authContext";
import { brandArt, characterArt } from "../assets/art";
import { DiaryView } from "../components/Diary/DiaryPaper";
import Brand from "../components/layout/Brand";
import StoryBook from "../components/StorybookViewer/StoryBook";
import { useLogin } from "../hooks/useAccount";
import { buildExampleEntries } from "../mock/diaryEntries";
import { buildStory } from "../mock/stories";
import type { ChildGender } from "../types";

const NAV_LINKS = [
  { href: "#diary", label: "하루 기록" },
  { href: "#book", label: "그림동화" },
  { href: "#safe", label: "안심 보관" },
  { href: "#faq", label: "자주 묻는 질문" },
];

const SAMPLE_MESSAGE = "친구와 나누면 기쁨이 두 배가 된다는 걸 알려주고 싶어요. 네 것을 기꺼이 내어줄 줄 아는 마음이 참 예뻐.";

export default function IntroPage() {
  const isSignedIn = useAuth().status === "authenticated";
  const login = useLogin();
  const navigate = useNavigate();
  const ctaTo = isSignedIn ? "/" : "/signup";
  const [sampleGender, setSampleGender] = useState<ChildGender>("girl");

  const sampleEntry = useMemo(() => buildExampleEntries()[2], []);
  const sampleBook = useMemo(() => {
    const name = sampleGender === "girl" ? "서아" : "도윤";
    const story = buildStory("sharing", name, sampleGender);
    return {
      title: story.title,
      coverImageUrl: story.coverImageUrl,
      pages: story.pages.map((p, i) => ({ pageNo: i + 1, ...p })),
      questions: story.questions,
      parentMessage: SAMPLE_MESSAGE,
      protagonistName: name,
      periodLabel: "봄날의 일주일",
      lessonTag: "나눔",
    };
  }, [sampleGender]);

  return (
    <div className="min-h-screen bg-canvas">
      {/* 상단 메뉴 */}
      <header className="sticky top-0 z-30 border-b border-hairline/60 bg-canvas">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Brand to="/intro" />
          <nav className="hidden items-center gap-1 md:flex" aria-label="소개 메뉴">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center rounded-xl px-3.5 text-[15px] font-medium text-brown/60 transition-colors hover:bg-sand-light hover:text-brown"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {!isSignedIn && (
              <Link
                to="/login"
                className="hidden min-h-11 items-center rounded-xl px-3.5 text-[15px] font-medium text-brown/70 hover:bg-sand-light sm:flex"
              >
                로그인
              </Link>
            )}
            <Link
              to={ctaTo}
              className="flex min-h-11 items-center rounded-xl bg-brown px-4 text-sm font-semibold text-white transition-colors hover:bg-brown/90"
            >
              {isSignedIn ? "내 기록으로" : "시작하기"}
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="text-left">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-sand-ink">
              하루동화 · 추억을 모아, 동화로
            </p>
            <h1 className="mt-5 font-display text-[36px] leading-[1.3] tracking-tight text-brown sm:text-[46px] lg:text-[54px]">
              하루하루 기록이<br />
              우리 아이만의<br />
              그림동화로.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-brown/65 sm:text-lg lg:mx-0">
              사진 한 장, 짧은 글에 담긴 소중한 추억. 우리 아이가 주인공인 그림동화책으로 만들어 함께 읽어 보세요.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
              <Link
                to={ctaTo}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-sand px-7 text-base font-semibold text-brown shadow-sm transition-colors hover:bg-sand-strong sm:w-auto"
              >
                {isSignedIn ? "내 기록 보러 가기" : "무료로 시작하기"}
                <ArrowRight size={18} aria-hidden />
              </Link>
              {USE_MOCK && !isSignedIn ? (
                <button
                  type="button"
                  onClick={() => login.mutate(DEMO_ACCOUNT, { onSuccess: () => navigate("/") })}
                  disabled={login.isPending}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-white px-7 text-base font-semibold text-brown ring-1 ring-hairline transition-colors hover:bg-sand-light disabled:opacity-60 sm:w-auto"
                >
                  {login.isPending ? "체험 계정 여는 중…" : "가입 없이 둘러보기"}
                </button>
              ) : (
                <a
                  href="#book"
                  className="flex min-h-14 w-full items-center justify-center rounded-lg bg-white px-7 text-base font-semibold text-brown ring-1 ring-hairline transition-colors hover:bg-sand-light sm:w-auto"
                >
                  그림동화 미리 읽기
                </a>
              )}
            </div>
          </div>
          <figure className="relative mx-auto w-full max-w-[420px] px-6 sm:px-8 lg:ml-auto lg:mr-0">
            <a href="#book" className="editorial-cover relative block overflow-hidden rounded-r-md border border-hairline bg-paper">
              <img src={sampleBook.coverImageUrl} alt={`${sampleBook.title} 그림책 표지. 눌러서 미리 읽기`} className="aspect-[4/5] w-full object-cover" />
              <div className="border-t border-hairline bg-canvas px-6 py-5">
                <p className="text-[11px] tracking-widest text-sand-ink">하루동화 그림책 · 01</p>
                <p className="mt-2 font-book text-2xl font-bold">{sampleBook.title}</p>
              </div>
            </a>
            <figcaption className="mt-5 flex justify-between gap-3 text-xs text-brown/60">
              <span>한 주의 기록으로 만든 그림책</span><a href="#book" className="underline underline-offset-4">펼쳐 보기 →</a>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 세 단계 */}
      <section className="border-y border-hairline/70 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold text-sand-ink">이렇게 만들어져요</p>
          <h2 className="mt-2 font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
            우리 아이의 하루에, 전하고 싶은 마음을 더해요
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brown/65">
            아이에게 있었던 일과 <strong className="font-semibold text-brown">부모님이 전하고 싶은 교훈과 메시지</strong>를 자연스럽게 녹여,
            <strong className="font-semibold text-brown">세상에 하나뿐인 우리 아이의 그림동화</strong>로 만들어요.
          </p>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "이야기가 될 하루를 남겨요",
                body: "친구와 다툰 날, 처음 혼자 도전한 날. 사진과 짧은 글로 남긴 아이의 경험이 동화의 소재가 돼요.",
              },
              {
                title: "전하고 싶은 교훈과 메시지를 골라요",
                body: "용기, 나눔, 정직처럼 알려주고 싶은 가치를 고르고, ‘실수해도 괜찮아’처럼 아이에게 건네고 싶은 마음을 적어요.",
              },
              {
                title: "마음이 녹아든 동화를 함께 읽어요",
                body: "아이에게 있었던 일에 부모님이 전하고 싶은 마음이 자연스럽게 녹아들어요. 세상에 하나뿐인, 우리 아이가 주인공인 그림동화를 함께 읽어 보세요.",
              },
            ].map((step, i) => (
              <li key={step.title} className="border-t border-hairline pt-6">
                <div className="py-2 pr-5">
                  <p className="font-book text-3xl text-sand-ink">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className={`mt-2 text-lg font-bold ${i === 1 ? "text-sand-ink" : "text-brown"}`}>{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-brown/60">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 일기 */}
      <section id="diary" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-sand-ink">하루 기록</p>
            <h2 className="mt-2 font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
              사진 한 장부터 시작하는
              <br />
              우리 아이 다이어리
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brown/65">
              사진 한 장에 스티커를 붙이고, 좋아하는 종이와 사진 틀을 골라 보세요. 아이와 함께 고르고 꾸미다 보면 평범한 하루도 꺼내 보고 싶은 추억이 돼요.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [StickerIcon, "손그림 스티커 18종", "하트, 도장, ‘참 잘했어요’까지"],
                [PenLine, "종이·사진 틀 고르기", "줄노트, 모눈, 크라프트, 폴라로이드"],
                [CloudCheck, "자동 임시 저장", "쓰다 나가도 그대로 이어서"],
                [Camera, "하루 사진 5장", "고르면 바로 안전하게 업로드"],
              ].map(([Icon, title, body]) => {
                const I = Icon as typeof Camera;
                return (
                  <li key={title as string} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sand-ink shadow-sm ring-1 ring-hairline">
                      <I size={18} aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-brown">{title as string}</p>
                      <p className="text-sm text-brown/55">{body as string}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="intro-diary-preview mx-auto w-full max-w-lg">
            <DiaryView entry={sampleEntry} />
          </div>
        </div>
      </section>

      {/* 그림동화 */}
      <section id="book" className="scroll-mt-16 bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-left">
            <p className="text-sm font-semibold text-sand-ink">그림동화 미리 읽기</p>
            <h2 className="mt-2 font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
              친구에게 장난감을 빌려준 하루가
              <br className="hidden sm:block" /> 이런 그림책이 됐어요
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brown/65">
              진짜 책처럼 오른쪽 장을 넘겨 보세요. 왼쪽엔 그림, 오른쪽엔 이야기가 있고, 마지막 장에는 부모님의 마음이 편지로 실려요.
            </p>
            <div className="mt-6 inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-hairline" role="radiogroup" aria-label="주인공 고르기">
              {(["girl", "boy"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={sampleGender === g}
                  onClick={() => setSampleGender(g)}
                  className={[
                    "flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
                    sampleGender === g ? "bg-brown text-white" : "text-brown/60 hover:text-brown",
                  ].join(" ")}
                >
                  <img src={characterArt[g].portrait} alt="" className="h-7 w-7 rounded-full bg-paper object-cover object-top" />
                  {g === "girl" ? "서아가 주인공" : "도윤이가 주인공"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <StoryBook key={sampleGender} book={sampleBook} maxHeight={640} compact />
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-brown/55">
            <Volume2 size={16} aria-hidden />
            ‘소리 내어 읽어주기’를 누르면 잠자리 동화처럼 읽어 드려요.
          </p>
        </div>
      </section>

      {/* 안심 */}
      <section id="safe" className="scroll-mt-16 border-y border-hairline/70 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-left">
            <p className="text-sm font-semibold text-forest">안심 보관</p>
            <h2 className="mt-2 font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
              기록의 보관과 사진 사용 안내
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [Lock, "기록과 동화의 공개 범위", "작성한 기록과 동화는 다른 이용자에게 공개되지 않으며, 로그인한 계정에서 확인할 수 있습니다.", "bg-ocean-light text-ocean-deep"],
              [ShieldCheck, "아이 사진의 사용 범위", "업로드한 아이 사진은 일상 기록에 보관됩니다. 동화 삽화에는 선택한 그림책 캐릭터를 사용하며, 아이의 얼굴 사진을 그림 생성에 사용하지 않습니다.", "bg-forest-light text-forest"],
              [CloudCheck, "작성 중인 기록도 자동 저장", "사진은 선택하면 업로드되고, 작성 중인 글은 자동으로 임시 저장됩니다. 저장된 기록은 언제든 수정하거나 삭제할 수 있습니다.", "bg-sand-light text-sand-ink"],
            ].map(([Icon, title, body, tone]) => {
              const I = Icon as typeof Lock;
              return (
                <div key={title as string} className="border-t border-hairline py-7 pr-6">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone as string}`}>
                    <I size={22} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-brown">{title as string}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-brown/60">{body as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 자주 묻는 질문 */}
      <section id="faq" className="scroll-mt-16 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-book text-3xl font-bold text-brown sm:text-4xl">자주 묻는 질문</h2>
          <div className="mt-10 divide-y divide-hairline border-y border-hairline">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-brown marker:content-none sm:text-base">
                  {faq.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-light text-sand-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-10 text-[15px] leading-relaxed text-brown/65">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 마지막 권유 */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-6 overflow-hidden rounded-xl bg-sand-light px-6 pt-10 sm:px-12 lg:grid-cols-[1fr_1fr] lg:pt-0">
          <div className="text-center lg:py-14 lg:text-left">
            <h2 className="font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
              오늘의 작은 순간이
              <br />
              내일의 그림책이 돼요
            </h2>
            <p className="mt-3 text-base text-brown/65">잊고 싶지 않은 우리 아이의 하루를 지금 남겨 보세요.</p>
            <Link
              to={ctaTo}
              className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-lg bg-brown px-7 text-base font-semibold text-white transition-colors hover:bg-brown/90"
            >
              <ArrowRight size={18} aria-hidden />
              {isSignedIn ? "오늘 기록하러 가기" : "무료로 시작하기"}
            </Link>
          </div>
          <img src={brandArt.momReading} alt="" loading="lazy" className="mx-auto w-full max-w-lg mix-blend-multiply soft-edges" />
        </div>
      </section>

      <footer className="border-t border-hairline bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-brown/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Brand to="/intro" size="sm" />
            <p className="mt-2">우리 아이의 하루가, 한 권의 동화로.</p>
          </div>
          <div className="text-xs leading-relaxed sm:text-right">
            {USE_MOCK && <p className="font-semibold text-sand-ink">지금 보고 계신 화면은 체험 버전이에요.</p>}
            <p>© {new Date().getFullYear()} 하루동화</p>
            <a href="/licenses/README.txt" target="_blank" rel="noreferrer" className="mt-2 inline-block underline underline-offset-4">폰트·아이콘 라이선스</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FAQS = [
  {
    q: "매일 길게 써야 하나요?",
    a: "아니요. 사진 한 장이나 한 줄이면 충분해요. 바쁜 날은 건너뛰어도 괜찮고, 지난 날짜에도 언제든 기록할 수 있어요.",
  },
  {
    q: "그림동화는 어떻게 만들어지나요?",
    a: "기간을 고르고 아이에게 전하고 싶은 마음을 적으면, 그 마음을 중심 줄거리로 삼고 기록 속 일화를 소재로 엮어 6장면의 그림책을 만들어요. 마지막 장에는 적어 주신 마음이 편지로 실려요.",
  },
  {
    q: "아이 사진이 그대로 동화 캐릭터가 되나요?",
    a: "아니요. 아이 얼굴 사진은 그림 생성에 쓰지 않아요. 수채화로 그린 여자아이·남자아이 캐릭터 중 하나를 골라, 아이 이름을 달고 주인공이 돼요.",
  },
  {
    q: "기록이 얼마나 있어야 동화를 만들 수 있나요?",
    a: "고른 기간(최대 31일)에 기록이 하나라도 있으면 만들 수 있어요. 기록이 많을수록 이야기 속 장면이 풍부해져요.",
  },
  {
    q: "올린 사진과 기록은 안전하게 저장되나요?",
    a: USE_MOCK
      ? "지금은 체험 버전이라 서버 대신 이 브라우저에만 저장돼요. 정식 서비스에서는 계정에 보관되어 어느 기기에서나 볼 수 있어요."
      : "로그인한 계정에 보관되어 어느 기기에서나 볼 수 있어요. 기록과 동화는 언제든 고치거나 지울 수 있어요.",
  },
];
