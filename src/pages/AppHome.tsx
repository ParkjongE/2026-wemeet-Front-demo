import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays, List, Flame, Sparkles, PenLine } from "lucide-react";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import TimelineView from "../components/Calendar/TimelineView";
import RecentEntriesStrip from "../components/Calendar/RecentEntriesStrip";
import StatChip from "../components/Calendar/StatChip";
import { useDiary } from "../context/useDiary";
import { MONTH_LABEL_FORMAT, todayString } from "../utils/date";
import { computeStreak, countThisMonth } from "../utils/stats";
import { mascot } from "../mock/illustrations";

type ViewMode = "calendar" | "timeline";

export default function AppHome() {
  const navigate = useNavigate();
  const { entriesByDate } = useDiary();
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

  const monthLabel = MONTH_LABEL_FORMAT.format(new Date(viewYear, viewMonth, 1));
  const streak = computeStreak(entriesByDate);
  const monthCount = countThisMonth(entriesByDate);
  const hasEntries = entriesByDate.size > 0;

  return (
    <div className="min-h-screen bg-ivory">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={mascot.wave} alt="" className="h-8 w-8" />
          <span className="font-story text-base text-brown">하루동화</span>
        </Link>
        <Link
          to="/intro"
          className="rounded-full px-3 py-1.5 text-sm font-medium text-brown/60 transition-colors hover:bg-mint-light hover:text-brown"
        >
          서비스 소개
        </Link>
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
              <h1 className="mt-2 font-story text-2xl text-brown sm:text-3xl">우리 아이의 하루</h1>
              <p className="mt-1.5 text-sm text-brown/60">작은 순간들이 모여 소중한 이야기가 돼요.</p>

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
                  onClick={() => navigate("/storybook")}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-mint px-6 py-3 font-story text-brown shadow-sm transition-transform hover:scale-105 sm:w-auto"
                >
                  <Sparkles size={18} />
                  AI 동화 만들기
                </button>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                <StatChip icon={Flame} label="연속 기록" value={`${streak}일째`} colorClass="bg-coral" />
                <StatChip
                  icon={CalendarDays}
                  label="이번 달 기록"
                  value={`${monthCount}개`}
                  colorClass="bg-mint-deep"
                />
              </div>

              {hasEntries && (
                <div className="mt-6 text-left">
                  <p className="mb-2 text-center text-xs text-brown/50">최근 기록</p>
                  <div className="flex justify-center">
                    <RecentEntriesStrip
                      entries={Array.from(entriesByDate.values())}
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
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
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
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
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
                      className="rounded-full p-2 text-brown/60 hover:bg-mint-light"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-story text-lg text-brown">{monthLabel}</h2>
                    <button
                      type="button"
                      onClick={goNextMonth}
                      aria-label="다음 달"
                      className="rounded-full p-2 text-brown/60 hover:bg-mint-light"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <CalendarGrid
                    year={viewYear}
                    month={viewMonth}
                    entriesByDate={entriesByDate}
                    onDayClick={(dateStr) => navigate(`/diary/${dateStr}`)}
                  />
                </>
              ) : (
                <TimelineView
                  entries={Array.from(entriesByDate.values())}
                  onSelect={(dateStr) => navigate(`/diary/${dateStr}`)}
                />
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
                  onClick={() => navigate("/storybook")}
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
