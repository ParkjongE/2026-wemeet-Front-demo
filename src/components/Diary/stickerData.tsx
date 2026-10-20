// 일기 꾸미기 스티커. 흰 테두리가 있는 다이컷 스티커처럼 그린다(viewBox 64x64).
import type { ReactNode } from "react";
import Svg from "./StickerSvg";

const OUTLINE = {
  stroke: "#fff",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
  style: { paintOrder: "stroke" },
};

const STAR_PATH =
  "M32 8 L38.5 23.5 L55 24.8 L42.4 35.6 L46.3 52 L32 43.2 L17.7 52 L21.6 35.6 L9 24.8 L25.5 23.5 Z";

export interface StickerDef {
  label: string;
  render: () => ReactNode;
}

export const STICKERS: Record<string, StickerDef> = {
  heart: {
    label: "하트",
    render: () => (
      <Svg label="하트">
        <path
          {...OUTLINE}
          d="M32 54C13 41 7 31 10.5 21.5 14 12 26 11 32 20.5 38 11 50 12 53.5 21.5 57 31 51 41 32 54Z"
          fill="#e8857a"
        />
        <ellipse cx="21" cy="23" rx="4" ry="2.6" fill="#fff" opacity=".55" transform="rotate(-30 21 23)" />
      </Svg>
    ),
  },
  star: {
    label: "별",
    render: () => (
      <Svg label="별">
        <path {...OUTLINE} d={STAR_PATH} fill="#f2c14e" />
        <circle cx="27" cy="26" r="2.2" fill="#fff" opacity=".6" />
      </Svg>
    ),
  },
  flower: {
    label: "꽃",
    render: () => (
      <Svg label="꽃">
        <g {...OUTLINE}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <circle key={deg} cx="32" cy="18" r="10" fill="#f4a6a0" transform={`rotate(${deg} 32 32)`} />
          ))}
        </g>
        {[0, 72, 144, 216, 288].map((deg) => (
          <circle key={deg} cx="32" cy="18" r="10" fill="#f4a6a0" transform={`rotate(${deg} 32 32)`} />
        ))}
        <circle cx="32" cy="32" r="7.5" fill="#f2c14e" />
        <circle cx="30" cy="30" r="2" fill="#fff" opacity=".6" />
      </Svg>
    ),
  },
  sun: {
    label: "해님",
    render: () => (
      <Svg label="해님">
        <g stroke="#f2a93b" strokeWidth="5" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="32" y1="5" x2="32" y2="12" transform={`rotate(${i * 45} 32 32)`} />
          ))}
        </g>
        <circle {...OUTLINE} cx="32" cy="32" r="15" fill="#f2c14e" />
        <circle cx="26.5" cy="30" r="1.8" fill="#6b4a2b" />
        <circle cx="37.5" cy="30" r="1.8" fill="#6b4a2b" />
        <path d="M27 36c3 3 7 3 10 0" stroke="#6b4a2b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="23.5" cy="35" r="2.5" fill="#f08a6c" opacity=".5" />
        <circle cx="40.5" cy="35" r="2.5" fill="#f08a6c" opacity=".5" />
      </Svg>
    ),
  },
  cloud: {
    label: "구름",
    render: () => (
      <Svg label="구름">
        <path
          {...OUTLINE}
          d="M18 46c-6.5 0-11-4.3-11-9.6 0-5 4-9 9.2-9.4C17.5 19.6 24 14 31.5 14c7.8 0 14.2 5.6 15.3 13 6 .3 10.2 4.4 10.2 9.6 0 5.3-4.5 9.4-10.5 9.4Z"
          fill="#eef7fa"
        />
        <path
          d="M18 46c-6.5 0-11-4.3-11-9.6 0-5 4-9 9.2-9.4C17.5 19.6 24 14 31.5 14c7.8 0 14.2 5.6 15.3 13 6 .3 10.2 4.4 10.2 9.6 0 5.3-4.5 9.4-10.5 9.4Z"
          fill="none"
          stroke="#a5dce8"
          strokeWidth="2"
        />
        <circle cx="25" cy="34" r="1.6" fill="#5c7a86" />
        <circle cx="38" cy="34" r="1.6" fill="#5c7a86" />
        <path d="M29 38c1.5 1.3 3.5 1.3 5 0" stroke="#5c7a86" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </Svg>
    ),
  },
  rainbow: {
    label: "무지개",
    render: () => (
      <Svg label="무지개">
        <g fill="none" strokeLinecap="round">
          <path d="M8 46a24 24 0 0 1 48 0" stroke="#fff" strokeWidth="26" />
          <path d="M10 46a22 22 0 0 1 44 0" stroke="#e8857a" strokeWidth="5" />
          <path d="M15 46a17 17 0 0 1 34 0" stroke="#f2c14e" strokeWidth="5" />
          <path d="M20 46a12 12 0 0 1 24 0" stroke="#8cc5a0" strokeWidth="5" />
          <path d="M25 46a7 7 0 0 1 14 0" stroke="#7db8d8" strokeWidth="5" />
        </g>
        <g fill="#fff" stroke="#d8e9ef" strokeWidth="1.5">
          <ellipse cx="11" cy="48" rx="8" ry="5" />
          <ellipse cx="53" cy="48" rx="8" ry="5" />
        </g>
      </Svg>
    ),
  },
  leaf: {
    label: "은행잎",
    render: () => (
      <Svg label="은행잎">
        <path
          {...OUTLINE}
          d="M32 46C22 44 10 34 10 20c6-3 14-4 22 2 8-6 16-5 22-2 0 14-12 24-22 26Z"
          fill="#e9b949"
        />
        <path d="M32 46v12" stroke="#a87b2c" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 24v20M24 26l7 16M40 26l-7 16" stroke="#c99a35" strokeWidth="1.4" opacity=".6" />
      </Svg>
    ),
  },
  clover: {
    label: "네잎클로버",
    render: () => (
      <Svg label="네잎클로버">
        <g {...OUTLINE} fill="#7fb685">
          {[0, 90, 180, 270].map((deg) => (
            <path
              key={deg}
              d="M32 31c-4-7-12-9-14-3s5 9 14 3Z"
              transform={`rotate(${deg} 32 32)`}
            />
          ))}
        </g>
        <g fill="#7fb685">
          {[0, 90, 180, 270].map((deg) => (
            <path key={deg} d="M32 31c-4-7-12-9-14-3s5 9 14 3Z" transform={`rotate(${deg + 45} 32 32)`} />
          ))}
        </g>
        <path d="M32 33c2 8 5 14 9 20" stroke="#4f8a56" strokeWidth="3" fill="none" strokeLinecap="round" />
      </Svg>
    ),
  },
  strawberry: {
    label: "딸기",
    render: () => (
      <Svg label="딸기">
        <path {...OUTLINE} d="M32 56C18 48 12 36 14 26c2-6 10-8 18-8s16 2 18 8c2 10-4 22-18 30Z" fill="#e35d5b" />
        {[
          [24, 30],
          [32, 28],
          [40, 30],
          [27, 38],
          [37, 38],
          [32, 46],
        ].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.3" ry="2" fill="#fce7a8" />
        ))}
        <path d="M20 20c4 2 8 2 12-2 4 4 8 4 12 2-2 5-7 6-12 4-5 2-10 1-12-4Z" fill="#5fa36b" />
        <path d="M32 18v-7" stroke="#5fa36b" strokeWidth="3" strokeLinecap="round" />
      </Svg>
    ),
  },
  moon: {
    label: "달님",
    render: () => (
      <Svg label="달님">
        <path {...OUTLINE} d="M40 8a24 24 0 1 0 16 38A20 20 0 0 1 40 8Z" fill="#f2d27a" />
        <circle cx="30" cy="34" r="1.8" fill="#6b4a2b" />
        <path d="M24 30c1.5 1.5 3.5 1.5 5 0" stroke="#6b4a2b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="28" cy="40" r="2.4" fill="#f08a6c" opacity=".45" />
      </Svg>
    ),
  },
  crown: {
    label: "왕관",
    render: () => (
      <Svg label="왕관">
        <path {...OUTLINE} d="M10 46 8 20l13 11 11-17 11 17 13-11-2 26Z" fill="#f2c14e" />
        <rect {...OUTLINE} x="10" y="44" width="44" height="8" rx="3" fill="#e9a93b" />
        <circle cx="32" cy="36" r="3.2" fill="#e8857a" />
        <circle cx="20" cy="38" r="2.4" fill="#7db8d8" />
        <circle cx="44" cy="38" r="2.4" fill="#8cc5a0" />
      </Svg>
    ),
  },
  bunny: {
    label: "토끼",
    render: () => (
      <Svg label="토끼">
        <g {...OUTLINE} fill="#fdfaf6">
          <ellipse cx="23" cy="16" rx="6" ry="13" />
          <ellipse cx="41" cy="16" rx="6" ry="13" />
          <ellipse cx="32" cy="40" rx="20" ry="17" />
        </g>
        <ellipse cx="23" cy="16" rx="2.8" ry="8.5" fill="#f6c6c0" />
        <ellipse cx="41" cy="16" rx="2.8" ry="8.5" fill="#f6c6c0" />
        <ellipse cx="32" cy="40" rx="20" ry="17" fill="none" stroke="#e7ddd2" strokeWidth="1.5" />
        <circle cx="25" cy="39" r="2" fill="#4a3d35" />
        <circle cx="39" cy="39" r="2" fill="#4a3d35" />
        <path d="M30 44.5c1 1.2 3 1.2 4 0" stroke="#4a3d35" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="21" cy="45" r="3" fill="#f6c6c0" opacity=".8" />
        <circle cx="43" cy="45" r="3" fill="#f6c6c0" opacity=".8" />
      </Svg>
    ),
  },
  bear: {
    label: "곰",
    render: () => (
      <Svg label="곰">
        <g {...OUTLINE} fill="#c58f5a">
          <circle cx="16" cy="20" r="8" />
          <circle cx="48" cy="20" r="8" />
          <circle cx="32" cy="36" r="20" />
        </g>
        <circle cx="16" cy="20" r="4" fill="#e3b98d" />
        <circle cx="48" cy="20" r="4" fill="#e3b98d" />
        <ellipse cx="32" cy="42" rx="9" ry="7" fill="#f0d4b4" />
        <ellipse cx="32" cy="39" rx="3" ry="2.2" fill="#4a3027" />
        <circle cx="24" cy="32" r="2" fill="#4a3027" />
        <circle cx="40" cy="32" r="2" fill="#4a3027" />
      </Svg>
    ),
  },
  sparkle: {
    label: "반짝",
    render: () => (
      <Svg label="반짝">
        <path {...OUTLINE} d="M28 6c2 14 6 18 20 20-14 2-18 6-20 20-2-14-6-18-20-20 14-2 18-6 20-20Z" fill="#f2c14e" />
        <path {...OUTLINE} d="M50 38c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9Z" fill="#a5dce8" />
      </Svg>
    ),
  },
  ribbon: {
    label: "리본",
    render: () => (
      <Svg label="리본">
        <g {...OUTLINE} fill="#e8a0b4">
          <path d="M32 30 10 18c-4 6-4 18 0 24Z" />
          <path d="M32 30 54 18c4 6 4 18 0 24Z" />
          <path d="M28 34 20 56l7-3 4 6 3-25Z" />
          <path d="M36 34l8 22-7-3-4 6-3-25Z" />
        </g>
        <rect x="27" y="25" width="10" height="11" rx="4" fill="#d8849b" />
      </Svg>
    ),
  },
  "stamp-good": {
    label: "참 잘했어요 도장",
    render: () => (
      <Svg label="참 잘했어요 도장">
        <circle cx="32" cy="32" r="27" fill="#fff" opacity=".7" />
        <circle cx="32" cy="32" r="25" fill="none" stroke="#d6453d" strokeWidth="3" opacity=".85" />
        <circle cx="32" cy="32" r="20.5" fill="none" stroke="#d6453d" strokeWidth="1.2" opacity=".8" />
        <text
          x="32"
          y="29"
          textAnchor="middle"
          fill="#d6453d"
          fontSize="10.5"
          fontWeight="700"
          fontFamily="Gowun Batang, serif"
          opacity=".9"
        >
          참
        </text>
        <text
          x="32"
          y="42"
          textAnchor="middle"
          fill="#d6453d"
          fontSize="9.5"
          fontWeight="700"
          fontFamily="Gowun Batang, serif"
          opacity=".9"
        >
          잘했어요
        </text>
      </Svg>
    ),
  },
  "label-best": {
    label: "최고야 라벨",
    render: () => (
      <Svg label="최고야 라벨">
        <rect {...OUTLINE} x="4" y="18" width="56" height="28" rx="10" fill="#fff1c2" />
        <text x="32" y="38.5" textAnchor="middle" fill="#8b5e34" fontSize="16" fontWeight="700" fontFamily="Gaegu, sans-serif">
          최고야!
        </text>
      </Svg>
    ),
  },
  "label-love": {
    label: "사랑해 라벨",
    render: () => (
      <Svg label="사랑해 라벨">
        <rect {...OUTLINE} x="4" y="18" width="56" height="28" rx="14" fill="#fbd9d5" />
        <text x="32" y="38.5" textAnchor="middle" fill="#b84f4a" fontSize="16" fontWeight="700" fontFamily="Gaegu, sans-serif">
          사랑해
        </text>
      </Svg>
    ),
  },
};

