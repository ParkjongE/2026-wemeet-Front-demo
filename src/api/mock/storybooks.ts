import type { StorybooksApi } from "../storybooks";
import type { Storybook, StorybookStatus, StorybookSummary } from "../../types";
import { STORY_PERIOD_MAX_DAYS } from "../../constants/storybook";
import { buildStory, pickStorySlug } from "../../mock/stories";
import { daysBetweenInclusive, todayString } from "../../utils/date";
import { loadDb, newId, nowIso, saveDb, type MockDb, type MockStorybook } from "./db";
import { clone, fail, requireChild, requireUser, simulateNetwork } from "./util";

// 요청 직후 queued → 약 5초 뒤 processing → 약 15초 뒤 completed(또는 failed).
const PROCESSING_AFTER_MS = 5_000;
const FINISHED_AFTER_MS = 15_000;
const FAIL_KEYWORD = "실패테스트";

function statusOf(book: MockStorybook): StorybookStatus {
  const elapsed = Date.now() - new Date(book.startedAt).getTime();
  if (elapsed < PROCESSING_AFTER_MS) return "queued";
  if (elapsed < FINISHED_AFTER_MS) return "processing";
  // 메시지에 실패 키워드가 있으면 첫 시도는 실패하고, 다시 만들기(retry)는 성공한다.
  return book.attempt === 1 && book.parentMessage.includes(FAIL_KEYWORD) ? "failed" : "completed";
}

function finishedAt(book: MockStorybook): string {
  return new Date(new Date(book.startedAt).getTime() + FINISHED_AFTER_MS).toISOString();
}

function contentOf(book: MockStorybook, db: MockDb) {
  const child = db.children.find((c) => c.id === book.childId);
  return buildStory(pickStorySlug(book.lessonTag, book.parentMessage), child?.name ?? "", child?.gender ?? null);
}

function toSummary(book: MockStorybook, db: MockDb): StorybookSummary {
  const status = statusOf(book);
  const content = status === "completed" ? contentOf(book, db) : null;
  return {
    id: book.id,
    childId: book.childId,
    title: content?.title ?? null,
    status,
    periodStart: book.periodStart,
    periodEnd: book.periodEnd,
    parentMessage: book.parentMessage,
    lessonTag: book.lessonTag,
    coverImageUrl: content?.coverImageUrl ?? null,
    createdAt: book.createdAt,
    completedAt: status === "completed" ? finishedAt(book) : null,
  };
}

function toStorybook(book: MockStorybook, db: MockDb): Storybook {
  const summary = toSummary(book, db);
  const content = summary.status === "completed" ? contentOf(book, db) : null;
  return {
    ...summary,
    pages: content?.pages.map((page, i) => ({ pageNo: i + 1, ...page })) ?? [],
    questions: content?.questions ?? [],
    errorMessage:
      summary.status === "failed"
        ? "동화를 만드는 중에 문제가 생겼어요. 다시 만들어 주세요."
        : null,
  };
}

function requireOwnedStorybook(id: string, db: MockDb): MockStorybook {
  const user = requireUser(db);
  const book = db.storybooks.find((b) => b.id === id);
  const owner = book && db.children.find((c) => c.id === book.childId);
  if (!book || owner?.userId !== user.id) {
    fail(404, "STORYBOOK_NOT_FOUND", "동화를 찾을 수 없어요.");
  }
  return book;
}

export const mockStorybooksApi: StorybooksApi = {
  async createStorybook(childId, input) {
    await simulateNetwork();
    const db = loadDb();
    requireChild(childId, db);

    const parentMessage = input.parentMessage.trim();
    if (parentMessage.length < 10 || parentMessage.length > 300) {
      fail(400, "INVALID_PARENT_MESSAGE", "전하고 싶은 메시지는 10~300자로 적어 주세요.");
    }
    const { periodStart, periodEnd } = input;
    if (periodStart > periodEnd) fail(400, "INVALID_PERIOD", "기간을 다시 확인해 주세요.");
    if (periodEnd > todayString()) fail(400, "INVALID_PERIOD", "미래 날짜는 고를 수 없어요.");
    if (daysBetweenInclusive(periodStart, periodEnd) > STORY_PERIOD_MAX_DAYS) {
      fail(400, "PERIOD_TOO_LONG", `기간은 최대 ${STORY_PERIOD_MAX_DAYS}일까지 고를 수 있어요.`);
    }
    const diaryCount = db.diaries.filter(
      (d) => d.childId === childId && d.date >= periodStart && d.date <= periodEnd,
    ).length;
    if (diaryCount < 1) {
      fail(400, "NOT_ENOUGH_DIARIES", "이 기간에는 기록이 없어요. 기록을 먼저 남겨 주세요.");
    }

    const now = nowIso();
    const book: MockStorybook = {
      id: newId("storybook"),
      childId,
      periodStart,
      periodEnd,
      parentMessage,
      lessonTag: input.lessonTag || null,
      createdAt: now,
      startedAt: now,
      attempt: 1,
    };
    db.storybooks.push(book);
    saveDb(db);
    return clone(toSummary(book, db));
  },

  async listStorybooks(childId) {
    await simulateNetwork();
    const db = loadDb();
    requireChild(childId, db);
    return clone(
      db.storybooks
        .filter((b) => b.childId === childId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((b) => toSummary(b, db)),
    );
  },

  async getStorybook(id) {
    await simulateNetwork();
    const db = loadDb();
    return clone(toStorybook(requireOwnedStorybook(id, db), db));
  },

  async retryStorybook(id) {
    await simulateNetwork();
    const db = loadDb();
    const book = requireOwnedStorybook(id, db);
    if (statusOf(book) !== "failed") {
      fail(409, "STORYBOOK_NOT_FAILED", "실패한 동화만 다시 만들 수 있어요.");
    }
    book.attempt += 1;
    book.startedAt = nowIso();
    saveDb(db);
    return clone(toSummary(book, db));
  },

  async deleteStorybook(id) {
    await simulateNetwork();
    const db = loadDb();
    const book = requireOwnedStorybook(id, db);
    db.storybooks = db.storybooks.filter((b) => b !== book);
    saveDb(db);
  },
};
