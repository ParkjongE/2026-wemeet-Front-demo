// 목업 API가 쓰는 localStorage 저장소. 새로고침해도 데이터가 유지된다.
import { ApiError } from "../client";
import type { Weather } from "../../types";

const DB_KEY = "harudonghwa.mock.db.v1";

export interface MockUser {
  id: string;
  email: string;
  password: string;
}

export interface MockChild {
  id: string;
  userId: string;
  name: string;
  birthDate: string | null;
}

export interface MockDiary {
  id: string;
  childId: string;
  date: string;
  text: string;
  weather: Weather | null;
  moodTag: string | null;
  photoIds: string[];
  createdAt: string;
  updatedAt: string;
}

// url은 dataURL이거나, 번들 삽화를 가리키는 "asset:<index>" 형식이다.
export interface MockPhoto {
  id: string;
  userId: string;
  url: string;
}

export interface MockStorybook {
  id: string;
  childId: string;
  periodStart: string;
  periodEnd: string;
  parentMessage: string;
  lessonTag: string | null;
  createdAt: string;
  // 생성 작업이 시작된 시각과 시도 횟수. 재시도하면 갱신된다.
  startedAt: string;
  attempt: number;
}

export interface MockDb {
  users: MockUser[];
  children: MockChild[];
  diaries: MockDiary[];
  photos: MockPhoto[];
  storybooks: MockStorybook[];
}

function emptyDb(): MockDb {
  return { users: [], children: [], diaries: [], photos: [], storybooks: [] };
}

let cache: MockDb | null = null;

export function loadDb(): MockDb {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(DB_KEY);
    cache = raw ? { ...emptyDb(), ...(JSON.parse(raw) as Partial<MockDb>) } : emptyDb();
  } catch {
    cache = emptyDb();
  }
  return cache;
}

export function saveDb(db: MockDb) {
  cache = db;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    throw new ApiError(507, "STORAGE_FULL", "브라우저 저장 공간이 부족해요. 사진 수를 줄여 주세요.");
  }
}

export function resetMockDb() {
  cache = emptyDb();
  try {
    localStorage.removeItem(DB_KEY);
  } catch {
    // 무시
  }
}

export function newId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${random}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
