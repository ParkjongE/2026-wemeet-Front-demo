import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type CreateStorybookInput } from "../api";
import type { Storybook, StorybookStatus } from "../types";
import { queryKeys } from "./queryKeys";

const isInProgress = (status: StorybookStatus) => status === "queued" || status === "processing";

export function useStorybooks(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.storybooks(childId ?? ""),
    queryFn: () => api.listStorybooks(childId!),
    enabled: !!childId,
    // 만드는 중인 동화가 있으면 10초마다 다시 조회한다.
    refetchInterval: (query) =>
      query.state.data?.some((book) => isInProgress(book.status)) ? 10_000 : false,
  });
}

export function useStorybook(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: queryKeys.storybook(id ?? ""),
    queryFn: async () => {
      const previous = queryClient.getQueryData<Storybook>(queryKeys.storybook(id!));
      const book = await api.getStorybook(id!);
      // 상태가 바뀌면 서재 목록도 새로 받는다.
      if (previous && previous.status !== book.status) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.storybooks(book.childId) });
      }
      return book;
    },
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data && isInProgress(query.state.data.status) ? 5_000 : false,
  });
}

export function useCreateStorybook(childId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStorybookInput) => api.createStorybook(childId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.storybooks(childId) }),
  });
}

export function useRetryStorybook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.retryStorybook(id),
    onSuccess: (summary) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.storybook(summary.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.storybooks(summary.childId) });
    },
  });
}

export function useDeleteStorybook(childId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteStorybook(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.storybook(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.storybooks(childId) });
    },
  });
}
