import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type SaveDiaryInput } from "../api";
import { queryKeys } from "./queryKeys";

export function useDiaries(childId: string | undefined, from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.diaryRange(childId ?? "", from, to),
    queryFn: () => api.listDiaries(childId!, from, to),
    enabled: !!childId,
    placeholderData: (previous) => previous,
  });
}

export function useDiary(childId: string | undefined, date: string | undefined) {
  return useQuery({
    queryKey: queryKeys.diary(childId ?? "", date ?? ""),
    queryFn: () => api.getDiary(childId!, date!),
    enabled: !!childId && !!date,
  });
}

export function useSaveDiary(childId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ date, input }: { date: string; input: SaveDiaryInput }) =>
      api.saveDiary(childId, date, input),
    onSuccess: (entry) => {
      queryClient.setQueryData(queryKeys.diary(childId, entry.date), entry);
      void queryClient.invalidateQueries({ queryKey: queryKeys.diaries(childId) });
    },
  });
}

export function useDeleteDiary(childId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => api.deleteDiary(childId, date),
    onSuccess: (_, date) => {
      queryClient.setQueryData(queryKeys.diary(childId, date), null);
      void queryClient.invalidateQueries({ queryKey: queryKeys.diaries(childId) });
    },
  });
}

export function useUploadPhoto() {
  return useMutation({ mutationFn: (file: File) => api.uploadPhoto(file) });
}
