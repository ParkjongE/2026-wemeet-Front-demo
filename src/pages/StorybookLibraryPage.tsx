import { Link } from "react-router-dom";
import { CircleAlert, Plus, Wand2 } from "lucide-react";
import { errorMessage } from "../api";
import { useCurrentChild } from "../auth/authContext";
import PageHeader from "../components/layout/PageHeader";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import { useStorybooks } from "../hooks/useStorybooks";
import { brandArt } from "../assets/art";
import type { StorybookSummary } from "../types";
import { formatPeriod } from "../utils/date";
import { nameForms, possessive } from "../utils/korean";

function BookCard({ book }: { book: StorybookSummary }) {
  const inProgress = book.status === "queued" || book.status === "processing";
  const failed = book.status === "failed";

  return (
    <Link to={`/storybooks/${book.id}`} className="group block">
      <div className="relative">
        <div
          className={[
            "relative aspect-[2/3] overflow-hidden rounded-l-[4px] rounded-r-[10px] shadow-lift transition-all duration-300 group-hover:-translate-y-1.5 group-hover:rotate-[-1deg]",
            inProgress || failed ? "bg-sand-light" : "bg-sand-soft",
          ].join(" ")}
        >
          {book.status === "completed" && book.coverImageUrl ? (
            <>
              <img src={book.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#fffdf7]/85 to-transparent px-3 pb-8 pt-3 text-center font-book text-sm font-bold leading-snug text-brown sm:text-[15px]">
                {book.title}
              </span>
            </>
          ) : inProgress ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
              <img src={brandArt.makingBook} alt="" className="animate-bob w-[85%] mix-blend-multiply soft-edges" />
              <p className="text-sm font-semibold text-sand-ink">{book.status === "queued" ? "곧 그리기 시작해요" : "삽화를 그리는 중"}</p>
              <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full bg-sand ${book.status === "queued" ? "w-1/4" : "w-2/3"} transition-all`} />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
              <CircleAlert className="text-error" size={28} aria-hidden />
              <p className="text-sm font-semibold text-brown">완성하지 못했어요</p>
              <p className="text-xs text-brown/55">눌러서 다시 만들 수 있어요</p>
            </div>
          )}
          {/* 책등 */}
          <span className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/25 via-black/5 to-transparent" />
          <span className="absolute inset-y-0 left-[7%] w-px bg-white/30" />
        </div>
        {/* 책 밑그림자 */}
        <span className="absolute -bottom-2 left-[8%] right-[4%] h-3 rounded-[50%] bg-brown/20 blur-md" aria-hidden />
      </div>
      <div className="mt-4 px-0.5">
        <p className="line-clamp-1 text-[15px] font-semibold text-brown">{book.title ?? "만들고 있는 동화"}</p>
        <p className="mt-0.5 text-xs text-brown/50">
          {formatPeriod(book.periodStart, book.periodEnd)}
          {book.lessonTag && ` · ${book.lessonTag}`}
        </p>
      </div>
    </Link>
  );
}

export default function StorybookLibraryPage() {
  const child = useCurrentChild();
  const storybooksQuery = useStorybooks(child.id);
  const books = storybooksQuery.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
      <PageHeader
        eyebrow="동화 서재"
        title={`${possessive(child.name)} 책장`}
        description={books.length > 0 ? `지금까지 ${books.length}권의 이야기가 모였어요.` : "기록으로 만든 그림동화가 이곳에 꽂혀요."}
        actions={
          books.length > 0 && (
            <Link
              to="/storybooks/new"
              className="hidden min-h-12 items-center gap-1.5 rounded-2xl bg-sand px-5 text-[15px] font-semibold text-brown shadow-sm hover:bg-sand-strong sm:flex"
            >
              <Plus size={18} aria-hidden />새 동화 만들기
            </Link>
          )
        }
      />

      {storybooksQuery.isPending ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4" role="status" aria-label="동화를 불러오는 중">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
        </div>
      ) : storybooksQuery.isError ? (
        <ErrorBox
          message={`동화 목록을 불러오지 못했어요. ${errorMessage(storybooksQuery.error)}`}
          onRetry={() => void storybooksQuery.refetch()}
        />
      ) : books.length === 0 ? (
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-[28px] bg-white px-6 pb-10 pt-6 text-center shadow-card ring-1 ring-hairline/60">
          <img src={brandArt.emptyLibrary} alt="" className="h-56 w-auto mix-blend-multiply soft-edges" />
          <p className="mt-2 font-book text-2xl font-bold text-brown">첫 번째 그림책을 기다리고 있어요</p>
          <p className="mt-2 text-[15px] leading-relaxed text-brown/60">
            남겨둔 기록에 아이에게 전하고 싶은 마음을 더하면,
            <br />
            {nameForms(child.name).가} 주인공인 동화가 완성돼요.
          </p>
          <Link
            to="/storybooks/new"
            className="mt-6 flex min-h-14 items-center gap-2 rounded-2xl bg-sand px-7 text-base font-semibold text-brown shadow-sm hover:bg-sand-strong"
          >
            <Wand2 size={18} aria-hidden />첫 동화 만들기
          </Link>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
            {books.map((book) => (
              <li key={book.id}>
                <BookCard book={book} />
              </li>
            ))}
            <li>
              <Link
                to="/storybooks/new"
                className="flex aspect-[2/3] flex-col items-center justify-center gap-3 rounded-[10px] border-2 border-dashed border-brown/15 text-center transition-colors hover:border-sand hover:bg-sand-light/50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand-light text-sand-ink">
                  <Plus size={22} aria-hidden />
                </span>
                <span className="text-sm font-semibold text-brown/70">새 동화 만들기</span>
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
