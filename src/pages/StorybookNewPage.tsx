import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NotebookPen, PenLine, Wand2 } from "lucide-react";
import { USE_MOCK, errorMessage } from "../api";
import { useCurrentChild } from "../auth/authContext";
import AppHeader from "../components/AppHeader";
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

// "같은 설정으로 새로 만들기"에서 넘겨주는 초기값
export interface StorybookDraft {
  parentMessage?: string;
  lessonTag?: string | null;
  periodStart?: string;
  periodEnd?: string;
}

const chipClass = (active: boolean) =>
  [
    "min-h-11 rounded-full px-4 text-sm font-medium transition-colors",
    active ? "bg-coral text-white" : "bg-mint-light text-brown/70 hover:bg-mint",
  ].join(" ");

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

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:max-w-xl lg:max-w-3xl lg:py-10">
      <AppHeader title="동화 만들기" backTo="/storybooks" />

      <div className="space-y-8 rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6">
        <div className="text-center">
          <h2 className="font-story text-xl text-brown">{child.name}에게 전하고 싶은 이야기가 있나요?</h2>
          <p className="mt-1 text-sm text-brown/60">
            부모님의 마음을 중심으로, 남겨둔 기록을 엮어 동화를 만들어요.
          </p>
        </div>

        {/* 1. 전하고 싶은 메시지 (필수) */}
        <section>
          <label htmlFor="parent-message" className="mb-1 block font-story text-lg text-brown">
            전하고 싶은 메시지 <span className="text-sm text-coral-deep">(필수)</span>
          </label>
          <p className="mb-2 text-xs text-brown/50">동화가 아이에게 건넬 한마디예요. 편하게 적어 주세요.</p>
          <textarea
            id="parent-message"
            value={parentMessage}
            onChange={(e) => setParentMessage(e.target.value)}
            rows={4}
            maxLength={PARENT_MESSAGE_MAX + 50}
            placeholder={`예: ${PARENT_MESSAGE_EXAMPLES[0]}`}
            aria-invalid={submitted && !!messageError}
            aria-describedby="parent-message-help"
            className={[
              "w-full resize-none rounded-2xl border-2 bg-yellow-light/40 p-4 text-base leading-relaxed text-brown outline-none transition-colors placeholder:text-brown/35 focus:ring-2",
              submitted && messageError
                ? "border-coral-deep focus:ring-coral/40"
                : "border-yellow focus:border-mint-deep focus:ring-mint/50",
            ].join(" ")}
          />
          <div id="parent-message-help" className="mt-1 flex justify-between gap-2 text-xs">
            <span className={submitted && messageError ? "text-coral-deep" : "text-brown/50"}>
              {submitted && messageError ? messageError : `${PARENT_MESSAGE_MIN}~${PARENT_MESSAGE_MAX}자`}
            </span>
            <span className={messageLength > PARENT_MESSAGE_MAX ? "text-coral-deep" : "text-brown/40"}>
              {messageLength}/{PARENT_MESSAGE_MAX}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {PARENT_MESSAGE_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setParentMessage(example)}
                className="min-h-11 rounded-2xl border border-hairline bg-white px-3 py-2 text-left text-xs text-brown/70 hover:border-mint hover:bg-mint-light"
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        {/* 2. 교훈 태그 (선택) */}
        <section>
          <h3 className="mb-1 text-sm font-semibold text-brown">
            교훈 태그 <span className="font-normal text-brown/50">(선택)</span>
          </h3>
          <p className="mb-2 text-xs text-brown/50">메시지와 어울리는 주제가 있으면 골라 주세요.</p>
          <div className="flex flex-wrap gap-2">
            {LESSON_TAGS.map((tag) => {
              const active = lessonTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLessonTag(active ? null : tag)}
                  className={chipClass(active)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. 기간 */}
        <section>
          <h3 className="mb-2 text-sm font-semibold text-brown">어떤 날의 기록을 담을까요?</h3>
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
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-brown/60">
              시작일
              <input
                type="date"
                value={periodStart}
                max={periodEnd || today}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="min-h-11 rounded-lg border border-mint bg-white px-2 text-sm text-brown outline-none focus:ring-2 focus:ring-coral"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-brown/60">
              종료일
              <input
                type="date"
                value={periodEnd}
                min={periodStart}
                max={today}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="min-h-11 rounded-lg border border-mint bg-white px-2 text-sm text-brown outline-none focus:ring-2 focus:ring-coral"
              />
            </label>
          </div>
          <p className={`mt-2 text-xs ${periodError ? "text-coral-deep" : "text-brown/50"}`} role={periodError ? "alert" : undefined}>
            {periodError ?? `${formatPeriod(periodStart, periodEnd)} · ${periodDays}일 (최대 ${STORY_PERIOD_MAX_DAYS}일)`}
          </p>
        </section>

        {/* 4. 이 기간의 기록 미리보기 */}
        {!periodError && (
          <section aria-live="polite">
            <h3 className="mb-2 text-sm font-semibold text-brown">이 기간의 기록</h3>
            {diariesQuery.isPending ? (
              <div className="flex gap-2" role="status" aria-label="기록을 불러오는 중">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-14 w-14" />
                ))}
              </div>
            ) : diariesQuery.isError ? (
              <ErrorBox
                message={`기록을 불러오지 못했어요. ${errorMessage(diariesQuery.error)}`}
                onRetry={() => void diariesQuery.refetch()}
              />
            ) : hasEntries ? (
              <>
                <span className="rounded-full bg-mint-light px-3 py-1 text-xs font-medium text-mint-deep">
                  기록 {entries.length}개를 담을게요
                </span>
                <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
                  {entries.map((entry) => (
                    <span
                      key={entry.date}
                      title={entry.text}
                      className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-hairline bg-yellow-light"
                    >
                      {entry.photos[0] ? (
                        <img src={entry.photos[0].url} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <NotebookPen size={18} className="text-brown/60" aria-hidden />
                      )}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-yellow-light/60 p-5 text-center">
                <p className="text-sm text-brown">이 기간에는 아직 기록이 없어요.</p>
                <p className="text-xs text-brown/60">기록이 1개 이상 있어야 동화를 만들 수 있어요.</p>
                <Link
                  to={`/diary/${today}`}
                  className="mt-1 flex min-h-11 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-medium text-brown shadow-sm hover:bg-mint-light"
                >
                  <PenLine size={16} aria-hidden />
                  기록 남기러 가기
                </Link>
              </div>
            )}
          </section>
        )}

        <div>
          {createStorybook.isError && (
            <p role="alert" className="mb-3 rounded-xl bg-coral-light/60 px-4 py-3 text-sm text-brown">
              {errorMessage(createStorybook.error)}
            </p>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={createStorybook.isPending}
            className="w-full"
          >
            <Wand2 size={18} aria-hidden />
            그림동화 만들기
          </Button>
          <p className="mt-2 text-center text-xs text-brown/50">
            {USE_MOCK
              ? "미리 준비된 예시로 체험하는 AI 그림동화입니다."
              : "요청하면 몇 분 안에 완성돼요. 서재에서 확인할 수 있어요."}
          </p>
        </div>
      </div>
    </div>
  );
}
