export type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

export interface User {
  id: string;
  email: string;
}

export interface Child {
  id: string;
  name: string;
  birthDate: string | null; // YYYY-MM-DD
}

export interface DiaryPhoto {
  id: string;
  url: string; // 표시용 URL (CloudFront 또는 목업 objectURL/dataURL)
}

export interface DiaryEntry {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD, 아이별로 날짜당 1개
  text: string;
  weather: Weather | null;
  moodTag: string | null;
  photos: DiaryPhoto[];
  createdAt: string;
  updatedAt: string;
}

export type StorybookStatus = "queued" | "processing" | "completed" | "failed";

export interface StorybookPage {
  pageNo: number;
  text: string;
  imageUrl: string;
}

export interface StorybookSummary {
  id: string;
  childId: string;
  title: string | null; // 완성 전에는 null
  status: StorybookStatus;
  periodStart: string;
  periodEnd: string;
  parentMessage: string;
  lessonTag: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Storybook extends StorybookSummary {
  pages: StorybookPage[]; // completed일 때만 채워짐
  errorMessage: string | null;
}
