import type { DiaryEntry } from "../types";
import { isApiError, request } from "./client";
import type { SaveDiaryInput } from "./types";

export const diariesApi = {
  listDiaries: (childId: string, from: string, to: string) =>
    request<DiaryEntry[]>("GET", `/children/${childId}/diaries`, { query: { from, to } }),

  // 기록이 없는 날(404)은 null로 돌려준다.
  getDiary: async (childId: string, date: string): Promise<DiaryEntry | null> => {
    try {
      return await request<DiaryEntry>("GET", `/children/${childId}/diaries/${date}`);
    } catch (error) {
      if (isApiError(error) && error.status === 404) return null;
      throw error;
    }
  },

  saveDiary: (childId: string, date: string, input: SaveDiaryInput) =>
    request<DiaryEntry>("PUT", `/children/${childId}/diaries/${date}`, { body: input }),

  deleteDiary: (childId: string, date: string) =>
    request<void>("DELETE", `/children/${childId}/diaries/${date}`),
};

export type DiariesApi = typeof diariesApi;
