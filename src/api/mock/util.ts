import { ApiError, getToken } from "../client";
import { genericDiaryScenes } from "../../assets/illustrations";
import type { DiaryEntry } from "../../types";
import { loadDb, type MockChild, type MockDb, type MockDiary, type MockUser } from "./db";

const FAIL_RATE = Number(import.meta.env.VITE_MOCK_FAIL_RATE ?? 0) || 0;

// 실제 네트워크처럼 300~800ms 지연하고, 설정한 비율만큼 실패한다.
export async function simulateNetwork() {
  const delay = 300 + Math.random() * 500;
  await new Promise((resolve) => setTimeout(resolve, delay));
  if (FAIL_RATE > 0 && Math.random() < FAIL_RATE) {
    throw new ApiError(503, "MOCK_RANDOM_FAILURE", "일시적인 오류가 생겼어요. 다시 시도해 주세요.");
  }
}

export function fail(status: number, code: string, message: string): never {
  throw new ApiError(status, code, message);
}

export function tokenForUser(userId: string): string {
  return `mock-token.${userId}`;
}

export function requireUser(db: MockDb = loadDb()): MockUser {
  const token = getToken();
  const userId = token?.startsWith("mock-token.") ? token.slice("mock-token.".length) : null;
  const user = userId ? db.users.find((u) => u.id === userId) : undefined;
  if (!user) fail(401, "UNAUTHORIZED", "로그인이 필요해요.");
  return user;
}

export function requireChild(childId: string, db: MockDb = loadDb()): MockChild {
  const user = requireUser(db);
  const child = db.children.find((c) => c.id === childId && c.userId === user.id);
  if (!child) fail(404, "CHILD_NOT_FOUND", "아이 정보를 찾을 수 없어요.");
  return child;
}

export function resolvePhotoUrl(url: string): string {
  if (url.startsWith("asset:")) {
    const index = Number(url.slice("asset:".length));
    return genericDiaryScenes[index % genericDiaryScenes.length];
  }
  return url;
}

export function toDiaryEntry(diary: MockDiary, db: MockDb = loadDb()): DiaryEntry {
  const { photoIds, ...rest } = diary;
  return {
    ...rest,
    photos: photoIds.flatMap((id) => {
      const photo = db.photos.find((p) => p.id === id);
      return photo ? [{ id: photo.id, url: resolvePhotoUrl(photo.url) }] : [];
    }),
  };
}

// 원본 객체가 캐시에 섞이지 않도록 복사해서 돌려준다.
export function clone<T>(value: T): T {
  return structuredClone(value);
}
