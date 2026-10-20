// 목업 동화 원고. 실제 서비스에서는 백엔드가 기록과 부모 메시지로 이야기를 만든다.
// 장면마다 삽화 한 장(왼쪽)과 글 한 쪽(오른쪽)이 짝을 이룬다.
import { STORY_LESSON_SLUGS, storyArt, type StorySlug } from "../assets/art";
import type { ChildGender } from "../types";
import { nameForms, type NameForms } from "../utils/korean";

interface StoryTemplate {
  slug: StorySlug;
  title: (p: NameForms) => string;
  pages: (p: NameForms, f: NameForms) => string[];
  questions: (p: NameForms) => string[];
}

const SHARING: StoryTemplate = {
  slug: "sharing",
  title: (p) => `${p.와} 노란 삽`,
  pages: (p, f) => [
    `봄바람이 살랑살랑 부는 아침이었어요.\n${p.는} 엄마 손을 꼭 잡고 아파트 화단으로 향했어요. 손에는 어제 선물 받은 반짝반짝 노란 삽이 들려 있었지요.\n"엄마, 오늘 꽃씨 심는 날 맞지?"`,
    `화단 앞에는 ${f.가} 먼저 와 있었어요. ${f.는} 삽이 없어서 작은 손으로 흙을 파고 있었어요. 손톱 밑까지 흙이 까맣게 묻어 있었지요.\n${p.는} 노란 삽을 가슴에 꼭 안았어요.\n'이건 내 새 삽인데…'`,
    `그런데 ${f.의} 흙투성이 손을 보니 마음 한쪽이 간질간질했어요.\n${p.는} 잠시 머뭇거리다가 삽을 쑥 내밀었어요.\n"우리 같이 쓸래?"\n${f.의} 얼굴이 해님처럼 환해졌어요.`,
    `한 사람은 삽으로 콕콕 구멍을 파고, 한 사람은 꽃씨를 톡톡 넣었어요. 물뿌리개로 쪼르르 물을 주자 흙 속에서 지렁이가 꼼지락 인사를 했어요.\n둘은 배를 잡고 깔깔 웃었어요. 혼자 할 때보다 두 배는 더 신이 났지요.`,
    `며칠 동안 보슬보슬 봄비가 내렸어요.\n${p.와} ${f.는} 우산을 함께 쓰고 화단을 보러 갔어요. 젖은 흙 사이로 연둣빛 새싹이 쏙 고개를 내밀고 있었어요.\n"우리가 심은 거야!"`,
    `몇 주가 지나자 작은 화단에 코스모스와 금잔화가 활짝 피었어요.\n${p.는} ${f.와} 꽃밭 앞에 나란히 앉아 생각했어요. 내 것을 나누었더니 기쁨이 두 배로 커졌다고요.\n노란 삽은 오늘도 꽃밭 옆에서 반짝이고 있답니다.`,
  ],
  questions: (p) => [
    `${p.는} 왜 아끼던 노란 삽을 빌려주었을까?`,
    `친구와 무언가를 나눴을 때 어떤 기분이 들었는지 이야기해 볼까?`,
  ],
};

const COURAGE: StoryTemplate = {
  slug: "courage",
  title: (p) => `${p.와} 구불구불 미끄럼틀`,
  pages: (p) => [
    `노란 은행잎이 하나둘 떨어지는 가을날, 공원에 새 미끄럼틀이 생겼어요. 구불구불 초록색 터널이 하늘 높이 솟아 있었지요.\n${p.는} 미끄럼틀 아래에서 고개를 한껏 젖히고 올려다보았어요. 다리가 조금 후들후들 떨렸어요.`,
    `친구들은 "야호!" 소리치며 쓩쓩 내려왔어요.\n${p.도} 타 보고 싶었지만, 발이 땅에 붙은 것처럼 움직이지 않았어요.\n${p.는} 엄마 바지를 꼭 붙잡고 엄마 뒤로 살짝 숨었어요.`,
    `엄마가 무릎을 굽혀 ${p.와} 눈을 맞췄어요.\n"${p.야}, 무서운 건 부끄러운 게 아니야. 한 칸씩 천천히 올라가 보자. 엄마가 여기서 기다릴게."\n엄마의 따뜻한 손이 ${p.의} 작은 손을 감싸 주었어요.`,
    `${p.는} 사다리를 꼭 잡고 한 칸 올라갔어요. "하나."\n또 한 칸. "둘."\n숨을 크게 들이쉬고 또 한 칸. "셋!"\n아래를 보니 엄마가 두 팔을 벌리고 웃고 있었어요.`,
    `드디어 꼭대기에 도착했어요!\n공원이 한눈에 내려다보였어요. 노란 은행나무, 파란 하늘, 손톱만 한 사람들.\n${p.는} 눈을 꼭 감고 작게 속삭였어요.\n"나는 할 수 있어."`,
    `쓩—! 바람이 머리카락을 간지럽혔어요.\n미끄럼틀 끝에서 엄마 품으로 폭 안기자 웃음이 터져 나왔어요. "엄마, 한 번 더!"\n무서워도 한 걸음 내디딘 그날, ${p.의} 마음은 한 뼘 더 자랐답니다.`,
  ],
  questions: (p) => [
    `${p.는} 무서웠는데도 어떻게 꼭대기까지 올라갔을까?`,
    `요즘 조금 무섭지만 해 보고 싶은 일이 있니?`,
  ],
};

