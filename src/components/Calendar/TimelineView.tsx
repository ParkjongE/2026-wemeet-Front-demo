import { NotebookPen } from "lucide-react";
import type { DiaryEntry } from "../../types";
import { getWeatherOption } from "../../utils/weather";

interface TimelineViewProps {
  entries: DiaryEntry[];
  onSelect: (dateStr: string) => void;
}

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default function TimelineView({ entries, onSelect }: TimelineViewProps) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-brown/50">
        아직 기록된 일기가 없어요. 첫 일기를 남겨보세요!
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 pl-4">
      <div className="absolute bottom-2 left-[9px] top-2 w-0.5 bg-mint-light" aria-hidden="true" />
      {sorted.map((entry) => {
        const weather = getWeatherOption(entry.weather);
        const WeatherIcon = weather?.icon;

        return (
          <li key={entry.date} className="relative">
            <span className="absolute -left-4 top-3 h-3 w-3 rounded-full border-2 border-white bg-coral" />
            <button
              type="button"
              onClick={() => onSelect(entry.date)}
              className="flex w-full items-center gap-3 rounded-2xl bg-white/80 p-3 text-left shadow-sm transition-transform hover:scale-[1.01]"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-yellow-light">
                {entry.imageUrls[0] ? (
                  <img
                    src={entry.imageUrls[0]}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <NotebookPen size={22} className="text-brown/60" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-brown/50">
                  <span>{formatDisplayDate(entry.date)}</span>
                  {WeatherIcon && <WeatherIcon size={14} className={weather?.colorClass} />}
                  {entry.moodTag && (
                    <span className="rounded-full bg-mint-light px-2 py-0.5 text-brown/60">
                      {entry.moodTag}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-brown">{entry.text}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
