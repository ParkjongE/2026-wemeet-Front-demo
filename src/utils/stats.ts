import type { DiaryEntry } from "../types";
import { addDays, todayString } from "./date";

export function computeStreak(entriesByDate: Map<string, DiaryEntry>): number {
  let streak = 0;
  let cursor = entriesByDate.has(todayString()) ? todayString() : addDays(todayString(), -1);

  while (entriesByDate.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function countThisMonth(entriesByDate: Map<string, DiaryEntry>): number {
  const [year, month] = todayString().split("-");
  const prefix = `${year}-${month}`;
  let count = 0;
  for (const date of entriesByDate.keys()) {
    if (date.startsWith(prefix)) count += 1;
  }
  return count;
}
