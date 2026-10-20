import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CloudCheck,
  Flame,
  LayoutList,
  NotebookPen,
  PenLine,
  Wand2,
} from "lucide-react";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import TimelineView from "../components/Calendar/TimelineView";
import { MoodFace } from "../components/Diary/stickers";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import { useCurrentChild } from "../auth/authContext";
import { useDiaries } from "../hooks/useDiaries";
import { useStorybooks } from "../hooks/useStorybooks";
import { errorMessage } from "../api";
import { brandArt, characterArt } from "../assets/art";
import { MONTH_LABEL_FORMAT, addDays, buildMonthGrid, daysBetweenInclusive, todayString } from "../utils/date";
import { computeStreak, countThisMonth, toEntriesByDate } from "../utils/stats";
import { nameForms, possessive } from "../utils/korean";
import type { DiaryEntry } from "../types";

// 연속 기록·이번 달 통계와 최근 기록은 최근 62일 기록으로 계산한다.
const RECENT_WINDOW_DAYS = 62;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "고요한 새벽이에요";
  if (hour < 11) return "좋은 아침이에요";
  if (hour < 17) return "따뜻한 오후예요";
  if (hour < 21) return "수고 많았던 하루예요";
  return "포근한 밤이에요";
}

type ViewMode = "calendar" | "timeline";

