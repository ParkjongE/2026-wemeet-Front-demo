import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookHeart,
  Camera,
  CloudCheck,
  HeartHandshake,
  Lock,
  PenLine,
  ShieldCheck,
  Sparkles,
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
      <header className="sticky top-0 z-30 border-b border-hairline/60 bg-canvas/85 backdrop-blur-md">
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
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:pb-20 lg:pt-16">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-sand-ink shadow-sm ring-1 ring-hairline">
              <BookHeart size={14} aria-hidden />
              육아 기록이 그림책이 되는 곳
            </p>
            <h1 className="mt-5 font-book text-[34px] font-bold leading-[1.3] text-brown sm:text-5xl lg:text-[56px]">
              우리 아이의 하루가,
              <br />
              한 권의 <span className="relative whitespace-nowrap">
                그림동화
                <span className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-sand-soft/80" aria-hidden />
              </span>
              로.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-brown/65 sm:text-lg lg:mx-0">
              사진 한 장과 짧은 글로 오늘을 남겨 두세요. 쌓인 하루에 엄마 아빠의 마음을 더하면, 아이가 주인공인 그림책이 완성돼요.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to={ctaTo}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-sand px-7 text-base font-semibold text-brown shadow-sm transition-colors hover:bg-sand-strong sm:w-auto"
              >
                {isSignedIn ? "내 기록 보러 가기" : "무료로 시작하기"}
                <ArrowRight size={18} aria-hidden />
              </Link>
              {USE_MOCK && !isSignedIn ? (
                <button
                  type="button"
                  onClick={() => login.mutate(DEMO_ACCOUNT, { onSuccess: () => navigate("/") })}
                  disabled={login.isPending}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 text-base font-semibold text-brown ring-1 ring-hairline transition-colors hover:bg-sand-light disabled:opacity-60 sm:w-auto"
                >
                  {login.isPending ? "체험 계정 여는 중…" : "가입 없이 둘러보기"}
                </button>
              ) : (
                <a
                  href="#book"
                  className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-white px-7 text-base font-semibold text-brown ring-1 ring-hairline transition-colors hover:bg-sand-light sm:w-auto"
                >
                  그림동화 미리 읽기
                </a>
              )}
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-brown/55 lg:justify-start">
              <li className="flex items-center gap-1.5">
                <Lock size={15} className="text-ocean-deep" aria-hidden />
                가족만 보는 비공개 기록
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-forest" aria-hidden />
                아이 사진은 그림 생성에 쓰지 않아요
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-[8%] rounded-full bg-sand-light" aria-hidden />
            <img
              src={brandArt.hero}
              alt="노란 가디건을 입은 여자아이와 줄무늬 티셔츠를 입은 남자아이가 바닥에 앉아 커다란 그림책을 함께 펼쳐 보며 웃고 있다"
              className="relative w-full mix-blend-multiply soft-edges"
            />
          </div>
        </div>
      </section>

      {/* 세 단계 */}
      <section className="border-y border-hairline/70 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-semibold text-sand-ink">이렇게 만들어져요</p>
          <h2 className="mt-2 text-center font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
            기록하고, 마음을 담고, 함께 읽어요
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "오늘을 남겨요",
                body: "사진 한 장, 한 줄이면 충분해요. 스티커와 예쁜 종이로 꾸미는 재미는 덤이에요.",
                art: brandArt.emptyDiary,
              },
              {
                icon: HeartHandshake,
                title: "전하고 싶은 마음을 적어요",
                body: "‘친구와 나누면 더 즐거워’처럼 아이에게 건네고 싶은 한마디가 이야기의 중심이 돼요.",
                art: brandArt.makingBook,
              },
              {
                icon: BookHeart,
                title: "그림책으로 함께 읽어요",
                body: "아이가 주인공인 6장면 그림동화가 완성돼요. 책장을 넘기며 소리 내어 읽어 줄 수도 있어요.",
                art: brandArt.momReading,
              },
            ].map((step, i) => (
              <li key={step.title} className="overflow-hidden rounded-[28px] bg-canvas ring-1 ring-hairline/60">
                <div className="flex h-48 items-end justify-center bg-sand-light/70 px-4">
                  <img src={step.art} alt="" loading="lazy" className="h-44 w-auto object-contain mix-blend-multiply soft-edges" />
                </div>
                <div className="p-6">
                  <p className="flex items-center gap-2 text-sm font-semibold text-sand-ink">
                    <step.icon size={17} aria-hidden />
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-brown">{step.title}</h3>
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
              쓰는 날이 기다려지는
              <br />
              우리 아이 다이어리
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brown/65">
              사진을 고르면 바로 올라가고, 쓰던 글은 자동으로 임시 저장돼요. 바쁜 날엔 사진만, 여유로운 날엔 스티커까지 붙여 마음껏 꾸며 보세요.
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
          <div className="mx-auto w-full max-w-lg rotate-[1.2deg]">
            <DiaryView entry={sampleEntry} />
          </div>
        </div>
      </section>

      {/* 그림동화 */}
      <section id="book" className="scroll-mt-16 bg-[#f6efe3] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-sand-ink">그림동화 미리 읽기</p>
            <h2 className="mt-2 font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
              친구에게 장난감을 빌려준 하루가
              <br className="hidden sm:block" /> 이런 그림책이 됐어요
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brown/65">
              진짜 책처럼 오른쪽 장을 넘겨 보세요. 왼쪽엔 그림, 오른쪽엔 이야기가 있고, 마지막 장에는 부모님의 마음이 편지로 실려요.
            </p>
            <div className="mt-6 inline-flex rounded-2xl bg-white p-1 shadow-sm ring-1 ring-hairline" role="radiogroup" aria-label="주인공 고르기">
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

      {/* 캐릭터 */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-sand-ink">우리 아이 캐릭터</p>
            <h2 className="mt-2 font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
              아이 이름을 단 그림책 주인공
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brown/65">
              실제 사진 대신, 따뜻한 수채화로 그린 두 아이 중 한 명이 우리 아이의 이름으로 이야기 속을 뛰어다녀요.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {(
              [
                ["girl", "여자아이 캐릭터", "단발머리에 노란 머리핀, 겨자색 가디건이 잘 어울리는 다정한 아이"],
                ["boy", "남자아이 캐릭터", "삐죽 솟은 머리카락에 줄무늬 티셔츠, 웃음이 많은 개구쟁이"],
              ] as const
            ).map(([g, title, desc]) => (
              <div key={g} className="flex items-end gap-4 overflow-hidden rounded-[28px] bg-white px-6 pt-6 shadow-card ring-1 ring-hairline/60">
                <img src={characterArt[g].full} alt="" loading="lazy" className="-mb-2 h-56 w-auto shrink-0 mix-blend-multiply soft-edges sm:h-64" />
                <div className="pb-8">
                  <p className="text-lg font-bold text-brown">{title}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-brown/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 안심 */}
      <section id="safe" className="scroll-mt-16 border-y border-hairline/70 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-forest">안심 보관</p>
            <h2 className="mt-2 font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
              아이의 기록이니까, 더 조심스럽게
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [Lock, "우리 가족만 봐요", "기록과 동화는 공개되지 않아요. 로그인한 계정에서만 열리고, 링크로 퍼지지 않아요.", "bg-ocean-light text-ocean-deep"],
              [ShieldCheck, "사진은 그림 재료가 아니에요", "삽화는 그림책 캐릭터로 그려요. 아이 얼굴 사진을 그림 생성에 넣지 않아요.", "bg-forest-light text-forest"],
              [CloudCheck, "쓰는 순간부터 지켜요", "사진은 고르는 즉시 올라가고, 글은 자동으로 임시 저장돼요. 언제든 고치고 지울 수 있어요.", "bg-sand-light text-sand-ink"],
            ].map(([Icon, title, body, tone]) => {
              const I = Icon as typeof Lock;
              return (
                <div key={title as string} className="rounded-[28px] bg-canvas p-7 ring-1 ring-hairline/60">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone as string}`}>
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
          <h2 className="text-center font-book text-3xl font-bold text-brown sm:text-4xl">자주 묻는 질문</h2>
          <div className="mt-10 divide-y divide-hairline rounded-[28px] bg-white px-5 shadow-card ring-1 ring-hairline/60 sm:px-8">
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
        <div className="mx-auto grid max-w-6xl items-center gap-6 overflow-hidden rounded-[32px] bg-sand-light px-6 pt-10 sm:px-12 lg:grid-cols-[1fr_1fr] lg:pt-0">
          <div className="text-center lg:py-14 lg:text-left">
            <h2 className="font-book text-3xl font-bold leading-snug text-brown sm:text-4xl">
              오늘의 작은 순간이
              <br />
              내일의 그림책이 돼요
            </h2>
            <p className="mt-3 text-base text-brown/65">잊고 싶지 않은 우리 아이의 하루를 지금 남겨 보세요.</p>
            <Link
              to={ctaTo}
              className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-brown px-7 text-base font-semibold text-white transition-colors hover:bg-brown/90"
            >
              <Sparkles size={18} aria-hidden />
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
