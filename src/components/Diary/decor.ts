import type { DiaryDecoration, PaperTheme, PhotoFrame as FrameStyle } from "../../types";

export const PAPERS: { value: PaperTheme; label: string; className: string }[] = [
  { value: "lined", label: "줄노트", className: "paper-lined" },
  { value: "grid", label: "모눈", className: "paper-grid" },
  { value: "dot", label: "점선", className: "paper-dot" },
  { value: "blossom", label: "꽃잎", className: "paper-blossom" },
  { value: "kraft", label: "크라프트", className: "paper-kraft" },
];

export const FRAMES: { value: FrameStyle; label: string }[] = [
  { value: "polaroid", label: "폴라로이드" },
  { value: "tape", label: "마스킹테이프" },
  { value: "round", label: "동글동글" },
];

export const DEFAULT_DECORATION: DiaryDecoration = { paper: "lined", frame: "polaroid", stickers: [] };

export const paperClass = (paper: PaperTheme) => PAPERS.find((p) => p.value === paper)?.className ?? "paper-lined";

export function formatDiaryDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return {
    year: y,
    month: m,
    day: d,
    weekday: date.toLocaleDateString("ko-KR", { weekday: "long" }),
  };
}