// ---------- 기분 얼굴 ----------

export interface MoodDef {
  tag: string;
  color: string;
  eyes: "dot" | "smile" | "sleepy" | "sparkle";
  mouth: "smile" | "big" | "flat" | "sad";
  extra?: "blush" | "tear" | "zzz" | "brow";
}

export const MOODS: MoodDef[] = [
  { tag: "행복", color: "#f7d58b", eyes: "smile", mouth: "smile", extra: "blush" },
  { tag: "신남", color: "#f6b98f", eyes: "sparkle", mouth: "big", extra: "blush" },
  { tag: "뿌듯", color: "#f2c6a0", eyes: "smile", mouth: "smile", extra: "brow" },
  { tag: "씩씩", color: "#bfe0c4", eyes: "dot", mouth: "big", extra: "brow" },
  { tag: "평온", color: "#cfe7ee", eyes: "smile", mouth: "flat" },
  { tag: "감동", color: "#f4c7cf", eyes: "smile", mouth: "smile", extra: "tear" },
  { tag: "졸림", color: "#dcd6ef", eyes: "sleepy", mouth: "flat", extra: "zzz" },
  { tag: "속상", color: "#d5dde6", eyes: "dot", mouth: "sad", extra: "tear" },
];

export const STICKER_KINDS = Object.keys(STICKERS);
