import { useRef, useState } from "react";
import { Check, ImagePlus, LoaderCircle, RotateCcw, TriangleAlert, X } from "lucide-react";
import { PHOTO_LIMITS } from "../../api";
import type { PhotoItem } from "../../hooks/usePhotoUploads";
import type { PhotoFrame as FrameStyle } from "../../types";
import PhotoFrame from "./PhotoFrame";

interface EditablePhotosProps {
  items: PhotoItem[];
  frame: FrameStyle;
  onAdd: (files: File[]) => string[];
  onRemove: (key: string) => void;
  onRetry: (key: string) => void;
  disabled?: boolean;
}

const ACCEPT = [...PHOTO_LIMITS.contentTypes, ".heic"].join(",");

function UploadState({ item }: { item: PhotoItem }) {
  if (item.kind === "saved") return null;
  switch (item.status) {
    case "pending":
      return (
        <span className="absolute inset-x-0 bottom-0 bg-brown/55 py-1 text-center text-[11px] text-white">대기 중</span>
      );
    case "uploading":
      return (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-brown/35 text-[11px] font-medium text-white">
          <LoaderCircle size={20} className="animate-spin" aria-hidden />
          안전하게 올리는 중
        </span>
      );
    case "done":
      return (
        <span className="animate-pop-in absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-forest text-white shadow">
          <Check size={14} aria-label="업로드 완료" />
        </span>
      );
    case "error":
      return null;
  }
}

// 편집 중인 일기 위의 사진들. 고르면 바로 업로드하고, 틀 모양은 꾸미기 설정을 따른다.
export default function EditablePhotos({ items, frame, onAdd, onRemove, onRetry, disabled }: EditablePhotosProps) {
  const input = useRef<HTMLInputElement>(null);
  const [notices, setNotices] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const full = items.length >= PHOTO_LIMITS.maxCount;
  const canAdd = !disabled && !full;

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0 || !canAdd) return;
    setNotices(onAdd(Array.from(files)));
  };

  const addTile = canAdd && (
    <button
      type="button"
      onClick={() => input.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      }}
      className={[
        "flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center transition-colors",
        dragging ? "border-sand bg-sand-light" : "border-brown/15 bg-white/70 hover:border-sand hover:bg-white",
      ].join(" ")}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sand-light text-sand-ink">
        <ImagePlus size={22} aria-hidden />
      </span>
      <span className="text-sm font-semibold text-brown/80">{items.length === 0 ? "오늘의 사진 넣기" : "사진 더하기"}</span>
      <span className="px-2 text-[11px] leading-tight text-brown/45">
        {items.length}/{PHOTO_LIMITS.maxCount}장 · 끌어다 놓아도 돼요
      </span>
    </button>
  );

  return (
    <div className="my-6">
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {items.length === 0 ? (
        <div className="mx-auto max-w-[260px]">{addTile}</div>
      ) : (
        <ul className={`grid gap-5 ${items.length === 1 && !canAdd ? "mx-auto max-w-[62%] grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}>
          {items.map((item, i) => {
            const failed = item.kind === "new" && item.status === "error";
            return (
              <li key={item.key} className="relative">
                <PhotoFrame src={item.url} alt={`사진 ${i + 1}`} frame={frame} index={i}>
                  <UploadState item={item} />
                  {failed && (
                    <button
                      type="button"
                      onClick={() => onRetry(item.key)}
                      disabled={disabled}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-error/80 text-[11px] font-semibold text-white"
                    >
                      <RotateCcw size={18} aria-hidden />
                      다시 올리기
                    </button>
                  )}
                </PhotoFrame>
                <button
                  type="button"
                  onClick={() => onRemove(item.key)}
                  disabled={disabled}
                  aria-label={`사진 ${i + 1} 빼기`}
                  className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brown/70 shadow-card ring-1 ring-black/5 hover:text-error"
                >
                  <X size={16} aria-hidden />
                </button>
                {failed && (
                  <p className="mt-2 flex items-start gap-1 text-[11px] leading-tight text-error">
                    <TriangleAlert size={12} className="mt-px shrink-0" aria-hidden />
                    {item.error}
                  </p>
                )}
              </li>
            );
          })}
          {canAdd && <li>{addTile}</li>}
        </ul>
      )}
      {notices.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1 rounded-2xl bg-error-light px-4 py-2.5 text-xs text-brown">
          {notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
