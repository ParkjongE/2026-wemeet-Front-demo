import type { AuthApi } from "../auth";
import type { Credentials } from "../types";
import type { Child, User } from "../../types";
import { loadDb, newId, saveDb } from "./db";
import { clone, fail, requireUser, simulateNetwork, tokenForUser } from "./util";
import { ensureDemoAccount } from "./seed";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }: Credentials) {
  if (!EMAIL_PATTERN.test(email)) fail(400, "INVALID_EMAIL", "이메일 형식을 확인해 주세요.");
  if (password.length < 8) fail(400, "WEAK_PASSWORD", "비밀번호는 8자 이상이어야 해요.");
}

const publicUser = (u: { id: string; email: string }): User => ({ id: u.id, email: u.email });

export const mockAuthApi: AuthApi = {
  async signup(input) {
    await simulateNetwork();
    validate(input);
    const db = loadDb();
    const email = input.email.trim().toLowerCase();
    if (db.users.some((u) => u.email === email)) {
      fail(409, "EMAIL_TAKEN", "이미 가입된 이메일이에요.");
    }
    const user = { id: newId("user"), email, password: input.password };
    db.users.push(user);
    saveDb(db);
    return { accessToken: tokenForUser(user.id), user: publicUser(user) };
  },

  async login(input) {
    await simulateNetwork();
    ensureDemoAccount();
    const db = loadDb();
    const email = input.email.trim().toLowerCase();
    const user = db.users.find((u) => u.email === email && u.password === input.password);
    if (!user) fail(401, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 맞지 않아요.");
    return { accessToken: tokenForUser(user.id), user: publicUser(user) };
  },

  async getMe() {
    await simulateNetwork();
    const db = loadDb();
    const user = requireUser(db);
    const children: Child[] = db.children
      .filter((c) => c.userId === user.id)
      .map(({ id, name, birthDate, gender }) => ({ id, name, birthDate, gender: gender ?? null }));
    return clone({ user: publicUser(user), children });
  },
};
