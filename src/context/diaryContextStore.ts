import { createContext } from "react";
import type { LegacyDiaryEntry as DiaryEntry } from "../types/legacy";

export interface DiaryContextValue {
  entriesByDate: Map<string, DiaryEntry>;
  getEntry: (date: string) => DiaryEntry | undefined;
  upsertEntry: (entry: DiaryEntry) => void;
}

export const DiaryContext = createContext<DiaryContextValue | null>(null);
