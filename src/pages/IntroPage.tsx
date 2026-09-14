import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Image as ImageIcon, Sparkles } from "lucide-react";
import IntroNav from "../components/Intro/IntroNav";
import ExampleRecordCard from "../components/Intro/ExampleRecordCard";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import StorybookViewer from "../components/StorybookViewer/StorybookViewer";
import { useDiary } from "../context/useDiary";
import { hero, mascot, genericDiaryScenes, pointIcons } from "../mock/illustrations";
import { SAMPLE_STORYBOOK, LESSON_TAGS } from "../mock/storybook";

export default function IntroPage() {
  const { entriesByDate } = useDiary();
  const today = new Date();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-ivory">
      <IntroNav />

      {/* B. Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <p className="mb-3 inline-block rounded-full bg-mint-light px-3 py-1 text-xs font-medium text-mint-deep">
              AI로 엮는 우리 아이 성장 이야기
            </p>
            <h1 className="font-story text-3xl leading-tight text-brown sm:text-4xl lg:text-5xl">
              우리 아이의 하루가,
              <br />한 권의 동화로.
            </h1>
            <p className="mx-auto mt-4 max-w-md whitespace-pre-line text-sm leading-relaxed text-brown/70 sm:text-base lg:mx-0">
              {"사진 한 장과 짧은 이야기로 오늘을 남겨보세요.\nAI가 쌓인 추억에 부모의 마음을 더해,\n아이가 주인공인 그림동화를 만들어줍니다."}
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-coral px-7 py-3 font-story text-white shadow-md transition-transform hover:scale-105 sm:w-auto"
              >
                하루 기록 시작하기
                <ArrowRight size={18} />
              </Link>
              <a
                href="#preview"
                className="w-full rounded-full border border-hairline bg-white px-7 py-3 text-center text-sm font-medium text-brown/70 transition-colors hover:bg-mint-light sm:w-auto"
              >
                그림동화 미리보기
              </a>
            </div>
            <p className="mt-3 text-xs text-brown/50">
              지금은 준비된 기록과 동화로 체험할 수 있어요.
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <img
              src={hero}
              alt="민트색 멜빵옷을 입은 아기 하루가 커다랗게 펼쳐진 그림책 위에 앉아 있고, 책 속에는 작은 정원과 꽃, 별, 추억이 담긴 종이 조각들이 펼쳐져 있다"
              className="mx-auto w-full max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* C. 공감 영역 */}
      <section className="border-y border-hairline bg-white/60 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-story text-2xl text-brown sm:text-3xl">
              사진은 많은데,
              <br />
              그날의 이야기는 기억나나요?
            </h2>
            <p className="mx-auto mt-4 max-w-lg whitespace-pre-line text-sm leading-relaxed text-brown/70">
              {"처음 친구에게 장난감을 빌려준 날,\n무서워하던 미끄럼틀에 올라간 날.\n사진만으로는 담기 어려운 작은 이야기도\n하루동화에 함께 남겨주세요."}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { text: "사진 한 장으로 시작", image: pointIcons.photoStart },
              { text: "짧은 일화 한 줄이면 충분", image: pointIcons.shortStory },
              { text: "날짜별로 모이는 성장의 순간", image: pointIcons.growthByDate },
            ].map((point) => (
              <div
                key={point.text}
                className="flex flex-col items-center gap-3 rounded-2xl bg-mint-light px-4 py-5 text-center"
              >
                <img src={point.image} alt="" className="h-16 w-16 shrink-0" />
                <div className="flex items-center gap-1.5 text-sm text-brown">
                  <Check size={16} className="shrink-0 text-mint-deep" />
                  {point.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <ExampleRecordCard
              imageSrc={genericDiaryScenes[0]}
              dateLabel="8월 21일 · 실제 기록 예시"
              text="무섭다며 망설이던 그네를 오늘은 혼자 힘으로 끝까지 올라갔어요."
            />
            <ExampleRecordCard
              imageSrc={genericDiaryScenes[1]}
              dateLabel="8월 27일 · 실제 기록 예시"
              text="블록 탑이 와르르 무너졌는데도 울지 않고 다시 씩씩하게 쌓았어요."
            />
            <ExampleRecordCard
              imageSrc={genericDiaryScenes[4]}
              dateLabel="9월 3일 · 실제 기록 예시"
              text="오늘 서아가 친구에게 노란 삽을 빌려줬어요. 둘이 함께 모래성을 만들며 한참을 웃었어요."
            />
          </div>
        </div>
      </section>

      {/* D. 핵심 기능 1 */}
      <section id="record" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-coral-deep">01 · 오늘의 기록</p>
            <h2 className="mt-2 font-story text-2xl text-brown sm:text-3xl">
              길게 쓰지 않아도,
              <br />
              소중한 기록이 돼요.
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-brown/70">
              {"오늘 찍은 사진을 고르고 기억하고 싶은 일을 적어주세요.\n바쁜 날에는 사진만 남겨도 괜찮아요.\n아이의 하루가 캘린더에 차곡차곡 쌓입니다."}
            </p>
            <div className="mt-6">
              <ExampleRecordCard
                imageSrc={genericDiaryScenes[2]}
                dateLabel="예시 기록"
                text="오늘 서아가 친구에게 노란 삽을 빌려줬어요. 둘이 함께 모래성을 만들며 한참을 웃었어요."
              />
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
            <p className="mb-3 text-center font-story text-sm text-brown/60">
              {today.getFullYear()}년 {today.getMonth() + 1}월
            </p>
            <CalendarGrid
              year={today.getFullYear()}
              month={today.getMonth()}
              entriesByDate={entriesByDate}
              onDayClick={() => {}}
            />
          </div>
        </div>
      </section>

      {/* E. 핵심 기능 2 */}
      <section id="ai-story" className="scroll-mt-20 border-y border-hairline bg-white/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold text-coral-deep">02 · AI 그림동화</p>
            <h2 className="mt-2 font-story text-2xl text-brown sm:text-3xl">
              우리 아이의 경험에,
              <br />
              전하고 싶은 마음을 더해요.
            </h2>
            <p className="mx-auto mt-4 max-w-lg whitespace-pre-line text-sm leading-relaxed text-brown/70">
              {"추억을 고르고 나눔, 용기, 배려처럼 전하고 싶은 마음을 선택하세요.\nAI가 기록 속 경험을 이야기 소재로 연결하고,\n장면에 어울리는 삽화를 더해 아이만의 그림동화를 구성합니다."}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-hairline bg-white p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-mint-deep text-white">
                <ImageIcon size={22} />
              </span>
              <h3 className="mt-4 font-story text-base text-brown">우리 아이의 추억</h3>
              <p className="mt-1.5 text-sm text-brown/60">직접 남긴 사진과 짧은 일화</p>
            </div>
            <div className="rounded-2xl border border-hairline bg-white p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-coral-deep text-white">
                <Sparkles size={22} />
              </span>
              <h3 className="mt-4 font-story text-base text-brown">부모가 전하고 싶은 마음</h3>
              <p className="mt-1.5 text-sm text-brown/60">
                {LESSON_TAGS.join(" · ")}
              </p>
            </div>
            <div className="rounded-2xl border border-hairline bg-white p-6 text-center">
              <img src={mascot.write} alt="" className="mx-auto h-12 w-12" />
              <h3 className="mt-4 font-story text-base text-brown">AI가 구성하는 그림동화</h3>
              <p className="mt-1.5 text-sm text-brown/60">아이가 주인공인 이야기와 장면별 삽화</p>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-md rounded-2xl bg-yellow-light p-5 text-sm text-brown">
            <p>
              <strong className="font-semibold">기록</strong> · 친구에게 노란 삽을 빌려준 날
            </p>
            <p className="mt-1">
              <strong className="font-semibold">선택한 마음</strong> · 나눔
            </p>
            <p className="mt-1">
              <strong className="font-semibold">동화</strong> · 친구와 함께 꽃씨를 심으며 나누는
              기쁨을 발견하는 이야기
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-brown/50">
            현재 체험에서는 AI 생성 과정을 준비된 예시로 보여드려요.
          </p>
        </div>
      </section>

      {/* F. 동화 미리보기 */}
      <section id="preview" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-story text-2xl text-brown sm:text-3xl">
            익숙한 추억이,
            <br />
            새로운 이야기로 펼쳐져요.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brown/70">
            친구에게 삽을 빌려주었던 하루가 함께 꽃밭을 가꾸는 작은 모험이
            되었어요.
          </p>
          <div className="mt-4">
            <p className="font-story text-lg text-coral-deep">{SAMPLE_STORYBOOK.title}</p>
            <p className="mt-1 text-sm text-brown/60">
              전하고 싶은 마음: {SAMPLE_STORYBOOK.lesson} · 체험용 그림동화 · {SAMPLE_STORYBOOK.pages.length}페이지
            </p>
          </div>
        </div>

        <div className="mt-8">
          <StorybookViewer storybook={SAMPLE_STORYBOOK} />
        </div>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-hairline bg-white p-5">
          <p className="mb-2 text-sm font-semibold text-brown">이 이야기의 시작이 된 기록</p>
          <div className="flex items-start gap-3">
            <img src={genericDiaryScenes[2]} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
            <div>
              <p className="text-xs font-medium text-mint-deep">실제 기록 예시 · 나눔</p>
              <p className="mt-1 text-sm text-brown/70">
                친구에게 노란 삽을 빌려준 날의 짧은 기록이 이 동화의 시작이
                되었어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* G. 이용 방법 */}
      <section className="border-y border-hairline bg-white/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-story text-2xl text-brown sm:text-3xl">
            하루를 남기고,
            <br />
            함께 읽는 시간까지.
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <span className="font-story text-4xl text-coral/70">01</span>
              <h3 className="mt-2 font-story text-lg text-brown">오늘을 남겨요</h3>
              <p className="mt-1.5 text-sm text-brown/60">
                사진과 짧은 이야기로 아이의 하루를 기록해요.
              </p>
            </div>
            <div className="text-center">
              <span className="font-story text-4xl text-coral/70">02</span>
              <h3 className="mt-2 font-story text-lg text-brown">추억과 마음을 골라요</h3>
              <p className="mt-1.5 text-sm text-brown/60">
                동화에 담을 기간과 아이에게 전하고 싶은 마음을 선택해요.
              </p>
            </div>
            <div className="text-center">
              <span className="font-story text-4xl text-coral/70">03</span>
              <h3 className="mt-2 font-story text-lg text-brown">우리 아이 동화를 읽어요</h3>
              <p className="mt-1.5 text-sm text-brown/60">
                AI가 구성한 이야기와 삽화로 아이와 추억을 다시 만나보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* H. FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-story text-2xl text-brown sm:text-3xl">자주 묻는 질문</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((faq, i) => (
            <details
              key={faq.q}
              open={openFaq === i}
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) setOpenFaq(i);
                else if (openFaq === i) setOpenFaq(null);
              }}
              className="group rounded-2xl border border-hairline bg-white p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none font-story text-sm text-brown marker:content-none">
                <span className="flex items-center justify-between gap-2">
                  {faq.q}
                  <span className="shrink-0 text-brown/30 transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-brown/70">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* I. 마지막 CTA */}
      <section className="bg-coral py-16 text-center text-white">
        <img src={mascot.hug} alt="" className="mx-auto mb-4 h-28 w-28" />
        <h2 className="font-story text-2xl sm:text-3xl">
          오늘의 작은 순간,
          <br />
          내일의 소중한 동화.
        </h2>
        <p className="mt-2 text-sm text-white/90">잊고 싶지 않은 우리 아이의 하루를 남겨보세요.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-story text-coral-deep shadow-md transition-transform hover:scale-105"
        >
          첫 기록 남기러 가기
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="border-t border-hairline bg-ivory">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-brown/50 sm:px-6">
          <p className="font-story mb-1 text-sm text-brown/70">하루동화</p>
          <p>우리 아이의 하루가, 한 권의 동화로.</p>
          <p className="mt-1">프론트엔드 체험 버전</p>
        </div>
      </footer>
    </div>
  );
}

