import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { Minus, Plus, RotateCcw, RotateCw, Trash2 } from "lucide-react";
import type { DiarySticker } from "../../types";
import { STICKERS } from "./stickerData";
import { Sticker } from "./stickers";

interface StickerLayerProps {
  stickers: DiarySticker[];
  editable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onChange?: (stickers: DiarySticker[]) => void;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// 일기 종이 위에 붙은 스티커. 편집 중에는 끌어서 옮기고, 눌러서 크기·각도를 바꾼다.
export default function StickerLayer({ stickers, editable = false, selectedId, onSelect, onChange }: StickerLayerProps) {
  const layer = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number; moved: boolean } | null>(null);

  const update = (id: string, patch: Partial<DiarySticker>) =>
    onChange?.(stickers.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>, sticker: DiarySticker) => {
    if (!editable || !layer.current) return;
    e.stopPropagation();
    const rect = layer.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.width) * 100;
    drag.current = { id: sticker.id, dx: px - sticker.x, dy: py - sticker.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    onSelect?.(sticker.id);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || !layer.current) return;
    const rect = layer.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.width) * 100;
    const maxY = (rect.height / rect.width) * 100 - 1;
    d.moved = true;
    update(d.id, { x: clamp(px - d.dx, 2, 98), y: clamp(py - d.dy, 1, maxY) });
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const selected = stickers.find((s) => s.id === selectedId);

  return (
    <div ref={layer} className="pointer-events-none absolute inset-0 z-20">
      {stickers.map((sticker) => {
        if (!STICKERS[sticker.kind]) return null;
        const isSelected = editable && sticker.id === selectedId;
        const style = {
          left: `${sticker.x}%`,
          // y는 종이 너비 기준(cqw)이라 아래 내용 길이가 달라도 같은 자리에 붙어 있다.
          top: `min(${sticker.y}cqw, calc(100% - 24px))`,
          width: `calc(clamp(44px, 12%, 76px) * ${sticker.scale})`,
          transform: `translate(-50%, -50%) rotate(${sticker.rotate}deg)`,
        };
        return editable ? (
          <button
            key={sticker.id}
            type="button"
            aria-label={`${STICKERS[sticker.kind].label} 스티커 옮기기`}
            onPointerDown={(e) => onPointerDown(e, sticker)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClick={(e) => e.stopPropagation()}
            className={[
              "pointer-events-auto absolute aspect-square cursor-grab touch-none rounded-xl active:cursor-grabbing",
              isSelected ? "outline-2 outline-offset-4 outline-dashed outline-ocean" : "",
            ].join(" ")}
            style={style}
          >
            <Sticker kind={sticker.kind} />
          </button>
        ) : (
          <span key={sticker.id} className="absolute aspect-square" style={style}>
            <Sticker kind={sticker.kind} />
          </span>
        );
      })}

      {editable && selected && (
        <div
          className="pointer-events-auto absolute z-30 flex -translate-x-1/2 items-center gap-0.5 rounded-xl bg-brown px-1 py-1 text-white shadow-lift"
          style={{
            left: `${clamp(selected.x, 18, 82)}%`,
            top: `calc(min(${selected.y}cqw, calc(100% - 24px)) + clamp(34px, 7cqw, 52px) * ${selected.scale})`,
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <ToolButton label="왼쪽으로 돌리기" onClick={() => update(selected.id, { rotate: selected.rotate - 15 })}>
            <RotateCcw size={15} />
          </ToolButton>
          <ToolButton label="오른쪽으로 돌리기" onClick={() => update(selected.id, { rotate: selected.rotate + 15 })}>
            <RotateCw size={15} />
          </ToolButton>
          <ToolButton
            label="작게"
            onClick={() => update(selected.id, { scale: clamp(+(selected.scale - 0.15).toFixed(2), 0.55, 2) })}
          >
            <Minus size={15} />
          </ToolButton>
          <ToolButton
            label="크게"
            onClick={() => update(selected.id, { scale: clamp(+(selected.scale + 0.15).toFixed(2), 0.55, 2) })}
          >
            <Plus size={15} />
          </ToolButton>
          <span className="mx-0.5 h-5 w-px bg-white/20" />
          <ToolButton
            label="스티커 떼기"
            onClick={() => {
              onChange?.(stickers.filter((s) => s.id !== selected.id));
              onSelect?.(null);
            }}
          >
            <Trash2 size={15} />
          </ToolButton>
        </div>
      )}
    </div>
  );
}

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/15"
    >
      {children}
    </button>
  );
}
