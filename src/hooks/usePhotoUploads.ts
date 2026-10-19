import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTO_LIMITS, api, errorMessage } from "../api";
import type { DiaryPhoto } from "../types";

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export type PhotoItem =
  | { key: string; kind: "saved"; photoId: string; url: string }
  | {
      key: string;
      kind: "new";
      file: File;
      url: string; // 미리보기 objectURL
      status: UploadStatus;
      photoId: string | null;
      error: string | null;
    };

const MAX_CONCURRENT_UPLOADS = 2;
let keySeq = 0;
const nextKey = () => `photo-item-${++keySeq}`;

function fromSaved(photos: DiaryPhoto[]): PhotoItem[] {
  return photos.map((p) => ({ key: nextKey(), kind: "saved", photoId: p.id, url: p.url }));
}

// 브라우저에 따라 HEIC 파일의 type이 비어 있어서 확장자로 보완한다.
function contentTypeOf(file: File): string {
  if (file.type) return file.type;
  return /\.heic$/i.test(file.name) ? "image/heic" : "";
}

function revoke(item: PhotoItem) {
  if (item.kind === "new") URL.revokeObjectURL(item.url);
}

// 사진을 고르면 바로 업로드를 시작한다(동시에 2장). 저장할 때는 photoIds만 보내면 된다.
export function usePhotoUploads(initialPhotos: DiaryPhoto[]) {
  const [items, setItems] = useState<PhotoItem[]>(() => fromSaved(initialPhotos));
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // 업로드 대기열. 렌더링과 무관해서 ref로 관리한다.
  const queueRef = useRef<{ key: string; file: File }[]>([]);
  const activeRef = useRef(0);

  const update = useCallback((key: string, patch: Partial<Extract<PhotoItem, { kind: "new" }>>) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key && item.kind === "new" ? { ...item, ...patch } : item)),
    );
  }, []);

  const pump = useCallback(
    function startQueuedUploads() {
      while (activeRef.current < MAX_CONCURRENT_UPLOADS && queueRef.current.length > 0) {
        const { key, file } = queueRef.current.shift()!;
        activeRef.current += 1;
        update(key, { status: "uploading", error: null });
        api
          .uploadPhoto(file)
          .then(({ photoId }) => update(key, { status: "done", photoId }))
          .catch((error: unknown) => update(key, { status: "error", error: errorMessage(error) }))
          .finally(() => {
            activeRef.current -= 1;
            startQueuedUploads();
          });
      }
    },
    [update],
  );

  // 화면을 떠나면 대기열을 비우고 미리보기 URL을 정리한다.
  useEffect(
    () => () => {
      queueRef.current = [];
      itemsRef.current.forEach(revoke);
    },
    [],
  );

  // 제한을 넘는 파일은 올리지 않고 안내 문구를 돌려준다.
  const add = useCallback((files: File[]): string[] => {
    const notices: string[] = [];
    const accepted: PhotoItem[] = [];
    let remaining = PHOTO_LIMITS.maxCount - itemsRef.current.length;

    for (const file of files) {
      const type = contentTypeOf(file);
      if (!(PHOTO_LIMITS.contentTypes as readonly string[]).includes(type)) {
        notices.push(`${file.name}: JPG, PNG, HEIC, WEBP 사진만 올릴 수 있어요.`);
      } else if (file.size > PHOTO_LIMITS.maxBytes) {
        notices.push(`${file.name}: 사진 한 장은 10MB까지 올릴 수 있어요.`);
      } else if (remaining <= 0) {
        notices.push(`사진은 ${PHOTO_LIMITS.maxCount}장까지 올릴 수 있어요.`);
        break;
      } else {
        const typed = file.type ? file : new File([file], file.name, { type });
        accepted.push({
          key: nextKey(),
          kind: "new",
          file: typed,
          url: URL.createObjectURL(typed),
          status: "pending",
          photoId: null,
          error: null,
        });
        remaining -= 1;
      }
    }

    if (accepted.length > 0) {
      setItems((prev) => [...prev, ...accepted]);
      for (const item of accepted) {
        if (item.kind === "new") queueRef.current.push({ key: item.key, file: item.file });
      }
      pump();
    }
    return notices;
  }, [pump]);

  const remove = useCallback((key: string) => {
    queueRef.current = queueRef.current.filter((q) => q.key !== key);
    setItems((prev) => {
      const target = prev.find((i) => i.key === key);
      if (target) revoke(target);
      return prev.filter((i) => i.key !== key);
    });
  }, []);

  const retry = useCallback(
    (key: string) => {
      const item = itemsRef.current.find((i) => i.key === key);
      if (item?.kind !== "new" || item.status !== "error") return;
      update(key, { status: "pending", error: null });
      queueRef.current.push({ key, file: item.file });
      pump();
    },
    [pump, update],
  );

  const reset = useCallback((photos: DiaryPhoto[]) => {
    queueRef.current = [];
    itemsRef.current.forEach(revoke);
    setItems(fromSaved(photos));
  }, []);

  const isUploading = items.some((i) => i.kind === "new" && (i.status === "pending" || i.status === "uploading"));
  const hasFailed = items.some((i) => i.kind === "new" && i.status === "error");
  const photoIds = items.flatMap((i) => (i.kind === "saved" ? [i.photoId] : i.photoId ? [i.photoId] : []));
  const hasNew = items.some((i) => i.kind === "new");

  return { items, add, remove, retry, reset, isUploading, hasFailed, photoIds, hasNew };
}
