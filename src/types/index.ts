export type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

export interface DiaryEntry {
  date: string; // "2026-09-13" (YYYY-MM-DD)
  text: string;
  imageUrls: string[];
  moodTag?: string;
  weather?: Weather;
}

export interface StorybookPage {
  text: string;
  imageUrl: string;
}

export interface Storybook {
  id: string;
  title: string;
  lesson: string;
  protagonistName: string;
  periodStart: string;
  periodEnd: string;
  pages: StorybookPage[];
  createdAt: string;
}
