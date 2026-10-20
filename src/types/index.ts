export type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

export interface User {
  id: string;
  email: string;
}

// 동화 속 주인공 캐릭터. girl = 서아 캐릭터, boy = 도윤 캐릭터
export type ChildGender = "girl" | "boy";

export interface Child {
  id: string;
  name: string;
  birthDate: string | null; // YYYY-MM-DD
  gender: ChildGender | null;
}

export interface DiaryPhoto {
  id: string;
  url: string; // 표시용 URL (CloudFront 또는 목업 objectURL/dataURL)
}

export type PaperTheme = "lined" | "grid" | "dot" | "blossom" | "kraft";
export type PhotoFrame = "polaroid" | "tape" | "round";

// 일기 위에 붙이는 스티커. x는 종이 너비의 %, y는 종이 위쪽에서부터의 거리를 종이 너비의 %로 나타낸다.
export interface DiarySticker {
  id: string;
  kind: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

export interface DiaryDecoration {
  paper: PaperTheme;
  frame: PhotoFrame;
  stickers: DiarySticker[];
}

export interface DiaryEntry {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD, 아이별로 날짜당 1개
  text: string;
  weather: Weather | null;
  moodTag: string | null;
  photos: DiaryPhoto[];
  decoration: DiaryDecoration | null;
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
  // 다 읽고 아이와 나눌 질문. completed일 때만 채워지고, 없으면 빈 배열
  questions: string[];
  errorMessage: string | null;
}
