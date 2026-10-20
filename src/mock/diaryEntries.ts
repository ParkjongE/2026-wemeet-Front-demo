// 데모 계정과 소개 페이지에서 쓰는 예시 기록. 실제 부모가 쓴 것 같은 말투로 적었다.
import { diaryPhoto, type DiaryPhotoKey } from "../assets/art";
import type { DiaryDecoration, DiaryEntry, Weather } from "../types";
import { addDays, todayString } from "../utils/date";

type SeedSticker = [kind: string, x: number, y: number, rotate?: number, scale?: number];

export interface SeedEntry {
  offset: number;
  text: string;
  weather: Weather | null;
  moodTag: string | null;
  photos: DiaryPhotoKey[];
  paper: DiaryDecoration["paper"];
  frame: DiaryDecoration["frame"];
  stickers: SeedSticker[];
}

export const seedEntries: SeedEntry[] = [
  {
    offset: 1,
    text: "비 그친 오후, 창밖에 무지개가 떴다며 소리를 질렀다. 손가락으로 유리창에 무지개를 따라 그리면서 '빨주노초파남보'를 세 번이나 외웠다. 어린이집에서 배웠단다.",
    weather: "cloudy",
    moodTag: "신남",
    photos: ["rainbow-window"],
    paper: "lined",
    frame: "polaroid",
    stickers: [
      ["rainbow", 82, 9, 8, 1.1],
      ["sparkle", 10, 52, -10],
    ],
  },
  {
    offset: 2,
    text: "어린이집에서 만든 종이 목걸이를 걸고 하원했다. 저녁 먹을 때도, 씻을 때도 안 벗겠다고 해서 결국 머리맡에 걸어두고 재웠다. 별 모양은 엄마 거란다.",
    weather: "sunny",
    moodTag: "뿌듯",
    photos: ["paper-necklace"],
    paper: "dot",
    frame: "tape",
    stickers: [
      ["stamp-good", 80, 50, -12, 1.1],
      ["star", 12, 8, 10],
    ],
  },
  {
    offset: 3,
    text: "놀이터에서 만난 도윤이에게 아끼는 나무 자동차를 먼저 빌려줬다. 예전엔 '내 거야!'부터 외쳤는데. 둘이 번갈아 굴리며 해 질 때까지 놀았다. 집에 오는 길에 '나눠 주니까 더 재밌었어' 한다.",
    weather: "sunny",
    moodTag: "행복",
    photos: ["toy-share", "sandcastle"],
    paper: "blossom",
    frame: "polaroid",
    stickers: [
      ["heart", 86, 6, 12],
      ["clover", 8, 56, -8],
    ],
  },
  {
    offset: 5,
    text: "미끄럼틀 계단에서 미끄러져 넘어졌는데, 울먹이다가 '괜찮아, 나 씩씩해' 하고 혼자 일어났다. 신발 속 모래를 털어주는데 괜히 내가 울컥했다.",
    weather: "sunny",
    moodTag: "씩씩",
    photos: ["playground-shoes"],
    paper: "grid",
    frame: "round",
    stickers: [
      ["label-best", 76, 12, 6],
      ["sun", 12, 6, 0, 0.9],
    ],
  },
  {
    offset: 6,
    text: "저녁 반찬이 마음에 안 든다고 입을 삐죽 내밀더니, 할머니 계란말이 얘기에 금세 풀려서 한 그릇을 싹 비웠다. 단순해서 고마운 다섯 살.",
    weather: null,
    moodTag: "평온",
    photos: ["clean-bowl"],
    paper: "kraft",
    frame: "tape",
    stickers: [["stamp-good", 84, 54, -8]],
  },
  {
    offset: 7,
    text: "낮잠 자다가 키득키득 웃으며 잠꼬대를 했다. '토끼야 기다려~' 무슨 꿈을 꾸는 걸까. 이불 밖으로 나온 손이 아직도 이렇게 작다.",
    weather: "cloudy",
    moodTag: "졸림",
    photos: ["nap-blanket"],
    paper: "lined",
    frame: "polaroid",
    stickers: [
      ["bunny", 84, 8, 10],
      ["cloud", 8, 50, 0, 0.9],
    ],
  },
  {
    offset: 9,
    text: "어린이집에서 친구랑 다퉜다고 시무룩해 있더니, 다음 날 먼저 '어제 미안해' 했단다. 선생님이 보내주신 사진 속 둘은 손을 꼭 잡고 걷고 있었다.",
    weather: "sunny",
    moodTag: "감동",
    photos: ["making-up"],
    paper: "blossom",
    frame: "tape",
    stickers: [
      ["heart", 86, 10, -8],
      ["ribbon", 10, 6, 12],
    ],
  },
  {
    offset: 10,
    text: "혼자 신발끈을 묶겠다고 현관에 쪼그려 앉아 20분을 씨름했다. 도와줄까 했더니 '내가 할 거야!' 결국 삐뚤빼뚤 리본 하나를 완성하고는 세상 다 가진 표정.",
    weather: null,
    moodTag: "뿌듯",
    photos: ["shoelace"],
    paper: "grid",
    frame: "round",
    stickers: [
      ["stamp-good", 80, 48, 10],
      ["star", 14, 8, -6],
    ],
  },
  {
    offset: 12,
    text: "크레파스로 우리 가족을 그렸다며 냉장고에 붙여달란다. 아빠 머리카락은 세 가닥, 엄마는 웃는 입이 얼굴만 하다. 다 같이 손을 잡고 있어서 마음이 몽글했다.",
    weather: "sunny",
    moodTag: "행복",
    photos: ["family-drawing"],
    paper: "dot",
    frame: "polaroid",
    stickers: [
      ["label-love", 74, 10, -6],
      ["sun", 10, 52, 0],
    ],
  },
  {
    offset: 13,
    text: "새로 산 그림책을 자기 전에 세 번이나 읽어달라고 했다. 세 번째에는 내가 읽기도 전에 다음 문장을 먼저 말한다. 벌써 외워버렸네.",
    weather: "cloudy",
    moodTag: "평온",
    photos: ["picture-books"],
    paper: "lined",
    frame: "tape",
    stickers: [
      ["moon", 86, 8, 8],
      ["star", 76, 18, -10, 0.7],
    ],
  },
  {
    offset: 15,
    text: "모래밭에서 모래성 만들기. 자꾸 무너져도 '다시 하면 돼'를 반복하더니 기어이 탑 세 개짜리 성을 만들었다. 노란 삽은 도윤이랑 번갈아 썼다.",
    weather: "sunny",
    moodTag: "신남",
    photos: ["sandcastle", "playground-shoes"],
    paper: "kraft",
    frame: "polaroid",
    stickers: [
      ["crown", 84, 6, 10],
      ["flower", 8, 54, -6],
    ],
  },
  {
    offset: 16,
    text: "오늘은 사진이 없다. 퇴근이 늦어 잠든 얼굴만 봤다. 아빠 말로는 저녁 내내 '엄마 언제 와?'를 열 번은 물었다고. 내일은 꼭 일찍 와야지.",
    weather: "rainy",
    moodTag: "평온",
    photos: [],
    paper: "lined",
    frame: "polaroid",
    stickers: [["heart", 88, 70, 8, 0.9]],
  },
  {
    offset: 18,
    text: "산책길에 주운 은행잎이랑 단풍잎을 거실 바닥에 줄 세웠다. 제일 노란 잎은 엄마 거, 빨간 잎은 아빠 거, 제일 작은 잎은 자기 거란다.",
    weather: "sunny",
    moodTag: "행복",
    photos: ["leaf-collection"],
    paper: "dot",
    frame: "round",
    stickers: [
      ["leaf", 84, 8, 14],
      ["leaf", 10, 56, -20, 0.8],
    ],
  },
  {
    offset: 19,
    text: "목욕하면서 오리 인형한테 노래를 불러줬다. '오리야 너도 씻어야 감기 안 걸려.' 내가 매일 하는 말을 그대로 따라 한다.",
    weather: null,
    moodTag: "신남",
    photos: ["bath-duck"],
    paper: "grid",
    frame: "polaroid",
    stickers: [
      ["sparkle", 84, 10, 0],
      ["cloud", 10, 54, 0, 0.8],
    ],
  },
  {
    offset: 21,
    text: "딸기를 들고 와서 '엄마 제일 큰 거 줄게' 했다. 자기 입에 넣기 직전이었으면서. 결국 반으로 나눠 먹었다.",
    weather: "sunny",
    moodTag: "행복",
    photos: ["strawberry"],
    paper: "blossom",
    frame: "tape",
    stickers: [
      ["strawberry", 84, 8, 12],
      ["heart", 12, 54, -10, 0.8],
    ],
  },
  {
    offset: 22,
    text: "처음으로 혼자 화장실 불을 끄고 나왔다. 어두운 게 무섭다던 아이가 '이제 안 무서워' 하고 어깨를 으쓱. 별것 아닌 것 같아도 우리 집 오늘의 큰 사건.",
    weather: "cloudy",
    moodTag: "씩씩",
    photos: [],
    paper: "dot",
    frame: "polaroid",
    stickers: [["label-best", 72, 74, -6]],
  },
  {
    offset: 24,
    text: "도서관에서 그림책 다섯 권을 빌려왔다. 고르는 데만 30분. 표지에 고양이가 있는 책은 무조건 담는다.",
    weather: "sunny",
    moodTag: "신남",
    photos: ["picture-books"],
    paper: "kraft",
    frame: "round",
    stickers: [["star", 86, 8, 8]],
  },
  {
    offset: 26,
    text: "처음 먹어보는 버섯을 '딱 한 입만'에 성공. 표정은 영 별로였지만 칭찬 도장을 받고는 두 번째도 먹었다.",
    weather: null,
    moodTag: "뿌듯",
    photos: ["clean-bowl"],
    paper: "grid",
    frame: "tape",
    stickers: [["stamp-good", 82, 50, 12]],
  },
  {
    offset: 28,
    text: "열이 올라 하루 종일 안겨 있었다. 아픈 와중에도 '엄마 힘들지?' 하고 내 볼을 쓰다듬는다. 빨리 낫자, 우리 딸.",
    weather: "rainy",
    moodTag: "속상",
    photos: [],
    paper: "lined",
    frame: "polaroid",
    stickers: [["heart", 86, 72, 10]],
  },
  {
    offset: 30,
    text: "열이 내리고 다시 개구쟁이로 돌아왔다. 이불로 동굴을 만들고 토끼 인형이랑 캠핑 중이란다. 돌아와서 고마워.",
    weather: "sunny",
    moodTag: "신남",
    photos: ["nap-blanket"],
    paper: "blossom",
    frame: "round",
    stickers: [
      ["bunny", 84, 8, -8],
      ["sparkle", 12, 54, 6],
    ],
  },
  {
    offset: 33,
    text: "할머니 댁 다녀온 날. 할머니 손을 잡고 '할머니 손은 왜 쭈글쭈글해?' 해서 다 같이 웃었다. '서아 키우느라 그렇지' 하시니 한참을 손등을 쓰다듬어 드렸다.",
    weather: "cloudy",
    moodTag: "감동",
    photos: [],
    paper: "kraft",
    frame: "polaroid",
    stickers: [
      ["flower", 86, 70, 10],
      ["label-love", 14, 74, -6],
    ],
  },
  {
    offset: 36,
    text: "킥보드를 처음 탔다. 세 번 넘어지고 네 번째에 혼자 앞으로 쭉. '엄마 봤어? 봤어?'를 스무 번은 들은 것 같다.",
    weather: "sunny",
    moodTag: "씩씩",
    photos: ["playground-shoes"],
    paper: "dot",
    frame: "tape",
    stickers: [["label-best", 76, 10, 8]],
  },
];

