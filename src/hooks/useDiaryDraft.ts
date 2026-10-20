import { useCallback, useEffect, useRef, useState } from "react";
import type { DiaryDecoration, Weather } from "../types";

// 작성 중인 기록(글·날씨·기분·꾸미기)을 이 기기에 잠시 보관한다. 저장에 성공하면 지운다.
// 사진은 올리는 즉시 서버에 보관되므로 여기에는 담지 않는다.
export interface DiaryDraft {
  text: string;
  weather: Weather | null;
  moodTag: string | null;
  decoration: DiaryDecoration;
  savedAt: number;
}

const keyOf = (childId: string, date: string) => `harudonghwa.draft.${childId}.${date}`;
const SAVE_DELAY_MS = 600;

export function readDraft(childId: string, date: string): DiaryDraft | null {
  try {
    const raw = localStorage.getItem(keyOf(childId, date));
    return raw ? (JSON.parse(raw) as DiaryDraft) : null;
  } catch {
    return null;
  }
}

export function useDiaryDraft(childId: string, date: string, value: Omit<DiaryDraft, "savedAt">, enabled: boolean) {
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const serialized = JSON.stringify(value);

  useEffect(() => {
    if (!enabled) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const now = Date.now();
      try {
        localStorage.setItem(keyOf(childId, date), JSON.stringify({ ...JSON.parse(serialized), savedAt: now }));
        setSavedAt(now);
      } catch {
        // 저장 공간을 못 쓰면 임시 저장만 건너뛴다.
      }
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer.current);
  }, [childId, date, serialized, enabled]);

  const clear = useCallback(() => {
    window.clearTimeout(timer.current);
    try {
      localStorage.removeItem(keyOf(childId, date));
    } catch {
      // 무시
    }
    setSavedAt(null);
  }, [childId, date]);

  return { savedAt, clear };
}
