import type { ChildrenApi } from "../children";
import type { Child } from "../../types";
import { loadDb, newId, saveDb, type MockChild } from "./db";
import { fail, requireChild, requireUser, simulateNetwork } from "./util";

const toChild = ({ id, name, birthDate, gender }: MockChild): Child => ({
  id,
  name,
  birthDate,
  gender: gender ?? null,
});

function validateName(name: string) {
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 20) {
    fail(400, "INVALID_CHILD_NAME", "아이 이름은 1~20자로 입력해 주세요.");
  }
  return trimmed;
}

export const mockChildrenApi: ChildrenApi = {
  async createChild(input) {
    await simulateNetwork();
    const db = loadDb();
    const user = requireUser(db);
    if (db.children.some((c) => c.userId === user.id)) {
      fail(409, "CHILD_ALREADY_EXISTS", "지금은 아이 한 명만 등록할 수 있어요.");
    }
    const child: MockChild = {
      id: newId("child"),
      userId: user.id,
      name: validateName(input.name),
      birthDate: input.birthDate || null,
      gender: input.gender ?? null,
    };
    db.children.push(child);
    saveDb(db);
    return toChild(child);
  },

  async updateChild(childId, input) {
    await simulateNetwork();
    const db = loadDb();
    const child = requireChild(childId, db);
    if (input.name !== undefined) child.name = validateName(input.name);
    if (input.birthDate !== undefined) child.birthDate = input.birthDate || null;
    if (input.gender !== undefined) child.gender = input.gender ?? null;
    saveDb(db);
    return toChild(child);
  },
};
