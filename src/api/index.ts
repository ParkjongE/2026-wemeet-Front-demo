// 화면과 훅은 이 파일을 통해서만 API를 쓴다. VITE_USE_MOCK에 따라 실제/목업 구현을 고른다.
import { authApi } from "./auth";
import { childrenApi } from "./children";
import { diariesApi } from "./diaries";
import { storybooksApi } from "./storybooks";
import { uploadsApi } from "./uploads";
import { mockApi } from "./mock";

const realApi = {
  ...authApi,
  ...childrenApi,
  ...diariesApi,
  ...uploadsApi,
  ...storybooksApi,
};

export type Api = typeof realApi;

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const api: Api = USE_MOCK ? mockApi : realApi;

export { DEMO_ACCOUNT } from "./mock/seed";
export { ApiError, errorMessage, getToken, isApiError, setToken } from "./client";
export { PHOTO_LIMITS } from "./uploads";
export type * from "./types";
