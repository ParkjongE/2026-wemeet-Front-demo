import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, NotebookPen, PenLine, Sparkles, Wand2 } from "lucide-react";
import { USE_MOCK, errorMessage } from "../api";
import { useCurrentChild } from "../auth/authContext";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/common/Button";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import {
  LESSON_TAGS,
  PARENT_MESSAGE_EXAMPLES,
  PARENT_MESSAGE_MAX,
  PARENT_MESSAGE_MIN,
  STORY_PERIOD_DEFAULT_DAYS,
  STORY_PERIOD_MAX_DAYS,
  STORY_PERIOD_PRESETS,
} from "../constants/storybook";
import { useDiaries } from "../hooks/useDiaries";
import { useCreateStorybook } from "../hooks/useStorybooks";
import { addDays, daysBetweenInclusive, formatPeriod, todayString } from "../utils/date";
import { characterArt } from "../assets/art";
import { nameForms, possessive } from "../utils/korean";

// "같은 설정으로 새로 만들기"에서 넘겨주는 초기값
export interface StorybookDraft {
  parentMessage?: string;
  lessonTag?: string | null;
  periodStart?: string;
  periodEnd?: string;
}

const chipClass = (active: boolean) =>
  [
    "min-h-11 rounded-xl px-4 text-sm font-semibold transition-colors",
    active ? "bg-brown text-white" : "bg-white text-brown/70 ring-1 ring-hairline hover:bg-sand-light",
  ].join(" ");

const LESSON_HINT: Record<string, string> = {
  나눔: "함께 나누는 기쁨",
  용기: "무서워도 한 걸음",
  정직: "솔직한 마음",
  배려: "친구의 마음 헤아리기",
  끈기: "포기하지 않는 힘",
};

