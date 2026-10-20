import type { DiaryEntry } from "../../types";
import { getWeatherOption } from "../../utils/weather";
import { MoodFace } from "../Diary/stickers";

interface TimelineViewProps {
  entries: DiaryEntry[];
  onSelect: (dateStr: string) => void;
}

function formatDisplayDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return { day: d, weekday: date.toLocaleDateString("ko-KR", { weekday: "short" }) };
}

export default function TimelineView({ entries, onSelect }: TimelineViewProps) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return <p className="py-14 text-center text-sm text-brown/50">이 달에는 아직 기록이 없어요.</p>;
  }

  return (
    <ol className="space-y-3">
      {sorted.map((entry) => {
        const weather = getWeatherOption(entry.weather);
        const { day, weekday } = formatDisplayDate(entry.date);
        return (
          <li key={entry.date}>
            <button
              type="button"
              onClick={() => onSelect(entry.date)}
              className="flex w-full items-start gap-4 rounded-2xl p-2 text-left transition-colors hover:bg-sand-light/60"
            >
              <div className="w-11 shrink-0 pt-1 text-center">
                <p className="font-book text-2xl font-bold leading-none text-brown">{day}</p>
                <p className="mt-1 text-[11px] text-brown/45">{weekday}요일</p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-brown/50">
                  {entry.moodTag && <MoodFace tag={entry.moodTag} className="h-5 w-5" />}
                  {entry.moodTag && <span>{entry.moodTag}</span>}
                  {weather && <weather.icon size={14} className={weather.colorClass} aria-label={weather.label} />}
                </div>
                <p className="mt-1 line-clamp-2 font-handwriting text-lg leading-snug text-brown">{entry.text || "사진으로 남긴 하루"}</p>
                {entry.photos.length > 0 && (
                  <div className="mt-2 flex gap-1.5">
                    {entry.photos.slice(0, 4).map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt=""
                        loading="lazy"
                        className="h-16 w-16 rounded-xl object-cover ring-1 ring-black/5 sm:h-20 sm:w-20"
                      />
                    ))}
                  </div>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
