// fetch 래퍼. 토큰 보관, ApiError 변환, snake_case ↔ camelCase 변환을 담당한다.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const TOKEN_KEY = "harudonghwa.accessToken";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function isApiError(error: unknown, code?: string): error is ApiError {
  return error instanceof ApiError && (code === undefined || error.code === code);
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "잠시 후 다시 시도해 주세요.";
}

// ---------- 토큰 ----------

let memoryToken: string | null = readStoredToken();

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return memoryToken;
}

export function setToken(token: string | null) {
  memoryToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // 저장소를 못 쓰는 환경에서는 메모리에만 둔다.
  }
}

// ---------- 키 변환 ----------

type Json = unknown;

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

function convertKeys(value: Json, convert: (key: string) => string): Json {
  if (Array.isArray(value)) return value.map((v) => convertKeys(v, convert));
  if (value && typeof value === "object" && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [convert(k), convertKeys(v, convert)]),
    );
  }
  return value;
}

export const toCamel = <T>(value: Json): T => convertKeys(value, snakeToCamel) as T;
export const toSnake = (value: Json): Json => convertKeys(value, camelToSnake);

// ---------- 요청 ----------

interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | undefined>;
  auth?: boolean;
}

export async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  { body, query, auth = true }: RequestOptions = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}/api${path}`, window.location.origin);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(toSnake(body)),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "인터넷 연결을 확인해 주세요.");
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (data as { error?: { code?: string; message?: string } } | null)?.error;
    throw new ApiError(
      response.status,
      error?.code ?? `HTTP_${response.status}`,
      error?.message ?? "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  return toCamel<T>(data);
}
