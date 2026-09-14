import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, RotateCcw, CalendarDays, NotebookPen } from "lucide-react";
import { LESSON_TAGS, generateDummyStorybook } from "../mock/storybook";
import type { Storybook } from "../types";
import { addDays, todayString } from "../utils/date";
import { useDiary } from "../context/useDiary";
import StorybookViewer from "../components/StorybookViewer/StorybookViewer";
import AppHeader from "../components/AppHeader";
import { mascot } from "../mock/illustrations";

type Step = "select" | "loading" | "result";

const GENERATION_DELAY_MS = 2400;
const DEFAULT_NAME = "서아";

export default function StorybookPage() {
  const navigate = useNavigate();
  const { entriesByDate } = useDiary();

  const [step, setStep] = useState<Step>("select");
  const [selectedLesson, setSelectedLesson] = useState<string>(LESSON_TAGS[0]);
  const [customLesson, setCustomLesson] = useState("");
  const [useCustomLesson, setUseCustomLesson] = useState(false);
  const [periodStart, setPeriodStart] = useState(addDays(todayString(), -14));
  const [periodEnd, setPeriodEnd] = useState(todayString());
  const [protagonistName, setProtagonistName] = useState(DEFAULT_NAME);
  const [storybook, setStorybook] = useState<Storybook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const lesson = useCustomLesson ? customLesson.trim() : selectedLesson;

  const selectedEntries = Array.from(entriesByDate.values())
    .filter((entry) => entry.date >= periodStart && entry.date <= periodEnd)
    .sort((a, b) => a.date.localeCompare(b.date));

  const validate = (): string | null => {
    if (!periodStart || !periodEnd) return "기간을 선택해주세요.";
    if (periodStart > periodEnd) return "종료일은 시작일보다 빠를 수 없어요.";
    if (periodEnd > todayString()) return "종료일은 오늘보다 늦을 수 없어요.";
    if (selectedEntries.length === 0) return "선택하신 기간에 기록이 없어요. 다른 기간을 선택해주세요.";
    if (useCustomLesson && customLesson.trim().length === 0) return "전하고 싶은 마음을 입력해주세요.";
    if (protagonistName.trim().length === 0) return "동화 속 주인공 이름을 알려주세요.";
    return null;
  };

  const handleGenerate = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep("loading");
    timerRef.current = setTimeout(() => {
      setStorybook(generateDummyStorybook(lesson, periodStart, periodEnd, protagonistName.trim()));
      setStep("result");
    }, GENERATION_DELAY_MS);
  };

  const handleRestart = () => {
    setStorybook(null);
    setError(null);
    setStep("select");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:max-w-xl lg:max-w-3xl lg:py-10">
      <AppHeader title="AI 동화 만들기" />

      {step === "select" && (
        <div className="space-y-7 rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6">
          <div className="text-center">
            <h2 className="font-story text-xl text-brown">우리 아이의 추억으로 동화를 만들어요</h2>
            <p className="mt-1 text-sm text-brown/60">
              기억하고 싶은 하루와 전하고 싶은 마음을 골라주세요.
            </p>
          </div>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-brown">어떤 날의 추억을 담을까요?</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-brown/60" htmlFor="period-start">
                  시작일
                </label>
                <input
                  id="period-start"
                  type="date"
                  value={periodStart}
                  max={periodEnd}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="rounded-lg border border-mint bg-white p-2 text-sm text-brown outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-brown/60" htmlFor="period-end">
                  종료일
                </label>
                <input
                  id="period-end"
                  type="date"
                  value={periodEnd}
                  min={periodStart}
                  max={todayString()}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="rounded-lg border border-mint bg-white p-2 text-sm text-brown outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-brown/50">기본값은 최근 2주로 설정되어 있어요.</p>

            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-mint-light px-3 py-1 text-xs font-medium text-mint-deep">
                선택된 기록 {selectedEntries.length}개
              </span>
            </div>
            {selectedEntries.length > 0 && (
              <div className="mt-2 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {selectedEntries.map((entry) => (
                  <span
                    key={entry.date}
                    className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-hairline bg-yellow-light"
                  >
                    {entry.imageUrls[0] ? (
                      <img src={entry.imageUrls[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <NotebookPen size={18} className="text-brown/60" />
                    )}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-brown">아이에게 어떤 마음을 전하고 싶나요?</h3>
            <div className="flex flex-wrap gap-2">
              {LESSON_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setUseCustomLesson(false);
                    setSelectedLesson(tag);
                  }}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    !useCustomLesson && selectedLesson === tag
                      ? "bg-coral text-white"
                      : "bg-mint-light text-brown/70 hover:bg-mint",
                  ].join(" ")}
                >
                  {tag}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUseCustomLesson(true)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  useCustomLesson ? "bg-coral text-white" : "bg-mint-light text-brown/70 hover:bg-mint",
                ].join(" ")}
              >
                직접 입력
              </button>
            </div>
            {useCustomLesson && (
              <input
                type="text"
                value={customLesson}
                onChange={(e) => setCustomLesson(e.target.value)}
                placeholder="전하고 싶은 마음을 입력해주세요 (예: 책임감)"
                className="mt-3 w-full rounded-xl border border-mint bg-white p-3 text-sm text-brown outline-none focus:ring-2 focus:ring-coral"
              />
            )}
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-brown">동화 속 주인공을 알려주세요</h3>
            <input
              type="text"
              value={protagonistName}
              onChange={(e) => setProtagonistName(e.target.value)}
              placeholder="아이 이름 또는 애칭"
              className="w-full rounded-xl border border-mint bg-white p-3 text-sm text-brown outline-none focus:ring-2 focus:ring-coral"
            />
          </section>

          {error && (
            <p role="alert" className="text-sm font-medium text-coral-deep">
              {error}
            </p>
          )}

          <div>
            <button
              type="button"
              onClick={handleGenerate}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-coral py-3 font-story text-white shadow transition-transform hover:scale-[1.02]"
            >
              <Wand2 size={18} />
              AI 그림동화 만들기
            </button>
            <p className="mt-2 text-center text-xs text-brown/50">
              현재는 미리 준비된 예시 동화로 체험해요.
            </p>
          </div>
        </div>
      )}

      {step === "loading" && <LoadingBook />}

      {step === "result" && storybook && (
        <StorybookResult
          storybook={storybook}
          originEntries={selectedEntries}
          onRestart={handleRestart}
          onBackHome={() => navigate("/")}
        />
      )}
    </div>
  );
}

