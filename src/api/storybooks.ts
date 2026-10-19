import type { Storybook, StorybookSummary } from "../types";
import { request } from "./client";
import type { CreateStorybookInput } from "./types";

export const storybooksApi = {
  createStorybook: (childId: string, input: CreateStorybookInput) =>
    request<StorybookSummary>("POST", `/children/${childId}/storybooks`, { body: input }),
  listStorybooks: (childId: string) =>
    request<StorybookSummary[]>("GET", `/children/${childId}/storybooks`),
  getStorybook: (id: string) => request<Storybook>("GET", `/storybooks/${id}`),
  retryStorybook: (id: string) => request<StorybookSummary>("POST", `/storybooks/${id}/retry`),
  deleteStorybook: (id: string) => request<void>("DELETE", `/storybooks/${id}`),
};

export type StorybooksApi = typeof storybooksApi;