const FAQS = [
  {
    q: "매일 길게 써야 하나요?",
    a: "아니요. 사진 한 장이나 짧은 이야기 한 줄부터 시작할 수 있어요. 기억하고 싶은 순간을 부담 없이 남겨주세요.",
  },
  {
    q: "AI는 무엇을 만들어주나요?",
    a: "서비스는 기록 속 일화와 선택한 마음을 바탕으로 이야기와 장면별 삽화를 구성하는 것을 목표로 해요. 현재 체험 버전에서는 미리 준비된 동화로 흐름을 확인할 수 있어요.",
  },
  {
    q: "아이의 사진이 그대로 동화 캐릭터가 되나요?",
    a: "현재 체험에서는 준비된 아기 캐릭터를 사용해요. 실제 사진 속 외모를 재현하는 기능은 제공하지 않아요.",
  },
  {
    q: "기록이 얼마나 있어야 하나요?",
    a: "체험에서는 선택한 기간에 기록이 하나 이상 있으면 시작할 수 있어요. 여러 기록을 선택하며 동화 만들기 흐름을 살펴보세요.",
  },
  {
    q: "지금 올린 사진과 기록은 저장되나요?",
    a: "현재 데모에서는 서버에 업로드하지 않고, 열린 화면에서만 임시로 사용해요. 새로고침하면 추가한 기록이 사라져요.",
  },
];
