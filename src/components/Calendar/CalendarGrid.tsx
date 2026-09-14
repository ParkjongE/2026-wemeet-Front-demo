import { NotebookPen } from "lucide-react";
import type { DiaryEntry } from "../../types";
import { buildMonthGrid, todayString, WEEKDAY_LABELS } from "../../utils/date";

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  entriesByDate: Map<string, DiaryEntry>;
  onDayClick: (dateStr: string) => void;
}

export default function CalendarGrid({
  year,
  month,
  entriesByDate,
  onDayClick,
}: CalendarGridProps) {
  const cells = buildMonthGrid(year, month);
  const today = todayString();

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-sm font-medium text-gray-500 py-1"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((cell) => {
          const entry = entriesByDate.get(cell.dateStr);
          const hasPhoto = !!entry?.imageUrls[0];
          const isTextOnly = !!entry && !hasPhoto;
          const isToday = cell.dateStr === today;

          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onDayClick(cell.dateStr)}
              aria-label={`${cell.date.getMonth() + 1}월 ${cell.date.getDate()}일${entry ? ", 기록 있음" : ""}`}
              className={[
                "relative aspect-square rounded-xl flex flex-col items-center justify-center overflow-hidden transition-colors",
                cell.inCurrentMonth
                  ? "bg-white"
                  : "bg-white/40 text-gray-300",
                isToday ? "ring-2 ring-coral" : "",
                "hover:bg-yellow-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral",
              ].join(" ")}
            >
              {hasPhoto && (
                <img
                  src={entry.imageUrls[0]}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-85"
                />
              )}
              {isTextOnly && (
                <span className="absolute inset-0 flex items-center justify-center bg-yellow-light">
                  <NotebookPen size={18} className="text-brown/60" />
                </span>
              )}
              <span
                className={[
                  "relative z-10 text-xs sm:text-sm font-medium",
                  hasPhoto ? "text-white drop-shadow" : "text-brown",
                  isTextOnly ? "absolute bottom-0.5 right-1 text-[10px] text-brown/70" : "",
                  !cell.inCurrentMonth && !entry ? "text-gray-300" : "",
                ].join(" ")}
              >
                {cell.date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