const HONESTY: StoryTemplate = {
  slug: "honesty",
  title: (p) => `${p.와} 파란 고래`,
  pages: (p) => [
    `창밖에 주룩주룩 비가 내리는 오후였어요.\n${p.는} 거실 낮은 탁자에 앉아 물감 놀이를 하고 있었어요. 붓에 파란 물감을 듬뿍 묻혀 커다란 바다를 칠하는 중이었지요.\n너무 열심이라 혀끝이 살짝 나와 있었어요.`,
    `그때였어요. 팔꿈치가 물통을 툭 건드렸어요.\n파란 물이 철퍼덕, 엄마가 아끼는 크림색 러그 위로 쏟아졌어요.\n${p.는} 붓을 든 채 그대로 얼어붙었어요.\n"어떡해…"`,
    `${p.는} 얼른 커다란 방석을 끌어다 얼룩 위에 올려놓았어요. 그리고 그 위에 꼼짝 않고 앉았지요.\n좋아하는 사과도 한 입 먹고 싶지 않았어요. 가슴이 콩닥콩닥, 마음이 무거운 돌처럼 느껴졌어요.`,
    `${p.는} 한참을 망설이다 부엌으로 갔어요. 옷자락을 만지작거리며 엄마를 올려다보았어요.\n"엄마… 사실은요, 제가 물감을 쏟았어요. 방석으로 숨겼어요."\n목소리가 작게 떨렸어요.`,
    `엄마는 ${p.를} 꼭 안아 주었어요.\n"솔직하게 말해 줘서 정말 고마워. 용기 냈구나."\n둘이 함께 걸레로 얼룩을 닦았어요. 그런데 남은 얼룩이 꼭 작은 고래 모양 같았어요. 둘은 마주 보고 웃었어요.`,
    `비가 그친 저녁, ${p.는} 엄마에게 그림 한 장을 선물했어요. 활짝 웃는 커다란 파란 고래였지요.\n솔직하게 말하고 나니 마음이 깃털처럼 가벼워졌어요.\n${p.는} 그 기분을 오래오래 기억하기로 했답니다.`,
  ],
  questions: (p) => [
    `얼룩을 숨기고 있을 때 ${p.의} 마음은 어땠을까?`,
    `솔직하게 말하고 나서 마음이 가벼워졌던 적이 있니?`,
  ],
};

const KINDNESS: StoryTemplate = {
  slug: "kindness",
  title: (p) => `${p.와} 털실 토끼`,
  pages: (p, f) => [
    `월요일 아침, 유치원에 새 친구가 왔어요. 이름은 ${f.plain}.\n${f.는} 털실로 뜬 작은 토끼 인형을 꼭 안고 문 앞에 서 있었어요. 엄마 손을 놓지 못하고 눈만 동그랗게 뜨고 있었지요.\n${p.는} 교실 안에서 그 모습을 가만히 바라보았어요.`,
    `친구들은 삼삼오오 모여 놀기 시작했어요.\n그런데 ${f.는} 구석 매트에 혼자 앉아 토끼 인형만 만지작거렸어요. 아무도 ${f.에게} 말을 걸지 않았어요.\n${p.는} 블록을 쌓다 말고 자꾸만 그쪽을 쳐다보았어요.`,
    `${p.는} 처음 유치원에 왔던 날이 생각났어요. 모든 게 낯설어서 엄마 뒤에 숨었던 날.\n그때 누군가 먼저 손 내밀어 주길 얼마나 바랐는지 몰라요.\n'${f.call}도 지금 그런 마음일까?'`,
    `${p.는} 제일 예쁜 빨간 블록을 들고 ${f.에게} 다가갔어요.\n"나랑 같이 블록 쌓을래? 네 토끼도 같이 놀자."\n${f.는} 깜짝 놀란 얼굴로 ${p.를} 올려다보더니, 작게 고개를 끄덕였어요.`,
    `둘은 힘을 합쳐 높이높이 탑을 쌓았어요. 꼭대기에는 토끼 인형을 살포시 앉혔지요.\n"우와, 토끼 성이다!"\n다른 친구들도 하나둘 모여들었어요. 어느새 ${f.의} 얼굴에도 웃음이 가득했어요.`,
    `하원 시간, ${f.가} 토끼 인형을 흔들며 소리쳤어요.\n"${p.야}, 내일 또 놀자!"\n${p.도} 두 손을 크게 흔들었어요. 친구의 마음을 먼저 헤아려 주는 것, 그건 아주 작은 용기에서 시작된다는 걸 ${p.는} 알게 되었답니다.`,
  ],
  questions: (p) => [
    `${p.는} 혼자 있는 친구를 보고 왜 먼저 다가갔을까?`,
    `새로운 곳에서 낯설었던 적이 있니? 그때 누가 도와주면 좋았을까?`,
  ],
};

