import type { Child } from "../types";
import { request } from "./client";
import type { ChildInput } from "./types";

export const childrenApi = {
  createChild: (input: ChildInput) => request<Child>("POST", "/children", { body: input }),
  updateChild: (childId: string, input: Partial<ChildInput>) =>
    request<Child>("PATCH", `/children/${childId}`, { body: input }),
};

export type ChildrenApi = typeof childrenApi;
