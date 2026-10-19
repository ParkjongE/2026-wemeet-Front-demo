import { useRef, useState } from "react";
import { Check, ImagePlus, LoaderCircle, RotateCcw, TriangleAlert, X } from "lucide-react";
import { PHOTO_LIMITS } from "../../api";
import type { PhotoItem } from "../../hooks/usePhotoUploads";

interface PhotoUploaderProps {
  items: PhotoItem[];
  onAdd: (files: File[]) => string[];
  onRemove: (key: string) => void;
  onRetry: (key: string) => void;
  disabled?: boolean;
}

const ACCEPT = [...PHOTO_LIMITS.contentTypes, ".heic"].join(",");

function StatusBadge({ item }: { item: PhotoItem }) {
  if (item.kind === "saved") return null;
  switch (item.status) {
    case "pending":
      return (
        <span className="absolute inset-x-0 bottom-0 bg-black/45 py-1 text-center text-[11px] text-white">
          대기 중
        </span>
      );
    case "uploading":
      return (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35 text-[11px] text-white">
          <LoaderCircle size={20} className="animate-spin" aria-hidden />
          올리는 중
        </span>
      );
    case "done":
      return (
        <span className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-mint-deep text-white">
          <Check size={12} aria-label="업로드 완료" />
        </span>
      );
    case "error":
      return null;
  }
}

export default function PhotoUploader({ items, onAdd, onRemove, onRetry, disabled }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);
  const isFull = items.length >= PHOTO_LIMITS.maxCount;
  const canAdd = !disabled && !isFull;

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0 || !canAdd) return;
    setNotices(onAdd(Array.from(files)));
  };

  return (
    <div>
      <div
        onClick={() => canAdd && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (canAdd && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (canAdd) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={canAdd ? 0 : -1}
        aria-disabled={!canAdd}
        className={[
          "flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          !canAdd
            ? "cursor-not-allowed border-hairline bg-white/60 opacity-60"
            : isDragging
              ? "cursor-pointer border-coral bg-coral-light"
              : "cursor-pointer border-mint bg-mint-light",
        ].join(" ")}
      >
        <ImagePlus className="text-gray-500" size={28} aria-hidden />
        <p className="text-sm text-gray-500">
          {isFull
            ? `사진은 ${PHOTO_LIMITS.maxCount}장까지 올릴 수 있어요`
            : "사진을 클릭하거나 끌어다 놓아주세요"}
        </p>
        <p className="text-xs text-gray-400">
          {items.length}/{PHOTO_LIMITS.maxCount}장 · 장당 10MB · JPG, PNG, HEIC, WEBP
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {notices.length > 0 && (
        <ul role="alert" className="mt-2 space-y-1 rounded-xl bg-coral-light/60 px-3 py-2 text-xs text-brown">
          {notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {items.map((item, i) => {
            const failed = item.kind === "new" && item.status === "error";
            return (
              <li key={item.key}>
                <div
                  className={[
                    "relative aspect-square overflow-hidden rounded-lg",
                    failed ? "ring-2 ring-coral-deep" : "",
                  ].join(" ")}
                >
                  <img src={item.url} alt={`사진 ${i + 1}`} className="h-full w-full object-cover" />
                  <StatusBadge item={item} />
                  {failed && (
                    <button
                      type="button"
                      onClick={() => onRetry(item.key)}
                      disabled={disabled}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-coral-deep/70 text-[11px] font-medium text-white"
                    >
                      <RotateCcw size={18} aria-hidden />
                      다시 올리기
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(item.key)}
                    disabled={disabled}
                    aria-label={`사진 ${i + 1} 빼기`}
                    className="absolute right-0 top-0 flex h-11 w-11 items-start justify-end p-1.5"
                  >
                    <span className="rounded-full bg-black/55 p-1 text-white">
                      <X size={14} aria-hidden />
                    </span>
                  </button>
                </div>
                {failed && (
                  <p className="mt-1 flex items-start gap-1 text-[11px] leading-tight text-coral-deep">
                    <TriangleAlert size={12} className="mt-px shrink-0" aria-hidden />
                    {item.error}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
