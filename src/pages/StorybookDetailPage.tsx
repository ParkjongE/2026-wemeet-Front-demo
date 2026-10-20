import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookOpen, Check, CopyPlus, PenLine, RotateCcw, Trash2 } from "lucide-react";
import { USE_MOCK, errorMessage, isApiError } from "../api";
import { useCurrentChild } from "../auth/authContext";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import { useToast } from "../components/common/toastContext";
import StoryBook from "../components/StorybookViewer/StoryBook";
import { useDiaries } from "../hooks/useDiaries";
import { useDeleteStorybook, useRetryStorybook, useStorybook } from "../hooks/useStorybooks";
import { brandArt } from "../assets/art";
import type { Storybook } from "../types";
import { formatPeriod, todayString } from "../utils/date";
import { possessive } from "../utils/korean";
import type { StorybookDraft } from "./StorybookNewPage";

const STEPS = [
  { key: "queued", label: "기록 읽기", detail: "고른 기간의 사진과 글을 살펴봐요" },
  { key: "processing", label: "이야기 짓고 그리기", detail: "메시지를 중심으로 장면을 엮고 삽화를 그려요" },
  { key: "completed", label: "책으로 묶기", detail: "표지와 마지막 장까지 정성껏 묶어요" },
];

function InProgressView({ book }: { book: Storybook }) {
  const current = book.status === "queued" ? 0 : 1;
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto grid max-w-4xl items-center gap-8 overflow-hidden rounded-[28px] bg-white p-6 shadow-card ring-1 ring-hairline/60 sm:p-10 md:grid-cols-[1fr_1.1fr]"
    >
      <div className="relative">
        <div className="absolute inset-6 rounded-full bg-sand-light" aria-hidden />
        <img src={brandArt.makingBook} alt="" className="animate-bob relative mx-auto w-full max-w-xs mix-blend-multiply soft-edges" />
      </div>
      <div>
        <p className="text-sm font-semibold text-sand-ink">그림동화를 만들고 있어요</p>
        <h2 className="mt-1 font-book text-2xl font-bold leading-snug text-brown">
          조금만 기다려 주세요.
          <br />곧 한 권의 책이 돼요.
        </h2>
        <ol className="mt-6 space-y-4" aria-label="진행 단계">
          {STEPS.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={step.key} className="flex gap-3" aria-current={active ? "step" : undefined}>
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    done ? "bg-forest text-white" : active ? "bg-sand text-brown" : "bg-hairline/70 text-brown/40",
                  ].join(" ")}
                >
                  {done ? <Check size={16} /> : i + 1}
                </span>
                <div>
                  <p className={`text-[15px] font-semibold ${active || done ? "text-brown" : "text-brown/40"}`}>
                    {step.label}
                    {active && <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-sand align-middle" />}
                  </p>
                  <p className="text-sm text-brown/50">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 rounded-2xl bg-canvas px-4 py-3 text-sm leading-relaxed text-brown/60">
          보통 몇 분 정도 걸려요. 이 화면을 닫아도 계속 만들어지고, 완성되면 서재에서 바로 볼 수 있어요.
        </p>
      </div>
    </div>
  );
}