const GRIT: StoryTemplate = {
  slug: "grit",
  title: (p) => `${p.의} 빨간 자전거`,
  pages: (p) => [
    `햇살 좋은 토요일, 아빠와 강가 공원에 갔어요.\n아빠가 ${p.의} 빨간 자전거에서 보조 바퀴를 떼어 냈어요. "오늘은 두 바퀴로 달려 볼까?"\n${p.는} 하얀 헬멧을 쓰고 침을 꼴깍 삼켰어요. 설레기도 하고 조금 무섭기도 했어요.`,
    `페달을 밟자 자전거가 휘청휘청 흔들렸어요.\n그러다 그만 꽈당! 풀밭 위로 넘어지고 말았어요.\n무릎이 조금 까져서 따끔했어요. ${p.의} 눈에 눈물이 그렁그렁 맺혔어요.`,
    `${p.는} 풀밭에 털썩 앉아 무릎을 끌어안았어요. "안 탈래. 나는 못 해."\n그때 발밑에서 개미들이 과자 부스러기를 옮기는 게 보였어요. 돌멩이에 걸려 떨어뜨리고, 또 들어 올리고, 또 떨어뜨리고…\n개미들은 포기하지 않았어요.`,
    `${p.는} 슬그머니 일어나 다시 자전거에 올랐어요. 아빠가 뒤에서 안장을 꼭 잡아 주었어요.\n휘청, 다시 휘청. 한 번, 두 번, 열 번…\n해님이 뉘엿뉘엿 기울 때까지 ${p.는} 멈추지 않았어요.`,
    `"아빠, 꼭 잡고 있지?" "그럼!"\n그런데 뒤를 돌아보니 아빠는 저 멀리서 두 팔을 번쩍 들고 있었어요.\n${p.plain} 혼자서 달리고 있었던 거예요! 바람이 쌩쌩, 가슴이 두근두근 뛰었어요.`,
    `노을이 강물을 주황빛으로 물들였어요.\n무릎에 반창고를 붙인 ${p.는} 아빠와 벤치에 앉아 아이스크림을 먹었어요.\n"넘어져도 다시 일어나니까 되더라."\n포기하지 않은 ${p.의} 얼굴이 노을보다 더 환하게 빛났답니다.`,
  ],
  questions: (p) => [
    `${p.는} 개미들을 보고 어떤 생각이 들었을까?`,
    `여러 번 해 보고 결국 해냈던 일이 있니?`,
  ],
};

const TEMPLATES: Record<StorySlug, StoryTemplate> = {
  sharing: SHARING,
  courage: COURAGE,
  honesty: HONESTY,
  kindness: KINDNESS,
  grit: GRIT,
};

// 교훈 태그가 없으면 부모 메시지의 낱말로 가장 가까운 이야기를 고른다.
const KEYWORDS: [StorySlug, RegExp][] = [
  ["honesty", /솔직|정직|거짓|사실대로|숨기/],
  ["courage", /용기|무서|겁|도전|씩씩/],
  ["grit", /포기|끝까지|다시 해|실수|노력|넘어져/],
  ["kindness", /배려|마음을|다정|친절|사과|양보/],
  ["sharing", /나눔|나누|빌려|함께|같이/],
];

export function pickStorySlug(lessonTag: string | null, parentMessage: string): StorySlug {
  if (lessonTag && lessonTag in STORY_LESSON_SLUGS) {
    return STORY_LESSON_SLUGS[lessonTag as keyof typeof STORY_LESSON_SLUGS];
  }
  return KEYWORDS.find(([, pattern]) => pattern.test(parentMessage))?.[0] ?? "sharing";
}

function friendName(protagonist: string, gender: ChildGender): string {
  const preferred = gender === "girl" ? "도윤" : "서아";
  if (protagonist.trim() !== preferred) return preferred;
  return gender === "girl" ? "지호" : "하린";
}

export interface StoryContent {
  title: string;
  coverImageUrl: string;
  pages: { text: string; imageUrl: string }[];
  questions: string[];
}

export function buildStory(
  slug: StorySlug,
  protagonistName: string,
  gender: ChildGender | null,
): StoryContent {
  const g = gender ?? "girl";
  const p = nameForms(protagonistName.trim() || "우리 아이");
  const f = nameForms(friendName(p.plain, g));
  const template = TEMPLATES[slug];
  return {
    title: template.title(p),
    coverImageUrl: storyArt(slug, g, "cover"),
    pages: template.pages(p, f).map((text, i) => ({ text, imageUrl: storyArt(slug, g, i + 1) })),
    questions: template.questions(p),
  };
}

export const STORY_SLUGS = Object.keys(TEMPLATES) as StorySlug[];
