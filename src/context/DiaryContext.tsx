import { useMemo, useState, type ReactNode } from "react";
import { diaryEntries as initialEntries } from "../mock/diaryEntries";
import type { DiaryEntry } from "../types";
import { DiaryContext } from "./diaryContextStore";

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, DiaryEntry>();
    for (const entry of entries) {
      map.set(entry.date, entry);
    }
    return map;
  }, [entries]);

  const getEntry = (date: string) => entriesByDate.get(date);

  const upsertEntry = (entry: DiaryEntry) => {
    setEntries((prev) => {
      const withoutDate = prev.filter((e) => e.date !== entry.date);
      return [...withoutDate, entry];
    });
  };

  return (
    <DiaryContext.Provider value={{ entriesByDate, getEntry, upsertEntry }}>
      {children}
    </DiaryContext.Provider>
  );
}
