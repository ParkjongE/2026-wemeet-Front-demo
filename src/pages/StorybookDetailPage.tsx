import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookOpen, CopyPlus, RotateCcw, Trash2 } from "lucide-react";
import { USE_MOCK, errorMessage, isApiError } from "../api";
import { useCurrentChild } from "../auth/authContext";
import AppHeader from "../components/AppHeader";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import { useToast } from "../components/common/toastContext";
import StatusBadge from "../components/Storybook/StatusBadge";
import StorybookViewer from "../components/StorybookViewer/StorybookViewer";
import { useDiaries } from "../hooks/useDiaries";
import { useDeleteStorybook, useRetryStorybook, useStorybook } from "../hooks/useStorybooks";
import { mascot } from "../assets/illustrations";
import type { Storybook } from "../types";
import { formatPeriod } from "../utils/date";
import type { StorybookDraft } from "./StorybookNewPage";

function InProgressView({ book }: { book: Storybook }) {
  const steps = [
    { key: "queued", label: "준비" },
    { key: "processing", label: "그리는 중" },
    { key: "completed", label: "완성" },
  ];
  const current = book.status === "queued" ? 0 : 1;
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-4 rounded-2xl bg-white/80 p-8 text-center shadow-sm"
    >
      <img src={mascot.read} alt="" className="animate-mascot-bob h-32 w-32" />
      <p className="font-story text-xl text-brown">동화를 만들고 있어요</p>
      <p className="max-w-xs text-sm leading-relaxed text-brown/60">
        몇 분 정도 걸려요. 이 화면을 나가도 서재에서 확인할 수 있어요.
      </p>
      <ol className="mt-2 flex items-center gap-2" aria-label="진행 단계">
        {steps.map((step, i) => (
          <li key={step.key} className="flex items-center gap-2">
            <span
              aria-current={i === current ? "step" : undefined}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium",
                i < current ? "bg-mint text-brown" : i === current ? "bg-coral text-white" : "bg-hairline/60 text-brown/40",
              ].join(" ")}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && <span className="h-0.5 w-4 bg-hairline" aria-hidden />}
          </li>
        ))}
      </ol>
    </div>
  );
}

function OriginEntries({ book }: { book: Storybook }) {
  const diariesQuery = useDiaries(book.childId, book.periodStart, book.periodEnd);
  const entries = diariesQuery.data ?? [];
  if (entries.length === 0) return null;
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6">
      <p className="mb-3 text-sm font-semibold text-brown">이 이야기의 시작이 된 기록</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {entries.map((entry) => (
          <Link
            key={entry.date}
            to={`/diary/${entry.date}`}
            className="w-40 shrink-0 rounded-xl border border-hairline bg-yellow-light/50 p-2.5 hover:bg-yellow-light"
          >
            {entry.photos[0] && (
              <img src={entry.photos[0].url} alt="" loading="lazy" className="mb-1.5 h-20 w-full rounded-lg object-cover" />
            )}
            <p className="line-clamp-3 text-xs text-brown/70">{entry.text}</p>
          </Link>
        ))}
      </div>
    </div>
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
    if (book?.status === "completed") toast.show("동화가 완성됐어요!");
    if (book?.status === "failed") toast.show("동화를 만들지 못했어요.", "error");
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
    retryStorybook.mutate(id, {
      onError: (error) => toast.show(errorMessage(error), "error"),
    });
  };

  let content;
  if (storybookQuery.isPending) {
    content = (
      <div className="space-y-4" role="status" aria-label="동화를 불러오는 중">
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="h-72" />
      </div>
    );
  } else if (storybookQuery.isError) {
    content =
      isApiError(storybookQuery.error) && storybookQuery.error.status === 404 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/80 p-8 text-center shadow-sm">
          <img src={mascot.hug} alt="" className="h-24 w-24" />
          <p className="font-story text-lg text-brown">동화를 찾을 수 없어요</p>
          <p className="text-sm text-brown/60">삭제되었거나 주소가 잘못되었어요.</p>
          <Link
            to="/storybooks"
            className="mt-2 flex min-h-11 items-center gap-1.5 rounded-full bg-mint px-5 text-sm font-medium text-brown"
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
    content = (
      <div className="space-y-6">
        <div className="text-center">
          <StatusBadge status={b.status} />
          <h2 className="mt-2 font-story text-xl text-brown sm:text-2xl">
            {b.title ?? `${child.name}의 동화`}
          </h2>
          <p className="mt-1 text-xs text-brown/50">
            {formatPeriod(b.periodStart, b.periodEnd)}의 기록
            {b.lessonTag && ` · ${b.lessonTag}`}
          </p>
          <blockquote className="mx-auto mt-3 max-w-md rounded-2xl bg-yellow-light/70 px-4 py-3 text-sm leading-relaxed text-brown">
            <span className="mb-0.5 block text-xs text-brown/50">전하고 싶은 메시지</span>“{b.parentMessage}”
          </blockquote>
        </div>

        {(b.status === "queued" || b.status === "processing") && <InProgressView book={b} />}

        {b.status === "failed" && (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/80 p-8 text-center shadow-sm">
            <img src={mascot.hug} alt="" className="h-24 w-24" />
            <p className="font-story text-lg text-brown">동화를 완성하지 못했어요</p>
            <p className="text-sm text-brown/60">{b.errorMessage ?? "잠시 후 다시 만들어 주세요."}</p>
            <Button onClick={handleRetry} loading={retryStorybook.isPending} className="mt-2">
              <RotateCcw size={18} aria-hidden />
              다시 만들기
            </Button>
          </div>
        )}

        {b.status === "completed" && b.pages.length > 0 && (
          <>
            <StorybookViewer
              key={b.id}
              storybook={b}
              footerActions={
                <Button variant="secondary" onClick={() => navigate("/storybooks")} className="text-sm">
                  <BookOpen size={16} aria-hidden />
                  서재로 돌아가기
                </Button>
              }
            />
            <OriginEntries book={b} />
            {USE_MOCK && (
              <p className="text-center text-xs text-brown/50">미리 준비된 예시로 체험하는 AI 그림동화입니다.</p>
            )}
          </>
        )}

        <div className="flex flex-col items-center gap-2 border-t border-hairline pt-6 sm:flex-row sm:justify-center">
          <Button variant="ghost" onClick={goNewWithSameSettings} className="text-sm">
            <CopyPlus size={16} aria-hidden />
            같은 설정으로 새로 만들기
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)} className="text-sm">
            <Trash2 size={16} aria-hidden />
            동화 삭제
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:max-w-xl lg:max-w-3xl lg:py-10">
      <AppHeader title="동화" backTo="/storybooks" />
      {content}
      <ConfirmDialog
        open={confirmDelete}
        title="이 동화를 삭제할까요?"
        description="삭제한 동화는 되돌릴 수 없어요. 기록은 그대로 남아 있어요."
        confirmLabel="삭제하기"
        destructive
        pending={deleteStorybook.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