function Step({ n, title, optional, children }: { n: number; title: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-hairline/60 sm:p-7">
      <h2 className="flex items-center gap-2.5 text-base font-bold text-brown">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sand-light text-sm text-sand-ink">{n}</span>
        {title}
        {optional && <span className="text-sm font-medium text-brown/40">선택</span>}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function StorybookNewPage() {
  const navigate = useNavigate();
  const child = useCurrentChild();
  const draft = (useLocation().state as { draft?: StorybookDraft } | null)?.draft;
  const today = todayString();

  const [parentMessage, setParentMessage] = useState(draft?.parentMessage ?? "");
  const [lessonTag, setLessonTag] = useState<string | null>(draft?.lessonTag ?? null);
  const [periodEnd, setPeriodEnd] = useState(draft?.periodEnd ?? today);
  const [periodStart, setPeriodStart] = useState(
    draft?.periodStart ?? addDays(today, -(STORY_PERIOD_DEFAULT_DAYS - 1)),
  );
  const [submitted, setSubmitted] = useState(false);
  const createStorybook = useCreateStorybook(child.id);

  const messageLength = parentMessage.trim().length;
  const messageError =
    messageLength < PARENT_MESSAGE_MIN
      ? `${PARENT_MESSAGE_MIN}자 이상 적어 주세요. (지금 ${messageLength}자)`
      : messageLength > PARENT_MESSAGE_MAX
        ? `${PARENT_MESSAGE_MAX}자까지 쓸 수 있어요.`
        : null;

  const periodDays = periodStart && periodEnd ? daysBetweenInclusive(periodStart, periodEnd) : 0;
  const periodError = !periodStart || !periodEnd
    ? "기간을 골라 주세요."
    : periodStart > periodEnd
      ? "시작일은 종료일보다 늦을 수 없어요."
      : periodEnd > today
        ? "종료일은 오늘보다 늦을 수 없어요."
        : periodDays > STORY_PERIOD_MAX_DAYS
          ? `기간은 최대 ${STORY_PERIOD_MAX_DAYS}일까지 고를 수 있어요.`
          : null;

  const diariesQuery = useDiaries(
    periodError ? undefined : child.id,
    periodStart,
    periodEnd,
  );
  const entries = periodError ? [] : (diariesQuery.data ?? []);
  const hasEntries = entries.length > 0;
  const canSubmit = !periodError && diariesQuery.isSuccess && hasEntries && !createStorybook.isPending;

  const selectPreset = (days: number) => {
    setPeriodEnd(today);
    setPeriodStart(addDays(today, -(days - 1)));
  };
  const activePreset =
    periodEnd === today ? STORY_PERIOD_PRESETS.find((d) => addDays(today, -(d - 1)) === periodStart) : undefined;

  const handleSubmit = () => {
    setSubmitted(true);
    if (messageError || !canSubmit) return;
    createStorybook.mutate(
      { periodStart, periodEnd, parentMessage: parentMessage.trim(), lessonTag },
      { onSuccess: (summary) => navigate(`/storybooks/${summary.id}`, { replace: true }) },
    );
  };

  const art = characterArt[child.gender ?? "girl"];
  const n = nameForms(child.name);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
      <PageHeader
        eyebrow="그림동화 만들기"
        title={`${n.에게} 들려줄 이야기를 지어요`}
        description="부모님이 전하고 싶은 마음을 중심에 두고, 남겨둔 기록을 엮어 한 권의 그림책을 만들어요."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-5">
          <Step n={1} title="아이에게 전하고 싶은 마음">
            <label htmlFor="parent-message" className="sr-only">
              전하고 싶은 메시지
            </label>
            <textarea
              id="parent-message"
              value={parentMessage}
              onChange={(e) => setParentMessage(e.target.value)}
              rows={4}
              maxLength={PARENT_MESSAGE_MAX + 50}
              placeholder={`예) ${PARENT_MESSAGE_EXAMPLES[0]}`}
              aria-invalid={submitted && !!messageError}
              aria-describedby="parent-message-help"
              className={[
                "paper-lined w-full resize-none rounded-2xl border py-3 pl-12 pr-5 font-handwriting text-xl leading-[36px] text-brown outline-none transition-colors placeholder:font-body placeholder:text-[15px] placeholder:text-brown/35 focus:ring-4",
                submitted && messageError
                  ? "border-error focus:ring-error/15"
                  : "border-hairline focus:border-ocean focus:ring-ocean/15",
              ].join(" ")}
            />
            <div id="parent-message-help" className="mt-1.5 flex justify-between gap-2 text-xs">
              <span className={submitted && messageError ? "text-error" : "text-brown/50"}>
                {submitted && messageError ? messageError : "이 마음이 동화의 중심 줄거리가 되고, 마지막 장에 편지로 실려요."}
              </span>
              <span className={messageLength > PARENT_MESSAGE_MAX ? "text-error" : "text-brown/40"}>
                {messageLength}/{PARENT_MESSAGE_MAX}
              </span>
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold text-brown/50">이런 마음은 어때요?</p>
            <div className="flex flex-wrap gap-2">
              {PARENT_MESSAGE_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setParentMessage(example)}
                  className="min-h-10 rounded-xl bg-canvas px-3 py-2 text-left text-sm text-brown/70 ring-1 ring-hairline/70 transition-colors hover:bg-sand-light hover:text-brown"
                >
                  {example}
                </button>
              ))}
            </div>
          </Step>

          <Step n={2} title="이야기의 주제" optional>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {LESSON_TAGS.map((tag) => {
                const active = lessonTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLessonTag(active ? null : tag)}
                    className={[
                      "flex min-h-16 flex-col items-center justify-center rounded-2xl px-2 text-center transition-colors",
                      active ? "bg-brown text-white" : "bg-canvas text-brown ring-1 ring-hairline/70 hover:bg-sand-light",
                    ].join(" ")}
                  >
                    <span className="text-[15px] font-bold">{tag}</span>
                    <span className={`text-[11px] ${active ? "text-white/70" : "text-brown/50"}`}>{LESSON_HINT[tag]}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-brown/45">고르지 않으면 적어 주신 마음에 가장 어울리는 주제로 지어요.</p>
          </Step>

          <Step n={3} title="담을 기록의 기간">
            <div className="flex flex-wrap gap-2">
              {STORY_PERIOD_PRESETS.map((days) => (
                <button
                  key={days}
                  type="button"
                  aria-pressed={activePreset === days}
                  onClick={() => selectPreset(days)}
                  className={chipClass(activePreset === days)}
                >
                  최근 {days}일
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-md">
              <label className="text-xs font-semibold text-brown/55">
                시작일
                <input
                  type="date"
                  value={periodStart}
                  max={periodEnd || today}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="mt-1 min-h-12 w-full rounded-xl border border-hairline bg-white px-3 text-sm font-normal text-brown outline-none focus:border-ocean focus:ring-4 focus:ring-ocean/15"
                />
              </label>
              <label className="text-xs font-semibold text-brown/55">
                종료일
                <input
                  type="date"
                  value={periodEnd}
                  min={periodStart}
                  max={today}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="mt-1 min-h-12 w-full rounded-xl border border-hairline bg-white px-3 text-sm font-normal text-brown outline-none focus:border-ocean focus:ring-4 focus:ring-ocean/15"
                />
              </label>
            </div>
            <p className={`mt-2 text-xs ${periodError ? "text-error" : "text-brown/50"}`} role={periodError ? "alert" : undefined}>
              {periodError ?? `${formatPeriod(periodStart, periodEnd)} · ${periodDays}일 (최대 ${STORY_PERIOD_MAX_DAYS}일)`}
            </p>

            {!periodError && (
              <div className="mt-5 border-t border-hairline/70 pt-4" aria-live="polite">
                {diariesQuery.isPending ? (
                  <div className="flex gap-2" role="status" aria-label="기록을 불러오는 중">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Skeleton key={i} className="h-16 w-16 rounded-xl" />
                    ))}
                  </div>
                ) : diariesQuery.isError ? (
                  <ErrorBox
                    message={`기록을 불러오지 못했어요. ${errorMessage(diariesQuery.error)}`}
                    onRetry={() => void diariesQuery.refetch()}
                  />
                ) : hasEntries ? (
                  <>
                    <p className="text-sm font-semibold text-brown">
                      이 기간의 기록 <span className="text-ocean-deep">{entries.length}개</span>를 이야기 재료로 써요
                    </p>
                    <div className="scrollbar-none -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
                      {entries.map((entry) => (
                        <span
                          key={entry.date}
                          title={entry.text}
                          className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sand-light ring-1 ring-hairline/60"
                        >
                          {entry.photos[0] ? (
                            <img src={entry.photos[0].url} alt="" loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <NotebookPen size={18} className="text-brown/50" aria-hidden />
                          )}
                          <span className="absolute bottom-0 inset-x-0 bg-black/35 text-center text-[10px] font-semibold text-white">
                            {Number(entry.date.slice(5, 7))}.{Number(entry.date.slice(8))}
                          </span>
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 rounded-2xl bg-sand-light/70 p-5 text-center">
                    <p className="text-sm font-semibold text-brown">이 기간에는 아직 기록이 없어요</p>
                    <p className="text-xs text-brown/60">기록이 하나 이상 있어야 동화를 만들 수 있어요.</p>
                    <Link
                      to={`/diary/${today}`}
                      className="mt-1 flex min-h-11 items-center gap-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-brown shadow-sm hover:bg-canvas"
                    >
                      <PenLine size={16} aria-hidden />
                      오늘 기록 남기러 가기
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Step>
        </div>

        {/* 미리보기 + 만들기 */}
        <aside className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-hairline/60">
            <div className="relative flex justify-center bg-sand-light px-6 pb-6 pt-8">
              <div className="relative aspect-[2/3] w-44 overflow-hidden rounded-l-[4px] rounded-r-[10px] bg-paper shadow-lift">
                <img src={art.full} alt="" className="absolute inset-x-0 bottom-0 mx-auto h-[78%] w-auto mix-blend-multiply soft-edges" />
                <span className="absolute inset-x-3 top-4 text-center font-book text-[13px] font-bold leading-snug text-brown">
                  {n.와} {lessonTag ? LESSON_HINT[lessonTag] : "특별한 하루"}
                </span>
                <span className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/20 to-transparent" />
              </div>
            </div>
            <div className="p-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-brown/50">주인공</dt>
                  <dd className="font-semibold text-brown">
                    {child.name} <Link to="/settings" className="ml-1 text-xs font-medium text-ocean-deep hover:underline">바꾸기</Link>
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-brown/50">주제</dt>
                  <dd className="font-semibold text-brown">{lessonTag ?? "마음에 맞춰 자동"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-brown/50">담을 기록</dt>
                  <dd className="font-semibold text-brown">{periodError ? "-" : `${entries.length}개`}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-brown/50">구성</dt>
                  <dd className="font-semibold text-brown">표지 + 6장면 + 마음 편지</dd>
                </div>
              </dl>
              {createStorybook.isError && (
                <p role="alert" className="mt-4 rounded-xl bg-error-light px-3 py-2 text-sm text-brown">
                  {errorMessage(createStorybook.error)}
                </p>
              )}
              <Button size="lg" onClick={handleSubmit} disabled={!canSubmit} loading={createStorybook.isPending} className="mt-5 w-full">
                <Wand2 size={18} aria-hidden />
                {possessive(child.name)} 그림동화 만들기
              </Button>
              <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-brown/50">
                <Sparkles size={14} className="mt-0.5 shrink-0 text-sand-ink" aria-hidden />
                {USE_MOCK ? "체험 버전에서는 미리 그려 둔 삽화로 약 15초 뒤 완성돼요." : "몇 분 안에 완성돼요. 그동안 다른 화면을 봐도 괜찮아요."}
              </p>
              <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-brown/50">
                <Lock size={14} className="mt-0.5 shrink-0" aria-hidden />
                아이 사진은 그림 생성에 쓰이지 않고, 기록의 내용만 이야기 재료로 써요.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
