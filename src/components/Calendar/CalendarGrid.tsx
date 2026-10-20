import { Plus } from "lucide-react";
import type { DiaryEntry } from "../../types";
import { buildMonthGrid, todayString, WEEKDAY_LABELS } from "../../utils/date";
import { MoodFace } from "../Diary/stickers";

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  entriesByDate: Map<string, DiaryEntry>;
  onDayClick: (dateStr: string) => void;
  disableFuture?: boolean;
}

export default function CalendarGrid({
  year,
  month,
  entriesByDate,
  onDayClick,
  disableFuture = false,
}: CalendarGridProps) {
  const cells = buildMonthGrid(year, month);
  // 마지막 줄이 모두 다음 달이면 감춘다.
  const visible = cells.slice(35).every((c) => !c.inCurrentMonth) ? cells.slice(0, 35) : cells;
  const today = todayString();

  return (
    <div className="w-full">
      <div className="mb-2 grid grid-cols-7">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`py-1 text-center text-xs font-semibold ${i === 0 ? "text-error/70" : i === 6 ? "text-ocean-deep/70" : "text-brown/45"}`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {visible.map((cell) => {
          const entry = entriesByDate.get(cell.dateStr);
          const photo = entry?.photos[0];
          const isToday = cell.dateStr === today;
          const isDisabled = disableFuture && cell.dateStr > today;
          const muted = !cell.inCurrentMonth;

          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onDayClick(cell.dateStr)}
              disabled={isDisabled}
              aria-label={`${cell.date.getMonth() + 1}월 ${cell.date.getDate()}일${entry ? ", 기록 있음" : isToday ? ", 오늘" : ""}`}
              className={[
                "group relative aspect-square overflow-hidden rounded-xl transition-all sm:rounded-2xl",
                photo ? "bg-sand-light" : entry ? "bg-sand-light" : "bg-canvas",
                muted ? "opacity-35" : "",
                isDisabled ? "cursor-default opacity-30" : "hover:-translate-y-0.5 hover:shadow-card",
                isToday && !entry ? "ring-2 ring-sand ring-offset-1 ring-offset-white" : "",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean",
              ].join(" ")}
            >
              {photo && (
                <>
                  <img src={photo.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
                </>
              )}
              {entry && !photo && entry.moodTag && (
                <span className="absolute inset-0 flex items-center justify-center pt-2">
                  <MoodFace tag={entry.moodTag} className="h-[55%] w-[55%]" />
                </span>
              )}
              <span
                className={[
                  "absolute left-1.5 top-1 text-[11px] font-semibold sm:left-2 sm:top-1.5 sm:text-xs",
                  photo ? "text-white drop-shadow" : isToday ? "text-sand-ink" : "text-brown/70",
                ].join(" ")}
              >
                {cell.date.getDate()}
              </span>
              {isToday && !entry && !isDisabled && (
                <span className="absolute inset-0 flex items-center justify-center pt-2 text-sand-ink">
                  <Plus size={18} strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