export default function AppHome() {
  const navigate = useNavigate();
  const child = useCurrentChild();
  const today = new Date();
  const todayStr = todayString();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  const goMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  // 캘린더는 앞뒤 달 칸까지 보여주므로 그리드 전체 범위를 조회한다.
  const grid = buildMonthGrid(viewYear, viewMonth);
  const monthQuery = useDiaries(child.id, grid[0].dateStr, grid[grid.length - 1].dateStr);
  const recentQuery = useDiaries(child.id, addDays(todayStr, -(RECENT_WINDOW_DAYS - 1)), todayStr);
  const storybooksQuery = useStorybooks(child.id);

  const monthEntriesByDate = toEntriesByDate(monthQuery.data);
  const recentEntriesByDate = toEntriesByDate(recentQuery.data);
  const monthLabel = MONTH_LABEL_FORMAT.format(new Date(viewYear, viewMonth, 1));
  const streak = computeStreak(recentEntriesByDate);
  const monthCount = countThisMonth(recentEntriesByDate);
  const recentCount = recentEntriesByDate.size;
  const todayEntry = recentEntriesByDate.get(todayStr);
  const lastWeekCount = (recentQuery.data ?? []).filter((e) => e.date >= addDays(todayStr, -6)).length;
  const completedBooks = (storybooksQuery.data ?? []).filter((b) => b.status === "completed");
  const monthEntriesInView = (monthQuery.data ?? []).filter((e) =>
    e.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`),
  );
  const dayCount = child.birthDate ? daysBetweenInclusive(child.birthDate, todayStr) : null;
  const art = characterArt[child.gender ?? "girl"];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
      {/* 인사 + 오늘 */}
      <section className="relative overflow-hidden rounded-[28px] bg-sand-light px-6 pb-6 pt-7 sm:px-10 sm:pt-10">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-sand-soft/50" aria-hidden />
        <div className="relative grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div className="pb-2">
            <p className="text-sm font-semibold text-sand-ink">
              {greeting()}
              {dayCount && ` · ${nameForms(child.name).와} 함께한 지 ${dayCount.toLocaleString()}일째`}
            </p>
            <h1 className="mt-2 font-book text-[26px] font-bold leading-snug text-brown sm:text-4xl">
              {todayEntry ? (
                <>
                  오늘의 {child.name},
                  <br className="sm:hidden" /> 잘 남겨두었어요
                </>
              ) : (
                <>
                  오늘 {possessive(child.name)} 하루는
                  <br />
                  어땠나요?
                </>
              )}
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-brown/65">
              {todayEntry
                ? "남긴 기록은 언제든 다시 꾸미고 고칠 수 있어요. 쌓인 하루들은 나중에 한 권의 그림동화가 돼요."
                : "사진 한 장, 한 줄이면 충분해요. 오늘의 작은 순간이 언젠가 아이의 동화 속 한 장면이 돼요."}
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                to={`/diary/${todayStr}`}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-brown px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brown/90"
              >
                <PenLine size={19} aria-hidden />
                {todayEntry ? "오늘 기록 보기" : "오늘 기록 남기기"}
              </Link>
              <Link
                to="/storybooks/new"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-base font-semibold text-brown shadow-sm ring-1 ring-hairline transition-colors hover:bg-canvas"
              >
                <Wand2 size={19} aria-hidden />
                그림동화 만들기
              </Link>
            </div>
          </div>
          <img
            src={art.full}
            alt=""
            className="animate-bob pointer-events-none mx-auto -mb-6 h-56 w-auto mix-blend-multiply soft-edges sm:h-72 md:mr-6"
          />
        </div>
      </section>

      {/* 통계 */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 lg:grid-cols-4" aria-label="기록 요약">
        {recentQuery.isPending ? (
          Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[92px]" />)
        ) : recentQuery.isError ? (
          <ErrorBox
            className="col-span-full"
            message={`최근 기록을 불러오지 못했어요. ${errorMessage(recentQuery.error)}`}
            onRetry={() => void recentQuery.refetch()}
          />
        ) : (
          <>
            <Stat icon={<Flame size={18} />} tone="bg-blush text-[#b55d4c]" label="연속 기록" value={`${streak}일`} hint={streak > 0 ? "꾸준함이 쌓이고 있어요" : "오늘부터 시작해요"} />
            <Stat icon={<CalendarDays size={18} />} tone="bg-ocean-light text-ocean-deep" label="이번 달 기록" value={`${monthCount}개`} />
            <Stat icon={<NotebookPen size={18} />} tone="bg-sand-light text-sand-ink" label="최근 두 달" value={`${recentCount}개`} />
            <Stat icon={<BookOpen size={18} />} tone="bg-forest-light text-forest" label="완성한 동화" value={`${completedBooks.length}권`} />
          </>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* 캘린더 / 모아보기 */}
        <section className="rounded-[28px] bg-white p-4 shadow-card ring-1 ring-hairline/60 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                aria-label="이전 달"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-brown/60 hover:bg-sand-light"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="min-w-28 text-center text-lg font-bold text-brown">{monthLabel}</h2>
              <button
                type="button"
                onClick={() => goMonth(1)}
                disabled={isCurrentMonth}
                aria-label="다음 달"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-brown/60 hover:bg-sand-light disabled:opacity-25"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex rounded-xl bg-canvas p-1 ring-1 ring-hairline/70" role="tablist" aria-label="보기 방식">
              {(
                [
                  ["calendar", "달력", CalendarDays],
                  ["timeline", "모아보기", LayoutList],
                ] as const
              ).map(([mode, label, Icon]) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={viewMode === mode}
                  onClick={() => setViewMode(mode)}
                  className={[
                    "flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors",
                    viewMode === mode ? "bg-white text-brown shadow-sm" : "text-brown/50 hover:text-brown",
                  ].join(" ")}
                >
                  <Icon size={15} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {monthQuery.isPending ? (
            <div className="grid grid-cols-7 gap-1 sm:gap-2" role="status" aria-label="기록을 불러오는 중">
              {Array.from({ length: 35 }, (_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : monthQuery.isError ? (
            <ErrorBox
              message={`이 달의 기록을 불러오지 못했어요. ${errorMessage(monthQuery.error)}`}
              onRetry={() => void monthQuery.refetch()}
            />
          ) : (
            <div className={monthQuery.isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
              {viewMode === "calendar" ? (
                <CalendarGrid
                  year={viewYear}
                  month={viewMonth}
                  entriesByDate={monthEntriesByDate}
                  onDayClick={(dateStr) => navigate(`/diary/${dateStr}`)}
                  disableFuture
                />
              ) : (
                <TimelineView entries={monthEntriesInView} onSelect={(dateStr) => navigate(`/diary/${dateStr}`)} />
              )}
            </div>
          )}
          <p className="mt-5 flex items-center gap-1.5 border-t border-hairline/70 pt-4 text-xs text-brown/50">
            <CloudCheck size={15} className="text-forest" aria-hidden />
            모든 기록은 계정에 안전하게 저장되고, 우리 가족만 볼 수 있어요.
          </p>
        </section>

        <aside className="space-y-6">
          {/* 동화 만들기 제안 */}
          <section className="overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-hairline/60">
            <div className="relative bg-ocean-light/60 px-5 pt-5">
              <p className="text-xs font-semibold text-ocean-deep">이번 주 기록 {lastWeekCount}개</p>
              <p className="mt-1 whitespace-pre-line font-book text-xl font-bold leading-snug text-brown">
                {lastWeekCount > 0 ? "이번 주 이야기로\n그림동화를 만들어 볼까요?" : "기록이 모이면\n그림동화가 돼요"}
              </p>
              <img src={brandArt.makingBook} alt="" className="mx-auto mt-2 h-40 w-auto mix-blend-multiply soft-edges" />
            </div>
            <div className="p-5">
              <p className="text-sm leading-relaxed text-brown/60">
                아이에게 전하고 싶은 한마디를 적으면, {possessive(child.name)} 기록을 엮어 주인공이 된 그림책을 지어 드려요.
              </p>
              <Link
                to="/storybooks/new"
                className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sand text-[15px] font-semibold text-brown transition-colors hover:bg-sand-strong"
              >
                <Wand2 size={17} aria-hidden />
                동화 만들러 가기
              </Link>
            </div>
          </section>

          {/* 최근 동화 */}
          <section className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-hairline/60">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-brown">{possessive(child.name)} 책장</h2>
              <Link to="/storybooks" className="flex min-h-9 items-center gap-0.5 text-sm font-medium text-ocean-deep hover:underline">
                전체 보기
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
            {storybooksQuery.isPending ? (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            ) : completedBooks.length === 0 ? (
              <p className="mt-3 text-sm text-brown/55">아직 완성한 동화가 없어요. 첫 그림책을 만들어 보세요.</p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {completedBooks.slice(0, 3).map((book) => (
                  <Link key={book.id} to={`/storybooks/${book.id}`} className="group">
                    <span className="relative block aspect-[2/3] overflow-hidden rounded-r-lg rounded-l-sm shadow-card transition-transform group-hover:-translate-y-1">
                      {book.coverImageUrl && (
                        <img src={book.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                      )}
                      <span className="absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-black/25 to-transparent" />
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-xs font-medium leading-snug text-brown/80">{book.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {recentQuery.data && recentQuery.data.length > 0 && <RecentMoments entries={recentQuery.data} />}
        </aside>
      </div>
    </div>
  );
}

function Stat({
  icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card ring-1 ring-hairline/60">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-brown/55">{label}</p>
        <p className="text-xl font-bold text-brown">{value}</p>
        {hint && <p className="hidden truncate text-[11px] text-brown/45 sm:block">{hint}</p>}
      </div>
    </div>
  );
}

function RecentMoments({ entries }: { entries: DiaryEntry[] }) {
  const recent = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-hairline/60">
      <h2 className="text-base font-bold text-brown">최근의 순간들</h2>
      <ul className="mt-3 space-y-1">
        {recent.map((entry) => {
          const [, m, d] = entry.date.split("-").map(Number);
          return (
            <li key={entry.date}>
              <Link to={`/diary/${entry.date}`} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-sand-light/60">
                {entry.photos[0] ? (
                  <img src={entry.photos[0].url} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sand-light">
                    {entry.moodTag ? <MoodFace tag={entry.moodTag} className="h-8 w-8" /> : <NotebookPen size={18} className="text-brown/50" />}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brown/50">
                    {m}월 {d}일{entry.moodTag ? ` · ${entry.moodTag}` : ""}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-brown/80">{entry.text || "사진으로 남긴 하루"}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
