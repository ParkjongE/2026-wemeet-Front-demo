import { PHOTO_LIMITS, type UploadsApi } from "../uploads";
import { loadDb, newId, saveDb } from "./db";
import { fail, requireUser, simulateNetwork } from "./util";

const MAX_EDGE = 1280;

// localStorage 용량을 아끼려고 긴 변 1280px JPEG로 줄인다. 디코딩할 수 없으면(HEIC 등) 원본을 쓴다.
async function toCompactDataUrl(file: File): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}

export const mockUploadsApi: UploadsApi = {
  async uploadPhoto(file) {
    // 1) presign 흉내
    await simulateNetwork();
    const user = requireUser();
    if (!(PHOTO_LIMITS.contentTypes as readonly string[]).includes(file.type)) {
      fail(400, "UNSUPPORTED_PHOTO_TYPE", "JPG, PNG, HEIC, WEBP 사진만 올릴 수 있어요.");
    }
    if (file.size > PHOTO_LIMITS.maxBytes) {
      fail(400, "PHOTO_TOO_LARGE", "사진 한 장은 10MB까지 올릴 수 있어요.");
    }

    // 2) S3 PUT 흉내. 파일 이름에 "fail"이나 "실패"가 들어 있으면 실패한다.
    await simulateNetwork();
    if (/fail|실패/i.test(file.name)) {
      fail(500, "UPLOAD_FAILED", "사진을 올리지 못했어요.");
    }

    const url = await toCompactDataUrl(file);
    const db = loadDb();
    const photoId = newId("photo");
    db.photos.push({ id: photoId, userId: user.id, url });
    saveDb(db);
    return { photoId };
  },
};
