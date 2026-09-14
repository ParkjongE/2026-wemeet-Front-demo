import type { Storybook } from "../types";
import { shovelStoryScenes, genericDiaryScenes } from "./illustrations";

export const LESSON_TAGS = ["나눔", "용기", "정직", "배려", "끈기"] as const;

interface LessonTemplate {
  title: (name: string) => string;
  pages: (name: string) => string[];
  images: string[];
}

const SHARING_TEMPLATE: LessonTemplate = {
  title: (name) => `${name}와 노란 삽의 작은 정원`,
  images: shovelStoryScenes,
  pages: (name) => [
    `${name}는 노란 삽을 들고 작은 정원에 갔어요.\n오늘은 꽃씨를 심는 날이었지요.`,
    `옆에 있던 친구는 삽이 없어 흙만 바라보았어요.\n${name}는 노란 삽을 꼭 쥐고 잠시 생각했어요.`,
    `"우리 번갈아 써볼까?"\n${name}가 삽을 내밀자 친구의 얼굴에 웃음꽃이 피었어요.`,
    `한 명은 흙을 파고, 한 명은 꽃씨를 놓았어요.\n작은 정원은 둘의 웃음으로 가득 찼어요.`,
    `며칠 뒤, 두 아이의 정원에 꽃이 활짝 피었어요.\n${name}는 친구와 가장 예쁜 꽃 앞에 나란히 앉았어요.`,
  ],
};

const COURAGE_TEMPLATE: LessonTemplate = {
  title: (name) => `${name}의 씩씩한 하루`,
  images: [genericDiaryScenes[0], genericDiaryScenes[4], genericDiaryScenes[2], genericDiaryScenes[3], genericDiaryScenes[5]],
  pages: (name) => [
    `${name}는 높은 미끄럼틀 앞에서 잠시 멈춰 섰어요.\n조금 무섭기도 했지만 눈을 크게 뜨고 올려다봤어요.`,
    `친구들이 하나둘 신나게 미끄러져 내려가는 모습을 지켜봤어요.\n${name}의 마음도 콩닥콩닥 뛰기 시작했어요.`,
    `${name}는 손잡이를 꼭 잡고 한 걸음 내디뎠어요.\n"할 수 있어" 하고 작게 속삭였지요.`,
    `쓩! 미끄럼틀을 타고 내려오니 생각보다 훨씬 신났어요.\n${name}의 얼굴에 함박웃음이 번졌어요.`,
    `그날 이후로 ${name}는 새로운 것 앞에서도\n한 번은 씩씩하게 도전해보는 어린이가 되었답니다.`,
  ],
};

const HONESTY_TEMPLATE: LessonTemplate = {
  title: (name) => `${name}의 솔직한 마음`,
  images: [genericDiaryScenes[3], genericDiaryScenes[1], genericDiaryScenes[2], genericDiaryScenes[4], genericDiaryScenes[5]],
  pages: (name) => [
    `${name}는 그림을 그리다가 그만 물감을 쏟고 말았어요.\n조그만 얼룩이 카펫에 남았지요.`,
    `혼날까 봐 잠깐 숨기고 싶었지만\n${name}의 마음은 콩닥콩닥 불편했어요.`,
    `${name}는 엄마에게 다가가 사실대로 이야기했어요.\n"제가 물감을 쏟았어요."`,
    `엄마는 화내지 않고 솔직하게 말해줘서\n고맙다며 ${name}를 꼭 안아주었어요.`,
    `그 후로 ${name}는 작은 일에도\n솔직하게 말하는 것이 얼마나 편안한지 알게 되었답니다.`,
  ],
};

const CARE_TEMPLATE: LessonTemplate = {
  title: (name) => `${name}의 다정한 하루`,
  images: [genericDiaryScenes[0], genericDiaryScenes[2], genericDiaryScenes[4], genericDiaryScenes[1], genericDiaryScenes[3]],
  pages: (name) => [
    `놀이터에서 그네를 서로 타고 싶어 하는\n두 친구가 있었어요. ${name}도 그중 하나였지요.`,
    `${name}는 "네가 먼저 타" 하고 살짝 양보했어요.\n친구는 깜짝 놀라며 고마워했어요.`,
    `둘은 번갈아 가며 그네를 타기로 했어요.\n기다리는 시간도 재미있는 이야기로 채웠지요.`,
    `해가 질 때까지 ${name}와 친구는\n번갈아 그네를 타며 깔깔 웃었어요.`,
    `배려하는 마음은 함께 있을 때 더 즐겁다는 것을\n${name}는 오늘 하루 배웠답니다.`,
  ],
};

const PERSEVERANCE_TEMPLATE: LessonTemplate = {
  title: (name) => `${name}의 작은 도전`,
  images: [genericDiaryScenes[5], genericDiaryScenes[3], genericDiaryScenes[0], genericDiaryScenes[2], genericDiaryScenes[4]],
  pages: (name) => [
    `${name}는 혼자 신발끈을 묶어보기로 했어요.\n처음에는 자꾸 매듭이 풀렸지요.`,
    `몇 번이고 다시 해봐도 잘 되지 않았지만\n${name}는 포기하지 않았어요.`,
    `열 번, 스무 번을 다시 묶어도\n${name}의 손은 멈추지 않았어요.`,
    `마침내 매듭이 단단하게 묶였어요!\n${name}는 세상을 다 가진 표정을 지었어요.`,
    `포기하지 않고 끝까지 해내는 마음이\n얼마나 값진지 ${name}는 오늘 배웠답니다.`,
  ],
};

const CUSTOM_TEMPLATE: LessonTemplate = {
  title: (name) => `${name}의 그림동화`,
  images: [genericDiaryScenes[2], genericDiaryScenes[0], genericDiaryScenes[4], genericDiaryScenes[3], genericDiaryScenes[1]],
  pages: (name) => [
    `${name}의 하루하루가 조금씩 쌓여갔어요.\n작은 순간들이 모여 이야기가 되었지요.`,
    `오늘도 ${name}는 새로운 것을 보고\n눈을 반짝이며 하루를 보냈어요.`,
    `${name}의 곁에는 늘 함께 웃어주는\n소중한 사람들이 있었어요.`,
    `크고 작은 하루들이 이어지며\n${name}는 조금씩 자라났어요.`,
    `이 이야기는 ${name}가 전하고 싶은 마음을 담아\n앞으로도 계속 이어질 거예요.`,
  ],
};

const LESSON_TEMPLATES: Record<string, LessonTemplate> = {
  나눔: SHARING_TEMPLATE,
  용기: COURAGE_TEMPLATE,
  정직: HONESTY_TEMPLATE,
  배려: CARE_TEMPLATE,
  끈기: PERSEVERANCE_TEMPLATE,
};

export function generateDummyStorybook(
  lesson: string,
  periodStart: string,
  periodEnd: string,
  protagonistName: string,
): Storybook {
  const name = protagonistName.trim() || "우리 아이";
  const template = LESSON_TEMPLATES[lesson] ?? CUSTOM_TEMPLATE;
  const pageTexts = template.pages(name);

  return {
    id: `storybook-${Date.now()}`,
    title: template.title(name),
    lesson,
    protagonistName: name,
    periodStart,
    periodEnd,
    createdAt: new Date().toISOString(),
    pages: pageTexts.map((text, i) => ({
      text,
      imageUrl: template.images[i % template.images.length],
    })),
  };
}

export const SAMPLE_STORYBOOK = generateDummyStorybook(
  "나눔",
  "2026-09-01",
  "2026-09-13",
  "서아",
);
