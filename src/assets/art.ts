// 그림 자원 모음. 파일을 glob으로 읽어서, 아직 없는 그림이 있어도 빌드가 깨지지 않게 한다.
import type { ChildGender } from "../types";

const load = (files: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(files).map(([path, url]) => [path.split("/").pop()!.replace(/\.webp$/, ""), url]),
  );

const characterFiles = load(
  import.meta.glob<string>("./characters/*.webp", { eager: true, import: "default" }),
);
const storyFiles = load(import.meta.glob<string>("./story/*.webp", { eager: true, import: "default" }));
const diaryFiles = load(import.meta.glob<string>("./diary/*.webp", { eager: true, import: "default" }));

export const CHARACTER_NAMES: Record<ChildGender, string> = { girl: "서아", boy: "도윤" };

const fullBody = {
  girl: characterFiles["seoa-full"],
  boy: characterFiles["doyun-full"],
};

export const characterArt = {
  girl: {
    full: fullBody.girl,
    portrait: characterFiles["seoa-portrait"] ?? fullBody.girl,
  },
  boy: {
    full: fullBody.boy,
    portrait: characterFiles["doyun-portrait"] ?? fullBody.boy,
  },
};

export const brandArt = {
  hero: characterFiles["hero"] ?? fullBody.girl,
  welcome: characterFiles["welcome"] ?? fullBody.boy,
  emptyDiary: characterFiles["empty-diary"] ?? fullBody.girl,
  emptyLibrary: characterFiles["empty-library"] ?? fullBody.boy,
  makingBook: characterFiles["making-book"] ?? fullBody.girl,
  momReading: characterFiles["mom-reading"] ?? characterFiles["hero"] ?? fullBody.girl,
};

export const STORY_LESSON_SLUGS = {
  나눔: "sharing",
  용기: "courage",
  정직: "honesty",
  배려: "kindness",
  끈기: "grit",
} as const;

export type StorySlug = (typeof STORY_LESSON_SLUGS)[keyof typeof STORY_LESSON_SLUGS];

// 동화 삽화. 해당 성별 그림이 없으면 다른 성별 그림, 그것도 없으면 캐릭터 전신 그림을 쓴다.
export function storyArt(slug: StorySlug, gender: ChildGender, page: number | "cover"): string {
  const other: ChildGender = gender === "girl" ? "boy" : "girl";
  return (
    storyFiles[`${slug}-${gender}-${page}`] ??
    storyFiles[`${slug}-${other}-${page}`] ??
    storyFiles[`${slug}-${gender}-cover`] ??
    fullBody[gender]
  );
}

export const DIARY_PHOTO_KEYS = [
  "rainbow-window",
  "paper-necklace",
  "toy-share",
  "playground-shoes",
  "clean-bowl",
  "nap-blanket",
  "making-up",
  "shoelace",
  "family-drawing",
  "picture-books",
  "sandcastle",
  "leaf-collection",
  "bath-duck",
  "strawberry",
] as const;

export type DiaryPhotoKey = (typeof DIARY_PHOTO_KEYS)[number];

export function diaryPhoto(key: string): string {
  return diaryFiles[key] ?? storyFiles["sharing-girl-cover"] ?? fullBody.girl;
}
