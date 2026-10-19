// API 함수의 입력 타입 (camelCase). 실제 구현과 목업 구현이 함께 쓴다.
import type { Child, User, Weather } from "../types";

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  user: User;
}

export interface MeResult {
  user: User;
  children: Child[];
}

export interface ChildInput {
  name: string;
  birthDate?: string | null;
}

export interface SaveDiaryInput {
  text: string;
  weather?: Weather | null;
  moodTag?: string | null;
  photoIds: string[];
}

export interface UploadedPhoto {
  photoId: string;
}

export interface CreateStorybookInput {
  periodStart: string;
  periodEnd: string;
  parentMessage: string;
  lessonTag?: string | null;
}
