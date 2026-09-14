import { createContext } from "react";
import type { DiaryEntry } from "../types";

export interface DiaryContextValue {
  entriesByDate: Map<string, DiaryEntry>;
  getEntry: (date: string) => DiaryEntry | undefined;
  upsertEntry: (entry: DiaryEntry) => void;
}

export const DiaryContext = createContext<DiaryContextValue | null>(null);
