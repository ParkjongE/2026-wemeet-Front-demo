import { ApiError, request } from "./client";
import type { UploadedPhoto } from "./types";

export const PHOTO_LIMITS = {
  maxCount: 5,
  maxBytes: 10 * 1024 * 1024,
  contentTypes: ["image/jpeg", "image/png", "image/heic", "image/webp"],
} as const;

interface PresignResult {
  uploadUrl: string;
  photoId: string;
}

export const uploadsApi = {
  // presign으로 업로드 주소를 받은 뒤 S3에 직접 PUT한다.
  uploadPhoto: async (file: File): Promise<UploadedPhoto> => {
    const { uploadUrl, photoId } = await request<PresignResult>("POST", "/uploads/presign", {
      body: { filename: file.name, contentType: file.type, size: file.size },
    });

    let response: Response;
    try {
      response = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
    } catch {
      throw new ApiError(0, "NETWORK_ERROR", "인터넷 연결을 확인해 주세요.");
    }
    if (!response.ok) {
      throw new ApiError(response.status, "UPLOAD_FAILED", "사진을 올리지 못했어요.");
    }
    return { photoId };
  },
};

export type UploadsApi = typeof uploadsApi;
