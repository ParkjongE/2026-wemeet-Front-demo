import type { DiaryEntry } from "../types";
import { genericDiaryScenes } from "./illustrations";

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDate(d);
}

interface SeedEntry {
  offset: number;
  text: string;
  moodTag?: string;
  sceneIndex?: number;
  textOnly?: boolean;
}

const seedEntries: SeedEntry[] = [
  {
    offset: 0,
    text: "아침에 일어나자마자 창밖에 무지개가 떴다며 손가락으로 가리켰어요. 오늘 하루도 신나는 일이 가득했으면.",
    moodTag: "신남",
    sceneIndex: 4,
  },
  {
    offset: 1,
    text: "어린이집에서 만든 종이 목걸이를 자랑스럽게 걸고 왔어요. 저녁 내내 목에서 벗지 않으려 했어요.",
    moodTag: "뿌듯",
    sceneIndex: 3,
  },
  {
    offset: 3,
    text: "친구에게 먼저 장난감을 빌려줬어요. 둘이 함께 노는 모습이 참 예뻤어요.",
    moodTag: "나눔",
    sceneIndex: 1,
  },
  {
    offset: 4,
    text: "놀이터에서 넘어졌는데 울지 않고 씩씩하게 일어났어요. 많이 컸구나 싶었어요.",
    moodTag: "용기",
    sceneIndex: 0,
  },
  {
    offset: 6,
    textOnly: true,
    text: "저녁 반찬이 마음에 안 든다고 투정을 부리다가도, 결국 다 먹고 그릇을 싹 비웠어요.",
    moodTag: "평온",
  },
  {
    offset: 8,
    text: "낮잠을 자다 웃으면서 잠꼬대를 했어요. 무슨 꿈을 꾸는지 궁금했어요.",
    moodTag: "행복",
    sceneIndex: 5,
  },
  {
    offset: 10,
    text: "친구랑 다퉜지만 먼저 사과하고 다시 손을 잡았어요. 배려하는 마음이 자라는 것 같아요.",
    moodTag: "배려",
    sceneIndex: 2,
  },
  {
    offset: 12,
    textOnly: true,
    text: "혼자 신발끈을 묶어보겠다고 30분을 씨름했어요. 결국 성공하고 세상 다 가진 표정을 지었어요.",
    moodTag: "끈기",
  },
  {
    offset: 15,
    text: "크레용으로 우리 가족을 그렸다며 그림을 보여줬어요. 다 같이 손을 잡고 있는 그림이었어요.",
    moodTag: "행복",
    sceneIndex: 3,
  },
  {
    offset: 18,
    text: "새로 산 그림책을 밤새 읽어달라고 졸랐어요. 같은 이야기를 세 번이나 다시 읽었어요.",
    moodTag: "평온",
    sceneIndex: 2,
  },
];

export const diaryEntries: DiaryEntry[] = seedEntries.map((entry) => ({
  date: daysAgo(entry.offset),
  text: entry.text,
  moodTag: entry.moodTag,
  imageUrls:
    entry.textOnly || entry.sceneIndex === undefined
      ? []
      : [genericDiaryScenes[entry.sceneIndex % genericDiaryScenes.length]],
}));
