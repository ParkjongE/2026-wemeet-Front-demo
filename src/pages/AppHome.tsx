import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  List,
  Flame,
  Sparkles,
  PenLine,
  Settings,
  BookOpen,
} from "lucide-react";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import TimelineView from "../components/Calendar/TimelineView";
import RecentEntriesStrip from "../components/Calendar/RecentEntriesStrip";
import StatChip from "../components/Calendar/StatChip";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import { useCurrentChild } from "../auth/authContext";
import { useDiaries } from "../hooks/useDiaries";
import { errorMessage } from "../api";
import { MONTH_LABEL_FORMAT, addDays, buildMonthGrid, todayString } from "../utils/date";
import { computeStreak, countThisMonth, toEntriesByDate } from "../utils/stats";
import { mascot } from "../mock/illustrations";

// 연속 기록·이번 달 통계와 최근 기록은 최근 62일 기록으로 계산한다.
const RECENT_WINDOW_DAYS = 62;

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="기록을 불러오는 중" role="status">
      {Array.from({ length: 35 }, (_, i) => (
        <Skeleton key={i} className="aspect-square" />
      ))}
    </div>
  );
}

type ViewMode = "calendar" | "timeline";

export default function AppHome() {
  const navigate = useNavigate();
  const child = useCurrentChild();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // 캘린더는 앞뒤 달 칸까지 보여주므로 그리드 전체 범위를 조회한다.
  const grid = buildMonthGrid(viewYear, viewMonth);
  const monthQuery = useDiaries(child.id, grid[0].dateStr, grid[grid.length - 1].dateStr);
  const todayStr = todayString();
  const recentQuery = useDiaries(child.id, addDays(todayStr, -(RECENT_WINDOW_DAYS - 1)), todayStr);

  const monthEntriesByDate = toEntriesByDate(monthQuery.data);
  const recentEntriesByDate = toEntriesByDate(recentQuery.data);
  const monthLabel = MONTH_LABEL_FORMAT.format(new Date(viewYear, viewMonth, 1));
  const streak = computeStreak(recentEntriesByDate);
  const monthCount = countThisMonth(recentEntriesByDate);
  const hasEntries = recentEntriesByDate.size > 0;
  const isEmpty = recentQuery.isSuccess && monthQuery.isSuccess && !hasEntries && monthEntriesByDate.size === 0;
  const monthEntriesInView = (monthQuery.data ?? []).filter((e) =>
    e.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`),
  );

  return (
    <div className="min-h-screen bg-ivory">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={mascot.wave} alt="" className="h-8 w-8" />
          <span className="font-story text-base text-brown">하루동화</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/storybooks"
            className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-brown/70 transition-colors hover:bg-mint-light hover:text-brown"
          >
            <BookOpen size={18} aria-hidden />
            동화 서재
          </Link>
          <Link
            to="/intro"
            className="hidden min-h-11 items-center rounded-full px-3 text-sm font-medium text-brown/60 transition-colors hover:bg-mint-light hover:text-brown sm:flex"
          >
            서비스 소개
          </Link>
          <Link
            to="/settings"
            aria-label="설정"
            className="flex h-11 w-11 items-center justify-center rounded-full text-brown/60 transition-colors hover:bg-mint-light hover:text-brown"
          >
            <Settings size={20} />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <main className="min-w-0 flex-1">
            <section className="mb-8 rounded-2xl bg-white/70 p-5 text-center shadow-sm sm:p-8">
              <img
                src={mascot.wave}
                alt="인사하는 하루"
                className="animate-mascot-bob mx-auto h-24 w-24 sm:h-28 sm:w-28"
              />
              <h1 className="mt-2 font-story text-2xl text-brown sm:text-3xl">{child.name}의 하루</h1>
              <p className="mt-1.5 text-sm text-brown/60">
                {isEmpty
                  ? "첫 기록을 남겨볼까요? 사진 한 장, 한 줄이면 충분해요."
                  : "작은 순간들이 모여 소중한 이야기가 돼요."}
              </p>

              <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate(`/diary/${todayString()}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 font-story text-white shadow-sm transition-transform hover:scale-105 sm:w-auto"
                >
                  <PenLine size={18} />
                  오늘 기록하기
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/storybooks/new")}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-mint px-6 py-3 font-story text-brown shadow-sm transition-transform hover:scale-105 sm:w-auto"
                >
                  <Sparkles size={18} />
                  AI 동화 만들기
                </button>
              </div>

              {recentQuery.isPending ? (
                <div className="mt-5 flex justify-center gap-2.5" role="status" aria-label="통계를 불러오는 중">
                  <Skeleton className="h-12 w-32 rounded-full" />
                  <Skeleton className="h-12 w-32 rounded-full" />
                </div>
              ) : recentQuery.isError ? (
                <ErrorBox
                  className="mt-5"
                  message={`최근 기록을 불러오지 못했어요. ${errorMessage(recentQuery.error)}`}
                  onRetry={() => void recentQuery.refetch()}
                />
              ) : (
                !isEmpty && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                    <StatChip icon={Flame} label="연속 기록" value={`${streak}일째`} colorClass="bg-coral" />
                    <StatChip
                      icon={CalendarDays}
                      label="이번 달 기록"
                      value={`${monthCount}개`}
                      colorClass="bg-mint-deep"
                    />
                  </div>
                )
              )}

              {hasEntries && (
                <div className="mt-6 text-left">
                  <p className="mb-2 text-center text-xs text-brown/50">최근 기록</p>
                  <div className="flex justify-center">
                    <RecentEntriesStrip
                      entries={recentQuery.data ?? []}
                      onSelect={(dateStr) => navigate(`/diary/${dateStr}`)}
                      limit={3}
                    />
                  </div>
                </div>
              )}
            </section>

            <div className="mb-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("calendar")}
                className={[
                  "flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
                  viewMode === "calendar"
                    ? "bg-coral text-white"
                    : "bg-white/70 text-brown/60 hover:bg-mint-light",
                ].join(" ")}
              >
                <CalendarDays size={16} />
                캘린더
              </button>
              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                className={[
                  "flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
                  viewMode === "timeline"
                    ? "bg-coral text-white"
                    : "bg-white/70 text-brown/60 hover:bg-mint-light",
                ].join(" ")}
              >
                <List size={16} />
                타임라인
              </button>
            </div>

            <div className="rounded-2xl bg-white/70 p-4 shadow-sm sm:p-6">
              {viewMode === "calendar" ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={goPrevMonth}
                      aria-label="이전 달"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-brown/60 hover:bg-mint-light"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-story text-lg text-brown">{monthLabel}</h2>
                    <button
                      type="button"
                      onClick={goNextMonth}
                      aria-label="다음 달"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-brown/60 hover:bg-mint-light"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {monthQuery.isPending ? (
                    <CalendarSkeleton />
                  ) : monthQuery.isError ? (
                    <ErrorBox
                      message={`이 달의 기록을 불러오지 못했어요. ${errorMessage(monthQuery.error)}`}
                      onRetry={() => void monthQuery.refetch()}
                    />
                  ) : (
                    <div className={monthQuery.isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
                      <CalendarGrid
                        year={viewYear}
                        month={viewMonth}
                        entriesByDate={monthEntriesByDate}
                        onDayClick={(dateStr) => navigate(`/diary/${dateStr}`)}
                        disableFuture
                      />
                    </div>
                  )}
                </>
              ) : monthQuery.isError ? (
                <ErrorBox
                  message={`이 달의 기록을 불러오지 못했어요. ${errorMessage(monthQuery.error)}`}
                  onRetry={() => void monthQuery.refetch()}
                />
              ) : monthQuery.isPending ? (
                <div className="space-y-3" role="status" aria-label="기록을 불러오는 중">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} className="h-[88px]" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={goPrevMonth}
                      aria-label="이전 달"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-brown/60 hover:bg-mint-light"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-story text-lg text-brown">{monthLabel}</h2>
                    <button
                      type="button"
                      onClick={goNextMonth}
                      aria-label="다음 달"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-brown/60 hover:bg-mint-light"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <TimelineView
                    entries={monthEntriesInView}
                    onSelect={(dateStr) => navigate(`/diary/${dateStr}`)}
                  />
                </>
              )}
            </div>

            {hasEntries && (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-yellow-light p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <p className="font-story text-lg text-brown">
                    추억이 모였어요. 이제 동화로 만나볼까요?
                  </p>
                  <p className="mt-1 text-sm text-brown/60">
                    남겨둔 기록에 전하고 싶은 마음을 더해보세요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/storybooks/new")}
                  className="flex shrink-0 items-center gap-2 rounded-full bg-coral px-6 py-3 font-story text-white shadow-sm transition-transform hover:scale-105"
                >
                  <Sparkles size={18} />
                  우리 아이 동화 만들기
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
