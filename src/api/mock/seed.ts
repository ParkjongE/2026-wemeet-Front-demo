// 목업 모드 체험용 데모 계정. 로그인할 때 없으면 만든다.
import { seedEntries } from "../../mock/diaryEntries";
import { addDays, todayString } from "../../utils/date";
import { loadDb, newId, saveDb, type MockDiary, type MockPhoto } from "./db";

export const DEMO_ACCOUNT = { email: "demo@harudonghwa.app", password: "harudonghwa" } as const;
const DEMO_CHILD_NAME = "서아";

export function ensureDemoAccount() {
  const db = loadDb();
  if (db.users.some((u) => u.email === DEMO_ACCOUNT.email)) return;

  const userId = newId("user");
  const childId = newId("child");
  db.users.push({ id: userId, ...DEMO_ACCOUNT });
  db.children.push({ id: childId, userId, name: DEMO_CHILD_NAME, birthDate: "2021-05-20" });

  const today = todayString();
  for (const seed of seedEntries) {
    const date = addDays(today, -seed.offset);
    const photos: MockPhoto[] =
      seed.textOnly || seed.sceneIndex === undefined
        ? []
        : [{ id: newId("photo"), userId, url: `asset:${seed.sceneIndex}` }];
    db.photos.push(...photos);
    const createdAt = `${date}T21:00:00.000Z`;
    db.diaries.push({
      id: newId("diary"),
      childId,
      date,
      text: seed.text,
      weather: null,
      moodTag: seed.moodTag ?? null,
      photoIds: photos.map((p) => p.id),
      createdAt,
      updatedAt: createdAt,
    } satisfies MockDiary);
  }

  // 이미 완성된 동화 한 권
  const createdAt = new Date(Date.now() - 2 * 86_400_000).toISOString();
  db.storybooks.push({
    id: newId("storybook"),
    childId,
    periodStart: addDays(today, -7),
    periodEnd: addDays(today, -1),
    parentMessage: "친구와 나누면 기쁨이 두 배가 된다는 걸 알려주고 싶어요.",
    lessonTag: "나눔",
    createdAt,
    startedAt: createdAt,
    attempt: 1,
  });

  saveDb(db);
}
