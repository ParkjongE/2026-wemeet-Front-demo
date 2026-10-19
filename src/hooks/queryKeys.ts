export const queryKeys = {
  me: ["me"] as const,
  diaries: (childId: string) => ["diaries", childId] as const,
  diaryRange: (childId: string, from: string, to: string) =>
    ["diaries", childId, "range", from, to] as const,
  diary: (childId: string, date: string) => ["diaries", childId, "date", date] as const,
  storybooks: (childId: string) => ["storybooks", childId] as const,
  storybook: (id: string) => ["storybook", id] as const,
};
