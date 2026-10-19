import { Link } from "react-router-dom";
import { Plus, Wand2 } from "lucide-react";
import { errorMessage } from "../api";
import { useCurrentChild } from "../auth/authContext";
import AppHeader from "../components/AppHeader";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import StatusBadge from "../components/Storybook/StatusBadge";
import { useStorybooks } from "../hooks/useStorybooks";
import { mascot } from "../mock/illustrations";
import type { StorybookSummary } from "../types";
import { formatPeriod } from "../utils/date";

function StorybookCard({ book }: { book: StorybookSummary }) {
  const inProgress = book.status === "queued" || book.status === "processing";
  return (
    <Link
      to={`/storybooks/${book.id}`}
      className="flex gap-3 rounded-2xl bg-white/80 p-3 shadow-sm transition-transform hover:scale-[1.01] sm:flex-col sm:p-4"
    >
      <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-yellow-light sm:h-40 sm:w-full">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <img
            src={book.status === "failed" ? mascot.hug : mascot.read}
            alt=""
            className={`h-20 w-20 sm:h-28 sm:w-28 ${inProgress ? "animate-mascot-bob" : ""}`}
          />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-story text-base text-brown">{book.title ?? "만드는 중인 동화"}</p>
          <StatusBadge status={book.status} />
        </div>
        <p className="mt-0.5 text-xs text-brown/50">{formatPeriod(book.periodStart, book.periodEnd)}</p>
        <p className="mt-1.5 line-clamp-2 text-sm text-brown/70">“{book.parentMessage}”</p>
      </div>
    </Link>
  );
}

export default function StorybookLibraryPage() {
  const child = useCurrentChild();
  const storybooksQuery = useStorybooks(child.id);

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:max-w-3xl lg:max-w-5xl lg:py-10">
      <AppHeader title={`${child.name}의 동화 서재`} />

      {storybooksQuery.isPending ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="동화를 불러오는 중">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 sm:h-64" />
          ))}
        </div>
      ) : storybooksQuery.isError ? (
        <ErrorBox
          message={`동화 목록을 불러오지 못했어요. ${errorMessage(storybooksQuery.error)}`}
          onRetry={() => void storybooksQuery.refetch()}
        />
      ) : storybooksQuery.data.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-white/80 p-8 text-center shadow-sm">
          <img src={mascot.read} alt="" className="animate-mascot-bob h-28 w-28" />
          <p className="mt-3 font-story text-xl text-brown">아직 만든 동화가 없어요</p>
          <p className="mt-1 text-sm text-brown/60">
            남겨둔 기록에 전하고 싶은 마음을 더해 첫 동화를 만들어 보세요.
          </p>
          <Link
            to="/storybooks/new"
            className="mt-5 flex min-h-12 items-center gap-2 rounded-full bg-coral px-6 font-story text-white shadow-sm hover:bg-coral-deep"
          >
            <Wand2 size={18} aria-hidden />첫 동화 만들기
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm text-brown/60">동화 {storybooksQuery.data.length}권</p>
            <Link
              to="/storybooks/new"
              className="flex min-h-11 items-center gap-1.5 rounded-full bg-coral px-5 text-sm font-medium text-white shadow-sm hover:bg-coral-deep"
            >
              <Plus size={16} aria-hidden />새 동화 만들기
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {storybooksQuery.data.map((book) => (
              <li key={book.id}>
                <StorybookCard book={book} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
