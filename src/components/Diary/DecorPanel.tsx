import { useState } from "react";
import type { DiaryDecoration } from "../../types";
import { FRAMES, PAPERS } from "./decor";
import { STICKER_KINDS, STICKERS } from "./stickerData";
import { Sticker } from "./stickers";

type Tab = "sticker" | "paper" | "frame";

const TABS: { value: Tab; label: string }[] = [
  { value: "sticker", label: "스티커" },
  { value: "paper", label: "종이" },
  { value: "frame", label: "사진 틀" },
];

interface DecorPanelProps {
  decoration: DiaryDecoration;
  onAddSticker: (kind: string) => void;
  onChange: (patch: Partial<DiaryDecoration>) => void;
}

function FramePreview({ value }: { value: DiaryDecoration["frame"] }) {
  if (value === "round") {
    return <span className="block h-9 w-9 rounded-full bg-ocean-soft ring-[3px] ring-white shadow-sm" />;
  }
  if (value === "tape") {
    return (
      <span className="relative block h-8 w-10 rotate-[-4deg] rounded-[2px] bg-ocean-soft shadow-sm">
        <span className="washi absolute -top-1.5 left-1/2 h-2.5 w-6 -translate-x-1/2 bg-sand-soft" />
      </span>
    );
  }
  return (
    <span className="block rotate-3 bg-white p-[3px] pb-[9px] shadow-sm ring-1 ring-black/5">
      <span className="block h-7 w-7 bg-ocean-soft" />
    </span>
  );
}

// 일기 꾸미기 도구: 스티커 붙이기, 종이 고르기, 사진 틀 고르기
export default function DecorPanel({ decoration, onAddSticker, onChange }: DecorPanelProps) {
  const [tab, setTab] = useState<Tab>("sticker");

  return (
    <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-hairline/70">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-brown">꾸미기</p>
        <p className="text-xs text-brown/45">마음껏 꾸며도 언제든 바꿀 수 있어요</p>
      </div>
      <div role="tablist" aria-label="꾸미기 도구" className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-sand-light p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={[
              "min-h-10 rounded-xl text-sm font-semibold transition-colors",
              tab === t.value ? "bg-white text-brown shadow-sm" : "text-brown/55 hover:text-brown",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4" role="tabpanel">
        {tab === "sticker" && (
          <>
            <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
              {STICKER_KINDS.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => onAddSticker(kind)}
                  aria-label={`${STICKERS[kind].label} 스티커 붙이기`}
                  title={STICKERS[kind].label}
                  className="flex aspect-square items-center justify-center rounded-2xl p-1.5 transition-transform hover:scale-110 hover:bg-sand-light active:scale-95"
                >
                  <Sticker kind={kind} className="h-full w-full" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-brown/50">
              누르면 일기에 붙어요. 붙인 스티커는 끌어서 옮기고, 한 번 눌러 돌리거나 크기를 바꿀 수 있어요.
            </p>
          </>
        )}

        {tab === "paper" && (
          <div className="grid grid-cols-5 gap-2">
            {PAPERS.map((paper) => {
              const active = decoration.paper === paper.value;
              return (
                <button
                  key={paper.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ paper: paper.value })}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={[
                      "block aspect-[3/4] w-full rounded-xl ring-1 ring-black/10 transition-all",
                      paper.className,
                      active ? "ring-[3px] ring-sand" : "hover:ring-sand/60",
                    ].join(" ")}
                  />
                  <span className={`text-[11px] ${active ? "font-semibold text-brown" : "text-brown/55"}`}>{paper.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {tab === "frame" && (
          <div className="grid grid-cols-3 gap-2">
            {FRAMES.map((frame) => {
              const active = decoration.frame === frame.value;
              return (
                <button
                  key={frame.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ frame: frame.value })}
                  className={[
                    "flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-colors",
                    active ? "border-sand bg-sand-light" : "border-transparent bg-canvas hover:bg-sand-light/60",
                  ].join(" ")}
                >
                  <FramePreview value={frame.value} />
                  <span className={`text-xs ${active ? "font-semibold text-brown" : "text-brown/60"}`}>{frame.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
