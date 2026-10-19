// 기존 목업 데모 화면이 쓰던 타입. 4·5단계에서 화면을 API 훅으로 옮기면서 삭제한다.
import type { Weather } from "./index";

export interface LegacyDiaryEntry {
  date: string; // "2026-09-13" (YYYY-MM-DD)
  text: string;
  imageUrls: string[];
  moodTag?: string;
  weather?: Weather;
}

export interface LegacyStorybookPage {
  text: string;
  imageUrl: string;
}

export interface LegacyStorybook {
  id: string;
  title: string;
  lesson: string;
  protagonistName: string;
  periodStart: string;
  periodEnd: string;
  pages: LegacyStorybookPage[];
  createdAt: string;
}
