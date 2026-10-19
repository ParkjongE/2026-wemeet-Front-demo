import { request } from "./client";
import type { AuthResult, Credentials, MeResult } from "./types";

export const authApi = {
  signup: (input: Credentials) =>
    request<AuthResult>("POST", "/auth/signup", { body: input, auth: false }),
  login: (input: Credentials) =>
    request<AuthResult>("POST", "/auth/login", { body: input, auth: false }),
  getMe: () => request<MeResult>("GET", "/me"),
};

export type AuthApi = typeof authApi;