function OriginEntries({ book }: { book: Storybook }) {
  const diariesQuery = useDiaries(book.childId, book.periodStart, book.periodEnd);
  const entries = diariesQuery.data ?? [];
  if (entries.length === 0) return null;
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-hairline/60 sm:p-6">
      <h2 className="text-base font-bold text-brown">이 이야기의 시작이 된 기록</h2>
      <p className="mt-0.5 text-sm text-brown/50">
        {formatPeriod(book.periodStart, book.periodEnd)} · 기록 {entries.length}개
      </p>
      <div className="scrollbar-none -mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-1">
        {entries.map((entry) => (
          <Link
            key={entry.date}
            to={`/diary/${entry.date}`}
            className="w-44 shrink-0 rounded-2xl bg-canvas p-2.5 ring-1 ring-hairline/60 transition-colors hover:bg-sand-light"
          >
            {entry.photos[0] ? (
              <img src={entry.photos[0].url} alt="" loading="lazy" className="mb-2 aspect-[4/3] w-full rounded-xl object-cover" />
            ) : (
              <span className="mb-2 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-sand-light">
                <PenLine size={20} className="text-brown/40" aria-hidden />
              </span>
            )}
            <p className="text-[11px] font-semibold text-brown/45">{formatPeriod(entry.date, entry.date)}</p>
            <p className="mt-0.5 line-clamp-3 font-handwriting text-[15px] leading-snug text-brown/80">{entry.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function StorybookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const child = useCurrentChild();
  const storybookQuery = useStorybook(id);
  const retryStorybook = useRetryStorybook();
  const deleteStorybook = useDeleteStorybook(child.id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const book = storybookQuery.data;

  // 보고 있는 동안 완성되면 알려준다.
  const previousStatus = useRef(book?.status);
  useEffect(() => {
    const prev = previousStatus.current;
    previousStatus.current = book?.status;
    if (!prev || prev === book?.status) return;
    if (book?.status === "completed") toast.show("그림동화가 완성됐어요! 함께 읽어 보세요.");
    if (book?.status === "failed") toast.show("동화를 만들지 못했어요. 다시 만들 수 있어요.", "error");
  }, [book?.status, toast]);

  const draft: StorybookDraft | undefined = book && {
    parentMessage: book.parentMessage,
    lessonTag: book.lessonTag,
    periodStart: book.periodStart,
    periodEnd: book.periodEnd,
  };
  const goNewWithSameSettings = () => navigate("/storybooks/new", { state: { draft } });

  const handleDelete = () => {
    if (!id) return;
    deleteStorybook.mutate(id, {
      onSuccess: () => {
        toast.show("동화를 삭제했어요.");
        navigate("/storybooks", { replace: true });
      },
      onError: (error) => {
        setConfirmDelete(false);
        toast.show(errorMessage(error), "error");
      },
    });
  };

  const handleRetry = () => {
    if (!id) return;
    retryStorybook.mutate(id, { onError: (error) => toast.show(errorMessage(error), "error") });
  };

  let content;
  if (storybookQuery.isPending) {
    content = (
      <div className="space-y-4" role="status" aria-label="동화를 불러오는 중">
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="mx-auto aspect-[1.44] w-full max-w-5xl" />
      </div>
    );
  } else if (storybookQuery.isError) {
    content =
      isApiError(storybookQuery.error) && storybookQuery.error.status === 404 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-[28px] bg-white p-10 text-center shadow-card">
          <img src={brandArt.emptyLibrary} alt="" className="h-40 w-auto mix-blend-multiply soft-edges" />
          <p className="text-lg font-bold text-brown">동화를 찾을 수 없어요</p>
          <p className="text-sm text-brown/60">삭제되었거나 주소가 잘못되었어요.</p>
          <Link
            to="/storybooks"
            className="mt-2 flex min-h-12 items-center gap-1.5 rounded-2xl bg-sand px-5 text-sm font-semibold text-brown"
          >
            <BookOpen size={16} aria-hidden />
            서재로 가기
          </Link>
        </div>
      ) : (
        <ErrorBox
          message={`동화를 불러오지 못했어요. ${errorMessage(storybookQuery.error)}`}
          onRetry={() => void storybookQuery.refetch()}
        />
      );
  } else {
    const b = storybookQuery.data;
    const period = formatPeriod(b.periodStart, b.periodEnd);
    content = (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-sand-ink">
            {period}의 기록으로 만든 {b.lessonTag ? `${b.lessonTag} 이야기` : "그림동화"}
          </p>
          <h1 className="mt-1.5 font-book text-[26px] font-bold leading-snug text-brown sm:text-4xl">
            {b.title ?? `${possessive(child.name)} 그림동화`}
          </h1>
        </div>

        {(b.status === "queued" || b.status === "processing") && <InProgressView book={b} />}

        {b.status === "failed" && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-[28px] bg-white p-8 text-center shadow-card ring-1 ring-hairline/60">
            <img src={brandArt.emptyDiary} alt="" className="h-40 w-auto mix-blend-multiply soft-edges" />
            <p className="text-lg font-bold text-brown">이번에는 책을 완성하지 못했어요</p>
            <p className="text-sm leading-relaxed text-brown/60">
              {b.errorMessage ?? "잠시 후 다시 만들어 주세요."}
              <br />
              적어 주신 메시지와 기간은 그대로 남아 있어요.
            </p>
            <Button onClick={handleRetry} loading={retryStorybook.isPending} className="mt-2">
              <RotateCcw size={18} aria-hidden />
              같은 내용으로 다시 만들기
            </Button>
          </div>
        )}

        {b.status === "completed" && b.pages.length > 0 && (
          <>
            <StoryBook
              key={b.id}
              book={{
                title: b.title ?? `${possessive(child.name)} 그림동화`,
                coverImageUrl: b.coverImageUrl,
                pages: b.pages,
                questions: b.questions,
                parentMessage: b.parentMessage,
                protagonistName: child.name,
                periodLabel: period,
                lessonTag: b.lessonTag,
              }}
            />
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
              <section className="rounded-[28px] bg-sand-light p-6">
                <p className="text-xs font-semibold tracking-wider text-sand-ink">이 동화에 담은 마음</p>
                <p className="mt-3 font-handwriting text-[22px] leading-snug text-brown">“{b.parentMessage}”</p>
                {b.completedAt && (
                  <p className="mt-4 text-xs text-brown/45">
                    {new Date(b.completedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })} 완성
                  </p>
                )}
              </section>
              <OriginEntries book={b} />
            </div>
            {USE_MOCK && (
              <p className="text-center text-xs text-brown/45">체험 버전에서는 미리 그려 둔 삽화로 동화를 보여드려요.</p>
            )}
          </>
        )}

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 border-t border-hairline pt-6 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={goNewWithSameSettings}>
            <CopyPlus size={16} aria-hidden />
            같은 마음으로 새 동화 만들기
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/diary/${todayString()}`)}>
            <PenLine size={16} aria-hidden />
            오늘 기록 남기기
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(true)} className="text-error hover:bg-error-light hover:text-error">
            <Trash2 size={16} aria-hidden />
            동화 삭제
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
      <Link
        to="/storybooks"
        className="-ml-2 mb-4 inline-flex min-h-10 items-center gap-1 rounded-xl px-2 text-sm font-medium text-brown/55 hover:bg-sand-light hover:text-brown"
      >
        <BookOpen size={16} aria-hidden />
        서재로
      </Link>
      {content}
      <ConfirmDialog
        open={confirmDelete}
        title="이 동화를 삭제할까요?"
        description="삭제한 동화는 되돌릴 수 없어요. 동화를 만든 기록은 그대로 남아 있어요."
        confirmLabel="삭제하기"
        destructive
        pending={deleteStorybook.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
