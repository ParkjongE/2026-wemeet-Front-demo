import type { DiariesApi } from "../diaries";
import { todayString } from "../../utils/date";
import { loadDb, newId, nowIso, saveDb, type MockDiary } from "./db";
import { clone, fail, requireChild, simulateNetwork, toDiaryEntry } from "./util";

export const mockDiariesApi: DiariesApi = {
  async listDiaries(childId, from, to) {
    await simulateNetwork();
    const db = loadDb();
    requireChild(childId, db);
    return clone(
      db.diaries
        .filter((d) => d.childId === childId && d.date >= from && d.date <= to)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((d) => toDiaryEntry(d, db)),
    );
  },

  async getDiary(childId, date) {
    await simulateNetwork();
    const db = loadDb();
    requireChild(childId, db);
    const diary = db.diaries.find((d) => d.childId === childId && d.date === date);
    return diary ? clone(toDiaryEntry(diary, db)) : null;
  },

  async saveDiary(childId, date, input) {
    await simulateNetwork();
    const db = loadDb();
    const child = requireChild(childId, db);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(400, "INVALID_DATE", "날짜 형식이 올바르지 않아요.");
    if (date > todayString()) fail(400, "FUTURE_DATE", "미래 날짜에는 기록할 수 없어요.");
    const text = input.text.trim();
    if (!text && input.photoIds.length === 0) {
      fail(400, "EMPTY_DIARY", "사진이나 글 중 하나는 남겨 주세요.");
    }
    if (text.length > 1000) fail(400, "DIARY_TOO_LONG", "기록은 1000자까지 쓸 수 있어요.");
    if (input.photoIds.length > 5) fail(400, "TOO_MANY_PHOTOS", "사진은 5장까지 올릴 수 있어요.");
    for (const photoId of input.photoIds) {
      if (!db.photos.some((p) => p.id === photoId && p.userId === child.userId)) {
        fail(400, "PHOTO_NOT_FOUND", "올리지 않은 사진이 포함되어 있어요. 사진을 다시 올려 주세요.");
      }
    }

    const now = nowIso();
    let diary = db.diaries.find((d) => d.childId === childId && d.date === date);
    if (diary) {
      // 기록에서 빠진 사진은 함께 지운다.
      const removed = diary.photoIds.filter((id) => !input.photoIds.includes(id));
      db.photos = db.photos.filter((p) => !removed.includes(p.id));
      Object.assign(diary, {
        text,
        weather: input.weather ?? null,
        moodTag: input.moodTag ?? null,
        photoIds: [...input.photoIds],
        updatedAt: now,
      });
    } else {
      diary = {
        id: newId("diary"),
        childId,
        date,
        text,
        weather: input.weather ?? null,
        moodTag: input.moodTag ?? null,
        photoIds: [...input.photoIds],
        createdAt: now,
        updatedAt: now,
      } satisfies MockDiary;
      db.diaries.push(diary);
    }
    saveDb(db);
    return clone(toDiaryEntry(diary, db));
  },

  async deleteDiary(childId, date) {
    await simulateNetwork();
    const db = loadDb();
    requireChild(childId, db);
    const diary = db.diaries.find((d) => d.childId === childId && d.date === date);
    if (!diary) fail(404, "DIARY_NOT_FOUND", "이 날의 기록을 찾을 수 없어요.");
    db.photos = db.photos.filter((p) => !diary.photoIds.includes(p.id));
    db.diaries = db.diaries.filter((d) => d !== diary);
    saveDb(db);
  },
};