let stickerSeq = 0;
export function seedDecoration(entry: SeedEntry): DiaryDecoration {
  return {
    paper: entry.paper,
    frame: entry.frame,
    // 위쪽에 붙인 스티커는 날짜와 날씨 사이 빈 곳으로 옮겨 머리말을 가리지 않게 한다.
    stickers: entry.stickers.map(([kind, x, y, rotate = 0, scale = 1]) => ({
      id: `seed-sticker-${++stickerSeq}`,
      kind,
      x: y < 20 ? (x > 50 ? 60 : 46) : x,
      y: y < 20 ? 9 : y,
      rotate,
      scale,
    })),
  };
}

// 소개 페이지 캘린더에 보여줄 예시 기록 (API와 같은 모양)
export function buildExampleEntries(): DiaryEntry[] {
  const today = todayString();
  return seedEntries.map((entry, i) => ({
    id: `example-${i}`,
    childId: "example",
    date: addDays(today, -entry.offset),
    text: entry.text,
    weather: entry.weather,
    moodTag: entry.moodTag,
    photos: entry.photos.map((key, j) => ({ id: `example-photo-${i}-${j}`, url: diaryPhoto(key) })),
    decoration: seedDecoration(entry),
    createdAt: "",
    updatedAt: "",
  }));
}