function LoadingBook() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/80 p-10 shadow-sm"
    >
      <img src={mascot.read} alt="" className="h-32 w-32" />
      <div className="h-2 w-40 overflow-hidden rounded-full bg-mint-light">
        <div className="h-full w-1/2 animate-[page-flip_1.2s_ease-in-out_infinite] rounded-full bg-coral" />
      </div>
      <p className="text-center font-story text-brown">추억이 동화가 되는 모습을 준비하고 있어요.</p>
      <p className="text-center text-xs text-brown/50">체험용 예시 동화를 불러오는 중이에요.</p>
    </div>
  );
}

interface StorybookResultProps {
  storybook: Storybook;
  originEntries: { date: string; text: string; imageUrls: string[] }[];
  onRestart: () => void;
  onBackHome: () => void;
}

function StorybookResult({ storybook, originEntries, onRestart, onBackHome }: StorybookResultProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-story text-xl text-brown sm:text-2xl">
          {storybook.protagonistName}의 그림동화가 펼쳐졌어요
        </h2>
        <p className="mt-1 font-story text-lg text-coral-deep">{storybook.title}</p>
        <p className="mt-1 text-sm text-brown/60">
          전하고 싶은 마음: {storybook.lesson} · 체험용 그림동화 · {storybook.pages.length}페이지
        </p>
      </div>

      <StorybookViewer
        key={storybook.id}
        storybook={storybook}
        footerActions={
          <>
            <button
              type="button"
              onClick={onRestart}
              className="flex items-center justify-center gap-1 rounded-full bg-yellow px-5 py-2 text-sm font-medium text-brown shadow"
            >
              <RotateCcw size={16} />
              다른 마음으로 다시 만들기
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="flex items-center justify-center gap-1 rounded-full bg-mint px-5 py-2 text-sm font-medium text-brown shadow"
            >
              <CalendarDays size={16} />
              성장 기록으로 돌아가기
            </button>
          </>
        }
      />

      {originEntries.length > 0 && (
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6">
          <p className="mb-3 text-sm font-semibold text-brown">이 이야기의 시작이 된 기록</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {originEntries.map((entry) => (
              <div
                key={entry.date}
                className="w-40 shrink-0 rounded-xl border border-hairline bg-yellow-light/50 p-2.5"
              >
                {entry.imageUrls[0] && (
                  <img
                    src={entry.imageUrls[0]}
                    alt=""
                    loading="lazy"
                    className="mb-1.5 h-20 w-full rounded-lg object-cover"
                  />
                )}
                <p className="line-clamp-3 text-xs text-brown/70">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-brown/50">
        미리 준비된 예시로 체험하는 AI 그림동화입니다.
      </p>
    </div>
  );
}
