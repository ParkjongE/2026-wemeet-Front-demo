import { NotebookPen } from "lucide-react";
import type { DiaryEntry } from "../../types";

interface RecentEntriesStripProps {
  entries: DiaryEntry[];
  onSelect: (dateStr: string) => void;
  limit?: number;
}

function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${m}.${d}`;
}

export default function RecentEntriesStrip({ entries, onSelect, limit = 8 }: RecentEntriesStripProps) {
  const recent = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

  if (recent.length === 0) return null;

  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {recent.map((entry) => (
        <button
          key={entry.date}
          type="button"
          onClick={() => onSelect(entry.date)}
          className="flex shrink-0 flex-col items-center gap-1.5 transition-transform hover:scale-105"
        >
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-yellow-light shadow-sm sm:h-20 sm:w-20">
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
          <span className="text-xs text-brown/60">{formatShortDate(entry.date)}</span>
        </button>
      ))}
    </div>
  );
}
